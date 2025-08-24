"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { isLoggedIn, getUserData, logout, isAdmin } from "@/lib/auth"
import BackButton from "@/components/back-button"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/")
      return
    }

    // Get user data
    const userData = getUserData()
    setUser(userData)

    // Redirect admin users to admin dashboard
    if (isAdmin()) {
      router.push("/admin")
      return
    }

    setLoading(false)
  }, [router])

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BackButton />
      <div className="container mx-auto py-16 px-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Dashboard</CardTitle>
            <CardDescription className="text-gray-400">Καλώς ήρθατε στο dashboard σας</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="font-bold text-white mb-2">Πληροφορίες Χρήστη</h3>
              <p className="text-gray-300">Όνομα Χρήστη: {user?.username}</p>
              <p className="text-gray-300">Email: {user?.email}</p>
              <p className="text-gray-300">ID: {user?.id}</p>
            </div>

            <div className="flex gap-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => router.push("/")}
              >
                Επιστροφή στην Αρχική
              </Button>

              <Button variant="destructive" onClick={handleSignOut}>
                Αποσύνδεση
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
