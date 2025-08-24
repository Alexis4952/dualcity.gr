"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { DiscordLogoIcon } from "@radix-ui/react-icons"
import { Mail, Lock, User, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { register } from "@/lib/auth"

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      setError("You must accept the terms of use")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simple registration with localStorage
      const success = register(username, email, password)

      if (success) {
        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        throw new Error("Registration failed")
      }
    } catch (error: any) {
      console.error("Error signing up:", error)
      setError(error.message || "Error during registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDiscordRegister = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Mock Discord registration
      setTimeout(() => {
        // Store login state
        localStorage.setItem("isLoggedIn", "true")

        // Store mock user data
        localStorage.setItem(
          "userData",
          JSON.stringify({
            id: "123456",
            email: "discord_user@example.com",
            username: "DiscordUser",
          }),
        )

        // Redirect to dashboard
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
          onClick={handleDiscordRegister}
          disabled={isLoading}
        >
          <DiscordLogoIcon className="h-5 w-5 text-[#5865F2]" />
          Εγγραφή με Discord
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#030014] px-2 text-gray-400">ή εγγραφείτε με email</span>
        </div>
      </div>

      <form onSubmit={handleEmailRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-300">
            Όνομα Χρήστη
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              type="text"
              placeholder="username"
              className="pl-10 bg-gray-900/50 border-gray-700 focus:border-cyan-500 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-gray-300">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="register-email"
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
          <Label htmlFor="register-password" className="text-gray-300">
            Κωδικός
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              className="pl-10 bg-gray-900/50 border-gray-700 focus:border-cyan-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
          >
            Αποδέχομαι τους{" "}
            <Button variant="link" className="p-0 h-auto text-cyan-400">
              όρους χρήσης
            </Button>
          </label>
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          disabled={isLoading || !acceptTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Εγγραφή...
            </>
          ) : (
            "Εγγραφή"
          )}
        </Button>
      </form>
    </div>
  )
}
