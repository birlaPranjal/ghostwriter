import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import OpenAI from "openai"
import { authOptions } from "@/lib/auth"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const getPromptTemplate = (type: string, prompt: string, tone: string, style: string, emotion: string) => {
  const basePrompt = `Write a ${type} with the following characteristics:
- Tone: ${tone}
- Style: ${style}
- Emotion: ${emotion}
- Topic: ${prompt}

Make it engaging, well-structured, and suitable for the specified tone and style.`

  switch (type) {
    case "blog":
      return `${basePrompt}\n\nInclude proper headings, paragraphs, and a clear structure.`
    case "story":
      return `${basePrompt}\n\nInclude a clear plot, interesting characters, and a satisfying conclusion.`
    case "speech":
      return `${basePrompt}\n\nMake it inspiring, well-structured, and suitable for public speaking.`
    default:
      return basePrompt
  }
}

export async function POST(request: Request) {
  try {
    
    const { prompt, type, tone, style, emotion } = await request.json()

    if (!prompt || !type || !tone || !style || !emotion) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional content writer who creates engaging and high-quality content.",
        },
        {
          role: "user",
          content: getPromptTemplate(type, prompt, tone, style, emotion),
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error("No content generated")
    }

    return NextResponse.json({ content })
  } catch (error: any) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate content" },
      { status: 500 }
    )
  }
}
