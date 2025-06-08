import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"
import { PopulatedBlog, BlogResponse } from "@/types/blog"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const blog = await Blog.findById(params.id)
      .populate('authorId', 'name image')
      .lean() as unknown as PopulatedBlog | null

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }

    // Transform the response to match the expected format
    const transformedBlog: BlogResponse = {
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      publishedAt: blog.publishedAt.toISOString(),
      author: {
        name: blog.authorId.name,
        image: blog.authorId.image,
      },
    }

    return NextResponse.json(transformedBlog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
} 