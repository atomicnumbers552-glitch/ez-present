import { FishAudioClient } from "fish-audio";

export function generateTranscript(slidesFile) {
  // Uses Gemini document understanding to generate a transcript given the .pdf file containing the slides
  
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
