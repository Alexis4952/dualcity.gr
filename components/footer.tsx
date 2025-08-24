import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function Footer() {
  // Discord server URL
  const DISCORD_URL = "https://discord.gg/PdMYvK7WGN"

  return (
    <footer className="py-6 relative z-10 border-t border-gray-800 bg-[#030014] mt-auto">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <Image
              src="/images/new-logo.png"
              alt="Dual City Logo"
              width={60}
              height={60}
              className="mr-3"
              loading="lazy"
            />
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
                Dual City
              </h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 mb-6 md:mb-0">
            <Link href="/community" className="text-gray-300 hover:text-white transition-colors">
              Κοινότητα
            </Link>
            <Link href="/guides" className="text-gray-300 hover:text-white transition-colors">
              Οδηγοί
            </Link>
            <Link href="/rules" className="text-gray-300 hover:text-white transition-colors">
              Κανόνες
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
              Κατάστημα
            </Link>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors flex items-center"
            >
              Discord <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>

          <div className="mt-6 md:mt-0 text-sm text-gray-400">
            <p>© 2024 Dual City FiveM Roleplay Server. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
