"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Users, BookOpen, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"

// Discord link
const DISCORD_LINK = "https://discord.gg/PdMYvK7WGN"

// Δυναμική εισαγωγή components για καλύτερη απόδοση
const DynamicFooter = dynamic(() => import("@/components/footer"), {
  loading: () => <div className="py-10 bg-black/30 backdrop-blur-sm"></div>,
  ssr: false,
})

export default function Home() {
  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    serverInfo: false,
    joinSteps: false,
  })
  const serverInfoRef = useRef<HTMLElement>(null)
  const joinStepsRef = useRef<HTMLElement>(null)

  // Intersection Observer για lazy loading των sections
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          setVisibleSections((prev) => ({
            ...prev,
            [sectionId]: true,
          }))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (serverInfoRef.current) observer.observe(serverInfoRef.current)
    if (joinStepsRef.current) observer.observe(joinStepsRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Space Background - Applied to entire page */}
      <div className="fixed inset-0 z-0">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-[#030014]"></div>

        {/* Stars */}
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>

        {/* Shooting stars */}
        <div className="shooting-star" style={{ top: "15%", left: "10%", transform: "rotate(45deg)" }}></div>
        <div
          className="shooting-star"
          style={{ top: "35%", left: "25%", transform: "rotate(35deg)", animationDelay: "3s" }}
        ></div>
        <div
          className="shooting-star"
          style={{ top: "65%", left: "60%", transform: "rotate(55deg)", animationDelay: "6s" }}
        ></div>

        {/* Distant galaxies/nebulae */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-900/10 blur-[100px]"></div>
        <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 rounded-full bg-pink-900/10 blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="container mx-auto p-4 pt-24 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <img src="/images/new-logo.png" alt="Dual City Logo" className="h-32 w-32 mb-6 animate-float" />
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600">
              Dual City
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-12">
            Ζήστε την απόλυτη εμπειρία roleplay στον πιο προηγμένο FiveM server
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              className="bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-full relative overflow-hidden group min-w-[240px]"
              onClick={() => window.open("https://cfx.re/join/o8lojy", "_blank")}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              Σύνδεση στον Server <ChevronRight className="ml-2 h-5 w-5 inline" />
            </Button>

            <Button
              variant="outline"
              className="border-2 border-cyan-700 text-cyan-400 hover:bg-cyan-950/50 px-8 py-6 text-lg rounded-full relative overflow-hidden group min-w-[240px] bg-transparent"
              onClick={() => window.open(DISCORD_LINK, "_blank")}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-cyan-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              <ExternalLink className="mr-2 h-5 w-5 inline" /> Discord Community
            </Button>
          </div>
        </div>
      </div>

      {/* Server Info Section */}
      <motion.section
        id="serverInfo"
        ref={serverInfoRef}
        className="py-20 relative z-10"
        variants={sectionVariants}
        initial="hidden"
        animate={visibleSections.serverInfo ? "visible" : "hidden"}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Ο Server μας
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ένας προηγμένος FiveM server με μοναδικές εμπειρίες roleplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10 text-cyan-400" />,
                title: "Ενεργή Κοινότητα",
                description: "Συνδεθείτε με εκατοντάδες παίκτες και ζήστε μοναδικές εμπειρίες roleplay",
                href: "/community",
              },
              {
                icon: <BookOpen className="h-10 w-10 text-pink-400" />,
                title: "Οδηγοί & Εκπαίδευση",
                description: "Βρείτε χρήσιμους οδηγούς και εκπαιδευτικό υλικό για να ξεκινήσετε",
                href: "/guides",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={cardVariants} custom={index}>
                <Link href={feature.href} className="block">
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 h-full border border-gray-800 hover:border-cyan-900 transition-colors">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Join Section */}
      <motion.section
        id="joinSteps"
        ref={joinStepsRef}
        className="py-20 relative z-10"
        variants={sectionVariants}
        initial="hidden"
        animate={visibleSections.joinSteps ? "visible" : "hidden"}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-cyan-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Πώς να συνδεθείτε
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ακολουθήστε αυτά τα απλά βήματα για να ξεκινήσετε την περιπέτειά σας
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ChevronRight className="h-10 w-10 text-cyan-400" />,
                title: "Εγκατάσταση FiveM",
                description: "Κατεβάστε και εγκαταστήστε το FiveM client από το επίσημο site",
              },
              {
                icon: <ExternalLink className="h-10 w-10 text-pink-400" />,
                title: "Συνδεθείτε στο Discord",
                description: "Γίνετε μέλος της κοινότητάς μας στο Discord για ενημερώσεις",
              },
              {
                icon: <Users className="h-10 w-10 text-cyan-400" />,
                title: "Βρείτε τον Server",
                description: "Αναζητήστε τον server μας ή συνδεθείτε απευθείας με το IP",
              },
              {
                icon: <Users className="h-10 w-10 text-pink-400" />,
                title: "Δημιουργήστε Χαρακτήρα",
                description: "Φτιάξτε τον χαρακτήρα σας και ξεκινήστε το roleplay",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-black/30 backdrop-blur-sm rounded-lg p-6 relative overflow-hidden border border-gray-800"
                variants={cardVariants}
                custom={index}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-black h-10 w-10 rounded-full flex items-center justify-center mr-4 text-white font-bold border border-gray-700">
                    {index + 1}
                  </div>
                  <div>{step.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              className="bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
              onClick={() => window.open(DISCORD_LINK, "_blank")}
            >
              Συνδεθείτε στο Discord μας <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <DynamicFooter />
    </div>
  )
}
