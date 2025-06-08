import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import Content from "@/lib/models/Content"
import User from "@/lib/models/User"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // First get the user by email
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get recent blogs for this user
    const blogs = await Content.find({
      userId: user._id.toString(),
      type: "blog",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title content type tone style emotion createdAt")
      .lean()

    // Convert MongoDB ObjectIds to strings for JSON serialization
    const serializedBlogs = blogs.map((blog) => ({
      ...blog,
      id: blog._id.toString(),
      _id: undefined,
    }))

    return NextResponse.json({ blogs: serializedBlogs })
  } catch (error: any) {
    console.error("Error fetching recent blogs:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch recent blogs" }, { status: 500 })
  }
}
