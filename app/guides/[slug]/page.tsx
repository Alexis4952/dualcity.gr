"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { guides } from "@/lib/mock-data"
import BackButton from "@/components/back-button"

export default function GuidePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch guide data
    const foundGuide = guides.find((g) => g.slug === slug)
    if (foundGuide) {
      setGuide(foundGuide)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Ο οδηγός δεν βρέθηκε</h1>
        <Link href="/guides">
          <Button variant="outline">Επιστροφή στους Οδηγούς</Button>
        </Link>
      </div>
    )
  }

  // Έλεγχος αν είναι ένας από τους οδηγούς που δεν πρέπει να έχουν σχετικούς οδηγούς
  const hideRelatedGuides = slug === "getting-started" || slug === "roleplay-basics"

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BackButton />
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

      {/* Guide Content */}
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/guides" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Επιστροφή στους Οδηγούς
          </Link>

          <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-cyan-600">Κείμενο</Badge>
                      <Badge className="bg-gray-700">{guide.category}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-white">{guide.title}</h1>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  {guide.content.map((section: any, index: number) => (
                    <div key={index} className="mb-8">
                      {section.title && <h2 className="text-xl font-bold text-cyan-400 mb-4">{section.title}</h2>}
                      {section.text && <div className="text-gray-300 mb-4">{section.text}</div>}
                      {section.list && (
                        <ul className="list-disc pl-6 space-y-2 text-gray-300">
                          {section.list.map((item: any, i: number) => (
                            <li key={i}>
                              {item.title && <span className="font-bold">{item.title}</span>}
                              {item.title && item.description && " - "}
                              {item.description}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Σχετικοί Οδηγοί - Εμφανίζονται μόνο αν δεν είναι ένας από τους συγκεκριμένους οδηγούς */}
          {!hideRelatedGuides && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4">Σχετικοί Οδηγοί</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides
                  .filter((g) => g.slug !== slug && g.category === guide.category)
                  .slice(0, 2)
                  .map((relatedGuide) => (
                    <Link href={`/guides/${relatedGuide.slug}`} key={relatedGuide.id}>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="bg-cyan-900/30 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-cyan-400"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{relatedGuide.title}</h3>
                            <p className="text-sm text-gray-400">{relatedGuide.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
