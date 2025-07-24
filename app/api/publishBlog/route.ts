import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { getImageUrl } from "@/lib/pexels"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Debug log to check session data
    console.log("Session user:", session.user)

    const { title, content, type, tone, style, emotion } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Get a relevant image from Pexels
    let imageUrl = ""
    try {
      imageUrl = await getImageUrl(title)
    } catch (error) {
      console.error("Error fetching image:", error)
      imageUrl = "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg" // Fallback image
    }

    // Ensure we have a valid user ID
    if (!session.user.id) {
      console.error("No user ID found in session:", session)
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      )
    }

    const blogData = {
      title,
      content,
      type: type || "blog",
      tone: tone || "professional",
      style: style || "blog",
      emotion: emotion || "medium",
      slug,
      authorId: session.user.id,
      imageUrl,
      published: true,
      publishedAt: new Date()
    }

    // Debug log to check blog data
    console.log("Creating blog with data:", blogData)

    try {
      const blog = await Blog.create(blogData)
      return NextResponse.json({
        success: true,
        blogId: blog._id,
        url: `/blog/${blog.authorId}/${blog._id}`,
        imageUrl: blog.imageUrl
      })
    } catch (error: any) {
      console.error("Error creating blog:", error)
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: "Validation error: " + Object.values(error.errors).map((e: any) => e.message).join(', ') },
          { status: 400 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error("Error publishing blog:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to publish blog" },
      { status: 500 }
    )
  }
} 