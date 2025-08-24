"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { DiscordLogoIcon } from "@radix-ui/react-icons"
import { Mail, Lock, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Attempt login
    const result = login(email, password)

    if (result.success) {
      // Redirect based on role
      if (result.role === "ADMIN") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/dashboard"
      }
    } else {
      setError("Λάθος email ή κωδικός πρόσβασης.")
      setIsLoading(false)
    }
  }

  const handleDiscordLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Mock Discord login
      setTimeout(() => {
        // Store login state
        localStorage.setItem("isLoggedIn", "true")

        // Store mock user data
        const userData = {
          id: "123456",
          email: "discord_user@example.com",
          username: "DiscordUser",
          role: "USER", // Default role for Discord users
        }

        localStorage.setItem("userData", JSON.stringify(userData))

        // Redirect to dashboard (Discord users are not admins by default)
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error: any) {
      console.error("Error signing in with Discord:", error)
      setError(error.message || "Error signing in with Discord. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2 bg-[#5865F2]/10 border-[#5865F2]/30 hover:bg-[#5865F2]/20 text-white"
          onClick={handleDiscordLogin}
          disabled={isLoading}
        >
          <DiscordLogoIcon className="h-5 w-5 text-[#5865F2]" />
          Σύνδεση με Discord
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#030014] px-2 text-gray-400">ή συνδεθείτε με email</span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10 bg-gray-900/50 border-gray-700 focus:border-cyan-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-300">
              Κωδικός
            </Label>
            <Button variant="link" className="px-0 text-xs text-cyan-400">
              Ξεχάσατε τον κωδικό;
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 bg-gray-900/50 border-gray-700 focus:border-cyan-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Σύνδεση...
            </>
          ) : (
            "Σύνδεση"
          )}
        </Button>
      </form>
    </div>
  )
}
