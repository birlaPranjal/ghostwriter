import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Story } from "@/lib/models/Content"
import { ContentDisplay } from "@/components/content-studio/content-display"

interface StoryPageProps {
  params: {
    id: string
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  await connectToDatabase()

  const story = await Story.findById(params.id)
  if (!story) {
    notFound()
  }

  return <ContentDisplay content={story} />
} 