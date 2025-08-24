"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Settings, Cpu, BarChart, Zap, Server, Download } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      {/* Space Background - Applied to entire page */}
      <div className="fixed inset-0 z-0">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-[#030014]"></div>

        {/* Stars */}
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>

        {/* Distant galaxies/nebulae */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-900/10 blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 rounded-full bg-pink-900/10 blur-[120px]"></div>
      </div>

      {/* Performance Content */}
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Επιστροφή στην αρχική
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
              Βελτιστοποιημένη Απόδοση
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Απολαύστε ομαλό gameplay χωρίς lag και με σταθερό FPS στον server μας
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  Χαμηλή Χρήση CPU
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Βελτιστοποιημένα scripts για χαμηλή χρήση CPU
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-cyan-400">30%</div>
                <p className="text-gray-400 mt-2">Λιγότερη χρήση CPU σε σχέση με άλλους servers</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-pink-400" />
                  Σταθερό FPS
                </CardTitle>
                <CardDescription className="text-gray-400">Απολαύστε σταθερό ρυθμό καρέ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-pink-400">60+</div>
                <p className="text-gray-400 mt-2">FPS σε μέτριες προδιαγραφές υπολογιστή</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  Γρήγορη Φόρτωση
                </CardTitle>
                <CardDescription className="text-gray-400">Ελάχιστος χρόνος φόρτωσης</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-400">2 λεπτά</div>
                <p className="text-gray-400 mt-2">Μέσος χρόνος φόρτωσης του server</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900/50 border-gray-800 mb-12">
            <CardHeader>
              <CardTitle className="text-xl text-white">Τεχνικές Προδιαγραφές</CardTitle>
              <CardDescription className="text-gray-400">Οι τεχνικές προδιαγραφές του server μας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-900/30 p-2 rounded-full">
                    <Server className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Υψηλής Απόδοσης Servers</h3>
                    <p className="text-sm text-gray-400">
                      Χρησιμοποιούμε servers υψηλής απόδοσης με τις τελευταίες τεχνολογίες για να διασφαλίσουμε την
                      καλύτερη δυνατή εμπειρία.
                    </p>
                    <ul className="text-sm text-gray-400 mt-2 space-y-1">
                      <li>• Intel Xeon E5-2690v4 @ 3.5GHz</li>
                      <li>• 64GB DDR4 RAM</li>
                      <li>• NVMe SSD Storage</li>
                      <li>• 1Gbps Αποκλειστική Σύνδεση</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-900/30 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Βελτιστοποιημένα Scripts</h3>
                    <p className="text-sm text-gray-400">
                      Όλα τα scripts μας είναι βελτιστοποιημένα για μέγιστη απόδοση και ελάχιστη χρήση πόρων.
                    </p>
                    <ul className="text-sm text-gray-400 mt-2 space-y-1">
                      <li>• Χαμηλή χρήση CPU και RAM</li>
                      <li>• Ελαχιστοποιημένα SQL queries</li>
                      <li>• Βελτιστοποιημένα 3D μοντέλα</li>
                      <li>• Αποδοτική διαχείριση μνήμης</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 mb-12">
            <CardHeader>
              <CardTitle className="text-xl text-white">Προτεινόμενες Ρυθμίσεις</CardTitle>
              <CardDescription className="text-gray-400">
                Βελτιστοποιήστε τις ρυθμίσεις σας για καλύτερη απόδοση
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-white mb-2">Ρυθμίσεις FiveM</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Ορίστε το "Texture Quality" σε "Normal"</li>
                  <li>• Ενεργοποιήστε το "Reduce Streaming Memory"</li>
                  <li>• Απενεργοποιήστε το "Extended Distance Scaling"</li>
                  <li>• Ορίστε το "Shadow Quality" σε "Normal" ή χαμηλότερα</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-white mb-2">Ρυθμίσεις Windows</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Ενημερώστε τους drivers της κάρτας γραφικών σας</li>
                  <li>• Κλείστε περιττές εφαρμογές στο παρασκήνιο</li>
                  <li>• Ορίστε το FiveM ως εφαρμογή υψηλής προτεραιότητας</li>
                  <li>• Απενεργοποιήστε τις εφαρμογές που ξεκινούν αυτόματα</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
              Κατεβάστε τα απαραίτητα αρχεία
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                onClick={() => window.open("https://fivem.net/", "_blank")}
              >
                <Download className="mr-2 h-4 w-4" /> FiveM Client
              </Button>
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                onClick={() => window.open("https://cfx.re/join/o8lojy", "_blank")}
              >
                Σύνδεση στον Server
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
