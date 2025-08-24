"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Home,
  Package,
  Users,
  Settings,
  LogOut,
  BarChart2,
  MessageSquare,
  Bell,
  HardDrive,
  AlertTriangle,
} from "lucide-react"
import { logoutAdmin, getCurrentAdmin } from "@/lib/admin-auth"
import { useRouter } from "next/navigation"

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [admin, setAdmin] = useState<{ username: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const currentAdmin = getCurrentAdmin()
    if (currentAdmin) {
      setAdmin({ username: currentAdmin.username })
    }
  }, [])

  const handleLogout = () => {
    if (confirm("Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε;")) {
      logoutAdmin()
      router.push("/admin-login")
    }
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/admin/products", label: "Προϊόντα", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/sold-products", label: "Πωλημένα", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/users", label: "Χρήστες", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/admins", label: "Διαχειριστές", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/orders", label: "Παραγγελίες", icon: <BarChart2 className="h-5 w-5" /> },
    { href: "/admin/support", label: "Υποστήριξη", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/admin/announcements", label: "Ανακοινώσεις", icon: <Bell className="h-5 w-5" /> },
    { href: "/admin/statistics", label: "Στατιστικά", icon: <BarChart2 className="h-5 w-5" /> },
    { href: "/admin/logs", label: "Logs", icon: <BarChart2 className="h-5 w-5" /> },
    { href: "/admin/storage", label: "Αποθήκευση", icon: <HardDrive className="h-5 w-5" /> },
    { href: "/admin/diagnostics", label: "Διαγνωστικά", icon: <AlertTriangle className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Ρυθμίσεις", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/admin" className="flex items-center">
                <span className="text-white font-bold text-xl">Admin Panel</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {admin && (
                <span className="text-gray-300 mr-4">
                  Συνδεδεμένος ως <span className="font-medium text-cyan-400">{admin.username}</span>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Αποσύνδεση</span>
              </Button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-gray-400">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-700">
              {admin && (
                <div className="px-3 text-gray-400 text-sm">
                  Συνδεδεμένος ως <span className="font-medium text-cyan-400">{admin.username}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="mt-3 w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Αποσύνδεση</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      <div className="hidden md:block border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "border-cyan-500 text-white"
                    : "border-transparent text-gray-300 hover:border-gray-300 hover:text-white"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-12 mx-2 whitespace-nowrap`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
