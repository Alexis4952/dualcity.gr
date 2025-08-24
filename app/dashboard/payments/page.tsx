"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

export default function PaymentsPage() {
  const [isAddingCard, setIsAddingCard] = useState(false)

  const savedCards = [
    {
      id: 1,
      type: "visa",
      last4: "4242",
      expiry: "12/25",
      name: "JOHN DOE",
      isDefault: true,
    },
    {
      id: 2,
      type: "mastercard",
      last4: "5678",
      expiry: "09/26",
      name: "JOHN DOE",
      isDefault: false,
    },
  ]

  const transactions = [
    {
      id: "TRX-123456",
      date: "15/04/2024",
      description: "Αγορά: Bahama Mamas",
      amount: "-€40.00",
      status: "Ολοκληρώθηκε",
      method: "Visa •••• 4242",
    },
    {
      id: "TRX-123457",
      date: "10/04/2024",
      description: "Αγορά: VIP Πακέτο - 30 Ημέρες",
      amount: "-€25.00",
      status: "Ολοκληρώθηκε",
      method: "Mastercard •••• 5678",
    },
    {
      id: "TRX-123458",
      date: "05/04/2024",
      description: "Αγορά: Burgershot",
      amount: "-€40.00",
      status: "Ολοκληρώθηκε",
      method: "Visa •••• 4242",
    },
    {
      id: "TRX-123459",
      date: "01/04/2024",
      description: "Προσθήκη Χρημάτων",
      amount: "+€100.00",
      status: "Ολοκληρώθηκε",
      method: "PayPal",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
          Πληρωμές
        </h1>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-8 bg-gray-900/50">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Μέθοδοι Πληρωμής</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Συναλλαγές</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Αποθηκευμένες Κάρτες</CardTitle>
              <CardDescription className="text-gray-400">Διαχειριστείτε τις αποθηκευμένες κάρτες σας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 flex items-center justify-center">
                        {card.type === "visa" ? (
                          <Image src="/images/visa-logo.png" alt="Visa" width={40} height={24} className="h-6 w-auto" />
                        ) : (
                          <Image
                            src="/images/mastercard-logo.png"
                            alt="Mastercard"
                            width={40}
                            height={24}
                            className="h-6 w-auto"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {card.type === "visa" ? "Visa" : "Mastercard"} •••• {card.last4}
                        </p>
                        <p className="text-sm text-gray-400">
                          Λήξη: {card.expiry} • {card.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.isDefault && (
                        <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded-full">Προεπιλογή</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {isAddingCard ? (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="font-bold text-white mb-4">Προσθήκη Νέας Κάρτας</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Όνομα Κατόχου</Label>
                      <Input
                        id="cardName"
                        placeholder="JOHN DOE"
                        className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Αριθμός Κάρτας</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Ημ. Λήξης</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input
                          id="cardCvc"
                          placeholder="123"
                          className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsAddingCard(false)}>
                        Ακύρωση
                      </Button>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        Αποθήκευση
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full border-dashed border-2 border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-400"
                  onClick={() => setIsAddingCard(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Προσθήκη Νέας Κάρτας
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 mt-6">
            <CardHeader>
              <CardTitle className="text-xl text-white">Άλλες Μέθοδοι Πληρωμής</CardTitle>
              <CardDescription className="text-gray-400">Συνδέστε επιπλέον μεθόδους πληρωμής</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 flex items-center justify-center bg-white rounded">
                      <Image src="/images/paypal-logo.png" alt="PayPal" width={60} height={24} className="h-6 w-auto" />
                    </div>
                    <div>
                      <p className="font-medium text-white">PayPal</p>
                      <p className="text-sm text-gray-400">Συνδεδεμένο με player123@example.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Αποσύνδεση
                  </Button>
                </div>
              </div>

              <Button className="w-full border-dashed border-2 border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-400">
                <Plus className="h-4 w-4 mr-2" /> Προσθήκη Νέας Μεθόδου
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Ιστορικό Συναλλαγών</CardTitle>
              <CardDescription className="text-gray-400">
                Δείτε όλες τις συναλλαγές που έχετε πραγματοποιήσει
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white">{transaction.description}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>{transaction.id}</span>
                          <span>•</span>
                          <span>{transaction.method}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-bold ${
                            transaction.amount.startsWith("+") ? "text-green-400" : "text-white"
                          }`}
                        >
                          {transaction.amount}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === "Ολοκληρώθηκε"
                              ? "bg-green-900/30 text-green-400"
                              : transaction.status === "Σε εξέλιξη"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Φόρτωση Περισσότερων</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
