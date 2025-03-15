import { NextResponse } from "next/server"
import { OpenAI } from "openai"

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "A text prompt is required" }, { status: 400 })
    }

    // Generate the image using OpenAI
    const result = await client.images.generate({
      model: "black-forest-labs/flux-schnell",
      response_format: "url",
      //@ts-expect-error extra_body is not in the type definition
      extra_body: {
        response_extension: "webp",
        width: 1024,
        height: 1024,
        num_inference_steps: 4,
        negative_prompt: "",
        seed: -1
      },
      prompt
    })

    // console.log(result.data)

    // Return the image URL
    return NextResponse.json({
      imageData: result.data[0].url
    })
    // return NextResponse.json({
    //   //a fake image URL
    //   imageData: 'https://images.unsplash.com/photo-1724582980082-6753d3c54ede?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    // })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'