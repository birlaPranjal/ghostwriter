import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Profile fields for personalization
    writingStyle: {
      type: String,
      enum: ["formal", "conversational", "professional", "creative", "technical"],
    },
    preferredTones: [{
      type: String,
      enum: ["professional", "casual", "humorous", "serious", "mysterious"],
    }],
    favoriteTopics: [{
      type: String,
    }],
    targetAudience: {
      type: String,
    },
    writingGoals: {
      type: String,
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
    },
    preferredLength: {
      type: String,
      enum: ["brief", "medium", "detailed", "comprehensive"],
    },
    referenceAuthors: {
      type: String,
    },
    // Personality analysis
    personalityAnalysis: {
      type: String,
    },
    personalityAnalysisData: {
      overallProfile: {
        primaryStyle: String,
        strengths: [String],
        challenges: [String]
      },
      writingApproach: {
        style: String,
        preferences: [String],
        techniques: [String]
      },
      environmentalFactors: {
        idealConditions: [String],
        productivityFactors: [String],
        distractionManagement: [String]
      },
      creativeProcess: {
        problemSolving: String,
        inspirationSources: [String],
        workflowPatterns: [String]
      },
      goalsAndImpact: {
        communicationStyle: String,
        targetAudience: [String],
        recommendedContentTypes: [String]
      },
      recommendations: {
        writingRoutine: [String],
        tools: [String],
        developmentAreas: [String]
      }
    },
    // Writing analysis
    writingAnalysis: {
      type: String,
    },
    writingAnalysisData: {
      writingMetrics: {
        optimisticTone: {
          score: Number,
          examples: [String],
          suggestions: [String]
        },
        reflectiveQuality: {
          score: Number,
          examples: [String],
          suggestions: [String]
        },
        motivationalImpact: {
          score: Number,
          examples: [String],
          suggestions: [String]
        },
        poeticElements: {
          score: Number,
          examples: [String],
          suggestions: [String]
        },
        conversationalStyle: {
          score: Number,
          examples: [String],
          suggestions: [String]
        }
      },
      styleAnalysis: {
        tone: String,
        voice: String,
        structure: String,
        strengths: [String],
        areasForImprovement: [String]
      },
      contentAnalysis: {
        clarity: String,
        engagement: String,
        coherence: String,
        keyThemes: [String],
        emotionalImpact: String
      },
      recommendations: {
        styleEnhancements: [String],
        structuralImprovements: [String],
        contentSuggestions: [String],
        practiceExercises: [String]
      }
    },
    lastWritingPrompt: {
      type: String,
    },
    lastWritingResponse: {
      type: String,
    },
    // Detailed writing metrics
    writingMetrics: {
      optimisticTone: {
        score: Number,
        examples: [String],
        suggestions: [String]
      },
      reflectiveQuality: {
        score: Number,
        examples: [String],
        suggestions: [String]
      },
      motivationalImpact: {
        score: Number,
        examples: [String],
        suggestions: [String]
      },
      poeticElements: {
        score: Number,
        examples: [String],
        suggestions: [String]
      },
      conversationalStyle: {
        score: Number,
        examples: [String],
        suggestions: [String]
      }
    },
    // Writing history
    writingHistory: [{
      prompt: String,
      response: String,
      analysis: String,
      metrics: {
        optimisticTone: Number,
        reflectiveQuality: Number,
        motivationalImpact: Number,
        poeticElements: Number,
        conversationalStyle: Number
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    // Usage statistics
    totalGenerated: {
      type: Number,
      default: 0,
    },
    wordsGenerated: {
      type: Number,
      default: 0,
    },
    voiceMinutes: {
      type: Number,
      default: 0,
    },
    savedContent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ writingStyle: 1 })
UserSchema.index({ experienceLevel: 1 })

export default mongoose.models.User || mongoose.model("User", UserSchema) 