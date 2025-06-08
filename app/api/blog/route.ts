import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateImage } from "@/lib/utils/image"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import User from "@/lib/models/User"
import { PopulatedBlog, BlogResponse } from "@/types/blog"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, prompt } = await req.json()
    
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Generate image based on the blog title or prompt
    const imagePrompt = prompt || `A beautiful illustration representing: ${title}`
    const imageUrl = await generateImage(imagePrompt)

    // Find the user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Create the blog post
    const blog = await Blog.create({
      title,
      content,
      imageUrl,
      authorId: user._id,
      published: true,
      publishedAt: new Date(),
    })

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    await connectDB()

    const blogs = await Blog.find({ published: true })
      .populate('authorId', 'name image')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as unknown as PopulatedBlog[]

    const total = await Blog.countDocuments({ published: true })

    const transformedBlogs: BlogResponse[] = blogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      publishedAt: blog.publishedAt.toISOString(),
      author: {
        name: blog.authorId.name,
        image: blog.authorId.image,
      },
    }))

    return NextResponse.json({
      blogs: transformedBlogs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
} 