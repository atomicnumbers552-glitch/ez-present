"use client";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { UploadIcon } from "lucide-react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "@app/globals.css";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const router = useRouter();
  const [audioFile, setAudioFile] = useState(null);
  const [slidesFile, setSlidesFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const referenceText = `This system converts written text into natural-sounding speech.
        Each word is processed, analyzed for context, and generated with the correct intonation.
        The goal is to make digital voices sound as close to human conversation as possible.`;

  const handleUpload = async () => {
    if (!audioFile || !slidesFile) {
      alert("Please provide audio, slides, and description");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("slides", slidesFile);
    formData.append("text", referenceText); // reference text for Fish Audio

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`Upload failed: ${data.error}`);
        setLoading(false);
        return;
      }

      // The API route redirects to /api/download?id=<presentationId>
      // You can follow the redirect:
      const downloadUrl = res.url;

      router.push(downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-[var(--spacing-xl)] px-[var(--spacing-xxl)] min-h-screen">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {" "}
        Create Presentation
      </h2>
      <h3 className="mt-[var(--spacing-md2)] scroll-m-20 text-xl font-semibold tracking-tight">
        Project Info
      </h3>
      <div className="mb-[var(--spacing-md)] mt-[var(--spacing-sm)] flex !items-start flex-col gap-[var(--spacing-md)] p-[var(--spacing-sm)] border-0 shadow-none">
        <Label className="text-lg">Name</Label>
        <Input
          placeholder="Name"
          className="border-1 -mt-[var(--spacing-sm)]"
        />
        <Label className="text-lg">Description</Label>
        <Textarea
          className="border-1 -mt-[var(--spacing-sm)]"
          placeholder="Description"
        ></Textarea>
      </div>

      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Upload Files
      </h3>

      <div className="mb-[var(--spacing-lg)] mt-[var(--spacing-md)]">
        <Dropzone
          maxSize={1024 * 1024 * 10}
          accept={{ "audio/*": [".mp3", ".wav"] }}
          minSize={1024}
          onDrop={(files) => setAudioFile(files[0])}
          onError={console.error}
          src={audioFile ? [audioFile] : []}
          className="dropzone"
        >
          {!audioFile ? (
            <div className="flex w-full items-center gap-4 p-8">
              <div className="cursor-pointer flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <UploadIcon size={16} />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Upload Audio</p>
                <p className="text-muted-foreground text-xs">
                  Drag and drop or click to upload
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm">{audioFile.name}</p>
          )}
        </Dropzone>

        <Dropzone
          maxSize={1024 * 1024 * 10}
          accept={{ "application/pdf": [".pdf"] }}
          onDrop={(files) => setSlidesFile(files[0])}
          onError={console.error}
          src={slidesFile ? [slidesFile] : []}
          className="dropzone"
        >
          {!slidesFile ? (
            <div className="flex w-full items-center gap-4 p-8">
              <div className="flex size-16 cursor-pointer items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <UploadIcon size={24} />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Upload Slide Deck</p>
                <p className="text-muted-foreground text-xs">
                  Drag and drop or click to upload
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm">{slidesFile.name}</p>
          )}
        </Dropzone>
      </div>

      <Button
        className="w-1/2 h-[var(--spacing-xl)] cursor-pointer text-lg font-semibold mt-[var(--spacing-lg)]"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Now"}
      </Button>
    </div>
  );
}
