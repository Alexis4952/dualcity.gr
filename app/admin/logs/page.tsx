"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAdminLogsAction } from "@/app/actions/admin"
import { isAdminLoggedIn } from "@/lib/admin-auth"

interface AdminLog {
  id: string
  action: string
  details: any
  created_at: string
  admins: {
    id: string
    username: string
  }
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Έλεγχος αν ο χρήστης είναι συνδεδεμένος ως admin
    if (!isAdminLoggedIn()) {
      router.push("/admin-login?redirect=/admin/logs&message=Πρέπει να συνδεθείτε ως διαχειριστής")
      return
    }

    // Φόρτωση των logs
    fetchLogs()
  }, [router])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const logsData = await getAdminLogsAction()
      setLogs(logsData as AdminLog[])
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Συνάρτηση για τη μορφοποίηση της ημερομηνίας
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  // Συνάρτηση για τη μορφοποίηση της ενέργειας
  const formatAction = (action: string) => {
    switch (action) {
      case "login":
        return "Σύνδεση"
      case "create_admin":
        return "Δημιουργία Admin"
      case "delete_admin":
        return "Διαγραφή Admin"
      case "mark_product_sold":
        return "Σήμανση Προϊόντος ως Πωλημένο"
      case "unmark_product_sold":
        return "Αφαίρεση Σήμανσης Πωλημένου Προϊόντος"
      case "remove_discount":
        return "Αφαίρεση Έκπτωσης"
      default:
        return action
    }
  }

  // Συνάρτηση για τη μορφοποίηση των λεπτομερειών
  const formatDetails = (details: any) => {
    if (!details) return "-"

    try {
      const detailsObj = typeof details === "string" ? JSON.parse(details) : details

      // Δημιουργία λίστας με τις λεπτομέρειες
      return Object.entries(detailsObj).map(([key, value]) => {
        const formattedKey = key
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .replace(/^./, (str) => str.toUpperCase())

        return (
          <div key={key} className="flex">
            <span className="font-medium text-gray-400">{formattedKey}:</span>
            <span className="ml-1">{String(value)}</span>
          </div>
        )
      })
    } catch (error) {
      console.error("Error formatting details:", error)
      return String(details)
    }
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
      <div className="container mx-auto py-16 px-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <Link href="/admin" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Επιστροφή στο Dashboard
            </Link>
            <CardTitle className="text-2xl text-white">Καταγραφή Ενεργειών</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-800">
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ημερομηνία</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Admin</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Ενέργεια</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-300">Λεπτομέρειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-gray-300">{formatDate(log.created_at)}</td>
                          <td className="px-4 py-3 text-white">{log.admins?.username || "Άγνωστος"}</td>
                          <td className="px-4 py-3 text-gray-300">{formatAction(log.action)}</td>
                          <td className="px-4 py-3 text-gray-300">{formatDetails(log.details)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                          Δεν υπάρχουν καταγεγραμμένες ενέργειες ακόμα
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
