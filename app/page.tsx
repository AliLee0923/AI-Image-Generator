import { ImageGenerator } from "@/components/image-generator"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">AI Image Generator</h1>
          <p className="text-gray-500 md:text-xl/relaxed">
            Enter a prompt to generate images, select your favorite, and download or refine it.
          </p>
        </div>
        <ImageGenerator />
      </div>
    </main>
  )
}

