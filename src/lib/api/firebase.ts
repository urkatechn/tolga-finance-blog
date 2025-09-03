// This file will contain Firebase configuration and initialization
// In a real app, you would use actual Firebase credentials

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Mock Firebase Auth functions
export const auth = {
  currentUser: {
    uid: "admin-user-123",
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  signInWithGoogle: async () => {
    return Promise.resolve({
      user: {
        uid: "admin-user-123",
        email: "admin@example.com",
        displayName: "Admin User",
        photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
    });
  },
  signOut: async () => {
    return Promise.resolve();
  },
};

// Mock Firestore functions
export const firestore = {
  collection: (collectionName: string) => ({
    doc: (id: string) => ({
      get: async () => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts" && mockPosts[id]) {
          return {
            exists: true,
            data: () => mockPosts[id],
            id,
          };
        }
        
        if (collectionName === "users" && mockUsers[id]) {
          return {
            exists: true,
            data: () => mockUsers[id],
            id,
          };
        }
        
        return {
          exists: false,
          data: () => null,
          id,
        };
      },
      set: async (data: any) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts") {
          mockPosts[id] = { ...mockPosts[id], ...data };
        }
        
        if (collectionName === "users") {
          mockUsers[id] = { ...mockUsers[id], ...data };
        }
        
        return Promise.resolve();
      },
      update: async (data: any) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts" && mockPosts[id]) {
          mockPosts[id] = { ...mockPosts[id], ...data };
        }
        
        if (collectionName === "users" && mockUsers[id]) {
          mockUsers[id] = { ...mockUsers[id], ...data };
        }
        
        return Promise.resolve();
      },
      delete: async () => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts") {
          delete mockPosts[id];
        }
        
        if (collectionName === "users") {
          delete mockUsers[id];
        }
        
        return Promise.resolve();
      },
    }),
    add: async (data: any) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const id = `${collectionName}-${Date.now()}`;
      
      if (collectionName === "posts") {
        mockPosts[id] = data;
      }
      
      if (collectionName === "users") {
        mockUsers[id] = data;
      }
      
      return {
        id,
      };
    },
    where: () => ({
      get: async () => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts") {
          return {
            docs: Object.entries(mockPosts).map(([id, data]) => ({
              id,
              data: () => data,
              exists: true,
            })),
          };
        }
        
        if (collectionName === "users") {
          return {
            docs: Object.entries(mockUsers).map(([id, data]) => ({
              id,
              data: () => data,
              exists: true,
            })),
          };
        }
        
        return {
          docs: [],
        };
      },
    }),
    orderBy: () => ({
      limit: () => ({
        get: async () => {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          if (collectionName === "posts") {
            return {
              docs: Object.entries(mockPosts)
                .slice(0, 5)
                .map(([id, data]) => ({
                  id,
                  data: () => data,
                  exists: true,
                })),
            };
          }
          
          if (collectionName === "users") {
            return {
              docs: Object.entries(mockUsers)
                .slice(0, 5)
                .map(([id, data]) => ({
                  id,
                  data: () => data,
                  exists: true,
                })),
            };
          }
          
          return {
            docs: [],
          };
        },
      }),
    }),
  }),
};

// Mock Storage functions
export const storage = {
  ref: (path: string) => ({
    put: async (file: File) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return {
        ref: {
          getDownloadURL: async () => {
            return `https://firebasestorage.googleapis.com/v0/b/mock-bucket/o/${path}?alt=media`;
          },
        },
      };
    },
    delete: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      return Promise.resolve();
    },
  }),
};

// Mock data
const mockPosts: Record<string, any> = {
  "post-1": {
    id: "post-1",
    title: "Understanding Market Volatility",
    slug: "understanding-market-volatility",
    excerpt: "Learn how market volatility works and strategies to navigate turbulent times.",
    content: "# Understanding Market Volatility\n\nMarket volatility refers to the rate at which the price of assets increases or decreases...",
    category: "investing",
    status: "published",
    author: "admin-user-123",
    publishedAt: "2025-08-15T10:30:00Z",
    updatedAt: "2025-08-15T10:30:00Z",
    readTime: 8,
    featured: true,
  },
  "post-2": {
    id: "post-2",
    title: "Retirement Planning Basics",
    slug: "retirement-planning-basics",
    excerpt: "Essential strategies for planning your retirement at any age.",
    content: "# Retirement Planning Basics\n\nPlanning for retirement is one of the most important financial steps you can take...",
    category: "retirement",
    status: "published",
    author: "admin-user-123",
    publishedAt: "2025-08-10T14:20:00Z",
    updatedAt: "2025-08-12T09:15:00Z",
    readTime: 10,
    featured: false,
  },
  "post-3": {
    id: "post-3",
    title: "Cryptocurrency Investment Guide",
    slug: "cryptocurrency-investment-guide",
    excerpt: "A comprehensive guide to investing in cryptocurrencies safely.",
    content: "# Cryptocurrency Investment Guide\n\nCryptocurrencies have emerged as a new asset class that offers both opportunities and risks...",
    category: "crypto",
    status: "published",
    author: "admin-user-123",
    publishedAt: "2025-08-05T16:45:00Z",
    updatedAt: "2025-08-07T11:30:00Z",
    readTime: 12,
    featured: true,
  },
  "post-4": {
    id: "post-4",
    title: "Tax Optimization Strategies",
    slug: "tax-optimization-strategies",
    excerpt: "Legal ways to minimize your tax burden and maximize savings.",
    content: "# Tax Optimization Strategies\n\nTax planning is a year-round activity that can significantly impact your financial health...",
    category: "taxes",
    status: "draft",
    author: "admin-user-123",
    updatedAt: "2025-08-01T13:20:00Z",
    readTime: 9,
    featured: false,
  },
  "post-5": {
    id: "post-5",
    title: "Emergency Fund Essentials",
    slug: "emergency-fund-essentials",
    excerpt: "How to build and maintain an emergency fund for financial security.",
    content: "# Emergency Fund Essentials\n\nAn emergency fund is your financial safety net designed to cover unexpected expenses...",
    category: "saving",
    status: "published",
    author: "admin-user-123",
    publishedAt: "2025-07-28T09:10:00Z",
    updatedAt: "2025-07-30T15:45:00Z",
    readTime: 7,
    featured: false,
  },
};

const mockUsers: Record<string, any> = {
  "admin-user-123": {
    id: "admin-user-123",
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "admin",
    createdAt: "2025-01-01T00:00:00Z",
  },
  "author-user-456": {
    id: "author-user-456",
    email: "author@example.com",
    displayName: "Author User",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=author",
    role: "author",
    createdAt: "2025-01-15T00:00:00Z",
  },
};
