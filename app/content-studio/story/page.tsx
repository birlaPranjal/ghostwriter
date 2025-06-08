"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, X } from "lucide-react"

interface Character {
  name: string
  description: string
  role: string
}

export default function StoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    genre: "Fantasy",
    targetAudience: "All Ages",
    length: "Medium",
    characters: [] as Character[],
  })

  const addCharacter = () => {
    setFormData({
      ...formData,
      characters: [
        ...formData.characters,
        { name: "", description: "", role: "" },
      ],
    })
  }

  const removeCharacter = (index: number) => {
    setFormData({
      ...formData,
      characters: formData.characters.filter((_, i) => i !== index),
    })
  }

  const updateCharacter = (
    index: number,
    field: keyof Character,
    value: string
  ) => {
    const newCharacters = [...formData.characters]
    newCharacters[index] = { ...newCharacters[index], [field]: value }
    setFormData({ ...formData, characters: newCharacters })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "story",
          title: formData.title,
          prompt: formData.prompt,
          parameters: {
            genre: formData.genre,
            targetAudience: formData.targetAudience,
            length: formData.length,
            characters: formData.characters,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create story")
      }

      const data = await response.json()
      toast.success("Story created successfully!")
      router.push(`/content-studio/story/${data._id}`)
    } catch (error) {
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Story</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter story title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                placeholder="Describe your story idea..."
                value={formData.prompt}
                onChange={(e) =>
                  setFormData({ ...formData, prompt: e.target.value })
                }
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Genre</label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) =>
                    setFormData({ ...formData, genre: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Horror">Horror</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Historical">Historical</SelectItem>
                    <SelectItem value="Contemporary">Contemporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) =>
                    setFormData({ ...formData, targetAudience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Children">Children</SelectItem>
                    <SelectItem value="Young Adult">Young Adult</SelectItem>
                    <SelectItem value="Adult">Adult</SelectItem>
                    <SelectItem value="All Ages">All Ages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Length</label>
                <Select
                  value={formData.length}
                  onValueChange={(value) =>
                    setFormData({ ...formData, length: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Characters</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCharacter}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Character
                </Button>
              </div>

              {formData.characters.map((character, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Character {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCharacter(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm">Name</label>
                      <Input
                        value={character.name}
                        onChange={(e) =>
                          updateCharacter(index, "name", e.target.value)
                        }
                        placeholder="Character name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm">Role</label>
                      <Input
                        value={character.role}
                        onChange={(e) =>
                          updateCharacter(index, "role", e.target.value)
                        }
                        placeholder="Character role"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm">Description</label>
                      <Input
                        value={character.description}
                        onChange={(e) =>
                          updateCharacter(index, "description", e.target.value)
                        }
                        placeholder="Character description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Story
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 