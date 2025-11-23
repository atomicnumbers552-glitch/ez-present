"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function DownloadPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the presentation ID from the URL

  const handleDownload = () => {
    if (!id) {
      alert("No presentation ID provided");
      return;
    }

    // Trigger download via GET
    const downloadUrl = `/api/download?id=${id}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `presentation_${id}.mp3`; // Optional: specify filename
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <div className="widgets">
        <h1>Presentation Ready!</h1>

        <Button onClick={handleDownload} className="cursor-pointer">
          Download Here
        </Button>
      </div>
    </main>
  );
}
