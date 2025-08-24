"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

export function EnvVariablesSetup() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError("Παρακαλώ συμπληρώστε όλα τα πεδία")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Σε πραγματικό περιβάλλον, θα αποθηκεύαμε τις μεταβλητές περιβάλλοντος
      // στο .env.local ή στις ρυθμίσεις του hosting
      // Εδώ απλά προσομοιώνουμε την αποθήκευση

      // Αποθήκευση στο localStorage για δοκιμαστικούς σκοπούς
      localStorage.setItem("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl)
      localStorage.setItem("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseKey)

      // Προσομοίωση καθυστέρησης δικτύου
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)

      // Ανανέωση της σελίδας μετά από 2 δευτερόλεπτα
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError("Σφάλμα κατά την αποθήκευση των μεταβλητών περιβάλλοντος")
      console.error("Error saving environment variables:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ρύθμιση Supabase</CardTitle>
        <CardDescription>
          Εισάγετε τα διαπιστευτήρια του Supabase για να συνδεθείτε με τη βάση δεδομένων
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Σφάλμα</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Επιτυχία</AlertTitle>
            <AlertDescription className="text-green-700">
              Οι μεταβλητές περιβάλλοντος αποθηκεύτηκαν επιτυχώς. Η σελίδα θα ανανεωθεί αυτόματα...
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">Supabase URL</Label>
          <Input
            id="supabaseUrl"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
            disabled={loading || success}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supabaseKey">Supabase Anon Key</Label>
          <Input
            id="supabaseKey"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            disabled={loading || success}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={loading || success || !supabaseUrl || !supabaseKey} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Αποθήκευση...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Αποθηκεύτηκε
            </>
          ) : (
            "Αποθήκευση"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
