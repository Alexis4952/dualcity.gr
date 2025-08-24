"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface TimelineItem {
  id: string
  title: string
  date: string
  description: string
  status: "completed" | "current" | "upcoming"
  features: string[]
}

interface AnimatedTimelineProps {
  items: TimelineItem[]
}

export default function AnimatedTimeline({ items }: AnimatedTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 transform md:-translate-x-1/2"></div>

      {/* Timeline items */}
      <div className="space-y-12">
        {items.map((item, index) => (
          <TimelineItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "current":
        return "bg-cyan-500"
      case "upcoming":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  // Alternate items left and right on desktop
  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex flex-col md:flex-row items-center ${isEven ? "md:flex-row-reverse" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline dot */}
      <motion.div
        className={`absolute left-4 md:left-1/2 w-8 h-8 rounded-full border-4 border-gray-900 z-10 transform md:-translate-x-1/2 ${getStatusColor(
          item.status,
        )}`}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
      >
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: getStatusColor(item.status), opacity: 0.3 }}
          />
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        className={`ml-16 md:ml-0 md:w-5/12 ${isEven ? "md:pr-16" : "md:pl-16"}`}
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div
          className={`bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-6 rounded-lg shadow-lg ${
            item.status === "current" ? "ring-2 ring-cyan-500/50" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{item.date}</span>
              </div>
            </div>
            <Badge
              className={`${
                item.status === "completed"
                  ? "bg-green-600"
                  : item.status === "current"
                    ? "bg-cyan-600"
                    : "bg-purple-600"
              }`}
            >
              {item.status === "completed" ? "Ολοκληρώθηκε" : item.status === "current" ? "Τρέχουσα" : "Επερχόμενη"}
            </Badge>
          </div>

          <p className="text-gray-300 mb-4">{item.description}</p>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-400">Χαρακτηριστικά:</h4>
            <ul className="space-y-1">
              {item.features.map((feature, i) => (
                <motion.li
                  key={i}
                  className="flex items-start text-sm text-gray-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1.5 mr-2"></span>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Date for mobile */}
      <div className="md:hidden text-sm text-gray-400 mt-2">{item.date}</div>
    </div>
  )
}
