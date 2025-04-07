import { NextResponse } from "next/server";

const STABILITY_API_KEY = process.env.STABILITY_API_KEY!;

export async function POST(req: Request) {
  try {
    const { prompt, referenceImage } = await req.json();

    const generationPrompt = referenceImage
      ? `${prompt} in the style of the reference image`
      : prompt;

    const generateImage = async () => {
      const formData = new FormData(); // <-- IMPORTANT: use Web FormData
      formData.append("prompt", generationPrompt);
      formData.append("output_format", "webp");

      const response = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STABILITY_API_KEY}`,
            Accept: "image/*",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Stability API error:", error);
        throw new Error(error.errors?.[0] || "Generation failed");
      }

      const buffer = await response.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      return `data:image/webp;base64,${base64Image}`;
    };

    const generatedImages = await Promise.all([
      generateImage(),
      generateImage(),
      generateImage(),
      generateImage(),
    ]);

    const images = generatedImages.map((base64, idx) => ({
      url: base64,
      alt: `Generated image ${idx + 1}`,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Internal error:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
