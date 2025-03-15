'use client'
import ImageGenerator from "@/components/image-generator"
import ColourfulText from "@/components/ui/colourful-text"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8 mt-20">
          The best <ColourfulText text="chitrakar" /> <br /> you will ever find
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          Enter a text prompt and get an AI-generated image in response
        </p>
        <ImageGenerator />
      </div>
    </main>
  )
}
