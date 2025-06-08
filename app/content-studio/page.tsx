"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { ContentGenerator } from "@/components/dashboard/content-generator"
import { FileText, BookOpen, Mic } from "lucide-react"

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState("blogs")

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopBar />

          <main className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold mb-6 ghost-glow">Content Studio</h1>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-purple-950/20 border border-purple-900/30">
                  <TabsTrigger
                    value="blogs"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Blogs
                  </TabsTrigger>
                  <TabsTrigger
                    value="stories"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Stories
                  </TabsTrigger>
                  <TabsTrigger
                    value="speeches"
                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Speeches
                  </TabsTrigger>
                </TabsList>

                <div className="grid gap-6">
                  <TabsContent value="blogs" className="m-0">
                    <ContentGenerator type="blog" />
                  </TabsContent>

                  <TabsContent value="stories" className="m-0">
                    <ContentGenerator type="story" />
                  </TabsContent>

                  <TabsContent value="speeches" className="m-0">
                    <ContentGenerator type="speech" />
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
