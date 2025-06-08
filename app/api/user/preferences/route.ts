import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import UserPreferences from "@/lib/models/UserPreferences"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const preferences = await UserPreferences.findOne({ userId: user._id.toString() })

    return NextResponse.json({
      preferences: preferences || {
        preferredTone: "professional",
        preferredStyle: "narrative",
        preferredVoice: "alloy",
        preferredEmotion: "inspiring",
      },
    })
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { preferredTone, preferredStyle, preferredVoice, preferredEmotion } = await request.json()

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const preferences = await UserPreferences.findOneAndUpdate(
      { userId: user._id.toString() },
      {
        preferredTone,
        preferredStyle,
        preferredVoice,
        preferredEmotion,
      },
      { upsert: true, new: true },
    )

    return NextResponse.json({ success: true, preferences })
  } catch (error) {
    console.error("Error saving user preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
