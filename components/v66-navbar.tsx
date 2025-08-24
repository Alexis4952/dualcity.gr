"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ShoppingCart, Settings, Menu, X, MessageSquare, Clock, Info, CreditCard, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function V66Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Έλεγχος για scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Κλείσιμο του menu όταν αλλάζει η διαδρομή
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Αρχική", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/shop", label: "Κατάστημα", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
    { href: "/updates", label: "Ενημερώσεις", icon: <Clock className="h-4 w-4 mr-2" /> },
    { href: "/support", label: "Υποστήριξη", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { href: "/chat", label: "Live Chat", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { href: "/about", label: "Σχετικά", icon: <Info className="h-4 w-4 mr-2" /> },
    { href: "/payments", label: "Πληρωμές", icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { href: "/admin", label: "Admin", icon: <Settings className="h-4 w-4 mr-2" /> },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isOpen ? "bg-black/80 backdrop-blur-lg border-b border-gray-800 shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/images/new-logo.png" alt="V66 Logo" className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl text-white">V66</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn("text-white hover:bg-gray-800", pathname === link.href && "bg-gray-800")}
                >
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" className="text-white hover:bg-gray-800" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-gray-800",
                      pathname === link.href && "bg-gray-800",
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
