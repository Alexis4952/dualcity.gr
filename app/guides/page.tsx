"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { guides } from "@/lib/mock-data"
import { FileText } from "lucide-react"
import Footer from "@/components/footer"

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Εξαγωγή μοναδικών κατηγοριών
  const categories = Array.from(new Set(guides.map((guide) => guide.category)))

  // Φιλτράρισμα οδηγών με βάση την αναζήτηση και την κατηγορία
  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? guide.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
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

      {/* Guides Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 flex-grow">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Οδηγοί Server</h1>
            <p className="text-xl text-gray-400 mb-6">Βρείτε χρήσιμους οδηγούς και εκπαιδευτικό υλικό για τον server</p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Αναζήτηση οδηγών..."
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 h-12 pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
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
                  className="text-gray-500"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge
                className={`cursor-pointer px-3 py-1 ${
                  selectedCategory === null ? "bg-cyan-600 hover:bg-cyan-700" : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Όλα
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  className={`cursor-pointer px-3 py-1 ${
                    selectedCategory === category ? "bg-cyan-600 hover:bg-cyan-700" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide) => (
                <Link href={`/guides/${guide.slug}`} key={guide.id}>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-cyan-900/30 p-3 rounded-full">
                        <FileText className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white mb-2">{guide.title}</h2>
                        <p className="text-gray-400 mb-4">{guide.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gray-700">{guide.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                  <h3 className="text-xl font-bold text-white mb-2">Δεν βρέθηκαν οδηγοί</h3>
                  <p className="text-gray-400">Δοκιμάστε διαφορετικούς όρους αναζήτησης ή κατηγορία</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
