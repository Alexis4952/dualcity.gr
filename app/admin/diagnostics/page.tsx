"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Info, AlertTriangle, Database } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isAdminLoggedIn, getCurrentAdmin } from "@/lib/admin-auth"

interface TestResult {
  name: string
  success: boolean
  message: string
  details?: any
}

interface DatabaseInfo {
  tables: {
    name: string
    description: string
    count: number | null
    error: string | null
  }[]
  timestamp: string | null
  timestampError: string | null
  databaseUrl: string
}

export default function AdminDiagnosticsPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null)
  const [loadingDbInfo, setLoadingDbInfo] = useState(false)
  const router = useRouter()

  // Έλεγχος αν ο χρήστης είναι συνδεδεμένος ως admin
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      console.log("User is not logged in as admin, redirecting to login page")
      router.push("/admin-login?redirect=/admin/diagnostics&message=Πρέπει να συνδεθείτε ως διαχειριστής")
      return
    }

    runDiagnostics()
  }, [router])

  // Εκτέλεση διαγνωστικών ελέγχων
  const runDiagnostics = async () => {
    try {
      setLoading(true)
      setError(null)
      setResults([])

      // Έλεγχος admin σύνδεσης
      const adminCheck = await checkAdminAuth()
      setResults((prev) => [...prev, adminCheck])

      // Έλεγχος μεταβλητών περιβάλλοντος
      const envCheck = await checkEnvironmentVariables()
      setResults((prev) => [...prev, envCheck])

      // Έλεγχος σύνδεσης με τη βάση δεδομένων
      const dbCheck = await checkDatabaseConnection()
      setResults((prev) => [...prev, dbCheck])

      // Έλεγχος πρόσβασης στο storage
      const storageCheck = await checkStorageAccess()
      setResults((prev) => [...prev, storageCheck])

      // Έλεγχος πρόσβασης στους admin
      const adminsCheck = await checkAdminsAccess()
      setResults((prev) => [...prev, adminsCheck])

      // Ανάκτηση πληροφοριών για τη βάση δεδομένων
      await fetchDatabaseInfo()
    } catch (err) {
      console.error("Error running diagnostics:", err)
      setError(`Σφάλμα κατά την εκτέλεση διαγνωστικών: ${err.message || "Άγνωστο σφάλμα"}`)
    } finally {
      setLoading(false)
    }
  }

  // Ανάκτηση πληροφοριών για τη βάση δεδομένων
  const fetchDatabaseInfo = async () => {
    try {
      setLoadingDbInfo(true)
      const response = await fetch("/api/database-info", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      setDbInfo(data)
    } catch (err) {
      console.error("Error fetching database info:", err)
      setError(`Σφάλμα κατά την ανάκτηση πληροφοριών για τη βάση δεδομένων: ${err.message || "Άγνωστο σφάλμα"}`)
    } finally {
      setLoadingDbInfo(false)
    }
  }

  // Έλεγχος μεταβλητών περιβάλλοντος
  const checkEnvironmentVariables = async (): Promise<TestResult> => {
    try {
      // Έλεγχος αν υπάρχουν οι μεταβλητές περιβάλλοντος στο client
      const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!hasSupabaseUrl || !hasSupabaseKey) {
        return {
          name: "Έλεγχος Μεταβλητών Περιβάλλοντος",
          success: false,
          message: "Λείπουν μεταβλητές περιβάλλοντος Supabase",
          details: {
            hasSupabaseUrl,
            hasSupabaseKey,
          },
        }
      }

      return {
        name: "Έλεγχος Μεταβλητών Περιβάλλοντος",
        success: true,
        message: "Όλες οι απαραίτητες μεταβλητές περιβάλλοντος είναι διαθέσιμες",
        details: {
          hasSupabaseUrl,
          hasSupabaseKey,
        },
      }
    } catch (error) {
      console.error("Error checking environment variables:", error)
      return {
        name: "Έλεγχος Μεταβλητών Περιβάλλοντος",
        success: false,
        message: `Σφάλμα: ${error.message || "Άγνωστο σφάλμα"}`,
        details: error,
      }
    }
  }

  // Έλεγχος admin σύνδεσης
  const checkAdminAuth = async (): Promise<TestResult> => {
    try {
      const admin = getCurrentAdmin()

      if (!admin) {
        return {
          name: "Έλεγχος Admin Σύνδεσης",
          success: false,
          message: "Δεν βρέθηκαν στοιχεία admin στο localStorage",
        }
      }

      // Έλεγχος με το API
      try {
        const response = await fetch("/api/admin-status")
        const data = await response.json()

        if (!data.isLoggedIn) {
          return {
            name: "Έλεγχος Admin Σύνδεσης",
            success: false,
            message: "Τα cookies admin δεν βρέθηκαν στο server",
            details: data,
          }
        }

        return {
          name: "Έλεγχος Admin Σύνδεσης",
          success: true,
          message: `Συνδεδεμένος ως ${admin.username}`,
          details: { admin, serverData: data },
        }
      } catch (apiError) {
        console.error("Error checking admin status with API:", apiError)
        return {
          name: "Έλεγχος Admin Σύνδεσης",
          success: true, // Θεωρούμε ότι είναι επιτυχής αν υπάρχει στο localStorage
          message: `Συνδεδεμένος ως ${admin.username} (δεν ήταν δυνατός ο έλεγχος με το API)`,
          details: { admin, apiError },
        }
      }
    } catch (error) {
      console.error("Error checking admin auth:", error)
      return {
        name: "Έλεγχος Admin Σύνδεσης",
        success: false,
        message: `Σφάλμα: ${error.message || "Άγνωστο σφάλμα"}`,
        details: error,
      }
    }
  }

  // Έλεγχος σύνδεσης με τη βάση δεδομένων
  const checkDatabaseConnection = async (): Promise<TestResult> => {
    try {
      const response = await fetch("/api/check-database-connection", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const text = await response.text()
        let errorData
        try {
          errorData = JSON.parse(text)
        } catch (e) {
          errorData = { text }
        }

        return {
          name: "Έλεγχος Σύνδεσης Βάσης Δεδομένων",
          success: false,
          message: `HTTP error ${response.status}: ${errorData.error || "Αποτυχία σύνδεσης με τη βάση δεδομένων"}`,
          details: { status: response.status, ...errorData },
        }
      }

      const data = await response.json()

      if (data.status !== "ok") {
        return {
          name: "Έλεγχος Σύνδεσης Βάσης Δεδομένων",
          success: false,
          message: data.error || "Αποτυχία σύνδεσης με τη βάση δεδομένων",
          details: data,
        }
      }

      return {
        name: "Έλεγχος Σύνδεσης Βάσης Δεδομένων",
        success: true,
        message: `Επιτυχής σύνδεση με τη βάση δεδομένων (${data.method || "unknown"})`,
        details: data,
      }
    } catch (error) {
      console.error("Error checking database connection:", error)
      return {
        name: "Έλεγχος Σύνδεσης Βάσης Δεδομένων",
        success: false,
        message: `Σφάλμα: ${error.message || "Άγνωστο σφάλμα"}`,
        details: error,
      }
    }
  }

  // Έλεγχος πρόσβασης στο storage
  const checkStorageAccess = async (): Promise<TestResult> => {
    try {
      // Έλεγχος αν υπάρχουν οι μεταβλητές περιβάλλοντος
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return {
          name: "Έλεγχος Πρόσβασης Storage",
          success: false,
          message: "Λείπουν μεταβλητές περιβάλλοντος Supabase",
          details: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        }
      }

      const response = await fetch("/api/storage/basic-info", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const text = await response.text()
        let errorData
        try {
          errorData = JSON.parse(text)
        } catch (e) {
          errorData = { text }
        }

        return {
          name: "Έλεγχος Πρόσβασης Storage",
          success: false,
          message: `HTTP error ${response.status}: ${errorData.error || "Αποτυχία πρόσβασης στο storage"}`,
          details: { status: response.status, ...errorData },
        }
      }

      const data = await response.json()

      if (!data.success) {
        return {
          name: "Έλεγχος Πρόσβασης Storage",
          success: false,
          message: data.error || "Αποτυχία πρόσβασης στο storage",
          details: data,
        }
      }

      return {
        name: "Έλεγχος Πρόσβασης Storage",
        success: true,
        message: `Επιτυχής πρόσβαση στο storage (${data.buckets?.length || 0} buckets)`,
        details: data,
      }
    } catch (error) {
      console.error("Error checking storage access:", error)
      return {
        name: "Έλεγχος Πρόσβασης Storage",
        success: false,
        message: `Σφάλμα: ${error.message || "Άγνωστο σφάλμα"}`,
        details: error,
      }
    }
  }

  // Έλεγχος πρόσβασης στους admin
  const checkAdminsAccess = async (): Promise<TestResult> => {
    try {
      // Έλεγχος αν υπάρχουν οι μεταβλητές περιβάλλοντος
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return {
          name: "Έλεγχος Πρόσβασης Admin",
          success: false,
          message: "Λείπουν μεταβλητές περιβάλλοντος Supabase",
          details: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        }
      }

      const response = await fetch("/api/check-admins", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const text = await response.text()
        let errorData
        try {
          errorData = JSON.parse(text)
        } catch (e) {
          errorData = { text }
        }

        return {
          name: "Έλεγχος Πρόσβασης Admin",
          success: false,
          message: `HTTP error ${response.status}: ${errorData.error || "Αποτυχία πρόσβασης στους admin"}`,
          details: { status: response.status, ...errorData },
        }
      }

      const data = await response.json()

      if (!data.success) {
        return {
          name: "Έλεγχος Πρόσβασης Admin",
          success: false,
          message: data.error || "Αποτυχία πρόσβασης στους admin",
          details: data,
        }
      }

      return {
        name: "Έλεγχος Πρόσβασης Admin",
        success: true,
        message: `Επιτυχής πρόσβαση στους admin (${data.admins?.length || 0} admins)`,
        details: data,
      }
    } catch (error) {
      console.error("Error checking admins access:", error)
      return {
        name: "Έλεγχος Πρόσβασης Admin",
        success: false,
        message: `Σφάλμα: ${error.message || "Άγνωστο σφάλμα"}`,
        details: error,
      }
    }
  }

  // Εμφάνιση λεπτομερειών
  const showDetails = (details: any) => {
    console.log("Details:", details)
    alert(JSON.stringify(details, null, 2))
  }

  // Εμφάνιση φόρτωσης
  if (loading && results.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <Link href="/admin" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Επιστροφή στο Dashboard
          </Link>
          <CardTitle className="text-2xl text-white">Διαγνωστικά Συστήματος</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Αποτελέσματα Ελέγχων</h3>
              <Button onClick={runDiagnostics} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Επανέλεγχος
              </Button>
            </div>

            <div className="space-y-2">
              {results.map((result, index) => (
                <Alert
                  key={index}
                  variant={result.success ? "default" : "destructive"}
                  className={result.success ? "bg-green-900/20 border-green-800" : ""}
                >
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription className="flex justify-between items-center">
                    <span>
                      {result.name}: {result.message}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => showDetails(result.details)}
                      className="text-xs bg-transparent hover:bg-gray-800 border-gray-700"
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Λεπτομέρειες
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}

              {loading && results.length > 0 && (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500 mr-2"></div>
                  <span className="text-gray-400">Εκτέλεση διαγνωστικών ελέγχων...</span>
                </div>
              )}
            </div>

            {/* Πληροφορίες βάσης δεδομένων */}
            {dbInfo && (
              <Card className="bg-gray-800/50 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Πληροφορίες Βάσης Δεδομένων
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Διεύθυνση βάσης δεδομένων:</p>
                      <p className="text-cyan-400">{dbInfo.databaseUrl}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Τρέχουσα ώρα βάσης δεδομένων:</p>
                      <p className="text-white">
                        {dbInfo.timestamp ? new Date(dbInfo.timestamp).toLocaleString() : "Μη διαθέσιμη"}
                        {dbInfo.timestampError && <span className="text-red-400 ml-2">({dbInfo.timestampError})</span>}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Πίνακες:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {dbInfo.tables.map((table) => (
                          <div
                            key={table.name}
                            className={`p-3 rounded-md ${
                              table.error ? "bg-red-900/20 border border-red-800" : "bg-gray-700/30"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-white">{table.name}</p>
                              {table.count !== null ? (
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                                  {table.count} εγγραφές
                                </span>
                              ) : (
                                <span className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded-full">
                                  Σφάλμα
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{table.description}</p>
                            {table.error && <p className="text-xs text-red-400 mt-1">{table.error}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Οδηγίες αντιμετώπισης προβλημάτων */}
            <Card className="bg-gray-800/50 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">Αντιμετώπιση Προβλημάτων</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Λείπουν μεταβλητές περιβάλλοντος:</strong> Βεβαιωθείτε ότι έχετε ορίσει τις μεταβλητές
                    NEXT_PUBLIC_SUPABASE_URL και NEXT_PUBLIC_SUPABASE_ANON_KEY στο αρχείο .env.local ή στις ρυθμίσεις
                    του Vercel.
                  </li>
                  <li>
                    <strong>Αποτυχία σύνδεσης με τη βάση δεδομένων:</strong> Ελέγξτε αν οι μεταβλητές περιβάλλοντος
                    είναι σωστές και αν η βάση δεδομένων Supabase είναι προσβάσιμη.
                  </li>
                  <li>
                    <strong>Αποτυχία πρόσβασης στο storage:</strong> Ελέγξτε τα δικαιώματα πρόσβασης στο storage του
                    Supabase.
                  </li>
                  <li>
                    <strong>Αποτυχία πρόσβασης στους admin:</strong> Ελέγξτε αν υπάρχει ο πίνακας "admins" στη βάση
                    δεδομένων.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
