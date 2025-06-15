import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/app/models/User"
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
    if (!session?.user?.email) {
      return NextResponse.jso n({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, type } = await req.json()
    if (!prompt || !type) {
      return NextResponse.json(
        { error: "Prompt and type are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Get user profile for personalization
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Build personalized system message based on user preferences
    let systemMessage = "You are a professional content writer. "
    
    if (user.writingStyle) {
      systemMessage += `Write in a ${user.writingStyle} style. `
    }
    
    if (user.preferredTones?.length > 0) {
      systemMessage += `Maintain a ${user.preferredTones.join(", ")} tone. `
    }
    
    if (user.experienceLevel) {
      systemMessage += `Adjust the complexity for a ${user.experienceLevel} level writer. `
    }
    
    if (user.preferredLength) {
      systemMessage += `Provide ${user.preferredLength} content. `
    }
    
    if (user.targetAudience) {
      systemMessage += `Target audience: ${user.targetAudience}. `
    }
    
    if (user.referenceAuthors) {
      systemMessage += `Take inspiration from: ${user.referenceAuthors}. `
    }

    // Add type-specific instructions
    switch (type) {
      case "blog":
        systemMessage += "Generate a well-structured blog post with an engaging introduction, clear sections, and a compelling conclusion."
        break
      case "article":
        systemMessage += "Create a detailed article with proper research and citations."
        break
      case "social":
        systemMessage += "Write engaging social media content that encourages interaction."
        break
      default:
        systemMessage += "Generate high-quality content that matches the user's requirements."
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedContent = completion.choices[0]?.message?.content

    // Update user statistics
    const wordCount = generatedContent?.split(/\s+/).length || 0
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        totalGenerated: 1,
        wordsGenerated: wordCount,
      },
    })

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
