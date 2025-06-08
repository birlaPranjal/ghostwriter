"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PenTool, BookOpen, Mic } from "lucide-react"

const routes = [
  {
    href: "/content-studio/blog",
    label: "Blog Writer",
    icon: PenTool,
  },
  {
    href: "/content-studio/story",
    label: "Story Creator",
    icon: BookOpen,
  },
  {
    href: "/content-studio/speech",
    label: "Speech Writer",
    icon: Mic,
  },
]

export function ContentStudioNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-purple-900/30 bg-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/content-studio" className="text-xl font-bold text-purple-300">
              Content Studio
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-purple-300 hover:text-purple-100 hover:bg-purple-900/20",
                    pathname === route.href && "bg-purple-900/20 text-purple-100"
                  )}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
} 