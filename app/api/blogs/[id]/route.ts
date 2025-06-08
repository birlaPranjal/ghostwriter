import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        },
        likes: {
          where: {
            userId: session.user.id
          }
        },
        bookmarks: {
          where: {
            userId: session.user.id
          }
        }
      }
    })

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 })
    }

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = blog.content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    return NextResponse.json({
      ...blog,
      readTime,
      liked: blog.likes.length > 0,
      bookmarked: blog.bookmarks.length > 0,
      likes: blog._count?.likes || 0,
      comments: blog._count?.comments || 0
    })
  } catch (error) {
    console.error("[BLOG_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
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