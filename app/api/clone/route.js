import { NextResponse } from "next/server";
import { FishAudioClient } from "fish-audio";

export async function POST(req) {
  const formData = await req.formData();

  const file = formData.get("audio");
  const text = formData.get("text");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fish = new FishAudioClient();

  const referenceAudio = {
    audio: file,
    text: "User reference audio",
  };

  const request = {
    text,
    references: [referenceAudio],
  };

  const result = await fish.textToSpeech.convert(request);

  // result.audio is typically an ArrayBuffer or Uint8Array
  return new Response(result.audio, {
    headers: {
      "Content-Type": "audio/wav",
    },
  });
}
