import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function getPromptTemplate(type: string, tone: string, style: string, emotion: string, topic: string) {
  const basePrompt = `Write a ${type} with the following characteristics:
- Tone: ${tone}
- Style: ${style}
- Emotion: ${emotion}
- Topic: ${topic}

Format the content in markdown with proper headings, paragraphs, and formatting.`

  switch (type) {
    case "blog":
      return `${basePrompt}
Include:
- A compelling introduction
- Clear sections with headings
- Supporting points or examples
- A strong conclusion
- Call to action or key takeaways`
    case "story":
      return `${basePrompt}
Include:
- Character development
- Setting description
- Plot progression
- Dialogue where appropriate
- A satisfying resolution`
    case "speech":
      return `${basePrompt}
Include:
- A powerful opening
- Clear main points
- Supporting evidence or examples
- Rhetorical devices
- A memorable conclusion`
    default:
      return basePrompt
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic, tone, style, emotion, type } = await req.json()

    if (!topic || !tone || !style || !emotion || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const prompt = getPromptTemplate(type, tone, style, emotion, topic)

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional content writer who creates engaging and well-structured content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedContent = completion.choices[0]?.message?.content || ""
    
    // Extract title from the first heading in the content
    const titleMatch = generatedContent.match(/^# (.+)$/m)
    const title = titleMatch ? titleMatch[1] : topic

    return NextResponse.json({
      content: generatedContent,
      title,
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
