export const runtime = "nodejs";

import { FishAudioClient } from "fish-audio";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/lib/mongodb";
import crypto from "crypto";
import { GridFSBucket } from "mongodb";

// Uses Gemini document understanding to generate a transcript given the .pdf file containing the slides
// Initialize Gemini client
export async function generateTranscript(slidesFile) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Convert uploaded file to ArrayBuffer, then to base64
  const arrayBuffer = await slidesFile.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  const contents = [
    {
      text: "You are given a pdf version of slides. Please generate a transcript that represents these slides, as if it is for a presentation or a lecture. Make sure to generate a transcript that makes sense when it is being read along in tandem with these slides. Please make sure to include absolutely no special characters. Make sure, that, when read by a text-to-voice agent, everything will read naturally. Do not include formatting or anything of that sort. Make sure that comprehensibility is the main focus.",
      //Also, this is EXTREMELY important: you must include the phrase: TRANSITION when the transcription changes from one page of the PDF to another. This is to ensure that, when we produce timestamps from speech to text, we can create a parallel slideshow that transitions at speaking timebreaks at slide transitions.
    },
    {
      inlineData: {
        mimeType: "application/pdf",
        data: base64Data,
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // use the latest Gemini model
    contents: contents,
  });

  // The generated transcript is in response.text
  return response.text;
}

export async function generateClonedAudio(
  audioFile,
  sampleText,
  textToConvert
) {
  const db = await getDb();
  if (!audioFile) throw new Error("No audio file provided");
  if (!textToConvert) throw new Error("No text to convert provided");

  const fish = new FishAudioClient();

  // Convert uploaded file to ArrayBuffer (browser File)
  const arrayBuffer = await audioFile.arrayBuffer();

  // Wrap in a File object (required by Fish Audio browser SDK)
  const referenceFile = new File([arrayBuffer], audioFile.name, {
    type: audioFile.type || "audio/wav",
  });

  // Build the reference object
  const referenceAudio = {
    audio: referenceFile,
    text: sampleText,
  };

  // Generate TTS using reference audio
  const result = await fish.textToSpeech.convert({
    text: textToConvert,
    references: [referenceAudio],
  });

  const bucket = new GridFSBucket(db, { bucketName: "audios" });

  async function saveAudio() {
    const uploadStream = bucket.openUploadStream(crypto.randomUUID());

    const reader = result.getReader();

    async function pump() {
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (value) uploadStream.write(Buffer.from(value));
        done = readerDone;
      }
      uploadStream.end();
    }

    await pump();

    return new Promise((resolve, reject) => {
      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", reject);
    });
  }

  //return gridFS id
  return await saveAudio();
}

export function combineToVideo() {
  // TODO: not used yet
}
