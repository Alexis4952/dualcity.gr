import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, MessageCircle } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Server Status Badge */}
        <div className="mb-8">
          <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-400 px-4 py-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Server Online - 247/500 παίκτες
          </Badge>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/dual-city-logo.png"
            alt="Dual City Logo"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Dual City
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Ζήστε την απόλυτη εμπειρία FiveM Roleplay
        </p>

        {/* Description */}
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Ένας προηγμένος FiveM server με custom jobs, realistic economy, και μια ενεργή κοινότητα που περιμένει να σας
          υποδεχτεί.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <a href="https://cfx.re/join/o8lojy" target="_blank" rel="noopener noreferrer">
              <Play className="mr-2 h-5 w-5" />
              Σύνδεση στον Server
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 bg-transparent"
            asChild
          >
            <a href="https://discord.gg/PdMYvK7WGN" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Discord Community
            </a>
          </Button>
        </div>

        {/* Server Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-cyan-400">24/7</div>
            <div className="text-gray-300 text-sm">Online</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-purple-400">500+</div>
            <div className="text-gray-300 text-sm">Slots</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-pink-400">EU</div>
            <div className="text-gray-300 text-sm">Location</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  )
}
