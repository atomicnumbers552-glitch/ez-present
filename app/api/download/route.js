import { NextResponse } from "next/server";
import { FishAudioClient } from "fish-audio";
import { getDb } from "@/lib/mongodb";
import { ObjectId, GridFSBucket } from "mongodb";

async function downloadStreamToBuf(id) {
  const db = await getDb();
  const bucket = new GridFSBucket(db, { bucketName: "audios" });
  const stream = bucket.openDownloadStream(id);
  return new Promise((resolve, reject) => {
    const chunks = [];

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.from(chunks)));
  });
}

async function getSlideTransitions(id) {
  const buf = await downloadStreamToBuf(id);
  const db = await getDb();

  const bucket = new GridFSBucket(db, { bucketName: "audios" });
  const stream = bucket.openDownloadStream(id);
  const webStream = new ReadableStream({
    async start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });

  const file = new File(buf, id, {
    type: "audio/mpeg",
  });

  const fish = new FishAudioClient();
  const res = await fish.speechToText.convert({ audio: webStream });
  console.log("RES SEGMENTS", res.segments);
  for (const seg of res.segments ?? [])
    console.log(
      `[${seg.start.toFixed(2)}s - ${seg.end.toFixed(2)}s] ${seg.text}`
    );
}

export async function GET(req) {
  try {
    const db = await getDb();

    const bucket = new GridFSBucket(db, { bucketName: "audios" });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // pass ?id=<presentationId> in the download link

    if (!id) {
      return NextResponse.json(
        { error: "Missing presentation ID" },
        { status: 400 }
      );
    }

    const collection = db.collection("presentations");
    const presentation = await collection.findOne({ _id: new ObjectId(id) });

    if (!presentation) {
      return NextResponse.json(
        { error: "Presentation not found" },
        { status: 404 }
      );
    }

    // Fetch the audio file from the stored URL
    const downloadStream = bucket.openDownloadStream(presentation.audioFileId);
    const webStream = new ReadableStream({
      async start(controller) {
        downloadStream.on("data", (chunk) => controller.enqueue(chunk));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err) => controller.error(err));
      },
    });

    await getSlideTransitions(presentation.audioFileId);
    // Return the file as a download
    return new Response(webStream, {
      headers: {
        "Content-Type": "audio/mpeg", // or "audio/mpeg" / "audio/wav" depending on format
        "Content-Disposition": `attachment; filename="presentation_${id}.mp3"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// User clicks download button, which calls API, and downloads the file
// <a href={`/api/download?id=${presentationId}`} download>Download Audio</a>
