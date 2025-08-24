"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./login-form"
import RegisterForm from "./register-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>("login")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#030014]/90 backdrop-blur-md border-gray-800">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {activeTab === "login" ? "Σύνδεση" : "Εγγραφή"}
            </h2>
            <p className="text-gray-400 text-sm">
              {activeTab === "login"
                ? "Συνδεθείτε για να αποκτήσετε πρόσβαση στον server"
                : "Δημιουργήστε λογαριασμό για να συνδεθείτε στον server"}
            </p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-gray-900/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-gray-800">
                Σύνδεση
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gray-800">
                Εγγραφή
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
