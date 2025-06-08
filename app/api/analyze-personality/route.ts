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
  overallProfile: {
    primaryStyle: "",
    strengths: [],
    challenges: []
  },
  writingApproach: {
    style: "",
    preferences: [],
    techniques: []
  },
  environmentalFactors: {
    idealConditions: [],
    productivityFactors: [],
    distractionManagement: []
  },
  creativeProcess: {
    problemSolving: "",
    inspirationSources: [],
    workflowPatterns: []
  },
  goalsAndImpact: {
    communicationStyle: "",
    targetAudience: [],
    recommendedContentTypes: []
  },
  recommendations: {
    writingRoutine: [],
    tools: [],
    developmentAreas: []
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { answers } = await req.json()
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Get user profile for context
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const analysisPrompt = `Analyze the following writing personality quiz answers and provide insights in a structured JSON format:

1. Writing Start: "${answers[0]}"
2. Writing Environment: "${answers[1]}"
3. Writer's Block Handling: "${answers[2]}"
4. Writing Goal: "${answers[3]}"

Please analyze and return a JSON object with the following structure:
${JSON.stringify(analysisTemplate, null, 2)}

Fill in each field with relevant insights based on the quiz answers. Keep the structure exactly as shown.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a writing coach and personality analyst. Provide detailed, structured analysis in JSON format."
        },
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const analysisData = JSON.parse(completion.choices[0]?.message?.content || "{}")

    // Create a formatted markdown analysis
    const markdownAnalysis = `# Writing Personality Analysis

## Overall Profile
- **Primary Style**: ${analysisData.overallProfile.primaryStyle}
- **Strengths**:
${analysisData.overallProfile.strengths.map(s => `  - ${s}`).join('\n')}
- **Challenges**:
${analysisData.overallProfile.challenges.map(c => `  - ${c}`).join('\n')}

## Writing Approach
- **Style**: ${analysisData.writingApproach.style}
- **Preferences**:
${analysisData.writingApproach.preferences.map(p => `  - ${p}`).join('\n')}
- **Techniques**:
${analysisData.writingApproach.techniques.map(t => `  - ${t}`).join('\n')}

## Environmental Factors
- **Ideal Conditions**:
${analysisData.environmentalFactors.idealConditions.map(c => `  - ${c}`).join('\n')}
- **Productivity Factors**:
${analysisData.environmentalFactors.productivityFactors.map(f => `  - ${f}`).join('\n')}
- **Distraction Management**:
${analysisData.environmentalFactors.distractionManagement.map(d => `  - ${d}`).join('\n')}

## Creative Process
- **Problem Solving**: ${analysisData.creativeProcess.problemSolving}
- **Inspiration Sources**:
${analysisData.creativeProcess.inspirationSources.map(s => `  - ${s}`).join('\n')}
- **Workflow Patterns**:
${analysisData.creativeProcess.workflowPatterns.map(p => `  - ${p}`).join('\n')}

## Goals and Impact
- **Communication Style**: ${analysisData.goalsAndImpact.communicationStyle}
- **Target Audience**:
${analysisData.goalsAndImpact.targetAudience.map(a => `  - ${a}`).join('\n')}
- **Recommended Content Types**:
${analysisData.goalsAndImpact.recommendedContentTypes.map(t => `  - ${t}`).join('\n')}

## Recommendations
- **Writing Routine**:
${analysisData.recommendations.writingRoutine.map(r => `  - ${r}`).join('\n')}
- **Tools**:
${analysisData.recommendations.tools.map(t => `  - ${t}`).join('\n')}
- **Development Areas**:
${analysisData.recommendations.developmentAreas.map(a => `  - ${a}`).join('\n')}`

    // Update user's personality analysis with both raw data and formatted markdown
    await User.findByIdAndUpdate(user._id, {
      $set: { 
        personalityAnalysis: markdownAnalysis,
        personalityAnalysisData: analysisData // Store the raw JSON data
      }
    })

    return NextResponse.json({ 
      analysis: markdownAnalysis,
      analysisData: analysisData
    })
  } catch (error) {
    console.error("Error analyzing personality:", error)
    return NextResponse.json(
      { error: "Failed to analyze personality" },
      { status: 500 }
    )
  }
}

function getQuestionText(questionId: string): string {
  const questions: Record<string, string> = {
    "1": "How do you prefer to approach writing?",
    "2": "What's your ideal writing environment?",
    "3": "How do you handle feedback on your writing?",
    "4": "What's your primary writing goal?"
  }
  return questions[questionId] || "Unknown question"
} 