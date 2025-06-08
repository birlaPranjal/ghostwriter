"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Ghost, Home, FileText, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Content", href: "/content", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gradient-to-b from-purple-950/30 to-black border-r border-purple-900/30 min-h-screen"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Ghost className="h-8 w-8 text-purple-400" />
          <span className="text-xl font-bold ghost-glow">Ghostwriter AI</span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-purple-600/20 text-purple-300 border border-purple-600/30"
                        : "hover:bg-purple-900/20 hover:text-purple-300"
                    }`}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-8">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300"
              onClick={() => signOut()}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
