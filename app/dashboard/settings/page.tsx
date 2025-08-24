"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Monitor, Volume2 } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
          Ρυθμίσεις
        </h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-8 bg-gray-900/50">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Λογαριασμός</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Ειδοποιήσεις</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Ασφάλεια</span>
          </TabsTrigger>
          <TabsTrigger value="game" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden md:inline">Παιχνίδι</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Πληροφορίες Λογαριασμού</CardTitle>
              <CardDescription className="text-gray-400">
                Ενημερώστε τις πληροφορίες του λογαριασμού σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Όνομα Χρήστη</Label>
                  <Input
                    id="username"
                    defaultValue="Player123"
                    className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="player123@example.com"
                    className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>
              </div>

              <Separator className="bg-gray-800 my-6" />

              <div className="space-y-2">
                <Label htmlFor="bio">Βιογραφικό</Label>
                <textarea
                  id="bio"
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyan-500 rounded-md p-2 text-white font-medium"
                  placeholder="Γράψτε λίγα λόγια για εσάς..."
                ></textarea>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Ρυθμίσεις Ειδοποιήσεων</CardTitle>
              <CardDescription className="text-gray-400">Διαχειριστείτε τις ειδοποιήσεις που λαμβάνετε</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Ειδοποιήσεις</Label>
                    <p className="text-sm text-gray-400">Λήψη ειδοποιήσεων μέσω email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Ενημερώσεις Server</Label>
                    <p className="text-sm text-gray-400">Ειδοποιήσεις για ενημερώσεις του server</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Εκδηλώσεις</Label>
                    <p className="text-sm text-gray-400">Ειδοποιήσεις για επερχόμενες εκδηλώσεις</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Προσφορές</Label>
                    <p className="text-sm text-gray-400">Ειδοποιήσεις για προσφορές και εκπτώσεις</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Ασφάλεια Λογαριασμού</CardTitle>
              <CardDescription className="text-gray-400">
                Διαχειριστείτε τις ρυθμίσεις ασφαλείας του λογαριασμού σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Τρέχων Κωδικός</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Νέος Κωδικός</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Επιβεβαίωση Κωδικού</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                    />
                  </div>
                </div>

                <Separator className="bg-gray-800 my-6" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Διπλός Έλεγχος Ταυτότητας</Label>
                    <p className="text-sm text-gray-400">
                      Ενεργοποίηση διπλού ελέγχου ταυτότητας για περισσότερη ασφάλεια
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="game">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-xl text-white">Ρυθμίσεις Παιχνιδιού</CardTitle>
              <CardDescription className="text-gray-400">Προσαρμόστε τις ρυθμίσεις του παιχνιδιού σας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Ήχοι Ειδοποιήσεων</Label>
                    <p className="text-sm text-gray-400">Ενεργοποίηση ήχων για τις ειδοποιήσεις</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume" className="text-base">
                      Ένταση Ήχου
                    </Label>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">75%</span>
                    </div>
                  </div>
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Αυτόματη Σύνδεση</Label>
                    <p className="text-sm text-gray-400">Αυτόματη σύνδεση στον server</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Εμφάνιση FPS</Label>
                    <p className="text-sm text-gray-400">Εμφάνιση μετρητή FPS κατά το παιχνίδι</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
