"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Bug,
  Lightbulb,
  Search,
  ThumbsUp,
  MessageSquare,
  FileText,
  Video,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bugTitle, setBugTitle] = useState("")
  const [bugDescription, setBugDescription] = useState("")
  const [suggestionTitle, setSuggestionTitle] = useState("")
  const [suggestionDescription, setSuggestionDescription] = useState("")
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  // Προσομοίωση οδηγών
  const guides = [
    {
      id: 1,
      title: "Ξεκινώντας στον Server",
      description: "Ένας πλήρης οδηγός για νέους παίκτες",
      category: "Βασικά",
      type: "text",
      views: 1245,
      likes: 87,
    },
    {
      id: 2,
      title: "Πώς να βρείτε την πρώτη σας δουλειά",
      description: "Όλα όσα πρέπει να γνωρίζετε για τις εργασίες στον server",
      category: "Εργασίες",
      type: "text",
      views: 982,
      likes: 65,
    },
    {
      id: 3,
      title: "Οδηγός Roleplay για Αρχάριους",
      description: "Μάθετε τα βασικά του σωστού roleplay",
      category: "Roleplay",
      type: "video",
      views: 1876,
      likes: 142,
    },
    {
      id: 4,
      title: "Σύστημα Οχημάτων και Οδήγησης",
      description: "Πώς να αγοράσετε, να συντηρήσετε και να οδηγήσετε οχήματα",
      category: "Οχήματα",
      type: "text",
      views: 754,
      likes: 43,
    },
    {
      id: 5,
      title: "Αγορά και Διαχείριση Ιδιοκτησιών",
      description: "Οδηγός για την αγορά σπιτιών και επιχειρήσεων",
      category: "Ιδιοκτησίες",
      type: "video",
      views: 1102,
      likes: 76,
    },
  ]

  // Προσομοίωση αναφορών
  const reports = [
    {
      id: 1,
      title: "Πρόβλημα με το σύστημα τηλεφώνου",
      description: "Το τηλέφωνο κολλάει όταν προσπαθώ να στείλω μήνυμα",
      type: "bug",
      status: "Σε εξέλιξη",
      date: "15/04/2024",
      comments: 3,
    },
    {
      id: 2,
      title: "Προσθήκη περισσότερων εργασιών",
      description: "Θα ήθελα να προστεθούν περισσότερες εργασίες στον τομέα της υγείας",
      type: "suggestion",
      status: "Υπό εξέταση",
      date: "12/04/2024",
      comments: 5,
    },
    {
      id: 3,
      title: "Πρόβλημα με το ATM στην πλατεία",
      description: "Το ATM στην κεντρική πλατεία δεν λειτουργεί σωστά",
      type: "bug",
      status: "Επιλύθηκε",
      date: "10/04/2024",
      comments: 2,
    },
  ]

  // Φιλτράρισμα οδηγών βάσει αναζήτησης
  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Προσομοίωση υποβολής
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmissionSuccess(true)
      setBugTitle("")
      setBugDescription("")

      // Επαναφορά μηνύματος επιτυχίας μετά από 3 δευτερόλεπτα
      setTimeout(() => {
        setSubmissionSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Προσομοίωση υποβολής
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmissionSuccess(true)
      setSuggestionTitle("")
      setSuggestionDescription("")

      // Επαναφορά μηνύματος επιτυχίας μετά από 3 δευτερόλεπτα
      setTimeout(() => {
        setSubmissionSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
          Υποστήριξη & Οδηγοί
        </h1>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-8 bg-gray-900/50">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Οδηγοί & Εκπαίδευση</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            <span>Αναφορές & Προτάσεις</span>
          </TabsTrigger>
        </TabsList>

        {/* Οδηγοί & Εκπαίδευση */}
        <TabsContent value="guides">
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Οδηγοί & Εκπαιδευτικό Υλικό</CardTitle>
                <CardDescription className="text-gray-400">
                  Βρείτε χρήσιμους οδηγούς και εκπαιδευτικό υλικό για τον server
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Αναζήτηση οδηγών..."
                    className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {filteredGuides.length > 0 ? (
                    filteredGuides.map((guide) => (
                      <div
                        key={guide.id}
                        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-cyan-900/30 p-2 rounded-full">
                            {guide.type === "text" ? (
                              <FileText className="h-5 w-5 text-cyan-400" />
                            ) : (
                              <Video className="h-5 w-5 text-pink-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-white">{guide.title}</h3>
                                <p className="text-sm text-gray-400">{guide.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge className="bg-gray-700 text-gray-300">{guide.category}</Badge>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" /> {guide.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" /> {guide.views}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-400">
                      Δεν βρέθηκαν οδηγοί που να ταιριάζουν με την αναζήτησή σας
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">Περισσότεροι Οδηγοί</Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Προτεινόμενοι Οδηγοί</CardTitle>
                <CardDescription className="text-gray-400">Οδηγοί που προτείνουμε για νέους παίκτες</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-900/30 p-3 rounded-full">
                        <BookOpen className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">Πλήρης Οδηγός για Νέους Παίκτες</h3>
                        <p className="text-sm text-gray-400">
                          Ένας ολοκληρωμένος οδηγός με όλα όσα πρέπει να γνωρίζετε για να ξεκινήσετε στον server μας
                        </p>
                        <div className="flex justify-end mt-2">
                          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-600">
                            Διαβάστε τον Οδηγό
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Αναφορές & Προτάσεις */}
        <TabsContent value="reports">
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Οι Αναφορές μου</CardTitle>
                <CardDescription className="text-gray-400">
                  Δείτε τις αναφορές και τις προτάσεις που έχετε υποβάλει
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-full ${
                                report.type === "bug" ? "bg-red-900/30" : "bg-green-900/30"
                              }`}
                            >
                              {report.type === "bug" ? (
                                <Bug className={`h-5 w-5 text-red-400`} />
                              ) : (
                                <Lightbulb className={`h-5 w-5 text-green-400`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div>
                                  <h3 className="font-bold text-white">{report.title}</h3>
                                  <p className="text-sm text-gray-400">{report.description}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                  <Badge
                                    className={`${
                                      report.status === "Επιλύθηκε"
                                        ? "bg-green-600"
                                        : report.status === "Σε εξέλιξη"
                                          ? "bg-blue-600"
                                          : "bg-yellow-600"
                                    }`}
                                  >
                                    {report.status}
                                  </Badge>
                                  <span className="text-xs text-gray-400">{report.date}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="text-gray-400 border-gray-700">
                                  {report.type === "bug" ? "Σφάλμα" : "Πρόταση"}
                                </Badge>
                                <span className="flex items-center gap-1 text-sm text-gray-400">
                                  <MessageSquare className="h-3 w-3" /> {report.comments} σχόλια
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      Δεν έχετε υποβάλει ακόμα καμία αναφορά ή πρόταση
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Φόρμα Αναφοράς Σφάλματος */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Bug className="h-5 w-5 text-red-400" />
                    Αναφορά Σφάλματος
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Αναφέρετε ένα πρόβλημα ή σφάλμα που εντοπίσατε
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissionSuccess ? (
                    <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <p className="text-green-400">Η αναφορά σας υποβλήθηκε με επιτυχία!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBugSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bug-title">Τίτλος</Label>
                        <Input
                          id="bug-title"
                          placeholder="Σύντομη περιγραφή του προβλήματος"
                          className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                          value={bugTitle}
                          onChange={(e) => setBugTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bug-description">Περιγραφή</Label>
                        <textarea
                          id="bug-description"
                          rows={4}
                          placeholder="Περιγράψτε αναλυτικά το πρόβλημα που αντιμετωπίζετε..."
                          className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyan-500 rounded-md p-2 text-white font-medium"
                          value={bugDescription}
                          onChange={(e) => setBugDescription(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Υποβολή...
                          </>
                        ) : (
                          "Υποβολή Αναφοράς"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Φόρμα Υποβολής Πρότασης */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-green-400" />
                    Υποβολή Πρότασης
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Μοιραστείτε τις ιδέες σας για τη βελτίωση του server
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissionSuccess ? (
                    <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <p className="text-green-400">Η πρότασή σας υποβλήθηκε με επιτυχία!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="suggestion-title">Τίτλος</Label>
                        <Input
                          id="suggestion-title"
                          placeholder="Σύντομη περιγραφή της πρότασής σας"
                          className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white"
                          value={suggestionTitle}
                          onChange={(e) => setSuggestionTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="suggestion-description">Περιγραφή</Label>
                        <textarea
                          id="suggestion-description"
                          rows={4}
                          placeholder="Περιγράψτε αναλυτικά την πρότασή σας..."
                          className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyan-500 rounded-md p-2 text-white font-medium"
                          value={suggestionDescription}
                          onChange={(e) => setSuggestionDescription(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Υποβολή...
                          </>
                        ) : (
                          "Υποβολή Πρότασης"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Κατάσταση Συστήματος</CardTitle>
                <CardDescription className="text-gray-400">
                  Τρέχουσα κατάσταση των συστημάτων του server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="font-medium text-white">Server Status</p>
                          <p className="text-sm text-green-400">Λειτουργικό</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-yellow-400" />
                        <div>
                          <p className="font-medium text-white">Σύστημα Τηλεφώνου</p>
                          <p className="text-sm text-yellow-400">Μερική Λειτουργία</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="font-medium text-white">Σύστημα Τραπεζών</p>
                          <p className="text-sm text-red-400">Προγραμματισμένη Συντήρηση</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
