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

    const userId = user._id.toString()

    // Get content statistics using Mongoose aggregation
    const stats = await Content.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalGenerated: { $sum: 1 },
          wordsGenerated: {
            $sum: {
              $size: {
                $split: ["$content", " "],
              },
            },
          },
          savedContent: { $sum: 1 },
        },
      },
    ])

    const userStats = stats[0] || {
      totalGenerated: 0,
      wordsGenerated: 0,
      savedContent: 0,
    }

    // Add mock voice minutes (you can track this separately if needed)
    userStats.voiceMinutes = Math.floor(userStats.wordsGenerated / 150) // Rough estimate

    return NextResponse.json({ stats: userStats })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
