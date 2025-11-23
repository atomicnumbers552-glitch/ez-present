import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId, GridFSBucket } from "mongodb";

export async function GET(req) {
  try {
    const bucket = new GridFSBucket(db, { bucketName: "audios" });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // pass ?id=<presentationId> in the download link

    if (!id) {
      return NextResponse.json(
        { error: "Missing presentation ID" },
        { status: 400 }
      );
    }

    const db = await getDb();
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

    // Return the file as a download
    return new Response(webStream, {
      headers: {
        "Content-Type": "video/mp4", // or "audio/mpeg" / "audio/wav" depending on format
        "Content-Disposition": `attachment; filename="presentation_${id}.mp4"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// User clicks download button, which calls API, and downloads the file
// <a href={`/api/download?id=${presentationId}`} download>Download Audio</a>
