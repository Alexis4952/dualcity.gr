"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, Award } from "lucide-react"

export default function ServerStats() {
  // Normally you would fetch these from your server API
  const [stats, setStats] = useState({
    onlinePlayers: 0,
    maxPlayers: 128,
    uptime: 0,
    totalRegistered: 0,
  })

  // Simulate stats loading and updating
  useEffect(() => {
    // Initial values
    setStats({
      onlinePlayers: 87,
      maxPlayers: 128,
      uptime: 99.8,
      totalRegistered: 3500,
    })

    // Simulate player count changing
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        onlinePlayers: Math.floor(Math.random() * 20) + 75, // Random between 75-95
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gray-800 border-cyan-500/50 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-6 flex items-center">
          <div className="bg-cyan-500/20 p-3 rounded-full mr-4">
            <Users className="h-8 w-8 text-cyan-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Online Players</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-white">{stats.onlinePlayers}</p>
              <p className="text-gray-400 text-sm">/ {stats.maxPlayers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-pink-500/50 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-6 flex items-center">
          <div className="bg-pink-500/20 p-3 rounded-full mr-4">
            <Clock className="h-8 w-8 text-pink-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Server Uptime</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-white">{stats.uptime}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-purple-500/50 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="p-6 flex items-center">
          <div className="bg-purple-500/20 p-3 rounded-full mr-4">
            <Award className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Registered Players</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-white">{stats.totalRegistered.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
