"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Zap, Server } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ServerStatusLive() {
  const [stats, setStats] = useState({
    onlinePlayers: 0,
    maxPlayers: 128,
    uptime: 0,
    totalRegistered: 0,
    ping: 0,
    serverLoad: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Simulate stats loading and updating
  useEffect(() => {
    // Initial loading
    setTimeout(() => {
      setIsLoading(false)
      setStats({
        onlinePlayers: 87,
        maxPlayers: 128,
        uptime: 99.8,
        totalRegistered: 3500,
        ping: 25,
        serverLoad: 42,
      })
    }, 1500)

    // Simulate player count changing
    const playerInterval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        onlinePlayers: Math.floor(Math.random() * 20) + 75, // Random between 75-95
        ping: Math.floor(Math.random() * 10) + 20, // Random between 20-30ms
        serverLoad: Math.floor(Math.random() * 15) + 35, // Random between 35-50%
      }))
    }, 5000)

    // Simulate random alerts
    const alertInterval = setInterval(() => {
      const shouldShowAlert = Math.random() > 0.7
      if (shouldShowAlert) {
        const alerts = [
          "Νέα ενημέρωση διαθέσιμη!",
          "Προγραμματισμένη συντήρηση σε 2 ώρες",
          "Νέο event ξεκινάει σε 30 λεπτά!",
          "Διπλά XP για τις επόμενες 3 ώρες!",
        ]
        setAlertMessage(alerts[Math.floor(Math.random() * alerts.length)])
        setShowAlert(true)

        // Hide alert after 5 seconds
        setTimeout(() => {
          setShowAlert(false)
        }, 5000)
      }
    }, 15000)

    return () => {
      clearInterval(playerInterval)
      clearInterval(alertInterval)
    }
  }, [])

  // Calculate server status color
  const getStatusColor = (load: number) => {
    if (load < 40) return "bg-green-500"
    if (load < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Calculate ping quality
  const getPingQuality = (ping: number) => {
    if (ping < 30) return { color: "text-green-400", text: "Excellent" }
    if (ping < 50) return { color: "text-yellow-400", text: "Good" }
    return { color: "text-red-400", text: "Poor" }
  }

  return (
    <div className="space-y-6">
      {/* Alert notification */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              <p>{alertMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Online Players */}
        <Card className="bg-gray-800 border-cyan-500/50 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="animate-pulse flex items-center">
                <div className="bg-cyan-500/20 p-3 rounded-full mr-4 h-14 w-14"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="bg-cyan-500/20 p-3 rounded-full mr-4 relative">
                  <Users className="h-8 w-8 text-cyan-400" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                    animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  ></motion.div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Online Players</p>
                  <div className="flex items-end gap-2">
                    <motion.p
                      className="text-3xl font-bold text-white"
                      key={stats.onlinePlayers}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stats.onlinePlayers}
                    </motion.p>
                    <p className="text-gray-400 text-sm">/ {stats.maxPlayers}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Server Status */}
        <Card className="bg-gray-800 border-pink-500/50 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="animate-pulse flex items-center">
                <div className="bg-pink-500/20 p-3 rounded-full mr-4 h-14 w-14"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="bg-pink-500/20 p-3 rounded-full mr-4">
                  <Server className="h-8 w-8 text-pink-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Server Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-3 w-3 rounded-full ${getStatusColor(stats.serverLoad)}`}></span>
                    <p className="text-xl font-bold text-white">Online</p>
                  </div>
                  <div className="mt-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.serverLoad}%` }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>Load: {stats.serverLoad}%</span>
                    <span className={getPingQuality(stats.ping).color}>
                      Ping: {stats.ping}ms ({getPingQuality(stats.ping).text})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registered Players */}
        <Card className="bg-gray-800 border-purple-500/50 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="animate-pulse flex items-center">
                <div className="bg-purple-500/20 p-3 rounded-full mr-4 h-14 w-14"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="bg-purple-500/20 p-3 rounded-full mr-4 relative">
                  <Award className="h-8 w-8 text-purple-400" />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: ["0 0 0 0 rgba(168, 85, 247, 0.4)", "0 0 0 10px rgba(168, 85, 247, 0)"],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  ></motion.div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Registered Players</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-white">{stats.totalRegistered.toLocaleString()}</p>
                    <motion.div
                      className="text-green-400 text-xs"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      +5 today
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
