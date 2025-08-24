"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import AuthModal from "./auth/auth-modal"
import { isLoggedIn, logout } from "@/lib/auth"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Έλεγχος αν είμαστε στην αρχική σελίδα
  const isHomePage = pathname === "/"

  useEffect(() => {
    // Check if user is logged in
    setUserLoggedIn(isLoggedIn())
  }, [])

  const DISCORD_LINK = "https://discord.gg/PdMYvK7WGN"

  const navLinks = [
    { name: "Αρχική", href: "/" },
    { name: "Κανόνες", href: "/rules" },
    { name: "Οδηγοί", href: "/guides" },
    { name: "Discord", href: DISCORD_LINK, external: true },
    { name: "Κατάστημα", href: "/shop" },
  ]

  const handleLogout = () => {
    logout()
    setUserLoggedIn(false)
    router.push("/")
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Name */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/images/new-logo.png" alt="Server Logo" width={40} height={40} className="mr-2" />
                <span className="text-xl font-bold relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    Dual City
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                ),
              )}

              {userLoggedIn && (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="destructive" onClick={handleLogout}>
                    Αποσύνδεση
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6 text-gray-300" />
                    <span className="sr-only">Άνοιγμα μενού</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gray-900 border-gray-800">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <Link href="/" className="flex items-center">
                        <Image src="/images/new-logo.png" alt="Server Logo" width={40} height={40} className="mr-2" />
                        <span className="text-xl font-bold relative">
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                            Dual City
                          </span>
                        </span>
                      </Link>
                    </div>
                    <nav className="flex flex-col space-y-4">
                      {navLinks.map((link) =>
                        link.external ? (
                          <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-cyan-400 transition-colors py-2 text-lg"
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-cyan-400 transition-colors py-2 text-lg"
                          >
                            {link.name}
                          </Link>
                        ),
                      )}

                      {userLoggedIn && (
                        <Link
                          href="/dashboard"
                          className="text-gray-300 hover:text-cyan-400 transition-colors py-2 text-lg"
                        >
                          Dashboard
                        </Link>
                      )}
                    </nav>
                    {userLoggedIn && (
                      <div className="mt-auto pt-6">
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
                          Αποσύνδεση
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
