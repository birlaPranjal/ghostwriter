import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Blog from "@/app/models/Blog"
import connectDB from "@/lib/mongodb"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { title, content, tone, style, emotion, imageUrl } = await request.json()

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Find the blog and verify ownership
    const blog = await Blog.findOne({ _id: params.id, userId: session.user.id })
    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 404 }
      )
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      {
        title,
        content,
        tone,
        style,
        emotion,
        imageUrl,
        updatedAt: new Date(),
      },
      { new: true }
    )

    return NextResponse.json({
      message: "Blog updated successfully",
      blogId: updatedBlog._id,
    })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
} 