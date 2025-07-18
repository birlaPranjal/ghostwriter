import React from "react"
import { motion } from "framer-motion"
import { Ghost } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const FooterSection: React.FC = () => (
  <footer className="border-t border-purple-900/20 bg-gradient-to-b from-background to-purple-950/10 relative z-10">
    <div className="container mx-auto px-4 py-16">
      {/* Main Footer Content */}
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Ghost className="h-8 w-8 text-purple-400 float-element" />
            <span className="text-2xl font-bold ghost-glow">Ghostwriter AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Unleash the supernatural power of AI to create compelling content that haunts your readers' minds.
          </p>
          <div className="flex space-x-4">
            {/* Social icons (static SVGs) */}
            <motion.a href="#" whileHover={{ scale: 1.1, y: -2 }} className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1, y: -2 }} className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1, y: -2 }} className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1, y: -2 }} className="text-purple-400 hover:text-purple-300 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" /></svg>
            </motion.a>
          </div>
        </div>
        {/* Product Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold ghost-glow">Product</h4>
          <ul className="space-y-2">
            {[
              { name: "Features", href: "#features" },
              { name: "Pricing", href: "#pricing" },
              { name: "API Documentation", href: "#api" },
              { name: "Integrations", href: "#integrations" },
              { name: "Templates", href: "#templates" },
              { name: "Changelog", href: "#changelog" },
            ].map((link, index) => (
              <li key={index}>
                <motion.a
                  href={link.href}
                  whileHover={{ x: 5, color: "#a855f7" }}
                  className="text-muted-foreground hover:text-purple-400 transition-colors text-sm"
                >
                  {link.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
        {/* Company Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold ghost-glow">Company</h4>
          <ul className="space-y-2">
            {[
              { name: "About Us", href: "#about" },
              { name: "Blog", href: "#blog" },
              { name: "Careers", href: "#careers" },
              { name: "Press Kit", href: "#press" },
              { name: "Contact", href: "#contact" },
              { name: "Partners", href: "#partners" },
            ].map((link, index) => (
              <li key={index}>
                <motion.a
                  href={link.href}
                  whileHover={{ x: 5, color: "#a855f7" }}
                  className="text-muted-foreground hover:text-purple-400 transition-colors text-sm"
                >
                  {link.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
        {/* Support & Legal */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold ghost-glow">Support</h4>
          <ul className="space-y-2">
            {[
              { name: "Help Center", href: "#help" },
              { name: "Community", href: "#community" },
              { name: "Status Page", href: "#status" },
              { name: "Privacy Policy", href: "#privacy" },
              { name: "Terms of Service", href: "#terms" },
              { name: "Cookie Policy", href: "#cookies" },
            ].map((link, index) => (
              <li key={index}>
                <motion.a
                  href={link.href}
                  whileHover={{ x: 5, color: "#a855f7" }}
                  className="text-muted-foreground hover:text-purple-400 transition-colors text-sm"
                >
                  {link.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-purple-900/20 pt-8">
        {/* Developed by Section - Full Width */}
        <div className="flex flex-col items-center justify-center mb-8 w-full">
          <div className="flex items-center justify-center space-x-16 text-5xl md:text-7xl w-full">
            <span className="text-muted-foreground font-medium text-5xl md:text-7xl">Developed by</span>
            <span className="text-5xl md:text-7xl font-bold ghost-glow bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
              Int Main()
            </span>
            {/* Large Animated Ghost Icon */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Ghost className="h-28 w-28 md:h-32 md:w-32 text-purple-400 ghost-glow" />
              {/* Glow effect around the ghost */}
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-purple-400/20 blur-lg pointer-events-none"
              />
            </motion.div>
          </div>
        </div>
        {/* Copyright and other info - Single Line */}
        <div className="flex flex-col items-center justify-center pt-6 border-t border-purple-900/10">
          <div className="flex items-center justify-center space-x-4 text-center">
            <p className="text-muted-foreground text-sm">&copy; 2024 Ghostwriter AI. All rights reserved.</p>
            <span className="text-muted-foreground text-sm">||</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
              OpenAI GPT-4
            </Badge>
            <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
              ElevenLabs
            </Badge>
          </div>
        </div>
      </div>
      {/* Floating Ghost in Footer */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 right-4 pointer-events-none"
      >
        <Ghost className="h-8 w-8 text-purple-400/50" />
      </motion.div>
    </div>
  </footer>
) 