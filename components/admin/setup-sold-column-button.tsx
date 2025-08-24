"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Database } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SetupSoldColumnButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const setupSoldColumn = async () => {
    try {
      setLoading(true)
      setResult(null)

      console.log("Setting up 'sold' column...")
      const response = await fetch("/api/setup-sold-column")
      const data = await response.json()

      console.log("Setup response:", data)
      setResult(data)

      if (data.success) {
        toast({
          title: "Επιτυχία",
          description: data.message,
        })
      } else {
        toast({
          title: "Σφάλμα",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error setting up sold column:", error)
      setResult({
        success: false,
        message: "Δεν ήταν δυνατή η ρύθμιση της στήλης 'sold'",
      })
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η ρύθμιση της στήλης 'sold'",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" size="sm" onClick={setupSoldColumn} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Ρύθμιση...
          </>
        ) : (
          <>
            <Database className="mr-2 h-4 w-4" />
            Ρύθμιση στήλης 'sold'
          </>
        )}
      </Button>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"} className="mt-2 text-xs">
          <AlertTitle>{result.success ? "Επιτυχία" : "Σφάλμα"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
