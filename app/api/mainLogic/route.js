// This file will do the following:
//    1. use fish audio generate cloned audio from the user's inputted audio file
//    2. use gemini to generate presentation transcript
//    3. put the two together to create a cohesive file
//    4. store everything in MongoDB

// in their sample audio, the user must say:
// "This system converts written text into natural-sounding speech.
// Each word is processed, analyzed for context, and generated with the correct intonation.
// The goal is to make digital voices sound as close to human conversation as possible."

import { NextResponse } from "next/server";
import { generateClone, generateTranscript } from "./logicFunctions";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const audioFile = formData.get("audio"); // user sample audio
    const slidesFile = formData.get("slides"); // pdf/ppt
    const referenceText = formData.get("text"); // what user said in the sample audio

    if (!audioFile || !slidesFile || !referenceText) {
      return NextResponse.json(
        { error: "audio, slides, and reference text required" },
        { status: 400 }
      );
    }

    // Step 1: generate transcript from slides
    const transcript = await generateTranscript(slidesFile);

    // Step 2: generate cloned voice audio using reference audio
    const modelId = await generateClonedAudio(audioFile, referenceText);

    // Step 3: generate final narration audio for the transcript
    const fish = new FishAudioClient();
    const finalAudio = await fish.textToSpeech.convert({
      text: transcript,
      reference_id: modelId, // use the persistent model
    });

    return NextResponse.json({
      success: true,
      audio: finalAudio.audio, // or URL if uploading to storage
      transcript,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
