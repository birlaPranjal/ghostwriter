import { NextResponse } from "next/server"
import OpenAI from "openai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { topic, platform, trainingData } = await req.json()

    if (!topic || !platform || !trainingData) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Create a prompt based on the user's writing style and previous posts
    const prompt = `Generate a ${platform} post about "${topic}" based on the following writing style and previous posts:

Writing Style: ${trainingData.writingStyle}
Preferred Tones: ${trainingData.preferredTones.join(", ")}
Favorite Topics: ${trainingData.favoriteTopics.join(", ")}
Target Audience: ${trainingData.targetAudience}

Previous Posts Examples:
${trainingData.previousPosts.slice(0, 3).join("\n")}

Generate a ${platform === "twitter" ? "tweet (max 280 characters)" : "LinkedIn post (professional tone)"} that matches the user's writing style and maintains consistency with their previous posts.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert social media content writer. Generate engaging ${platform} posts that match the user's writing style and previous content.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: platform === "twitter" ? 100 : 500
    })

    const generatedPost = completion.choices[0].message.content

    // Save the training data to the user's profile
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.id}`
      },
      body: JSON.stringify({
        socialMediaHistory: [
          ...(trainingData.socialMediaHistory || []),
          {
            platform,
            content: generatedPost,
            engagement: Math.floor(Math.random() * 100),
            date: new Date().toISOString()
          }
        ]
      })
    })

    if (!response.ok) {
      console.error("Failed to save training data")
    }

    return NextResponse.json({ post: generatedPost })
  } catch (error) {
    console.error("Error generating post:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 