"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isAdmin } from "@/lib/auth"
import { BarChart3, Package, Settings, ShoppingCart, Users } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
  title?: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      router.push("/login?redirect=/admin&message=Πρέπει να είστε διαχειριστής για να αποκτήσετε πρόσβαση")
    }
  }, [router])

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/admin/users", label: "Χρήστες", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/products", label: "Προϊόντα", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/orders", label: "Παραγγελίες", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Ρυθμίσεις", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
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

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-gray-900/50 border-r border-gray-800">
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <Link href="/admin" className="text-xl font-bold text-white">
              Admin Panel
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="md:hidden flex h-16 items-center justify-between border-b border-gray-800 px-4">
            <Link href="/admin" className="text-xl font-bold text-white">
              Admin Panel
            </Link>
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                type="button"
                className="text-gray-300 hover:text-white"
                onClick={() => {
                  const menu = document.getElementById("mobile-menu")
                  if (menu) {
                    menu.classList.toggle("hidden")
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile menu */}
          <div id="mobile-menu" className="md:hidden hidden bg-gray-900 border-b border-gray-800">
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      onClick={() => {
                        const menu = document.getElementById("mobile-menu")
                        if (menu) {
                          menu.classList.add("hidden")
                        }
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            {title && (
              <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
                {title}
              </h1>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
