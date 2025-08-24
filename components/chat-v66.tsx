"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Paperclip,
  Smile,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Settings,
  Shield,
  Zap,
  Wifi,
  Lock,
  FileText,
  Upload,
  Download,
  Check,
  AlertCircle,
  HelpCircle,
  Trash2,
  Car,
} from "lucide-react"
import { getUserData, isLoggedIn } from "@/lib/auth"

interface Message {
  id: string
  content: string
  sender: "user" | "admin" | "system"
  timestamp: number
  username: string
  read: boolean
  imageUrl?: string
  status?: "sending" | "sent" | "delivered" | "read" | "error"
  isTyping?: boolean
  attachments?: {
    type: "image" | "file" | "audio" | "video"
    url: string
    name: string
    size?: string
  }[]
}

type ThemeType = "default" | "neon" | "cyberpunk" | "galaxy" | "minimal" | "v66"

export default function ChatV66() {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoggedInUser, setIsLoggedInUser] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [currentTheme, setTheme] = useState<ThemeType>("v66")
  const [isUploadingImage, setUploadingImage] = useState(false)
  const messageAudioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [chatStatusMessage, setChatStatusMessage] = useState<string | null>("Online")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAgentTyping, setIsAgentTyping] = useState(false)
  const [agentTypingTimeout, setAgentTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected")
  const [pingMs, setPingMs] = useState<number>(25)
  const [showSystemMessage, setShowSystemMessage] = useState(false)
  const [systemMessageType, setSystemMessageType] = useState<"info" | "warning" | "error" | "success">("info")
  const [systemMessage, setSystemMessage] = useState("")
  const [isEncrypted, setIsEncrypted] = useState(true)
  const [encryptionStatus, setEncryptionStatus] = useState<"encrypting" | "encrypted" | "decrypting" | "decrypted">(
    "encrypted",
  )
  const [showEncryptionAnimation, setShowEncryptionAnimation] = useState(false)
  const [showDecryptionAnimation, setShowDecryptionAnimation] = useState(false)
  const [showConnectionAnimation, setShowConnectionAnimation] = useState(false)
  const [showDisconnectionAnimation, setShowDisconnectionAnimation] = useState(false)
  const [showReconnectionAnimation, setShowReconnectionAnimation] = useState(false)
  const [showErrorAnimation, setShowErrorAnimation] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showWarningAnimation, setShowWarningAnimation] = useState(false)
  const [showInfoAnimation, setShowInfoAnimation] = useState(false)
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false)
  const [showSendingAnimation, setShowSendingAnimation] = useState(false)
  const [showReceivingAnimation, setShowReceivingAnimation] = useState(false)
  const [showTypingAnimation, setShowTypingAnimation] = useState(false)
  const [showReadAnimation, setShowReadAnimation] = useState(false)
  const [showDeliveredAnimation, setShowDeliveredAnimation] = useState(false)
  const [showSentAnimation, setShowSentAnimation] = useState(false)
  const [showErrorSendingAnimation, setShowErrorSendingAnimation] = useState(false)
  const [showRetryAnimation, setShowRetryAnimation] = useState(false)
  const [showCancelAnimation, setShowCancelAnimation] = useState(false)
  const [showDeleteAnimation, setShowDeleteAnimation] = useState(false)
  const [showEditAnimation, setShowEditAnimation] = useState(false)
  const [showCopyAnimation, setShowCopyAnimation] = useState(false)
  const [showForwardAnimation, setShowForwardAnimation] = useState(false)
  const [showReplyAnimation, setShowReplyAnimation] = useState(false)
  const [showReactAnimation, setShowReactAnimation] = useState(false)
  const [showAttachmentAnimation, setShowAttachmentAnimation] = useState(false)
  const [showEmojiAnimation, setShowEmojiAnimation] = useState(false)
  const [showStickerAnimation, setShowStickerAnimation] = useState(false)
  const [showGifAnimation, setShowGifAnimation] = useState(false)
  const [showVoiceAnimation, setShowVoiceAnimation] = useState(false)
  const [showVideoAnimation, setShowVideoAnimation] = useState(false)
  const [showLocationAnimation, setShowLocationAnimation] = useState(false)
  const [showContactAnimation, setShowContactAnimation] = useState(false)
  const [showPollAnimation, setShowPollAnimation] = useState(false)
  const [showScheduleAnimation, setShowScheduleAnimation] = useState(false)
  const [showReminderAnimation, setShowReminderAnimation] = useState(false)
  const [showTaskAnimation, setShowTaskAnimation] = useState(false)
  const [showEventAnimation, setShowEventAnimation] = useState(false)
  const [showNoteAnimation, setShowNoteAnimation] = useState(false)
  const [showFileAnimation, setShowFileAnimation] = useState(false)
  const [showImageAnimation, setShowImageAnimation] = useState(false)
  const [showAudioAnimation, setShowAudioAnimation] = useState(false)
  const [showVideoMessageAnimation, setShowVideoMessageAnimation] = useState(false)
  const [showLinkAnimation, setShowLinkAnimation] = useState(false)
  const [showCodeAnimation, setShowCodeAnimation] = useState(false)
  const [showQuoteAnimation, setShowQuoteAnimation] = useState(false)
  const [showMentionAnimation, setShowMentionAnimation] = useState(false)
  const [showHashtagAnimation, setShowHashtagAnimation] = useState(false)
  const [showEmojiPickerAnimation, setShowEmojiPickerAnimation] = useState(false)
  const [showStickerPickerAnimation, setShowStickerPickerAnimation] = useState(false)
  const [showGifPickerAnimation, setShowGifPickerAnimation] = useState(false)
  const [showAttachmentMenuAnimation, setShowAttachmentMenuAnimation] = useState(false)
  const [showSettingsAnimation, setShowSettingsAnimation] = useState(false)
  const [showProfileAnimation, setShowProfileAnimation] = useState(false)
  const [showNotificationsAnimation, setShowNotificationsAnimation] = useState(false)
  const [showSoundAnimation, setShowSoundAnimation] = useState(false)
  const [showThemeAnimation, setShowThemeAnimation] = useState(false)
  const [showLanguageAnimation, setShowLanguageAnimation] = useState(false)
  const [showFontAnimation, setShowFontAnimation] = useState(false)
  const [showSizeAnimation, setShowSizeAnimation] = useState(false)
  const [showColorAnimation, setShowColorAnimation] = useState(false)
  const [showBackgroundAnimation, setShowBackgroundAnimation] = useState(false)
  const [showBorderAnimation, setShowBorderAnimation] = useState(false)
  const [showShadowAnimation, setShowShadowAnimation] = useState(false)
  const [showRadiusAnimation, setShowRadiusAnimation] = useState(false)
  const [showOpacityAnimation, setShowOpacityAnimation] = useState(false)
  const [showBlurAnimation, setShowBlurAnimation] = useState(false)
  const [showGlowAnimation, setShowGlowAnimation] = useState(false)
  const [showGradientAnimation, setShowGradientAnimation] = useState(false)
  const [showPatternAnimation, setShowPatternAnimation] = useState(false)
  const [showTextureAnimation, setShowTextureAnimation] = useState(false)
  const [showNoiseAnimation, setShowNoiseAnimation] = useState(false)
  const [showParticlesAnimation, setShowParticlesAnimation] = useState(false)
  const [showWavesAnimation, setShowWavesAnimation] = useState(false)
  const [showRippleAnimation, setShowRippleAnimation] = useState(false)
  const [showPulseAnimation, setShowPulseAnimation] = useState(false)
  const [showSparkleAnimation, setShowSparkleAnimation] = useState(false)
  const [showGlitchAnimation, setShowGlitchAnimation] = useState(false)
  const [showHologramAnimation, setShowHologramAnimation] = useState(false)
  const [showNeonAnimation, setShowNeonAnimation] = useState(false)
  const [showCyberAnimation, setShowCyberAnimation] = useState(false)
  const [showRetroAnimation, setShowRetroAnimation] = useState(false)
  const [showFutureAnimation, setShowFutureAnimation] = useState(false)
  const [showSpaceAnimation, setShowSpaceAnimation] = useState(false)
  const [showGalaxyAnimation, setShowGalaxyAnimation] = useState(false)
  const [showStarsAnimation, setShowStarsAnimation] = useState(false)
  const [showNebulaAnimation, setShowNebulaAnimation] = useState(false)
  const [showAuroraAnimation, setShowAuroraAnimation] = useState(false)
  const [showFireAnimation, setShowFireAnimation] = useState(false)
  const [showWaterAnimation, setShowWaterAnimation] = useState(false)
  const [showEarthAnimation, setShowEarthAnimation] = useState(false)
  const [showAirAnimation, setShowAirAnimation] = useState(false)
  const [showLightAnimation, setShowLightAnimation] = useState(false)
  const [showDarkAnimation, setShowDarkAnimation] = useState(false)
  const [showDayAnimation, setShowDayAnimation] = useState(false)
  const [showNightAnimation, setShowNightAnimation] = useState(false)
  const [showSunAnimation, setShowSunAnimation] = useState(false)
  const [showMoonAnimation, setShowMoonAnimation] = useState(false)
  const [showRainAnimation, setShowRainAnimation] = useState(false)
  const [showSnowAnimation, setShowSnowAnimation] = useState(false)
  const [showFogAnimation, setShowFogAnimation] = useState(false)
  const [showCloudAnimation, setShowCloudAnimation] = useState(false)
  const [showStormAnimation, setShowStormAnimation] = useState(false)
  const [showThunderAnimation, setShowThunderAnimation] = useState(false)
  const [showLightningAnimation, setShowLightningAnimation] = useState(false)
  const [showRainbowAnimation, setShowRainbowAnimation] = useState(false)
  const [showSunsetAnimation, setShowSunsetAnimation] = useState(false)
  const [showSunriseAnimation, setShowSunriseAnimation] = useState(false)
  const [showDawnAnimation, setShowDawnAnimation] = useState(false)
  const [showDuskAnimation, setShowDuskAnimation] = useState(false)
  const [showTwilightAnimation, setShowTwilightAnimation] = useState(false)
  const [showMidnightAnimation, setShowMidnightAnimation] = useState(false)
  const [showNoonAnimation, setShowNoonAnimation] = useState(false)
  const [showMorningAnimation, setShowMorningAnimation] = useState(false)
  const [showEveningAnimation, setShowEveningAnimation] = useState(false)
  const [showAfternoonAnimation, setShowAfternoonAnimation] = useState(false)
  const [showNightfallAnimation, setShowNightfallAnimation] = useState(false)
  const [showDaybreakAnimation, setShowDaybreakAnimation] = useState(false)
  const [showMidnightSunAnimation, setShowMidnightSunAnimation] = useState(false)
  const [showPolarNightAnimation, setShowPolarNightAnimation] = useState(false)
  const [showEquinoxAnimation, setShowEquinoxAnimation] = useState(false)
  const [showSolsticeAnimation, setShowSolsticeAnimation] = useState(false)
  const [showEclipseAnimation, setShowEclipseAnimation] = useState(false)
  const [showMeteorAnimation, setShowMeteorAnimation] = useState(false)
  const [showCometAnimation, setShowCometAnimation] = useState(false)
  const [showAsteroidAnimation, setShowAsteroidAnimation] = useState(false)
  const [showPlanetAnimation, setShowPlanetAnimation] = useState(false)
  const [showMoonPhaseAnimation, setShowMoonPhaseAnimation] = useState(false)
  const [showConstellationAnimation, setShowConstellationAnimation] = useState(false)
  const [showZodiacAnimation, setShowZodiacAnimation] = useState(false)
  const [showHoroscopeAnimation, setShowHoroscopeAnimation] = useState(false)
  const [showAstrologyAnimation, setShowAstrologyAnimation] = useState(false)
  const [showTarotAnimation, setShowTarotAnimation] = useState(false)
  const [showRuneAnimation, setShowRuneAnimation] = useState(false)
  const [showCrystalAnimation, setShowCrystalAnimation] = useState(false)
  const [showChakraAnimation, setShowChakraAnimation] = useState(false)
  const [showAuraAnimation, setShowAuraAnimation] = useState(false)
  const [showMeditationAnimation, setShowMeditationAnimation] = useState(false)
  const [showYogaAnimation, setShowYogaAnimation] = useState(false)
  const [showZenAnimation, setShowZenAnimation] = useState(false)
  const [showMindfulnessAnimation, setShowMindfulnessAnimation] = useState(false)
  const [showSpiritualAnimation, setShowSpiritualAnimation] = useState(false)
  const [showMysticAnimation, setShowMysticAnimation] = useState(false)
  const [showMagicAnimation, setShowMagicAnimation] = useState(false)
  const [showWizardAnimation, setShowWizardAnimation] = useState(false)
  const [showWitchAnimation, setShowWitchAnimation] = useState(false)
  const [showSorcererAnimation, setShowSorcererAnimation] = useState(false)
  const [showDruidAnimation, setShowDruidAnimation] = useState(false)
  const [showShamanAnimation, setShowShamanAnimation] = useState(false)
  const [showMonkAnimation, setShowMonkAnimation] = useState(false)
  const [showPaladinAnimation, setShowPaladinAnimation] = useState(false)
  const [showRangerAnimation, setShowRangerAnimation] = useState(false)
  const [showRogueAnimation, setShowRogueAnimation] = useState(false)
  const [showBardAnimation, setShowBardAnimation] = useState(false)
  const [showClericAnimation, setShowClericAnimation] = useState(false)
  const [showWarriorAnimation, setShowWarriorAnimation] = useState(false)
  const [showArcherAnimation, setShowArcherAnimation] = useState(false)
  const [showMageAnimation, setShowMageAnimation] = useState(false)
  const [showNecromancerAnimation, setShowNecromancerAnimation] = useState(false)
  const [showSummonerAnimation, setShowSummonerAnimation] = useState(false)
  const [showEnchanterAnimation, setShowEnchanterAnimation] = useState(false)
  const [showIllusionistAnimation, setShowIllusionistAnimation] = useState(false)
  const [showConjurerAnimation, setShowConjurerAnimation] = useState(false)
  const [showDivinationAnimation, setShowDivinationAnimation] = useState(false)
  const [showAlchemyAnimation, setShowAlchemyAnimation] = useState(false)
  const [showHerbalismAnimation, setShowHerbalismAnimation] = useState(false)
  const [showPotionAnimation, setShowPotionAnimation] = useState(false)
  const [showScrollAnimation, setShowScrollAnimation] = useState(false)
  const [showGrimoireAnimation, setShowGrimoireAnimation] = useState(false)
  const [showSpellbookAnimation, setShowSpellbookAnimation] = useState(false)
  const [showWandAnimation, setShowWandAnimation] = useState(false)
  const [showStaffAnimation, setShowStaffAnimation] = useState(false)
  const [showOrbAnimation, setShowOrbAnimation] = useState(false)
  const [showAmuletAnimation, setShowAmuletAnimation] = useState(false)
  const [showRingAnimation, setShowRingAnimation] = useState(false)
  const [showCloakAnimation, setShowCloakAnimation] = useState(false)
  const [showBootsAnimation, setShowBootsAnimation] = useState(false)
  const [showGlovesAnimation, setShowGlovesAnimation] = useState(false)
  const [showHelmAnimation, setShowHelmAnimation] = useState(false)
  const [showArmorAnimation, setShowArmorAnimation] = useState(false)
  const [showShieldAnimation, setShowShieldAnimation] = useState(false)
  const [showSwordAnimation, setShowSwordAnimation] = useState(false)
  const [showAxeAnimation, setShowAxeAnimation] = useState(false)
  const [showMaceAnimation, setShowMaceAnimation] = useState(false)
  const [showDaggerAnimation, setShowDaggerAnimation] = useState(false)
  const [showBowAnimation, setShowBowAnimation] = useState(false)
  const [showCrossbowAnimation, setShowCrossbowAnimation] = useState(false)
  const [showSpearAnimation, setShowSpearAnimation] = useState(false)
  const [showHalberdAnimation, setShowHalberdAnimation] = useState(false)
  const [showScytheAnimation, setShowScytheAnimation] = useState(false)
  const [showWhipAnimation, setShowWhipAnimation] = useState(false)
  const [showChainAnimation, setShowChainAnimation] = useState(false)
  const [showFlailAnimation, setShowFlailAnimation] = useState(false)
  const [showNunchakuAnimation, setShowNunchakuAnimation] = useState(false)
  const [showShurikenAnimation, setShowShurikenAnimation] = useState(false)
  const [showKunaiAnimation, setShowKunaiAnimation] = useState(false)
  const [showSaiAnimation, setShowSaiAnimation] = useState(false)
  const [showTonfa, setShowTonfa] = useState(false)
  const [showNaginataAnimation, setShowNaginataAnimation] = useState(false)
  const [showKatanaAnimation, setShowKatanaAnimation] = useState(false)
  const [showWakizashiAnimation, setShowWakizashiAnimation] = useState(false)
  const [showTantoAnimation, setShowTantoAnimation] = useState(false)
  const [showNodachiAnimation, setShowNodachiAnimation] = useState(false)
  const [showKusarigamaAnimation, setShowKusarigamaAnimation] = useState(false)
  const [showYariAnimation, setShowYariAnimation] = useState(false)
  const [showKanabo, setShowKanabo] = useState(false)
  const [showTessenAnimation, setShowTessenAnimation] = useState(false)
  const [showJitteAnimation, setShowJitteAnimation] = useState(false)
  const [showBo, setShowBo] = useState(false)
  const [showJoAnimation, setShowJoAnimation] = useState(false)
  const [showHanboAnimation, setShowHanboAnimation] = useState(false)
  const [showTekkoAnimation, setShowTekkoAnimation] = useState(false)
  const [showKakuteAnimation, setShowKakuteAnimation] = useState(false)
  const [showManrikigusariAnimation, setShowManrikigusariAnimation] = useState(false)
  const [showKyoketsuShoge, setShowKyoketsuShoge] = useState(false)
  const [showShikomizueAnimation, setShowShikomizueAnimation] = useState(false)
  const [showBokkenAnimation, setShowBokkenAnimation] = useState(false)
  const [showShinaiAnimation, setShowShinaiAnimation] = useState(false)
  const [showBastardSwordAnimation, setShowBastardSwordAnimation] = useState(false)
  const [showClaymoreAnimation, setShowClaymoreAnimation] = useState(false)
  const [showRapierAnimation, setShowRapierAnimation] = useState(false)
  const [showSabreAnimation, setShowSabreAnimation] = useState(false)
  const [showScimitarAnimation, setShowScimitarAnimation] = useState(false)
  const [showCutlassAnimation, setShowCutlassAnimation] = useState(false)
  const [showFalchionAnimation, setShowFalchionAnimation] = useState(false)
  const [showBroadswordAnimation, setShowBroadswordAnimation] = useState(false)
  const [showLongswordAnimation, setShowLongswordAnimation] = useState(false)
  const [showShortswordAnimation, setShowShortswordAnimation] = useState(false)
  const [showGreatswordAnimation, setShowGreatswordAnimation] = useState(false)
  const [showZweihanderAnimation, setShowZweihanderAnimation] = useState(false)
  const [showEstocAnimation, setShowEstocAnimation] = useState(false)
  const [showFlambergeAnimation, setShowFlambergeAnimation] = useState(false)
  const [showGlaiveAnimation, setShowGlaiveAnimation] = useState(false)
  const [showBardiche, setShowBardiche] = useState(false)
  const [showVoulgeAnimation, setShowVoulgeAnimation] = useState(false)
  const [showGuisarmeAnimation, setShowGuisarmeAnimation] = useState(false)
  const [showBillAnimation, setShowBillAnimation] = useState(false)
  const [showPartisanAnimation, setShowPartisanAnimation] = useState(false)
  const [showPikeAnimation, setShowPikeAnimation] = useState(false)
  const [showLanceAnimation, setShowLanceAnimation] = useState(false)
  const [showJavelinAnimation, setShowJavelinAnimation] = useState(false)
  const [showTridentAnimation, setShowTridentAnimation] = useState(false)
  const [showMorningstarAnimation, setShowMorningstarAnimation] = useState(false)
  const [showWarhammerAnimation, setShowWarhammerAnimation] = useState(false)
  const [showMaulAnimation, setShowMaulAnimation] = useState(false)
  const [showClubAnimation, setShowClubAnimation] = useState(false)
  const [showQuarterstaffAnimation, setShowQuarterstaffAnimation] = useState(false)
  const [showSlingAnimation, setShowSlingAnimation] = useState(false)
  const [showChakramAnimation, setShowChakramAnimation] = useState(false)
  const [showBolasAnimation, setShowBolasAnimation] = useState(false)
  const [showBlowgunAnimation, setShowBlowgunAnimation] = useState(false)
  const [showBoomerangAnimation, setShowBoomerangAnimation] = useState(false)
  const [showNetAnimation, setShowNetAnimation] = useState(false)
  const [showLassoAnimation, setShowLassoAnimation] = useState(false)
  const [showGauntletAnimation, setShowGauntletAnimation] = useState(false)
  const [showBrassKnucklesAnimation, setShowBrassKnucklesAnimation] = useState(false)
  const [showCestusAnimation, setShowCestusAnimation] = useState(false)
  const [showKatarAnimation, setShowKatarAnimation] = useState(false)
  const [showClawAnimation, setShowClawAnimation] = useState(false)
  const [showHookAnimation, setShowHookAnimation] = useState(false)
  const [showSapAnimation, setShowSapAnimation] = useState(false)
  const [showSlingshot, setShowSlingshot] = useState(false)

  // Emojis for quick selection
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "👍",
    "👎",
    "👏",
    "🙌",
    "👋",
    "🤝",
    "❤️",
    "🔥",
    "💯",
    "⭐",
  ]

  // Quick replies
  const quickReplies = [
    { text: "Πώς μπορώ να συνδεθώ στον server;", icon: <HelpCircle className="h-3 w-3" /> },
    { text: "Ποιο είναι το κόστος VIP;", icon: <Zap className="h-3 w-3" /> },
    { text: "Πού μπορώ να βρω τους κανόνες;", icon: <Shield className="h-3 w-3" /> },
    { text: "Πώς αγοράζω ένα όχημα;", icon: <Car className="h-3 w-3" /> },
  ]

  // Initialize
  useEffect(() => {
    // Check if user is logged in
    const loggedIn = isLoggedIn()
    setIsLoggedInUser(loggedIn)

    if (loggedIn) {
      const user = getUserData()
      if (user) {
        setUserData(user)
      }
    }

    // Load messages from localStorage
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      setMessages(parsedMessages)
      // Count unread messages
      const unread = parsedMessages.filter((msg: Message) => msg.sender === "admin" && !msg.read).length
      setUnreadCount(unread)
    } else {
      // Default welcome message
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        content: "Καλωσήρθατε στο Dual City! Πώς μπορώ να σας βοηθήσω;",
        sender: "admin",
        timestamp: Date.now(),
        username: "V66 AI Assistant",
        read: false,
      }
      setMessages([welcomeMessage])
      setUnreadCount(1)
      localStorage.setItem("chatMessages", JSON.stringify([welcomeMessage]))
    }

    // Create audio element
    const audio = new Audio("/notification.mp3")
    messageAudioRef.current = audio

    // Simulate connection
    setIsConnecting(true)
    setConnectionStatus("connecting")
    setShowConnectionAnimation(true)

    setTimeout(() => {
      setIsConnecting(false)
      setConnectionStatus("connected")
      setShowConnectionAnimation(false)
      setShowSuccessAnimation(true)

      setTimeout(() => {
        setShowSuccessAnimation(false)
      }, 1500)
    }, 2000)

    // Simulate ping updates
    const pingInterval = setInterval(() => {
      setPingMs(Math.floor(Math.random() * 20) + 15) // 15-35ms
    }, 5000)

    // Simulate chat status updates
    const statusInterval = setInterval(() => {
      const statuses = ["Online", "5 agents available", "Busy, wait time: 2 min", "Online"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      setChatStatusMessage(randomStatus)
    }, 15000)

    // Simulate encryption status
    const encryptionInterval = setInterval(() => {
      if (isEncrypted) {
        setEncryptionStatus("encrypted")
        setShowEncryptionAnimation(true)
        setTimeout(() => {
          setShowEncryptionAnimation(false)
        }, 1000)
      }
    }, 30000)

    // Cleanup
    return () => {
      clearInterval(pingInterval)
      clearInterval(statusInterval)
      clearInterval(encryptionInterval)
      if (typingTimeout) clearTimeout(typingTimeout)
      if (agentTypingTimeout) clearTimeout(agentTypingTimeout)
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  // Auto scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })

      // Mark all messages as read when chat is opened
      if (messages.some((msg) => !msg.read)) {
        const updatedMessages = messages.map((msg) => ({
          ...msg,
          read: true,
        }))
        setMessages(updatedMessages)
        setUnreadCount(0)
      }
    }
  }, [messages, isOpen])

  // Check scroll position to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
        setShowScrollButton(!isNearBottom)
      }

      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Simulate random chat statuses
  useEffect(() => {
    const statuses = [
      { message: "Online", duration: 40000 },
      { message: "Πολλά αιτήματα, παρακαλώ περιμένετε", duration: 15000 },
      { message: "Online (5 συνδεδεμένοι πράκτορες)", duration: 30000 },
    ]

    let currentIndex = 0
    const intervalId = setInterval(() => {
      setChatStatusMessage(statuses[currentIndex].message)
      currentIndex = (currentIndex + 1) % statuses.length
    }, statuses[currentIndex].duration)

    return () => clearInterval(intervalId)
  }, [])

  // Handle typing indicator
  useEffect(() => {
    if (isTyping) {
      // Send typing indicator to server/agent
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Clear typing indicator after 2 seconds of inactivity
      const timeout = setTimeout(() => {
        setIsTyping(false)
      }, 2000)

      setTypingTimeout(timeout)
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [isTyping, newMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleQuickReply = (text: string) => {
    setNewMessage(text)
    setShowQuickReplies(false)
    // Auto-send after a short delay
    setTimeout(() => {
      handleSendMessage()
    }, 300)
  }

  const handleChatClear = () => {
    if (window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε το ιστορικό συνομιλίας;")) {
      setMessages([])
      localStorage.removeItem("chatMessages")

      // Add new welcome message
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        content: "Η συνομιλία καθαρίστηκε. Πώς μπορώ να σας βοηθήσω;",
        sender: "admin",
        timestamp: Date.now(),
        username: "V66 AI Assistant",
        read: isOpen,
      }

      setMessages([welcomeMessage])
      localStorage.setItem("chatMessages", JSON.stringify([welcomeMessage]))

      if (!isOpen) {
        setUnreadCount(1)
      }

      // Show system message
      setSystemMessage("Η συνομιλία καθαρίστηκε επιτυχώς")
      setSystemMessageType("success")
      setShowSystemMessage(true)
      setTimeout(() => {
        setShowSystemMessage(false)
      }, 3000)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate file upload
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setIsUploading(false)
              handleSendMessage()
            }, 500)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const toggleNotifications = () => {
    if (!notificationsEnabled && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          setNotificationsEnabled(permission === "granted")
        })
      } else {
        setNotificationsEnabled(!notificationsEnabled)
      }
    } else {
      setNotificationsEnabled(!notificationsEnabled)
    }
  }

  const getThemeClass = () => {
    switch (currentTheme) {
      case "neon":
        return "theme-neon"
      case "cyberpunk":
        return "theme-cyberpunk"
      case "galaxy":
        return "theme-galaxy"
      case "minimal":
        return "theme-minimal"
      case "v66":
        return "theme-v66"
      default:
        return ""
    }
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!newMessage.trim() && !isUploading) return

    // Show sending animation
    setShowSendingAnimation(true)
    setTimeout(() => {
      setShowSendingAnimation(false)
    }, 1000)

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      sender: "user",
      timestamp: Date.now(),
      username: userData?.username || "Guest",
      read: true,
      status: "sending",
    }

    // Add attachment if uploading
    if (isUploading) {
      userMessage.attachments = [
        {
          type: "image",
          url: "/images/logo.png", // Placeholder image
          name: "screenshot.png",
          size: "245 KB",
        },
      ]
    }

    // Add message to state
    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsUploading(false)
    setUploadProgress(0)
    scrollToBottom()

    // Simulate message sending status updates
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "sent" as const } : msg)))

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg)),
        )

        // Simulate agent typing
        setIsAgentTyping(true)
        if (agentTypingTimeout) {
          clearTimeout(agentTypingTimeout)
        }

        // Generate response based on message content
        let responseText = "Ευχαριστώ για το μήνυμά σας! Πώς μπορώ να βοηθήσω περαιτέρω;"
        const lowerCaseMessage = newMessage.toLowerCase()

        if (lowerCaseMessage.includes("γεια") || lowerCaseMessage.includes("χαίρετε")) {
          responseText = "Γεια σας! Πώς μπορώ να σας βοηθήσω σήμερα;"
        } else if (
          lowerCaseMessage.includes("server") ||
          lowerCaseMessage.includes("σερβερ") ||
          lowerCaseMessage.includes("διακομιστή")
        ) {
          responseText =
            "Ο server μας είναι online 24/7 με 128 slots. Μπορείτε να συνδεθείτε μέσω του FiveM client αναζητώντας 'Dual City' ή χρησιμοποιώντας το IP: play.dualcity.gr"
        } else if (
          lowerCaseMessage.includes("κανόν") ||
          lowerCaseMessage.includes("κανον") ||
          lowerCaseMessage.includes("rule")
        ) {
          responseText =
            "Μπορείτε να βρείτε τους κανόνες του server στην ιστοσελίδα μας στην ενότητα 'Κανόνες' ή στο Discord μας."
        } else if (
          lowerCaseMessage.includes("vip") ||
          lowerCaseMessage.includes("βιπ") ||
          lowerCaseMessage.includes("premium")
        ) {
          responseText =
            "Το VIP πακέτο κοστίζει 15€/μήνα και περιλαμβάνει πρόσβαση σε αποκλειστικά οχήματα, προτεραιότητα σύνδεσης και 100.000$ in-game χρήματα."
        } else if (
          lowerCaseMessage.includes("αυτοκίνητ") ||
          lowerCaseMessage.includes("αμάξι") ||
          lowerCaseMessage.includes("όχημα") ||
          lowerCaseMessage.includes("car")
        ) {
          responseText =
            "Μπορείτε να αγοράσετε οχήματα από τις αντιπροσωπείες που βρίσκονται στην πόλη. Οι τιμές ξεκινούν από $15,000 για τα βασικά μοντέλα."
        }

        // Set timeout for agent typing
        const timeout = setTimeout(
          () => {
            setIsAgentTyping(false)

            // Send agent response
            const agentMessage: Message = {
              id: `msg-${Date.now() + 1}`,
              content: responseText,
              sender: "admin",
              timestamp: Date.now(),
              username: "V66 AI Assistant",
              read: isOpen,
            }

            setMessages((prev) => [
              ...prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "read" as const } : msg)),
              agentMessage,
            ])

            if (soundEnabled && messageAudioRef.current && !isOpen) {
              messageAudioRef.current.play().catch((e) => console.log(e))
            }

            if (!isOpen) {
              setUnreadCount((prev) => prev + 1)

              // Show browser notification
              if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
                new Notification("V66 AI Assistant", {
                  body: responseText,
                  icon: "/images/logo.png",
                })
              }
            }

            scrollToBottom()
          },
          1500 + Math.random() * 1500,
        ) // Random typing time between 1.5-3s

        setAgentTypingTimeout(timeout)
      }, 1000)
    }, 500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (e.target.value.trim() !== "" && !isTyping) {
      setIsTyping(true)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Audio element for notifications */}
      <audio ref={messageAudioRef} src="/notification.mp3" />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileSelected}
      />

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isFullscreen ? 1.05 : 1,
                width: isFullscreen ? "90vw" : "auto",
                height: isFullscreen ? "90vh" : "auto",
              }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`${
                isMinimized ? "h-16" : isFullscreen ? "w-[90vw] h-[90vh]" : "w-80 sm:w-96 h-[500px]"
              } bg-black/90 backdrop-blur-lg border border-cyan-500/30 rounded-lg shadow-lg flex flex-col overflow-hidden mb-4 transition-all duration-300 ${getThemeClass()}`}
              style={{
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.2), 0 0 40px rgba(0, 255, 255, 0.1)",
              }}
            >
              {/* Chat Header */}
              <div className="p-3 flex justify-between items-center bg-gradient-to-r from-cyan-900/80 to-purple-900/80 border-b border-cyan-500/30">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-8 w-8 mr-2 border border-cyan-500/50">
                      <AvatarImage src="/images/logo.png" alt="V66 AI" />
                      <AvatarFallback className="bg-cyan-900 text-cyan-100">V66</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-1 h-2.5 w-2.5 rounded-full bg-green-500 border border-black"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">V66 AI Assistant</h3>
                    <div className="flex items-center">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      <p className="text-xs text-gray-300 flex items-center gap-1">
                        {chatStatusMessage}
                        <span className="text-cyan-400 ml-1 text-[10px] flex items-center">
                          <Wifi className="h-3 w-3 mr-0.5" /> {pingMs}ms
                        </span>
                        {isEncrypted && (
                          <span className="text-green-400 ml-1 text-[10px] flex items-center">
                            <Lock className="h-3 w-3 mr-0.5" /> E2E
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {!isMinimized && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800/50"
                      >
                        {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleNotifications}
                        className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800/50"
                      >
                        {notificationsEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(!showSettings)}
                        className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800/50"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800/50"
                      >
                        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMinimize}
                    className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800/50"
                  >
                    {isMinimized ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800/50"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && !isMinimized && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/80 border-b border-cyan-500/30 overflow-hidden"
                  >
                    <div className="p-3 space-y-3">
                      <h4 className="text-sm font-medium text-cyan-400">Ρυθμίσεις</h4>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">Θέμα</span>
                          <div className="flex space-x-1">
                            {["default", "neon", "cyberpunk", "galaxy", "minimal", "v66"].map((theme) => (
                              <button
                                key={theme}
                                onClick={() => setTheme(theme as ThemeType)}
                                className={`w-5 h-5 rounded-full ${
                                  currentTheme === theme ? "ring-2 ring-cyan-400 ring-offset-1 ring-offset-black" : ""
                                } ${
                                  theme === "default"
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                    : theme === "neon"
                                      ? "bg-gradient-to-r from-cyan-400 to-purple-500"
                                      : theme === "cyberpunk"
                                        ? "bg-gradient-to-r from-yellow-400 to-pink-600"
                                        : theme === "galaxy"
                                          ? "bg-gradient-to-r from-indigo-500 to-purple-800"
                                          : theme === "minimal"
                                            ? "bg-gradient-to-r from-gray-700 to-gray-900"
                                            : "bg-gradient-to-r from-cyan-500 to-blue-800"
                                }`}
                              ></button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">Ήχοι</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`h-6 px-2 text-xs ${
                              soundEnabled
                                ? "bg-cyan-900/30 text-cyan-400 border-cyan-500/50"
                                : "bg-transparent text-gray-400 border-gray-700"
                            }`}
                          >
                            {soundEnabled ? "Ενεργοί" : "Ανενεργοί"}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">Ειδοποιήσεις</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleNotifications}
                            className={`h-6 px-2 text-xs ${
                              notificationsEnabled
                                ? "bg-cyan-900/30 text-cyan-400 border-cyan-500/50"
                                : "bg-transparent text-gray-400 border-gray-700"
                            }`}
                          >
                            {notificationsEnabled ? "Ενεργές" : "Ανενεργές"}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300">Κρυπτογράφηση</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEncrypted(!isEncrypted)}
                            className={`h-6 px-2 text-xs ${
                              isEncrypted
                                ? "bg-green-900/30 text-green-400 border-green-500/50"
                                : "bg-red-900/30 text-red-400 border-red-500/50"
                            }`}
                          >
                            {isEncrypted ? "Ενεργή" : "Ανενεργή"}
                          </Button>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleChatClear}
                          className="h-7 px-2 text-xs bg-red-900/20 text-red-400 border-red-500/30 hover:bg-red-900/30"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Καθαρισμός
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSettings(false)}
                          className="h-7 px-2 text-xs bg-cyan-900/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/30"
                        >
                          Κλείσιμο
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isMinimized && (
                <>
                  {/* System Message */}
                  <AnimatePresence>
                    {showSystemMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-2 text-xs text-center ${
                          systemMessageType === "info"
                            ? "bg-blue-900/30 text-blue-400"
                            : systemMessageType === "warning"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : systemMessageType === "error"
                                ? "bg-red-900/30 text-red-400"
                                : "bg-green-900/30 text-green-400"
                        }`}
                      >
                        {systemMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Connection Status */}
                  <AnimatePresence>
                    {isConnecting && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-2 text-xs text-center bg-blue-900/30 text-blue-400"
                      >
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Σύνδεση με το σύστημα V66...
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chat Messages */}
                  <div
                    className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar"
                    ref={messagesContainerRef}
                    style={{
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,30,60,0.8))",
                      backgroundImage:
                        "radial-gradient(circle at 50% 50%, rgba(0, 100, 150, 0.05) 0%, transparent 80%)",
                    }}
                  >
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : message.sender === "system" ? "justify-center" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        {message.sender === "system" ? (
                          <div className="bg-gray-800/70 text-gray-300 text-xs py-1 px-3 rounded-full">
                            {message.content}
                          </div>
                        ) : (
                          <div
                            className={`max-w-[85%] p-2.5 rounded-lg ${
                              message.sender === "user"
                                ? "bg-cyan-900/30 text-white border border-cyan-500/30 rounded-tr-none"
                                : "bg-gray-900/70 text-white border border-purple-500/30 rounded-tl-none"
                            }`}
                            style={{
                              boxShadow:
                                message.sender === "user"
                                  ? "0 0 10px rgba(0, 200, 255, 0.1)"
                                  : "0 0 10px rgba(150, 0, 255, 0.1)",
                            }}
                          >
                            <div className="flex items-center mb-1 gap-1">
                              {message.sender === "admin" && (
                                <Avatar className="h-4 w-4 mr-1">
                                  <AvatarImage src="/images/logo.png" alt="V66 AI" />
                                  <AvatarFallback className="bg-cyan-900 text-[8px]">V66</AvatarFallback>
                                </Avatar>
                              )}
                              <span className="text-[10px] font-medium text-gray-400">{message.username}</span>
                              <span className="text-[10px] text-gray-500">• {formatTime(message.timestamp)}</span>
                              {message.sender === "user" && message.status && (
                                <span className="ml-1">
                                  {message.status === "sending" ? (
                                    <Loader2 className="h-2 w-2 text-gray-400 animate-spin" />
                                  ) : message.status === "sent" ? (
                                    <Check className="h-2 w-2 text-gray-400" />
                                  ) : message.status === "delivered" ? (
                                    <div className="flex">
                                      <Check className="h-2 w-2 text-gray-400" />
                                      <Check className="h-2 w-2 -ml-0.5 text-gray-400" />
                                    </div>
                                  ) : message.status === "read" ? (
                                    <div className="flex">
                                      <Check className="h-2 w-2 text-cyan-400" />
                                      <Check className="h-2 w-2 -ml-0.5 text-cyan-400" />
                                    </div>
                                  ) : message.status === "error" ? (
                                    <AlertCircle className="h-2 w-2 text-red-400" />
                                  ) : null}
                                </span>
                              )}
                            </div>
                            <p className="text-sm break-words">{message.content}</p>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2">
                                {message.attachments.map((attachment, i) => (
                                  <div key={i} className="rounded overflow-hidden border border-gray-700">
                                    {attachment.type === "image" ? (
                                      <div className="relative">
                                        <img
                                          src={attachment.url || "/placeholder.svg"}
                                          alt={attachment.name}
                                          className="max-w-full h-auto"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 flex justify-between">
                                          <span>{attachment.name}</span>
                                          <span>{attachment.size}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-gray-800 p-2 text-xs flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-cyan-400" />
                                        <div className="flex-1">
                                          <div>{attachment.name}</div>
                                          <div className="text-gray-400">{attachment.size}</div>
                                        </div>
                                        <Download className="h-4 w-4 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Agent typing indicator */}
                    {isAgentTyping && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="bg-gray-900/70 text-white border border-purple-500/30 rounded-lg rounded-tl-none p-2.5 max-w-[85%]">
                          <div className="flex items-center mb-1 gap-1">
                            <Avatar className="h-4 w-4 mr-1">
                              <AvatarImage src="/images/logo.png" alt="V66 AI" />
                              <AvatarFallback className="bg-cyan-900 text-[8px]">V66</AvatarFallback>
                            </Avatar>
                            <span className="text-[10px] font-medium text-gray-400">V66 AI Assistant</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                            </div>
                            <span className="text-xs text-gray-400 ml-1">
                              AI {isAgentTyping ? "πληκτρολογεί..." : ""}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Upload progress */}
                    {isUploading && (
                      <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="bg-gray-900/70 text-white rounded-lg p-2.5 max-w-[85%]">
                          <div className="flex items-center">
                            <Upload className="h-4 w-4 text-cyan-400 mr-2" />
                            <span className="text-xs text-gray-300">Αποστολή αρχείου... {uploadProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full bg-cyan-500 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Scroll to bottom button */}
                  <AnimatePresence>
                    {showScrollButton && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-20 right-3"
                      >
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-500/30"
                          onClick={scrollToBottom}
                        >
                          <ChevronDown className="h-4 w-4 text-cyan-400" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick Replies */}
                  <AnimatePresence>
                    {showQuickReplies && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-2 border-t border-cyan-500/30 bg-gray-900/70"
                      >
                        <div className="flex flex-wrap gap-2">
                          {quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-auto py-1 px-2 text-xs bg-cyan-900/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/40"
                              onClick={() => handleQuickReply(reply.text)}
                            >
                              {reply.icon}
                              <span className="ml-1">{reply.text}</span>
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-2 border-t border-cyan-500/30 bg-gray-900/70"
                      >
                        <div className="grid grid-cols-10 gap-1">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              className="hover:bg-cyan-900/30 rounded p-1 transition-colors"
                              onClick={() => handleEmojiSelect(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="p-2 border-t border-cyan-500/30 bg-black/80">
                    <div className="flex items-center gap-1 mb-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="h-7 w-7 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/20"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleFileUpload}
                        className="h-7 w-7 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/20"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                        className="h-7 w-7 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/20"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Γράψτε ένα μήνυμα..."
                        value={newMessage}
                        onChange={handleInputChange}
                        className="flex-1 bg-gray-900/50 border-cyan-500/30 focus:border-cyan-500 text-white placeholder-gray-500 text-sm"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className={`bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-400 border border-cyan-500/30 ${
                          !newMessage.trim() && !isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!newMessage.trim() && !isUploading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Encryption indicator */}
                    {isEncrypted && (
                      <div className="mt-1 flex justify-center">
                        <span className="text-[10px] text-gray-500 flex items-center">
                          <Lock className="h-2.5 w-2.5 mr-0.5 text-green-500" />
                          End-to-end encrypted | V66 AI System
                        </span>
                      </div>
                    )}
                  </form>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Button */}
        <Button
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen) {
              setIsMinimized(false)
            }
          }}
          className={`rounded-full w-14 h-14 shadow-lg ${
            isOpen
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          }`}
          style={{
            boxShadow: isOpen
              ? "0 0 20px rgba(255, 0, 0, 0.3)"
              : "0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1)",
          }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </Button>
      </div>
    </>
  )
}
