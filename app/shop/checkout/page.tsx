"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const title = searchParams.get("title") || "Προϊόν"
  const price = searchParams.get("price") || "0"
  const itemId = searchParams.get("itemId") || ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [discord, setDiscord] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Προσομοίωση αποστολής δεδομένων
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Ανακατεύθυνση μετά από 3 δευτερόλεπτα
      setTimeout(() => {
        router.push("/shop")
      }, 3000)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[#030014]"></div>
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900/10 blur-[150px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-900/10 blur-[100px]"></div>
          <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 rounded-full bg-pink-900/10 blur-[120px]"></div>
        </div>

        <Card className="w-full max-w-md bg-gray-900/70 border-gray-800 relative z-10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Η παραγγελία ολοκληρώθηκε!</CardTitle>
            <CardDescription className="text-gray-400">
              Ευχαριστούμε για την αγορά σας. Θα επικοινωνήσουμε σύντομα μαζί σας.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            <p>Ανακατεύθυνση στο κατάστημα...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#030014]"></div>
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-900/10 blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 rounded-full bg-pink-900/10 blur-[120px]"></div>
      </div>

      <div className="container mx-auto py-16 px-4 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Ολοκλήρωση Αγοράς</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-900/70 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Στοιχεία Παραγγελίας</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-300">Προϊόν</h3>
                  <p className="text-white">{title}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-300">Τιμή</h3>
                  <p className="text-xl font-bold text-cyan-400">{price}€</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-300">Μέθοδος Πληρωμής</h3>
                  <p className="text-white">PayPal / Τραπεζική Κατάθεση</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/70 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Στοιχεία Επικοινωνίας</CardTitle>
              <CardDescription className="text-gray-400">
                Συμπληρώστε τα στοιχεία σας για να ολοκληρώσετε την αγορά
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Ονοματεπώνυμο
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discord" className="text-gray-300">
                    Discord Username
                  </Label>
                  <Input
                    id="discord"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-300">
                    Σημειώσεις (προαιρετικά)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Επεξεργασία..." : "Ολοκλήρωση Αγοράς"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-sm text-gray-400 border-t border-gray-800 pt-4">
              Μετά την υποβολή της φόρμας, θα επικοινωνήσουμε μαζί σας για τις λεπτομέρειες πληρωμής.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
