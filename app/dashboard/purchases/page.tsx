"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"
import Link from "next/link"

export default function PurchasesPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/")
      return
    }

    setLoading(false)
  }, [router])

  // Mock shop items for recommendations
  const recommendedItems = [
    {
      id: "1",
      title: "Bahama Mamas",
      description: "Πολυτελές νυχτερινό κέντρο διασκέδασης με μπαρ, πίστες χορού, VIP χώρους και ιδιωτικά δωμάτια.",
      price: 40,
      image_url: "/images/shops/bahamas1.png",
    },
    {
      id: "2",
      title: "Burgershot",
      description: "Δημοφιλές εστιατόριο γρήγορου φαγητού με πλήρως λειτουργικό εξοπλισμό, ταμεία και χώρο εστίασης.",
      price: 40,
      image_url: "/images/shops/burgershot.png",
    },
    {
      id: "3",
      title: "Pizzeria",
      description:
        "Αυθεντική ιταλική πιτσαρία με παραδοσιακό φούρνο, χώρο εστίασης, κελάρι κρασιών και ιδιωτικό γραφείο.",
      price: 40,
      image_url: "/images/shops/pizzeria.png",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-gray-800 animate-pulse rounded mb-8"></div>
        <div className="h-80 bg-gray-800/50 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Επιστροφή στο Dashboard
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
            Τα Μαγαζιά μου
          </h1>
        </div>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Τα Μαγαζιά σας</CardTitle>
          <CardDescription className="text-gray-400">Δεν έχετε αποκτήσει ακόμα κάποιο μαγαζί</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <p className="mb-4">Δεν έχετε αποκτήσει ακόμα κάποιο μαγαζί</p>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={() => router.push("/shop")}
            >
              Εξερευνήστε τα διαθέσιμα μαγαζιά
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Προτεινόμενα Μαγαζιά</CardTitle>
          <CardDescription className="text-gray-400">Μαγαζιά που μπορεί να σας ενδιαφέρουν</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex flex-col h-full">
                  <div className="relative h-40 mb-4 rounded-md overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg?height=160&width=320"}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="font-bold text-white">€{item.price}</span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600"
                      onClick={() => router.push(`/shop/${item.id}`)}
                    >
                      <Building2 className="h-4 w-4 mr-2" /> Πληροφορίες
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
