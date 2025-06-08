import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { PopulatedBlog, BlogResponse } from "@/types/blog"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const blog = await Blog.findById(params.id)
      .populate('authorId', 'name image')
      .lean()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, tone, style, emotion, imageUrl, published, publishedAt } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if the blog exists and belongs to the user
    const existingBlog = await Blog.findOne({
      _id: params.id,
      authorId: session.user.id
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found or unauthorized" },
        { status: 404 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      {
        title,
        content,
        tone,
        style,
        emotion,
        imageUrl,
        published,
        publishedAt,
        slug
      },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      blogId: updatedBlog._id,
      url: `/blog/${updatedBlog.authorId}/${updatedBlog._id}`
    })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
} 