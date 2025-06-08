import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/app/models/Blog"
import { getImageUrl } from "@/lib/pexels"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, type, tone, style, emotion } = await req.json()

    // Validate all required fields
    if (!title || !content || !type || !tone || !style || !emotion) {
      return NextResponse.json({
        error: "Missing required fields",
        details: {
          title: !title,
          content: !content,
          type: !type,
          tone: !tone,
          style: !style,
          emotion: !emotion
        }
      }, { status: 400 })
    }

    await connectDB()

    // Check if a blog with the same title already exists for this user
    const existingBlog = await Blog.findOne({
      title,
      userId: session.user.id
    })

    if (existingBlog) {
      return NextResponse.json({
        error: "A blog with this title already exists",
        blogId: existingBlog._id
      }, { status: 409 })
    }

    // Generate a slug from the title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if a blog with this slug already exists
    let slug = baseSlug
    let counter = 1
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Get a relevant image for the blog
    let imageUrl
    try {
      imageUrl = await getImageUrl(title)
    } catch (error) {
      console.error("Error getting image:", error)
      // Use a default image if Pexels API fails
      imageUrl = "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg"
    }

    // Create the blog post
    const blog = await Blog.create({
      title,
      content,
      slug,
      type,
      tone,
      style,
      emotion,
      imageUrl,
      userId: session.user.id,
    })

    return NextResponse.json({
      message: "Blog published successfully",
      slug: blog.slug,
      blogId: blog._id,
      blog
    })
  } catch (error: any) {
    console.error("Error publishing blog:", error)
    return NextResponse.json(
      {
        error: "Failed to publish blog",
        details: error.message
      },
      { status: 500 }
    )
  }
} 