"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Download } from "lucide-react"
import Image from 'next/image';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";


const placeholders = [
  "A painting of a beautiful sunset over the ocean",
  "A futuristic cityscape with flying cars",
  "A fantasy landscape with dragons and castles",
  "A portrait of a mysterious stranger",
  "An abstract geometric pattern",
  "A still life of flowers in a vase",
  "A surreal dreamlike scene",
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [imageData, setImageData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Called handleSubmit")
    e.preventDefault()

    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      setImageData(data.imageData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setImageData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!imageData) return

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = imageData
    link.download = `ai-generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
        <div className="h-[10rem] flex flex-col justify-center  items-center px-4">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setPrompt(e.target.value)}
            onSubmit={handleSubmit}
          />
        </div>
        {/* <Button type="submit" className="w-full" disabled={loading || !prompt.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Image"
          )}
        </Button> */}
      {/* </form> */}

      {error && <div className="p-4 bg-red-50 text-red-500 rounded-md">{error}</div>}

      {imageData && !loading && (
        <Card>
          <CardContent className="p-4">
            <div className="aspect-square relative overflow-hidden rounded-md">
              <Image
                src={imageData || "/placeholder.svg"} alt={prompt} className="object-cover w-full h-full"
                width={500}
                height={500}
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Prompt:</h3>
                <p className="text-sm text-muted-foreground">{prompt}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!imageData && !loading && !error && (
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md border-gray-300">
          <p className="text-muted-foreground">Your generated image will appear here</p>
        </div>
      )}
    </div>
  )
}

