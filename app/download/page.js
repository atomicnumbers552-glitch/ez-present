"use client";

import { Button } from "@/components/ui/button";

export default function DownloadPage() {

  const handleDownload = () => {
    fetch("/api/download", { method: "POST" })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((err) => console.error("Error:", err));
  };

  return (
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>Presentation Ready!</h1>

        <Button onClick={handleDownload}>Download Here</Button>
      </main>
  );
}
