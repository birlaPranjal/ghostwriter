import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Content from "@/lib/models/Content"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, type, tone, style, emotion } = await request.json()

    if (!title || !content || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const savedContent = await Content.create({
      title,
      content,
      type,
      tone,
      style,
      emotion,
      userId: user._id.toString(),
    })

    return NextResponse.json({ success: true, id: savedContent._id })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
