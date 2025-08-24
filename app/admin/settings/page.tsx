"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { isAdmin } from "@/lib/auth"
import { getSiteSettings, updateSiteSettings, type SiteSettings } from "@/lib/admin-store"
import { AlertCircle, ArrowLeft, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      router.push("/login?redirect=/admin/settings&message=Πρέπει να είστε διαχειριστής για να αποκτήσετε πρόσβαση")
      return
    }

    // Load settings
    setSettings(getSiteSettings())
    setLoading(false)
  }, [router])

  const handleSaveSettings = () => {
    if (!settings) return

    try {
      const updatedSettings = updateSiteSettings({
        siteName: settings.siteName,
        maintenanceMode: settings.maintenanceMode,
        allowRegistration: settings.allowRegistration,
        shopEnabled: settings.shopEnabled,
        footerText: settings.footerText,
        contactEmail: settings.contactEmail,
      })

      setSettings(updatedSettings)
      setMessage({ type: "success", text: "Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία" })
    } catch (error) {
      setMessage({ type: "error", text: "Σφάλμα κατά την αποθήκευση των ρυθμίσεων" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Σφάλμα φόρτωσης ρυθμίσεων</p>
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
            <CardTitle className="text-2xl text-white">Ρυθμίσεις Ιστοσελίδας</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className={message.type === "success" ? "bg-green-900/20 border-green-800 text-green-400" : ""}
              >
                {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                <AlertTitle>{message.type === "error" ? "Σφάλμα" : "Επιτυχία"}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Γενικές Ρυθμίσεις</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Όνομα Ιστοσελίδας</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Email Επικοινωνίας</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="footerText">Κείμενο Footer</Label>
                  <Textarea
                    id="footerText"
                    value={settings.footerText}
                    onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Ρυθμίσεις Λειτουργίας</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Λειτουργία Συντήρησης</Label>
                    <p className="text-sm text-gray-400">
                      Ενεργοποιήστε τη λειτουργία συντήρησης για να κλείσετε προσωρινά την ιστοσελίδα
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowRegistration">Εγγραφή Χρηστών</Label>
                    <p className="text-sm text-gray-400">
                      Επιτρέψτε στους επισκέπτες να δημιουργούν νέους λογαριασμούς
                    </p>
                  </div>
                  <Switch
                    id="allowRegistration"
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shopEnabled">Κατάστημα</Label>
                    <p className="text-sm text-gray-400">Ενεργοποιήστε ή απενεργοποιήστε το κατάστημα</p>
                  </div>
                  <Switch
                    id="shopEnabled"
                    checked={settings.shopEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, shopEnabled: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={handleSaveSettings}
              >
                Αποθήκευση Ρυθμίσεων
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
