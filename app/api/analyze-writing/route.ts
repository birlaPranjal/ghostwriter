import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/app/models/User"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const analysisTemplate = {
  writingMetrics: {
    optimisticTone: {
      score: 0,
      examples: [],
      suggestions: []
    },
    reflectiveQuality: {
      score: 0,
      examples: [],
      suggestions: []
    },
    motivationalImpact: {
      score: 0,
      examples: [],
      suggestions: []
    },
    poeticElements: {
      score: 0,
      examples: [],
      suggestions: []
    },
    conversationalStyle: {
      score: 0,
      examples: [],
      suggestions: []
    }
  },
  styleAnalysis: {
    tone: "",
    voice: "",
    structure: "",
    strengths: [],
    areasForImprovement: []
  },
  contentAnalysis: {
    clarity: "",
    engagement: "",
    coherence: "",
    keyThemes: [],
    emotionalImpact: ""
  },
  recommendations: {
    styleEnhancements: [],
    structuralImprovements: [],
    contentSuggestions: [],
    practiceExercises: []
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, response } = await req.json()
    if (!prompt || !response) {
      return NextResponse.json(
        { error: "Prompt and response are required" },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const analysisPrompt = `Analyze the following writing sample and provide insights in a structured JSON format:

Prompt: "${prompt}"
Response: "${response}"

Please analyze and return a JSON object with the following structure:
${JSON.stringify(analysisTemplate, null, 2)}

Fill in each field with relevant insights based on the writing sample. Keep the structure exactly as shown.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a writing coach and style analyst. Provide detailed, structured analysis in JSON format."
        },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const analysisData = JSON.parse(completion.choices[0]?.message?.content || "{}")

    // Create a formatted markdown analysis
    const markdownAnalysis = `# Writing Style Analysis

## Writing Metrics

### Optimistic Tone (${analysisData.writingMetrics.optimisticTone.score}%)
${analysisData.writingMetrics.optimisticTone.examples.map((e: string) => `- ${e}`).join('\n')}
**Suggestions:**
${analysisData.writingMetrics.optimisticTone.suggestions.map((s: string) => `- ${s}`).join('\n')}

### Reflective Quality (${analysisData.writingMetrics.reflectiveQuality.score}%)
${analysisData.writingMetrics.reflectiveQuality.examples.map((e: string) => `- ${e}`).join('\n')}
**Suggestions:**
${analysisData.writingMetrics.reflectiveQuality.suggestions.map((s: string) => `- ${s}`).join('\n')}

### Motivational Impact (${analysisData.writingMetrics.motivationalImpact.score}%)
${analysisData.writingMetrics.motivationalImpact.examples.map((e: string) => `- ${e}`).join('\n')}
**Suggestions:**
${analysisData.writingMetrics.motivationalImpact.suggestions.map((s: string) => `- ${s}`).join('\n')}

### Poetic Elements (${analysisData.writingMetrics.poeticElements.score}%)
${analysisData.writingMetrics.poeticElements.examples.map((e: string) => `- ${e}`).join('\n')}
**Suggestions:**
${analysisData.writingMetrics.poeticElements.suggestions.map((s: string) => `- ${s}`).join('\n')}

### Conversational Style (${analysisData.writingMetrics.conversationalStyle.score}%)
${analysisData.writingMetrics.conversationalStyle.examples.map((e: string) => `- ${e}`).join('\n')}
**Suggestions:**
${analysisData.writingMetrics.conversationalStyle.suggestions.map((s: string) => `- ${s}`).join('\n')}

## Style Analysis
- **Tone**: ${analysisData.styleAnalysis.tone}
- **Voice**: ${analysisData.styleAnalysis.voice}
- **Structure**: ${analysisData.styleAnalysis.structure}

### Strengths
${analysisData.styleAnalysis.strengths.map((s: string) => `- ${s}`).join('\n')}

### Areas for Improvement
${analysisData.styleAnalysis.areasForImprovement.map((a: string) => `- ${a}`).join('\n')}

## Content Analysis
- **Clarity**: ${analysisData.contentAnalysis.clarity}
- **Engagement**: ${analysisData.contentAnalysis.engagement}
- **Coherence**: ${analysisData.contentAnalysis.coherence}
- **Emotional Impact**: ${analysisData.contentAnalysis.emotionalImpact}

### Key Themes
${analysisData.contentAnalysis.keyThemes.map((t: string) => `- ${t}`).join('\n')}

## Recommendations

### Style Enhancements
${analysisData.recommendations.styleEnhancements.map((e: string) => `- ${e}`).join('\n')}

### Structural Improvements
${analysisData.recommendations.structuralImprovements.map((i: string) => `- ${i}`).join('\n')}

### Content Suggestions
${analysisData.recommendations.contentSuggestions.map((s: string) => `- ${s}`).join('\n')}

### Practice Exercises
${analysisData.recommendations.practiceExercises.map((e: string) => `- ${e}`).join('\n')}`

    // Add to writing history
    const writingHistoryEntry = {
      prompt,
      response,
      analysis: markdownAnalysis,
      metrics: {
        optimisticTone: analysisData.writingMetrics.optimisticTone.score,
        reflectiveQuality: analysisData.writingMetrics.reflectiveQuality.score,
        motivationalImpact: analysisData.writingMetrics.motivationalImpact.score,
        poeticElements: analysisData.writingMetrics.poeticElements.score,
        conversationalStyle: analysisData.writingMetrics.conversationalStyle.score
      },
      date: new Date().toISOString()
    }

    // Update user's writing analysis and history
    await User.findByIdAndUpdate(user._id, {
      $set: { 
        writingAnalysis: markdownAnalysis,
        writingAnalysisData: analysisData,
        writingMetrics: analysisData.writingMetrics,
        lastWritingPrompt: prompt,
        lastWritingResponse: response
      },
      $push: { writingHistory: writingHistoryEntry }
    })

    return NextResponse.json({ 
      analysis: markdownAnalysis,
      analysisData: analysisData,
      metrics: analysisData.writingMetrics
    })
  } catch (error) {
    console.error("Error analyzing writing:", error)
    return NextResponse.json(
      { error: "Failed to analyze writing" },
      { status: 500 }
    )
  }
} 