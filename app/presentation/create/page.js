"use client";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { UploadIcon } from "lucide-react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "@app/globals.css";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [files, setFiles] = useState();
  const handleDrop = (files) => {
    setFiles(files);
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
        <Input placeholder="Name" className="border-1 -mt-[var(--spacing-sm)]" />
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
          onDrop={setFiles}
          onError={console.error}
          src={files}
          className="dropzone"
        >
          <DropzoneEmptyState>
            <div className="flex w-full items-center gap-4 p-8">
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <UploadIcon size={16} />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Upload Audio</p>
                <p className="text-muted-foreground text-xs">
                  Drag and drop or click to upload
                </p>
              </div>
            </div>
          </DropzoneEmptyState>
          <DropzoneContent />
        </Dropzone>

        <Dropzone
          maxSize={1024 * 1024 * 10}
          accept={{ "application/pdf": [".pdf"] }}
          onDrop={setFiles}
          onError={console.error}
          src={files}
          className="dropzone"
        >
          <DropzoneEmptyState>
            <div className="flex w-full items-center gap-4 p-8">
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <UploadIcon size={24} />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Upload Slide Deck</p>
                <p className="text-muted-foreground text-xs">
                  Drag and drop or click to upload
                </p>
              </div>
            </div>
          </DropzoneEmptyState>
          <DropzoneContent />
        </Dropzone>
      </div>

      <Button className="w-1/2 h-[var(--spacing-xl)] text-lg font-semibold mt-[var(--spacing-lg)]">Create Now</Button>
    </div>
  );
}
