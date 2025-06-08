import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { action } = await request.json()

    if (action === "like") {
      const existingLike = await prisma.blogLike.findFirst({
        where: {
          blogId: params.id,
          userId: session.user.id
        }
      })

      if (existingLike) {
        await prisma.blogLike.delete({
          where: { id: existingLike.id }
        })
      } else {
        await prisma.blogLike.create({
          data: {
            blogId: params.id,
            userId: session.user.id
          }
        })
      }
    } else if (action === "bookmark") {
      const existingBookmark = await prisma.blogBookmark.findFirst({
        where: {
          blogId: params.id,
          userId: session.user.id
        }
      })

      if (existingBookmark) {
        await prisma.blogBookmark.delete({
          where: { id: existingBookmark.id }
        })
      } else {
        await prisma.blogBookmark.create({
          data: {
            blogId: params.id,
            userId: session.user.id
          }
        })
      }
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("[BLOG_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 