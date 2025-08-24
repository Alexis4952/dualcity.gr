"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Settings, ShoppingBag, CreditCard, LogOut, Home, Menu, X, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Προσομοίωση ελέγχου αν ο χρήστης είναι συνδεδεμένος
  useEffect(() => {
    setIsClient(true)
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn && typeof window !== "undefined") {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const menuItems = [
    { name: "Προφίλ", href: "/dashboard", icon: <User className="h-5 w-5" /> },
    { name: "Ρυθμίσεις", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
    { name: "Αγορές", href: "/dashboard/purchases", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "Πληρωμές", href: "/dashboard/payments", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Υποστήριξη", href: "/dashboard/support", icon: <BookOpen className="h-5 w-5" /> },
  ]

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Space Background - Applied to entire page */}
      <div className="fixed inset-0 z-0">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-[#030014]"></div>

        {/* Stars */}
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>

        {/* Distant galaxies/nebulae */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-900/10 blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 rounded-full bg-pink-900/10 blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Name */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/images/logo.png" alt="Server Logo" width={40} height={40} className="mr-2" />
                <span className="text-xl font-bold relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    Dual City
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Αρχική</span>
              </Link>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-red-400 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Αποσύνδεση
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-300" />
                )}
                <span className="sr-only">Μενού</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md md:hidden pt-16">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors py-2 px-4 rounded-md hover:bg-gray-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                href="/"
                className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors py-2 px-4 rounded-md hover:bg-gray-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Αρχική</span>
              </Link>
              <Button
                variant="ghost"
                className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors py-2 px-4 rounded-md hover:bg-gray-800/50 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Αποσύνδεση</span>
              </Button>
            </nav>
          </div>
        </div>
      )}

      <div className="flex min-h-screen pt-16">
        {/* Sidebar - Desktop only */}
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 pt-16 bg-gray-900/50 border-r border-gray-800 backdrop-blur-sm">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors py-2 px-4 rounded-md hover:bg-gray-800/50"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
              <Button
                variant="ghost"
                className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Αποσύνδεση</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 pt-8">
          <div className="container mx-auto relative z-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
