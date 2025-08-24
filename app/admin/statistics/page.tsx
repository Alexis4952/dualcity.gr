"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isAdmin } from "@/lib/auth"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { getStatistics, type Statistics } from "@/lib/admin-store"

export default function AdminStatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      router.push("/login?redirect=/admin/statistics&message=Πρέπει να είστε διαχειριστής για να αποκτήσετε πρόσβαση")
      return
    }

    // Load statistics
    setStatistics(getStatistics())
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Σφάλμα φόρτωσης στατιστικών</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-16 px-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Στατιστικά & Αναλυτικά Στοιχεία</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Συνολικοί Χρήστες</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-white">{statistics.totalUsers}</div>
                    <div className="p-2 bg-cyan-900/20 rounded-full">
                      <BarChart className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    +{statistics.newUsersThisMonth} νέοι χρήστες αυτό το μήνα
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Συνολικές Πωλήσεις</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-white">€{statistics.totalSales.toFixed(2)}</div>
                    <div className="p-2 bg-green-900/20 rounded-full">
                      <LineChart className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    €{statistics.salesThisMonth.toFixed(2)} πωλήσεις αυτό το μήνα
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Αιτήματα Υποστήριξης</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-white">{statistics.totalSupportTickets}</div>
                    <div className="p-2 bg-yellow-900/20 rounded-full">
                      <PieChart className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{statistics.openSupportTickets} ανοιχτά αιτήματα</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Δημοφιλή Προϊόντα</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statistics.popularProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white">{product.sales} πωλήσεις</p>
                          <p className="text-xs text-gray-400">€{product.revenue.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Στατιστικά Server</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-400">Μέγιστος αριθμός παικτών:</p>
                      <p className="text-white">{statistics.serverStats.maxPlayers}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Μέσος όρος παικτών:</p>
                      <p className="text-white">{statistics.serverStats.averagePlayers}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Συνολικές ώρες παιχνιδιού:</p>
                      <p className="text-white">{statistics.serverStats.totalPlaytime.toLocaleString()} ώρες</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Uptime:</p>
                      <p className="text-white">{statistics.serverStats.uptime}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => router.push("/admin")}
              >
                Επιστροφή στο Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
