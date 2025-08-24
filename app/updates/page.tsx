"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Gamepad2, Calendar, Clock, FileText } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"

export default function UpdatesPage() {
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

      {/* Updates Content */}
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
              Τακτικές Ενημερώσεις
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Μείνετε ενημερωμένοι για τις τελευταίες προσθήκες και βελτιώσεις στον server μας
            </p>
          </div>

          <Card className="bg-gray-900/50 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Τελευταία Ενημέρωση</CardTitle>
              <CardDescription className="text-gray-400">Η πιο πρόσφατη ενημέρωση του server μας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-900/30 p-3 rounded-full">
                    <Gamepad2 className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">Ενημέρωση v2.5.0</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>15 Απριλίου 2024</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>Διαθέσιμη τώρα</span>
                        </div>
                      </div>
                      <Badge className="bg-cyan-600 text-white">Νέα Έκδοση</Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-cyan-400 mb-2">Νέα Χαρακτηριστικά</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                          <li>Νέο σύστημα εργασιών με περισσότερες επιλογές και ανταμοιβές</li>
                          <li>Προσθήκη νέων οχημάτων υψηλής ποιότητας</li>
                          <li>Νέες περιοχές στον χάρτη με μοναδικά σημεία ενδιαφέροντος</li>
                          <li>Βελτιωμένο σύστημα οικονομίας με νέες επιχειρηματικές ευκαιρίες</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-pink-400 mb-2">Βελτιώσεις</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                          <li>Βελτιωμένη απόδοση και σταθερότητα του server</li>
                          <li>Αναβαθμισμένο σύστημα αστυνομίας με νέες λειτουργίες</li>
                          <li>Βελτιωμένο σύστημα τηλεφώνου με περισσότερες εφαρμογές</li>
                          <li>Αναβαθμισμένο σύστημα ιατρικής περίθαλψης</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Διορθώσεις</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                          <li>Διόρθωση προβλημάτων με το σύστημα απογραφής</li>
                          <li>Επίλυση προβλημάτων με τις αλληλεπιδράσεις NPC</li>
                          <li>Διόρθωση σφαλμάτων στο σύστημα κατοικιών</li>
                          <li>Βελτίωση της συνολικής σταθερότητας του server</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        <FileText className="mr-2 h-4 w-4" /> Διαβάστε τις πλήρεις σημειώσεις έκδοσης
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 mb-12">
            <CardHeader>
              <CardTitle className="text-xl text-white">Ιστορικό Ενημερώσεων</CardTitle>
              <CardDescription className="text-gray-400">Προηγούμενες ενημερώσεις του server μας</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-900/30 p-2 rounded-full">
                    <Gamepad2 className="h-5 w-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white">Ενημέρωση v2.4.0</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>1 Απριλίου 2024</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-gray-400 border-gray-700">
                        Προηγούμενη
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Προσθήκη νέου συστήματος ληστειών, βελτιώσεις στο σύστημα οχημάτων και διορθώσεις σφαλμάτων.
                    </p>
                    <Button variant="link" className="text-pink-400 p-0 h-auto mt-1">
                      Περισσότερα
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-900/30 p-2 rounded-full">
                    <Gamepad2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white">Ενημέρωση v2.3.0</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>15 Μαρτίου 2024</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-gray-400 border-gray-700">
                        Προηγούμενη
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Νέο σύστημα κατοικιών, βελτιωμένο σύστημα εργασιών και αναβαθμισμένο σύστημα τηλεφώνου.
                    </p>
                    <Button variant="link" className="text-purple-400 p-0 h-auto mt-1">
                      Περισσότερα
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-900/30 p-2 rounded-full">
                    <Gamepad2 className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white">Ενημέρωση v2.2.0</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>1 Μαρτίου 2024</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-gray-400 border-gray-700">
                        Προηγούμενη
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Προσθήκη νέων οχημάτων, βελτιώσεις στο σύστημα αστυνομίας και διορθώσεις σφαλμάτων.
                    </p>
                    <Button variant="link" className="text-cyan-400 p-0 h-auto mt-1">
                      Περισσότερα
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 mb-12">
            <CardHeader>
              <CardTitle className="text-xl text-white">Επερχόμενες Ενημερώσεις</CardTitle>
              <CardDescription className="text-gray-400">Τι να περιμένετε στις επόμενες ενημερώσεις</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-900/30 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Ενημέρωση v2.6.0</h3>
                    <p className="text-sm text-gray-400">Αναμένεται: Μάιος 2024</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400 mt-2">
                      <li>Νέο σύστημα συμμοριών με περισσότερες δυνατότητες</li>
                      <li>Προσθήκη νέων περιοχών στον χάρτη</li>
                      <li>Βελτιωμένο σύστημα καιρικών συνθηκών</li>
                      <li>Νέες δραστηριότητες και εκδηλώσεις</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-green-900/30 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Ενημέρωση v3.0.0</h3>
                    <p className="text-sm text-gray-400">Αναμένεται: Ιούνιος 2024</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400 mt-2">
                      <li>Μεγάλη αναβάθμιση του συστήματος roleplay</li>
                      <li>Νέο σύστημα οικονομίας</li>
                      <li>Προσθήκη νέων επιχειρήσεων και εργασιών</li>
                      <li>Πλήρης αναβάθμιση του συστήματος οχημάτων</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
              Μείνετε ενημερωμένοι
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                onClick={() => window.open("https://discord.gg/PdMYvK7WGN", "_blank")}
              >
                Discord Community
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
