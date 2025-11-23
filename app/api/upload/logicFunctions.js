import { FishAudioClient } from "fish-audio";
import { GeminiClient } from "@google-ai/gemini-api"; // adjust import if needed
import { GoogleGenAI } from "@google/genai";

// Uses Gemini document understanding to generate a transcript given the .pdf file containing the slides
// Initialize Gemini client
export async function generateTranscript(slidesFile) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Convert uploaded file to ArrayBuffer, then to base64
  const arrayBuffer = await slidesFile.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  const contents = [
    {
      text: "Generate a presentation transcript from these slides, preserving context and flow.",
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

  // result contains the generated audio (URL or blob depending on SDK)
  return result;
}

export function combineToVideo() {
  // TODO: not used yet
}
