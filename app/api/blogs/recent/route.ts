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