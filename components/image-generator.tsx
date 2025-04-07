"use client"

import type React from "react"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type ImageData = {
  url: string
  alt: string
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  async function generateImages(basePrompt: string, selectedImage?: string) {
    setIsGenerating(true)

    try {
      // In a real app, you would call your API route that connects to an image generation API
      // For this example, we'll simulate the API call with placeholder images
      const generationPrompt = selectedImage ? `${basePrompt} in the style of the selected image` : basePrompt

      console.log("Generating images with prompt:", generationPrompt)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate 4 placeholder images (in a real app, these would come from the API)
      const newImages = Array(4)
        .fill(null)
        .map((_, i) => ({
          url: `/placeholder.svg?height=512&width=512&text=Generated+Image+${i + 1}`,
          alt: `Generated image ${i + 1} for prompt: ${basePrompt}`,
        }))

      setImages(newImages)
      setSelectedImageIndex(null)
    } catch (error) {
      console.error("Failed to generate images:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return

    generateImages(prompt)
  }

  function handleRegenerateWithSelected() {
    if (selectedImageIndex === null || !prompt) return

    // In a real app, you would pass the selected image URL or ID to use as a reference
    generateImages(prompt, images[selectedImageIndex].url)
  }

  function handleDownload() {
    if (selectedImageIndex === null) return

    // In a real app, you would handle the actual download
    // For this example, we'll just open the image in a new tab
    window.open(images[selectedImageIndex].url, "_blank")
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

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <Card
                key={index}
                className={cn(
                  "overflow-hidden cursor-pointer transition-all",
                  selectedImageIndex === index && "ring-2 ring-primary ring-offset-2",
                )}
                onClick={() => setSelectedImageIndex(index)}
              >
                <CardContent className="p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full aspect-square object-cover rounded-sm"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedImageIndex !== null && (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={handleRegenerateWithSelected} disabled={isGenerating}>
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
  )
}

