import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, BookOpen, Mic, History } from "lucide-react"

interface StatsCardsProps {
  stats: {
    blogs: number
    stories: number
    speeches: number
    history: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Blogs",
      value: stats.blogs,
      icon: FileText,
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "Stories",
      value: stats.stories,
      icon: BookOpen,
      gradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Speeches",
      value: stats.speeches,
      icon: Mic,
      gradient: "from-pink-600 to-red-600",
    },
    {
      title: "History",
      value: stats.history,
      icon: History,
      gradient: "from-red-600 to-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-950/20 to-black border-purple-900/30 hover:border-purple-600/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${card.gradient})` }}>
                    {card.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${card.gradient}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 