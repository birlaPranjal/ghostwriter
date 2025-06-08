import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Content from "@/lib/models/Content"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const content = await Content.find({ userId: user._id.toString() }).sort({ createdAt: -1 }).lean()

    // Convert MongoDB ObjectIds to strings for JSON serialization
    const serializedContent = content.map((item) => ({
      ...item,
      id: item._id.toString(),
      _id: undefined,
    }))

    return NextResponse.json({ content: serializedContent })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
