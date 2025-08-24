"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { register } from "@/lib/auth"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Έλεγχος αν το email είναι το προκαθορισμένο admin email
    if (email === "admin@example.com") {
      setError("Αυτό το email δεν μπορεί να χρησιμοποιηθεί για εγγραφή")
      setLoading(false)
      return
    }

    try {
      const success = register(username, email, password)

      if (success) {
        // Επιτυχής εγγραφή, ανακατεύθυνση στο dashboard
        router.push("/dashboard")
      } else {
        throw new Error("Η εγγραφή απέτυχε")
      }
    } catch (error: any) {
      console.error("Error during registration:", error)
      setError(error.message || "Σφάλμα κατά την εγγραφή")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900/50 p-8 rounded-lg shadow-md max-w-md w-full border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Εγγραφή</h2>
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-white">
              Όνομα Χρήστη
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
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
              minLength={6}
              className="bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Εγγραφή..." : "Εγγραφή"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
            Έχετε ήδη λογαριασμό; Συνδεθείτε
          </Link>
        </div>
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Σημείωση: Οι λογαριασμοί διαχειριστών μπορούν να δημιουργηθούν μόνο από υπάρχοντες διαχειριστές.</p>
        </div>
      </div>
    </div>
  )
}
