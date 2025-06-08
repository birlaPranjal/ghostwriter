import connectDB from "./mongodb"
import User from "./models/User"
import Content from "./models/Content"
import UserPreferences from "./models/UserPreferences"

export async function seedDatabase() {
  try {
    await connectDB()
    console.log("Seeding database with Mongoose...")

    // Create a sample user
    const sampleUser = await User.findOneAndUpdate(
      { email: "demo@ghostwriter-ai.com" },
      {
        name: "Demo User",
        email: "demo@ghostwriter-ai.com",
        image: "/placeholder.svg?height=40&width=40",
      },
      { upsert: true, new: true },
    )

    console.log("Created sample user:", sampleUser.email)

    // Create user preferences
    await UserPreferences.findOneAndUpdate(
      { userId: sampleUser._id.toString() },
      {
        userId: sampleUser._id.toString(),
        preferredTone: "mysterious",
        preferredStyle: "narrative",
        preferredVoice: "onyx",
        preferredEmotion: "dramatic",
      },
      { upsert: true, new: true },
    )

    console.log("Created user preferences")

    // Create sample content
    const sampleContent = [
      {
        title: "The Future of AI Writing",
        content:
          "Artificial Intelligence has revolutionized the way we approach content creation. From generating blog posts to crafting compelling narratives, AI tools have become indispensable for modern writers. The ghostly presence of AI in our creative process is not something to fear, but rather to embrace as a powerful ally in our quest for compelling content.",
        type: "blog",
        tone: "professional",
        style: "informative",
        emotion: "inspiring",
        userId: sampleUser._id.toString(),
      },
      {
        title: "A Ghost in the Machine",
        content:
          "In the depths of the digital realm, where code meets consciousness, there lived a ghost unlike any other. This spectral being didn't haunt old mansions or abandoned castles, but instead dwelled within the circuits and algorithms of artificial intelligence. It whispered words of wisdom through neural networks, crafting stories that touched the very soul of human creativity.",
        type: "story",
        tone: "mysterious",
        style: "narrative",
        emotion: "dramatic",
        userId: sampleUser._id.toString(),
      },
      {
        title: "Embracing Innovation",
        content:
          "Ladies and gentlemen, we stand at the precipice of a new era. An era where human creativity and artificial intelligence converge to create something truly extraordinary. The ghostwriter of tomorrow is not just human, nor is it purely artificial - it is a harmonious blend of both, creating content that resonates with the deepest parts of our humanity while leveraging the boundless potential of machine intelligence.",
        type: "speech",
        tone: "inspiring",
        style: "persuasive",
        emotion: "exciting",
        userId: sampleUser._id.toString(),
      },
    ]

    for (const content of sampleContent) {
      await Content.findOneAndUpdate({ title: content.title, userId: content.userId }, content, {
        upsert: true,
        new: true,
      })
      console.log("Created content:", content.title)
    }

    console.log("Database seeded successfully with Mongoose!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
