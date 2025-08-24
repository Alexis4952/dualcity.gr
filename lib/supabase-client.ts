// Αυτό το αρχείο δεν χρειάζεται πλέον, αλλά το διατηρούμε με απλοποιημένη λειτουργικότητα
// για να μην σπάσουν τυχόν imports που μπορεί να υπάρχουν σε άλλα αρχεία

export function createClient() {
  console.log("Using mock Supabase client")
  return createMockClient()
}

// Mock client για development
function createMockClient() {
  return {
    auth: {
      getUser: () =>
        Promise.resolve({ data: { user: { id: "mock-user-id", email: "user@example.com" } }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: mockData(table, value), error: null }),
        }),
        single: () => Promise.resolve({ data: mockData(table), error: null }),
      }),
    }),
  }
}

// Επιστρέφει mock data για development
function mockData(table: string, id?: any) {
  switch (table) {
    case "users":
      return { id: id || "mock-user-id", name: "Mock User" }
    case "shop_items":
      return { id: id || "mock-item-id", price: 100 }
    default:
      return { id: id || "mock-id" }
  }
}
