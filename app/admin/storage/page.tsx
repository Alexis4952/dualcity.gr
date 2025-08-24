"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, HardDrive, Trash2, RefreshCw, FileWarning } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isAdminLoggedIn } from "@/lib/admin-auth"

interface StorageInfo {
  totalSize: number
  usedSize: number
  percentUsed: number
  buckets: {
    name: string
    size: number
    files: number
  }[]
}

export default function AdminStoragePage() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [optimizing, setOptimizing] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  // Έλεγχος αν ο χρήστης είναι συνδεδεμένος ως admin
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      console.log("User is not logged in as admin, redirecting to login page")
      router.push("/admin-login?redirect=/admin/storage&message=Πρέπει να συνδεθείτε ως διαχειριστής")
      return
    }

    fetchStorageInfo()
  }, [router])

  // Φόρτωση πληροφοριών αποθήκευσης
  const fetchStorageInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Fetching storage info...")
      const response = await fetch("/api/storage/info", {
        // Προσθέτουμε timestamp για να αποφύγουμε το caching
        headers: { "Cache-Control": "no-cache" },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Storage info received:", data)

      if (data.success) {
        setStorageInfo(data.info)
      } else {
        throw new Error(data.error || "Σφάλμα κατά τη λήψη πληροφοριών αποθήκευσης")
      }
    } catch (err) {
      console.error("Error fetching storage info:", err)
      setError(`Σφάλμα: ${err.message || "Δεν ήταν δυνατή η λήψη πληροφοριών αποθήκευσης"}`)
    } finally {
      setLoading(false)
    }
  }

  // Βελτιστοποίηση εικόνων
  const handleOptimizeImages = async () => {
    if (
      !confirm(
        "Είστε σίγουροι ότι θέλετε να βελτιστοποιήσετε όλες τις εικόνες; Αυτή η διαδικασία μπορεί να διαρκέσει αρκετή ώρα.",
      )
    ) {
      return
    }

    setOptimizing(true)
    setError(null)

    try {
      const response = await fetch("/api/storage/optimize", {
        method: "POST",
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      if (data.success) {
        alert(`Βελτιστοποιήθηκαν ${data.optimizedCount || 0} εικόνες. Εξοικονομήθηκαν ${data.savedSpace || 0} MB.`)
        fetchStorageInfo() // Ανανέωση πληροφοριών αποθήκευσης
      } else {
        throw new Error(data.error || "Σφάλμα κατά τη βελτιστοποίηση εικόνων")
      }
    } catch (err) {
      console.error("Error optimizing images:", err)
      setError(`Σφάλμα: ${err.message || "Δεν ήταν δυνατή η βελτιστοποίηση εικόνων"}`)
    } finally {
      setOptimizing(false)
    }
  }

  // Διαγραφή bucket
  const handleDeleteBucket = async (bucketName: string) => {
    if (
      !confirm(
        `Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα αρχεία από το bucket "${bucketName}"; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί!`,
      )
    ) {
      return
    }

    setDeleting(bucketName)
    setError(null)

    try {
      const response = await fetch("/api/storage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bucket: bucketName }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      if (data.success) {
        alert(`Διαγράφηκαν ${data.deletedCount || 0} αρχεία από το bucket "${bucketName}".`)
        fetchStorageInfo() // Ανανέωση πληροφοριών αποθήκευσης
      } else {
        throw new Error(data.error || `Σφάλμα κατά τη διαγραφή αρχείων από το bucket "${bucketName}"`)
      }
    } catch (err) {
      console.error(`Error deleting bucket ${bucketName}:`, err)
      setError(`Σφάλμα: ${err.message || `Δεν ήταν δυνατή η διαγραφή αρχείων από το bucket "${bucketName}"`}`)
    } finally {
      setDeleting(null)
    }
  }

  // Εμφάνιση φόρτωσης
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  // Εμφάνιση σφάλματος αν δεν υπάρχουν πληροφορίες αποθήκευσης
  if (!storageInfo && !loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <Link href="/admin" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Επιστροφή στο Dashboard
            </Link>
            <CardTitle className="text-2xl text-white">Διαχείριση Αποθήκευσης</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <FileWarning className="h-4 w-4" />
              <AlertDescription>
                {error || "Δεν ήταν δυνατή η λήψη πληροφοριών αποθήκευσης. Παρακαλώ δοκιμάστε ξανά αργότερα."}
              </AlertDescription>
            </Alert>
            <Button onClick={fetchStorageInfo} className="bg-cyan-600 hover:bg-cyan-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Δοκιμάστε ξανά
            </Button>
          </CardContent>
        </Card>
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
          <CardTitle className="text-2xl text-white">Διαχείριση Αποθήκευσης</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <FileWarning className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Συνολική χρήση αποθήκευσης */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Συνολική Χρήση Αποθήκευσης</h3>
                <span className="text-sm text-gray-400">
                  {(storageInfo?.usedSize || 0).toFixed(2)} MB / {(storageInfo?.totalSize || 0).toFixed(2)} MB
                </span>
              </div>
              <Progress value={storageInfo?.percentUsed || 0} className="h-2" />
              <div className="flex justify-end">
                <span className="text-xs text-gray-400">{storageInfo?.percentUsed.toFixed(1)}% σε χρήση</span>
              </div>
            </div>

            {/* Λίστα buckets */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Buckets</h3>
              <div className="grid gap-4">
                {storageInfo?.buckets.map((bucket) => (
                  <Card key={bucket.name} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <HardDrive className="h-5 w-5 mr-2 text-cyan-400" />
                          <div>
                            <h4 className="font-medium text-white">{bucket.name}</h4>
                            <p className="text-sm text-gray-400">
                              {bucket.size.toFixed(2)} MB • {bucket.files} αρχεία
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBucket(bucket.name)}
                          disabled={deleting === bucket.name}
                          className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                        >
                          {deleting === bucket.name ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="ml-2">Εκκαθάριση</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Ενέργειες */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Ενέργειες</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleOptimizeImages} disabled={optimizing} className="bg-cyan-600 hover:bg-cyan-700">
                  {optimizing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Βελτιστοποίηση Εικόνων
                </Button>
                <Button onClick={fetchStorageInfo} className="bg-gray-700 hover:bg-gray-600">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Ανανέωση
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
