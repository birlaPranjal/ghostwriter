import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Create conversation context with previous messages
    const messages = [
      {
        role: "system" as const,
        content: `You are a helpful AI assistant for Ghostwriter AI platform. You should:

1. Answer questions directly and helpfully
2. Provide real, practical advice about writing, content creation, and AI tools
3. Be conversational and friendly
4. Use emojis occasionally but don't overdo it
5. Give specific, actionable answers
6. If asked about current events or real-time information, explain that you don't have access to real-time data
7. Help with writing tips, content ideas, grammar, storytelling, and creative writing
8. Explain platform features when asked
9. Be encouraging and supportive
10. Keep responses concise but informative (2-5 sentences usually)

Available platform features you can explain:
- Content types: Blogs, Stories, Speeches
- Tones: Professional, Casual, Humorous, Serious, Mysterious
- Styles: Narrative, Descriptive, Persuasive, Informative, Creative
- Emotions: Inspiring, Dramatic, Calm, Exciting, Melancholic
- Voice synthesis with ElevenLabs
- Save and edit content

Answer the user's question directly and helpfully.`,
      },
      // Include recent conversation history for context
      ...(conversationHistory || []).slice(-6).map((msg: any) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ]

    console.log("Sending request to OpenAI with message:", message)

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const response = completion.choices[0]?.message?.content

    console.log("OpenAI response:", response)

    if (!response) {
      return NextResponse.json({
        response:
          "I'm having trouble generating a response right now. Could you please try asking your question again?",
      })
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Check if it's an OpenAI API error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({
          response: "There's an issue with the API configuration. Please check if the OpenAI API key is properly set.",
        })
      }
      if (error.message.includes("quota")) {
        return NextResponse.json({
          response: "The API quota has been exceeded. Please try again later.",
        })
      }
    }

    return NextResponse.json({
      response: "I'm experiencing some technical difficulties. Please try asking your question again.",
    })
  }
}
