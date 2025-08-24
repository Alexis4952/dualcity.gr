"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAdminAction } from "@/app/actions/admin"
import { setAdminData, isAdminLoggedIn } from "@/lib/admin-auth"
import "./admin-login.css"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Έλεγχος για μήνυμα από το URL
    const message = searchParams.get("message")
    if (message) {
      setError(message)
    }

    // Έλεγχος αν ο χρήστης είναι ήδη συνδεδεμένος
    const checkAuth = async () => {
      if (isAdminLoggedIn()) {
        console.log("User is already logged in, redirecting to admin dashboard")
        router.push("/admin")
      }
    }

    checkAuth()
  }, [router, searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Καθαρισμός των δεδομένων εισόδου
      const cleanUsername = username.trim()
      const cleanPassword = password.trim()

      if (!cleanUsername || !cleanPassword) {
        setError("Παρακαλώ συμπληρώστε όλα τα πεδία")
        setLoading(false)
        return
      }

      console.log(`Attempting login with username: ${cleanUsername}`)

      const result = await loginAdminAction(cleanUsername, cleanPassword)

      if (result.success && result.admin) {
        console.log(`Login successful for: ${result.admin.username}`)
        setSuccess(`Επιτυχής σύνδεση ως ${result.admin.username}`)
        setError("") // Καθαρίζουμε το σφάλμα μόνο σε περίπτωση επιτυχίας

        // Αποθήκευση των στοιχείων του admin στο localStorage και cookies
        setAdminData(result.admin.id, result.admin.username)

        // Άμεση ανακατεύθυνση στο admin dashboard
        const redirect = searchParams.get("redirect") || "/admin"
        console.log(`Redirecting to: ${redirect}`)

        // Χρησιμοποιούμε window.location.href για πιο άμεση ανακατεύθυνση
        window.location.href = redirect
      } else {
        console.error("Login failed:", result.error)
        setError(result.error || "Σφάλμα κατά τη σύνδεση")
        setSuccess("") // Καθαρίζουμε το μήνυμα επιτυχίας μόνο σε περίπτωση σφάλματος
      }
    } catch (error) {
      console.error("Unexpected login error:", error)
      setError(`Απρόσμενο σφάλμα κατά τη σύνδεση: ${error instanceof Error ? error.message : "Unknown error"}`)
      setSuccess("") // Καθαρίζουμε το μήνυμα επιτυχίας μόνο σε περίπτωση σφάλματος
    } finally {
      setLoading(false)
    }
  }

  // Συνάρτηση για την επαναφορά του κωδικού πρόσβασης του admin
  const resetAdminPassword = async () => {
    try {
      setResetLoading(true)
      setError("")
      setSuccess("")

      console.log("Resetting admin password...")
      const response = await fetch("/api/reset-admin-password", {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      })

      if (!response.ok) {
        // Προσπαθούμε να διαβάσουμε το σφάλμα ως JSON, αλλά αν αποτύχει, χρησιμοποιούμε το statusText
        try {
          const errorData = await response.json()
          setError(`Σφάλμα: ${errorData.error || response.statusText}`)
        } catch (jsonError) {
          setError(`Σφάλμα: ${response.statusText}`)
        }
        return
      }

      const data = await response.json()
      console.log("Reset admin password response:", data)

      if (data.success) {
        setSuccess(
          data.message ||
            "Ο κωδικός πρόσβασης του admin επαναφέρθηκε με επιτυχία. Επικοινωνήστε με τον διαχειριστή του συστήματος για τον νέο κωδικό.",
        )
      } else {
        setError(`Σφάλμα: ${data.error || "Άγνωστο σφάλμα"}`)
      }
    } catch (error) {
      console.error("Error resetting admin password:", error)
      setError(`Σφάλμα: ${error instanceof Error ? error.message : "Άγνωστο σφάλμα"}`)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-4">
        <Card className="bg-gray-900/70 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">
              Συνδεθείτε για να αποκτήσετε πρόσβαση στο admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin} className="login-form">
            <CardContent className="space-y-4">
              {/* Χρησιμοποιούμε σταθερό ύψος για τα μηνύματα */}
              <div className="message-container min-h-[80px]">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && !error && (
                  <Alert className="bg-green-900/50 border-green-800">
                    <AlertDescription className="text-green-200">{success}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="input-container">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Εισάγετε το username σας"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div className="input-container">
                <Label htmlFor="password" className="text-gray-300">
                  Κωδικός πρόσβασης
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Εισάγετε τον κωδικό σας"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loading}
              >
                {loading ? "Σύνδεση..." : "Σύνδεση"}
              </Button>

              <div className="w-full border-t border-gray-700 my-2"></div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={resetAdminPassword}
                disabled={resetLoading}
              >
                {resetLoading ? "Επαναφορά..." : "Επαναφορά κωδικού admin"}
              </Button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Αν δεν έχετε στοιχεία σύνδεσης, επικοινωνήστε με τον διαχειριστή του συστήματος
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
