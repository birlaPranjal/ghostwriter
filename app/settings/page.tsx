"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SettingsIcon, Bell, Shield, Palette, Key, Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC")

  const settingsCategories = [
    {
      title: "General Settings",
      icon: SettingsIcon,
      items: [
        {
          label: "Language",
          description: "Choose your preferred language",
          type: "select",
          value: language,
          onChange: setLanguage,
          options: [
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "fr", label: "French" },
            { value: "de", label: "German" },
          ],
        },
        {
          label: "Timezone",
          description: "Set your local timezone",
          type: "select",
          value: timezone,
          onChange: setTimezone,
          options: [
            { value: "UTC", label: "UTC" },
            { value: "EST", label: "Eastern Time" },
            { value: "PST", label: "Pacific Time" },
            { value: "IST", label: "India Standard Time" },
          ],
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Push Notifications",
          description: "Receive notifications about your content",
          type: "switch",
          value: notifications,
          onChange: setNotifications,
        },
        {
          label: "Email Updates",
          description: "Get email updates about new features",
          type: "switch",
          value: true,
          onChange: () => {},
        },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        {
          label: "Dark Mode",
          description: "Use dark theme for better experience",
          type: "switch",
          value: darkMode,
          onChange: setDarkMode,
        },
        {
          label: "Auto Save",
          description: "Automatically save your work",
          type: "switch",
          value: autoSave,
          onChange: setAutoSave,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <TopBar />

          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold ghost-glow">Settings</h1>
                <Badge variant="outline" className="border-purple-600 text-purple-300">
                  <Shield className="mr-1 h-3 w-3" />
                  Secure
                </Badge>
              </div>

              <div className="grid gap-6">
                {settingsCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 ghost-glow">
                          <category.icon className="h-5 w-5 text-purple-400" />
                          <span>{category.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label className="text-purple-100 font-medium">{item.label}</Label>
                              <p className="text-sm text-purple-300/70">{item.description}</p>
                            </div>
                            <div className="min-w-[200px] flex justify-end">
                              {item.type === "switch" ? (
                                <Switch
                                  checked={item.value as boolean}
                                  onCheckedChange={item.onChange}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                              ) : item.type === "select" ? (
                                <Select value={item.value as string} onValueChange={item.onChange}>
                                  <SelectTrigger className="w-[180px] bg-black/50 border-purple-900/30">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black/90 border-purple-900/30">
                                    {item.options?.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* API Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 ghost-glow">
                        <Key className="h-5 w-5 text-purple-400" />
                        <span>API Configuration</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="api-key" className="text-purple-100 font-medium">
                          API Key
                        </Label>
                        <Input
                          id="api-key"
                          type="password"
                          placeholder="sk-..."
                          className="bg-black/50 border-purple-900/30 focus:border-purple-600 mt-2"
                        />
                        <p className="text-sm text-purple-300/70 mt-1">Your OpenAI API key for content generation</p>
                      </div>
                      <div>
                        <Label htmlFor="webhook-url" className="text-purple-100 font-medium">
                          Webhook URL
                        </Label>
                        <Input
                          id="webhook-url"
                          placeholder="https://your-app.com/webhook"
                          className="bg-black/50 border-purple-900/30 focus:border-purple-600 mt-2"
                        />
                        <p className="text-sm text-purple-300/70 mt-1">
                          Receive notifications about content generation
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-end space-x-4"
                >
                  <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-900/20">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 fire-glow">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
