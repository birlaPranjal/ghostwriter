import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Blog from "@/app/models/Blog"
import connectDB from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, type, tone, style, emotion } = await request.json()

    if (!title || !content || !type || !tone || !style || !emotion) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    await connectDB()

    const blog = new Blog({
      title,
      content,
      type,
      tone,
      style,
      emotion,
      userId: session.user.id,
    })

    await blog.save()

    return NextResponse.json({ 
      message: "Content saved successfully",
      blog 
    })
  } catch (error: any) {
    console.error("Error saving content:", error)
    return NextResponse.json(
      { error: error.message || "Failed to save content" },
      { status: 500 }
    )
  }
}
