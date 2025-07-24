import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Blog from "@/app/models/Blog"

// Sample blog data for testing
const sampleBlogs = [
  {
    title: "The Future of AI Writing",
    type: "blog",
    tone: "informative",
    style: "professional",
    emotion: "excited",
    content: "Artificial Intelligence is revolutionizing the way we write and create content...",
    createdAt: new Date()
  },
  {
    title: "Creative Writing with AI",
    type: "story",
    tone: "creative",
    style: "narrative",
    emotion: "inspired",
    content: "Exploring the intersection of human creativity and artificial intelligence...",
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    title: "AI in Education",
    type: "blog",
    tone: "educational",
    style: "academic",
    emotion: "thoughtful",
    content: "How AI is transforming the educational landscape...",
    createdAt: new Date(Date.now() - 172800000) // 2 days ago
  }
]

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Check if we have any blogs in the database
    const existingBlogs = await Blog.find({ userId: session.user.id }).countDocuments()
    
    // If no blogs exist, create sample blogs
    if (existingBlogs === 0) {
      const blogsWithUserId = sampleBlogs.map(blog => ({
        ...blog,
        userId: session.user.id,
        slug: blog.title.toLowerCase().replace(/\s+/g, '-'),
        imageUrl: "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg"
      }))
      
      await Blog.insertMany(blogsWithUserId)
    }

    // Get unique blogs by title and sort by creation date
    const blogs = await Blog.aggregate([
      { $match: { userId: session.user.id } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$title",
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          title: 1,
          type: 1,
          tone: 1,
          style: 1,
          emotion: 1,
          createdAt: 1
        }
      }
    ])

    return NextResponse.json({ blogs })
  } catch (error: any) {
    console.error("Error fetching recent blogs:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch recent blogs" },
      { status: 500 }
    )
  }
}
