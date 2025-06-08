import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Content } from "@/lib/models/Content"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await connectToDatabase()

    const content = await Content.findById(params.id)
    if (!content) {
      return new NextResponse("Content not found", { status: 404 })
    }

    // Check if user owns the content
    if (content.authorId.toString() !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Update content
    content.published = true
    content.publishedAt = new Date()
    await content.save()

    return NextResponse.json(content)
  } catch (error) {
    console.error("[CONTENT_PUBLISH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 