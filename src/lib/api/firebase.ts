// This file contains Firebase configuration and initialization
// In a real app, you would use actual Firebase credentials

interface PostData {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  status?: 'draft' | 'published' | 'archived' | 'deleted';
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  author?: string | {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  featuredImage?: string;
  coverImage?: string;
  tags?: string[];
  featured?: boolean;
  readTime?: number;
  [key: string]: unknown;
}

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Mock data
const mockPosts: Record<string, PostData> = {
  "post-1": {
    id: "post-1",
    title: "Getting Started with Personal Finance",
    slug: "getting-started-personal-finance",
    excerpt: "Learn the fundamentals of managing your money effectively.",
    content: "# Getting Started with Personal Finance\n\nManaging your personal finances...",
    category: "basics",
    status: "published",
    publishedAt: "2025-01-15T10:00:00Z",
    createdAt: "2025-01-10T14:30:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    author: "admin-user-123",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
    tags: ["finance", "basics", "money-management"],
    featured: true,
    readTime: 5,
  },
  "post-2": {
    id: "post-2", 
    title: "Investment Strategies for Beginners",
    slug: "investment-strategies-beginners",
    excerpt: "Discover simple investment strategies to grow your wealth.",
    content: "# Investment Strategies for Beginners\n\nInvesting can seem intimidating...",
    category: "investing",
    status: "published",
    publishedAt: "2025-01-20T09:00:00Z",
    createdAt: "2025-01-18T16:45:00Z",
    updatedAt: "2025-01-20T09:00:00Z",
    author: "admin-user-123",
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    tags: ["investing", "stocks", "portfolio"],
    featured: false,
    readTime: 8,
  },
};

const mockUsers: Record<string, FirebaseUser> = {
  "admin-user-123": {
    uid: "admin-user-123",
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  "author-user-456": {
    uid: "author-user-456",
    email: "author@example.com",
    displayName: "Author User",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=author",
  },
};

// Mock Firebase Auth functions
export const auth = {
  currentUser: {
    uid: "admin-user-123",
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email === "admin@example.com" && password === "password") {
      return {
        user: {
          uid: "admin-user-123",
          email: "admin@example.com",
          displayName: "Admin User",
          photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        },
      };
    }
    
    throw new Error("Invalid credentials");
  },
  signOut: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Promise.resolve();
  },
};

export const db = {
  collection: (collectionName: string) => ({
    get: async () => {
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
      
      return { docs: [] };
    },
    doc: (id: string) => ({
      get: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts" && mockPosts[id]) {
          return {
            id,
            data: () => mockPosts[id],
            exists: true,
          };
        }
        
        if (collectionName === "users" && mockUsers[id]) {
          return {
            id,
            data: () => mockUsers[id],
            exists: true,
          };
        }
        
        return {
          id,
          data: () => null,
          exists: false,
        };
      },
      set: async (data: PostData) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts") {
          mockPosts[id] = data;
        }
        
        if (collectionName === "users") {
          mockUsers[id] = data as unknown as FirebaseUser;
        }
        
        return Promise.resolve();
      },
      update: async (data: Partial<PostData>) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        if (collectionName === "posts" && mockPosts[id]) {
          mockPosts[id] = { ...mockPosts[id], ...data };
        }
        
        if (collectionName === "users" && mockUsers[id]) {
          mockUsers[id] = { ...mockUsers[id], ...data as Partial<FirebaseUser> };
        }
        
        return Promise.resolve();
      },
      delete: async () => {
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
    add: async (data: PostData | FirebaseUser) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const id = `${collectionName}-${Date.now()}`;
      
      if (collectionName === "posts") {
        mockPosts[id] = data as PostData;
      }
      
      if (collectionName === "users") {
        mockUsers[id] = data as FirebaseUser;
      }
      
      return {
        id,
      };
    },
    where: (field: string, operator: string, value: string | number | boolean) => {
      const createQueryBuilder = (filters: Array<{field: string, operator: string, value: string | number | boolean}>) => ({
        get: async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          if (collectionName === "posts") {
            let filteredPosts = Object.entries(mockPosts);
            
            // Apply all filters
            for (const filter of filters) {
              filteredPosts = filteredPosts.filter(([, post]) => {
                const fieldValue = post[filter.field as keyof PostData];
                if (filter.operator === "==") {
                  return fieldValue === filter.value;
                } else if (filter.operator === "!=") {
                  return fieldValue !== filter.value;
                }
                return false;
              });
            }
            
            return {
              docs: filteredPosts.map(([id, data]) => ({
                id,
                data: () => data,
                exists: true,
              })),
            };
          }
          
          return { docs: [] };
        },
        where: (nextField: string, nextOperator: string, nextValue: string | number | boolean) => {
          return createQueryBuilder([...filters, {field: nextField, operator: nextOperator, value: nextValue}]);
        },
        orderBy: (orderField: string, direction: 'asc' | 'desc' = 'asc') => ({
          get: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            
            if (collectionName === "posts") {
              let filteredPosts = Object.entries(mockPosts);
              
              // Apply all filters
              for (const filter of filters) {
                filteredPosts = filteredPosts.filter(([, post]) => {
                  const fieldValue = post[filter.field as keyof PostData];
                  if (filter.operator === "==") {
                    return fieldValue === filter.value;
                  } else if (filter.operator === "!=") {
                    return fieldValue !== filter.value;
                  }
                  return false;
                });
              }
              
              // Apply sorting
              filteredPosts.sort(([, a], [, b]) => {
                const aValue = a[orderField as keyof PostData];
                const bValue = b[orderField as keyof PostData];
                
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                  return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return 0;
              });
              
              return {
                docs: filteredPosts.map(([id, data]) => ({
                  id,
                  data: () => data,
                  exists: true,
                })),
              };
            }
            
            return { docs: [] };
          },
          limit: (limitCount: number) => ({
            get: async () => {
              await new Promise((resolve) => setTimeout(resolve, 300));
              
              if (collectionName === "posts") {
                let filteredPosts = Object.entries(mockPosts);
                
                // Apply all filters
                for (const filter of filters) {
                  filteredPosts = filteredPosts.filter(([, post]) => {
                    const fieldValue = post[filter.field as keyof PostData];
                    if (filter.operator === "==") {
                      return fieldValue === filter.value;
                    } else if (filter.operator === "!=") {
                      return fieldValue !== filter.value;
                    }
                    return false;
                  });
                }
                
                // Apply sorting
                filteredPosts.sort(([, a], [, b]) => {
                  const aValue = a[orderField as keyof PostData];
                  const bValue = b[orderField as keyof PostData];
                  
                  if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                  }
                  return 0;
                });
                
                return {
                  docs: filteredPosts.slice(0, limitCount).map(([id, data]) => ({
                    id,
                    data: () => data,
                    exists: true,
                  })),
                };
              }
              
              return { docs: [] };
            },
          }),
        }),
      });
      
      return createQueryBuilder([{field, operator, value}]);
    },
    orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => ({
      limit: (limitCount: number) => ({
        get: async () => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          if (collectionName === "posts") {
            const posts = Object.entries(mockPosts);
            
            posts.sort(([, a], [, b]) => {
              const aValue = a[field as keyof PostData];
              const bValue = b[field as keyof PostData];
              
              if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
              }
              return 0;
            });
            
            return {
              docs: posts.slice(0, limitCount).map(([id, data]) => ({
                id,
                data: () => data,
                exists: true,
              })),
            };
          }
          
          return { docs: [] };
        },
      }),
    }),
  }),
};

// Mock Storage functions
export const uploadFile = async (file: File, path: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `https://firebasestorage.googleapis.com/v0/b/mock-bucket/o/${path}?alt=media`;
};

export const storage = {
  ref: (path: string) => ({
    put: async () => {
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
      await new Promise((resolve) => setTimeout(resolve, 300));
      return Promise.resolve();
    },
  }),
};

// Export firestore for compatibility
export const firestore = db;
