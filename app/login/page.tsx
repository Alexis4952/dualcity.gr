"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { login } from "@/lib/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get redirect path and message from URL if present
  const redirect = searchParams?.get("redirect") || ""
  const message = searchParams?.get("message") || ""

  useEffect(() => {
    // Display message if present in URL
    if (message) {
      setError(message)
    }
  }, [message])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = login(email, password)

      if (result.success && result.role) {
        // Επιτυχής σύνδεση, ανακατεύθυνση στο κατάλληλο dashboard βάσει ρόλου
        // Αν υπάρχει redirect παράμετρος, χρησιμοποίησέ την, αλλιώς πήγαινε στο dashboard του ρόλου
        if (redirect) {
          router.push(redirect)
        } else {
          // Ανακατεύθυνση βάσει ρόλου
          if (result.role === "ADMIN") {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        }
      } else {
        throw new Error("Λάθος email ή κωδικός πρόσβασης")
      }
    } catch (error: any) {
      console.error("Error during login:", error)
      setError(error.message || "Σφάλμα κατά τη σύνδεση")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900/50 p-8 rounded-lg shadow-md max-w-md w-full border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Σύνδεση</h2>
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">
              Κωδικός
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Σύνδεση..." : "Σύνδεση"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300">
            Δεν έχετε λογαριασμό; Εγγραφείτε
          </Link>
        </div>
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Για δοκιμή του admin panel:</p>
          <p>Email: admin@example.com</p>
          <p>Κωδικός: admin123</p>
        </div>
      </div>
    </div>
  )
}
