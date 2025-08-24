"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import BackButton from "@/components/back-button"

// Discord link
const DISCORD_LINK = "https://discord.gg/PdMYvK7WGN"

export default function CommunityPage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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

      {/* Community Content */}
      <BackButton />
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Επιστροφή στην αρχική
            </Link>
          </motion.div>

          <motion.div className="text-center mb-16" variants={fadeIn} initial="hidden" animate="visible">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 neon-text">
              Η Κοινότητά μας
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Γίνετε μέλος της κοινότητάς μας και ζήστε μια μοναδική εμπειρία roleplay
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-navy-900/80 backdrop-blur-sm rounded-lg p-8 mb-12 border border-gray-800 flex flex-col md:flex-row items-center justify-between"
          >
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">Συνδεθείτε στο Discord μας</h2>
              <p className="text-gray-300">
                Το Discord είναι το κύριο μέσο επικοινωνίας της κοινότητάς μας. Εδώ θα βρείτε όλες τις πληροφορίες, θα
                μπορείτε να επικοινωνήσετε με άλλους παίκτες και να λάβετε βοήθεια από την ομάδα υποστήριξης.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Image
                src="/images/dual-city-logo.png"
                alt="Dual City Logo"
                width={200}
                height={200}
                className="rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => window.open(DISCORD_LINK, "_blank")}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-navy-900/80 backdrop-blur-sm rounded-lg p-8 border border-gray-800"
          >
            <h2 className="text-2xl font-bold mb-4">Κανόνες Κοινότητας</h2>
            <p className="text-gray-300 mb-6">
              Για να διατηρήσουμε μια ευχάριστη και φιλική ατμόσφαιρα, έχουμε θεσπίσει ορισμένους βασικούς κανόνες που
              πρέπει να ακολουθούν όλα τα μέλη.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="bg-cyan-900 text-cyan-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  1
                </span>
                <span>Σεβαστείτε όλα τα μέλη της κοινότητας</span>
              </li>
              <li className="flex items-start">
                <span className="bg-cyan-900 text-cyan-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  2
                </span>
                <span>Μην κάνετε spam ή flood στα κανάλια</span>
              </li>
              <li className="flex items-start">
                <span className="bg-cyan-900 text-cyan-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  3
                </span>
                <span>Ακολουθήστε τις οδηγίες των διαχειριστών</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center card-v66 p-8 animated-lines mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 neon-text">
              Γίνετε μέλος της κοινότητάς μας σήμερα
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open(DISCORD_LINK, "_blank")}
              >
                Συνδεθείτε στο Discord
              </button>
              <button
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open("https://cfx.re/join/o8lojy", "_blank")}
              >
                Σύνδεση στον Server
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
