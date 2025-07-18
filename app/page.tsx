"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import {
  pricingPlans,
  creationTypes,
  workflowSteps,
  features,
  testimonials,
  apiFeatures,
  codeSnippet,
} from "@/data/homepageData"
import { FloatingGhosts } from "@/components/homepage/FloatingGhosts"
import { GhostCursor } from "@/components/homepage/GhostCursor"
import { HeroSection } from "@/components/homepage/HeroSection"
import { WhatYouCanCreateSection } from "@/components/homepage/WhatYouCanCreateSection"
import { HowItWorksSection } from "@/components/homepage/HowItWorksSection"
import { GhostwritingAdvantageSection } from "@/components/homepage/GhostwritingAdvantageSection"
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection"
import { JoinClubSection } from "@/components/homepage/JoinClubSection"
import { ApiPreviewSection } from "@/components/homepage/ApiPreviewSection"
import { FeaturesSection } from "@/components/homepage/FeaturesSection"
import { PricingSection } from "@/components/homepage/PricingSection"
import { FooterSection } from "@/components/homepage/FooterSection"

export default function HomePage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isGhostCursor, setIsGhostCursor] = useState(false)
  const [email, setEmail] = useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email subscription (replace with real logic)
    console.log("Email submitted:", email)
    setEmail("")
  }

  const handleGhostCursorToggle = () => setIsGhostCursor((v) => !v)
  const handleGhostCursorDeactivate = () => setIsGhostCursor(false)
  const handleThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background transition-colors duration-300 relative overflow-hidden">
      {/* Floating Ghosts (background) */}
      <FloatingGhosts numGhosts={8} />
      {/* Ghost Cursor (only when active) */}
      <GhostCursor active={isGhostCursor} onDeactivate={handleGhostCursorDeactivate} />
      {/* Header + Hero */}
      <HeroSection
        onGhostCursorToggle={handleGhostCursorToggle}
        isGhostCursorActive={isGhostCursor}
        onThemeToggle={handleThemeToggle}
        theme={theme ?? "light"}
        session={session ?? null}
      />
      {/* What You Can Create */}
      <WhatYouCanCreateSection creationTypes={creationTypes} />
      {/* How It Works */}
      <HowItWorksSection workflowSteps={workflowSteps} />
      {/* Ghostwriting Advantage */}
      <GhostwritingAdvantageSection
        features={features}
        onGhostCursorToggle={handleGhostCursorToggle}
        isGhostCursorActive={isGhostCursor}
      />
      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />
      {/* Join the Ghost Club */}
      <JoinClubSection email={email} setEmail={setEmail} handleEmailSubmit={handleEmailSubmit} />
      {/* API Preview */}
      <ApiPreviewSection apiFeatures={apiFeatures} codeSnippet={codeSnippet} />
      {/* Features */}
      <FeaturesSection />
      {/* Pricing Plans */}
      <PricingSection pricingPlans={pricingPlans} />
      {/* Footer */}
      <FooterSection />
    </div>
  )
}
