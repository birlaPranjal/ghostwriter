export const pricingPlans = [
  {
    name: "Apprentice",
    price: "$9",
    period: "/month",
    features: ["100 generations/month", "Basic voices", "Standard support"],
    current: true,
  },
  {
    name: "Ghostwriter",
    price: "$29",
    period: "/month",
    features: ["Unlimited generations", "Premium voices", "Priority support", "Advanced styles"],
    popular: true,
  },
  {
    name: "Phantom",
    price: "$99",
    period: "/month",
    features: ["Everything in Ghostwriter", "Custom voice cloning", "API access", "White-label option"],
  },
]

export const creationTypes = [
  {
    icon: "FileText",
    title: "Blog Posts",
    description: "Craft engaging articles that captivate your audience",
    example: "The Art of Letting Go",
  },
  {
    icon: "Mic",
    title: "Speeches",
    description: "Deliver powerful words that move hearts and minds",
    example: "Leadership in the Digital Age",
  },
  {
    icon: "BookOpen",
    title: "Short Stories",
    description: "Weave tales that transport readers to other worlds",
    example: "Whispers in the Moonlight",
  },
]

export const workflowSteps = [
  {
    icon: "Settings",
    title: "Choose Type",
    description: "Select your content format",
  },
  {
    icon: "Eye",
    title: "Set Tone",
    description: "Define style and emotion",
  },
  {
    icon: "Sparkles",
    title: "Generate Content",
    description: "AI creates your masterpiece",
  },
  {
    icon: "Save",
    title: "Save/Edit/Listen",
    description: "Perfect and preserve your work",
  },
]

export const features = [
  {
    title: "Tone Matching",
    description: "AI adapts to your unique voice and style preferences",
  },
  {
    title: "Real Voice",
    description: "ElevenLabs integration for lifelike speech synthesis",
  },
  {
    title: "Personalization",
    description: "Learns from your writing patterns and improves over time",
  },
  {
    title: "Auto Save",
    description: "Never lose your creative breakthroughs again",
  },
]

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    quote: "Ghostwriter AI transformed my writing process. It's like having a creative partner who never sleeps.",
    avatar: "/placeholder.svg?height=40&width=40&text=SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Public Speaker",
    quote: "The speech generation is incredible. My presentations have never been more engaging.",
    avatar: "/placeholder.svg?height=40&width=40&text=MR",
  },
  {
    name: "Emily Watson",
    role: "Novelist",
    quote: "From writer's block to bestseller. This AI understands storytelling like no other.",
    avatar: "/placeholder.svg?height=40&width=40&text=EW",
  },
]

export const apiFeatures = [
  "GPT-4 Integration",
  "ElevenLabs TTS",
  "JWT Authentication",
  "MongoDB Storage",
]

export const codeSnippet = `curl -X POST https://api.ghostwriter-ai.com/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "blog",
    "title": "The Future of AI",
    "tone": "professional",
    "style": "informative"
  }'` 