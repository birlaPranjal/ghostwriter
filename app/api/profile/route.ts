import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/app/models/User"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      writingStyle: user.writingStyle || "",
      preferredTones: user.preferredTones || [],
      favoriteTopics: user.favoriteTopics || [],
      targetAudience: user.targetAudience || "",
      writingGoals: user.writingGoals || "",
      experienceLevel: user.experienceLevel || "",
      preferredLength: user.preferredLength || "",
      referenceAuthors: user.referenceAuthors || "",
      personalityAnalysis: user.personalityAnalysis || "",
      writingAnalysis: user.writingAnalysis || "",
      lastWritingPrompt: user.lastWritingPrompt || "",
      lastWritingResponse: user.lastWritingResponse || "",
      writingMetrics: user.writingMetrics || {
        optimisticTone: { score: 0, examples: [], suggestions: [] },
        reflectiveQuality: { score: 0, examples: [], suggestions: [] },
        motivationalImpact: { score: 0, examples: [], suggestions: [] },
        poeticElements: { score: 0, examples: [], suggestions: [] },
        conversationalStyle: { score: 0, examples: [], suggestions: [] }
      },
      writingHistory: user.writingHistory || []
    })
  } catch (error: any) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    await connectDB()

    // Get existing user data
    const existingUser = await User.findById(session.user.id)
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Merge existing data with new data
    const updatedData = {
      ...existingUser.toObject(),
      ...data,
      // Preserve arrays by merging them
      preferredTones: data.preferredTones || existingUser.preferredTones,
      favoriteTopics: data.favoriteTopics || existingUser.favoriteTopics,
      // Preserve writing metrics if they exist
      writingMetrics: data.writingMetrics || existingUser.writingMetrics,
      // Preserve writing history if it exists
      writingHistory: data.writingHistory ? 
        [...(existingUser.writingHistory || []), ...data.writingHistory] : 
        existingUser.writingHistory
    }

    // Update the user with merged data
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updatedData },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return the complete updated user data
    return NextResponse.json({
      writingStyle: user.writingStyle || "",
      preferredTones: user.preferredTones || [],
      favoriteTopics: user.favoriteTopics || [],
      targetAudience: user.targetAudience || "",
      writingGoals: user.writingGoals || "",
      experienceLevel: user.experienceLevel || "",
      preferredLength: user.preferredLength || "",
      referenceAuthors: user.referenceAuthors || "",
      personalityAnalysis: user.personalityAnalysis || "",
      writingAnalysis: user.writingAnalysis || "",
      lastWritingPrompt: user.lastWritingPrompt || "",
      lastWritingResponse: user.lastWritingResponse || "",
      writingMetrics: user.writingMetrics || {
        optimisticTone: { score: 0, examples: [], suggestions: [] },
        reflectiveQuality: { score: 0, examples: [], suggestions: [] },
        motivationalImpact: { score: 0, examples: [], suggestions: [] },
        poeticElements: { score: 0, examples: [], suggestions: [] },
        conversationalStyle: { score: 0, examples: [], suggestions: [] }
      },
      writingHistory: user.writingHistory || []
    })
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    )
  }
} 