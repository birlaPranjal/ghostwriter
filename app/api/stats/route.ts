import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Blog from "@/app/models/Blog"
import connectDB from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get counts for different content types
    const [blogs, stories, speeches] = await Promise.all([
      Blog.countDocuments({ userId: session.user.id, type: 'blog' }),
      Blog.countDocuments({ userId: session.user.id, type: 'story' }),
      Blog.countDocuments({ userId: session.user.id, type: 'speech' })
    ])

    // Get total history (all content)
    const history = await Blog.countDocuments({ userId: session.user.id })

    return NextResponse.json({
      stats: {
        blogs,
        stories,
        speeches,
        history
      }
    })
  } catch (error: any) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch stats" },
      { status: 500 }
    )
  }
} 