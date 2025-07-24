import { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Ghost } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Ghost className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold ghost-glow">Ghostwriter AI</span>
            </div>
            <CardTitle className="text-2xl ghost-glow">{title}</CardTitle>
            {description && <p className="text-gray-400">{description}</p>}
          </CardHeader>
          <CardContent className="space-y-4">{children}</CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 