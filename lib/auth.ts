// Enhanced auth utility with roles support

// User roles
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// User interface
export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  createdAt: string
  lastLogin: string
  password?: string // Added password field
}

// Check if user is logged in
export const isLoggedIn = () => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isLoggedIn") === "true"
}

// Get user data from localStorage
export const getUserData = (): User | null => {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

// Check if user is admin
export const isAdmin = () => {
  // Έλεγχος αν είμαστε στο client-side
  if (typeof window === "undefined") {
    return false
  }

  // Έλεγχος αν υπάρχει το adminToken στο localStorage
  return localStorage.getItem("adminToken") === "true"
}

// Login function
export function login(email: string, password: string) {
  // Check if the user exists in localStorage
  const users = getUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false }
  }

  // In a real app, you would hash the password and compare
  // For demo purposes, we're using plain text
  if (user.password !== password) {
    return { success: false }
  }

  // Store login state
  localStorage.setItem("isLoggedIn", "true")
  localStorage.setItem("userData", JSON.stringify(user))

  return { success: true, role: user.role }
}

// Register function - only for regular users, not admins
export const register = (username: string, email: string, password: string) => {
  if (typeof window === "undefined") return false

  // Check if email is reserved for admin
  if (email === "admin@example.com") {
    return false
  }

  // Simple mock registration - in a real app, this would create a user in a database
  if (username && email && password) {
    // Get current timestamp
    const now = new Date().toISOString()

    // Store login state
    localStorage.setItem("isLoggedIn", "true")

    // Create user with USER role only
    const userData = {
      id: "user-" + Math.random().toString(36).substring(2, 9),
      email: email,
      username: username,
      role: UserRole.USER, // Always USER for self-registration
      createdAt: now,
      lastLogin: now,
      password: password, // Store the password
    }

    localStorage.setItem("userData", JSON.stringify(userData))

    // Add to users list
    const users = getUsers()
    users.push(userData)
    localStorage.setItem("usersList", JSON.stringify(users))

    return true
  }
  return false
}

// Admin function to create a user (can create both regular users and admins)
export const createUser = (username: string, email: string, role: UserRole = UserRole.USER) => {
  // In a real app, this would create a user in a database
  if (username && email) {
    // Get current timestamp
    const now = new Date().toISOString()

    // Generate a random password (in a real app, you'd send an email)
    const tempPassword = Math.random().toString(36).substring(2, 10)

    // Add to users list
    const users = getUsers()
    const newUser = {
      id: "user-" + Math.random().toString(36).substring(2, 9),
      email: email,
      username: username,
      role: role,
      createdAt: now,
      lastLogin: "",
      password: tempPassword, // Store the generated password
    }

    users.push(newUser)
    localStorage.setItem("usersList", JSON.stringify(users))

    return { user: newUser, password: tempPassword }
  }
  return null
}

// Get all users (admin function)
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []

  // Initialize users list if it doesn't exist
  if (!localStorage.getItem("usersList")) {
    // Create default admin user if no users exist
    const defaultAdmin = {
      id: "admin-123",
      email: "admin@example.com",
      username: "admin",
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      password: "admin123",
    }

    localStorage.setItem("usersList", JSON.stringify([defaultAdmin]))
  }

  const usersList = localStorage.getItem("usersList")
  return usersList ? JSON.parse(usersList) : []
}

// Update user role (admin function)
export const updateUserRole = (userId: string, newRole: UserRole) => {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex !== -1) {
    users[userIndex].role = newRole
    localStorage.setItem("usersList", JSON.stringify(users))
    return true
  }

  return false
}

// Delete user (admin function)
export const deleteUser = (userId: string) => {
  const users = getUsers()
  const filteredUsers = users.filter((user) => user.id !== userId)

  if (filteredUsers.length !== users.length) {
    localStorage.setItem("usersList", JSON.stringify(filteredUsers))
    return true
  }

  return false
}

// Logout function
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userData")
  }
}

// Συνάρτηση για αποσύνδεση του admin
export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
    window.location.href = "/"
  }
}

// Προσθήκη συνάρτησης για να πάρουμε το redirect URL βάσει ρόλου
export function getRedirectUrlByRole(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin"
    case UserRole.USER:
    default:
      return "/dashboard"
  }
}
