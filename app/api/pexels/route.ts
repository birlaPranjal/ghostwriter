import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getImageUrl } from "@/lib/pexels"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await request.json()
    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      )
    }

    const imageUrl = await getImageUrl(query)
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }
} 