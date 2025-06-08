import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Content, Blog, Story, Speech } from "@/lib/models/Content"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { type, title, prompt, parameters } = body

    await connectToDatabase()

    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional ${type} writer. Create high-quality content based on the given parameters.`,
        },
        {
          role: "user",
          content: `Title: ${title}\nPrompt: ${prompt}\nParameters: ${JSON.stringify(parameters)}`,
        },
      ],
    })

    const generatedContent = completion.choices[0].message.content

    // Create content based on type
    let content
    switch (type) {
      case "blog":
        content = await Blog.create({
          title,
          content: generatedContent,
          authorId: session.user.id,
          type: "blog",
          ...parameters,
        })
        break
      case "story":
        content = await Story.create({
          title,
          content: generatedContent,
          authorId: session.user.id,
          type: "story",
          ...parameters,
        })
        break
      case "speech":
        content = await Speech.create({
          title,
          content: generatedContent,
          authorId: session.user.id,
          type: "speech",
          ...parameters,
        })
        break
      default:
        return new NextResponse("Invalid content type", { status: 400 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error("[CONTENT_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    await connectToDatabase()

    let query = { authorId: session.user.id }
    if (type) {
      query = { ...query, type }
    }

    const content = await Content.find(query).sort({ createdAt: -1 })

    return NextResponse.json(content)
  } catch (error) {
    console.error("[CONTENT_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 