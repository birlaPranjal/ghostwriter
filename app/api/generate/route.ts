import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { getServerSession } from "next-auth"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, tone, style, emotion, type } = await request.json()

    if (!title || !tone || !style || !emotion || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prompt = `Write a ${type} with the following specifications:
    Title: ${title}
    Tone: ${tone}
    Style: ${style}
    Emotion: ${emotion}
    
    Please create engaging, high-quality content that matches these requirements. The content should be well-structured and compelling.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional ghostwriter AI that creates compelling content in various styles and tones. Always deliver high-quality, engaging content that matches the specified requirements.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
