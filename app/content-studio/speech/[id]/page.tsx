import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Speech } from "@/lib/models/Content"
import { ContentDisplay } from "@/components/content-studio/content-display"

interface SpeechPageProps {
  params: {
    id: string
  }
}

export default async function SpeechPage({ params }: SpeechPageProps) {
  await connectToDatabase()

  const speech = await Speech.findById(params.id)
  if (!speech) {
    notFound()
  }

  return <ContentDisplay content={speech} />
} 