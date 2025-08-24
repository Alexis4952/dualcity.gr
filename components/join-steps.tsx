import { Card, CardContent } from "@/components/ui/card"
import { Download, Monitor, Gamepad2, Users } from "lucide-react"

export default function JoinSteps() {
  const steps = [
    {
      icon: <Download className="h-10 w-10 text-cyan-400" />,
      title: "Εγκατάσταση FiveM",
      description: "Κατεβάστε και εγκαταστήστε το FiveM client από το επίσημο site",
    },
    {
      icon: <Monitor className="h-10 w-10 text-pink-400" />,
      title: "Συνδεθείτε στο Discord",
      description: "Γίνετε μέλος της κοινότητάς μας στο Discord για ενημερώσεις",
    },
    {
      icon: <Gamepad2 className="h-10 w-10 text-purple-400" />,
      title: "Βρείτε τον Server",
      description: "Αναζητήστε τον server μας ή συνδεθείτε απευθείας με το IP",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-400" />,
      title: "Δημιουργήστε Χαρακτήρα",
      description: "Φτιάξτε τον χαρακτήρα σας και ξεκινήστε το roleplay",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, index) => (
        <Card key={index} className="bg-gray-900/80 border-gray-700 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                {index + 1}
              </div>
              <div>{step.icon}</div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
