"use client";

import type React from "react";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImageData = {
  url: string;
  alt: string;
};

function SkeletonCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <CardContent className="p-2">
        <div className="w-full aspect-square bg-gray-300 rounded-sm" />
      </CardContent>
    </Card>
  );
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  async function generateImages(basePrompt: string, selectedImage?: string) {
    setIsGenerating(true);

    try {
      const generationPrompt = selectedImage
        ? `${basePrompt} in the style of the selected image`
        : basePrompt;

      const res = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: generationPrompt,
          referenceImage: selectedImage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate images");
      }

      const { images } = await res.json();
      setImages(images);
      setSelectedImageIndex(null);
    } catch (error) {
      console.error("Failed to generate images:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    generateImages(prompt);
  }

  function handleRegenerateWithSelected() {
    if (selectedImageIndex === null || !prompt) return;
    generateImages(prompt, images[selectedImageIndex].url);
  }

  function handleDownload() {
    if (selectedImageIndex === null) return;

    const image = images[selectedImageIndex];
    const link = document.createElement("a");
    link.href = image.url;
    link.download = "generated-image.webp"; // or you can make dynamic name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="prompt">Enter your prompt</Label>
          <div className="flex gap-2">
            <Input
              id="prompt"
              placeholder="A futuristic city with flying cars..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="flex-1"
            />
            <Button type="submit" disabled={isGenerating || !prompt.trim()}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      </form>

      {(isGenerating || images.length > 0) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isGenerating
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))
              : images.map((image, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all",
                      selectedImageIndex === index &&
                        "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <CardContent className="p-2">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full aspect-square object-cover rounded-sm transition-opacity duration-300"
                      />
                    </CardContent>
                  </Card>
                ))}
          </div>

          {selectedImageIndex !== null && !isGenerating && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleRegenerateWithSelected}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate More Like This"
                )}
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
