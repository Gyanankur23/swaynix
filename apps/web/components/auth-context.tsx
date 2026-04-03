"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface BusinessConfig {
  domain: string;
  name: string;
  logo: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  handle: string;
  level: number;
  role: "member" | "admin" | "superadmin" | "business";
  businessConfig?: BusinessConfig;
  joinDate?: string;
  posts?: number;
  cohorts?: number;
  streak?: number;
  interactions?: number;
  communities?: string[];
  adsCreated?: number;
  totalReach?: number;
  clicks?: number;
  conversions?: number;
  revenue?: number;
}

export interface Post {
  id: string;
  userId: string;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  community: string;
  content: string;
  image?: string | null;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  createdAt: number;
}

export interface Ad {
  id: string;
  brand: string;
  brandLogo: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  link: string;
  cta: string;
  likes: number;
  comments: number;
  status: "active" | "scheduled" | "paused";
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  posts: Post[];
  addPost: (post: Omit<Post, "id" | "likes" | "comments" | "shares" | "time" | "createdAt">) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  ads: Ad[];
  addAd: (ad: Omit<Ad, "id" | "likes" | "comments" | "status" | "createdAt">) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  posts: [],
  addPost: () => {},
  deletePost: () => {},
  likePost: () => {},
  ads: [],
  addAd: () => {},
});

// Default posts for demo
const DEFAULT_POSTS: Post[] = [
  {
    id: "p1",
    userId: "user-1",
    author: "Rohan Gupta",
    authorHandle: "rohan_codes",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    community: "Code Mumbai",
    content: "Just shipped a new feature using Next.js 15 Server Actions! The performance gains are incredible. Anyone else experimenting with the new App Router? 🚀",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
    likes: 45,
    comments: 12,
    shares: 3,
    time: "2h ago",
    createdAt: Date.now() - 7200000,
  },
  {
    id: "p2",
    userId: "user-2",
    author: "Neha Kumar",
    authorHandle: "neha_music",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    community: "Bollywood Beats",
    content: "This new AR Rahman album is pure magic! 🎵 Which track is your favorite? I'm looping 'Veera Raja Veera' on repeat.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600",
    likes: 128,
    comments: 34,
    shares: 8,
    time: "4h ago",
    createdAt: Date.now() - 14400000,
  },
  {
    id: "p3",
    userId: "user-3",
    author: "Vikram Singh",
    authorHandle: "vikram_cricket",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    community: "Cricket Fans",
    content: "What a match yesterday! That last over had me on the edge of my seat. India really knows how to keep the tension alive! 🏏🇮🇳",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",
    likes: 256,
    comments: 67,
    shares: 15,
    time: "6h ago",
    createdAt: Date.now() - 21600000,
  },
  {
    id: "p4",
    userId: "user-4",
    author: "Priya Sharma",
    authorHandle: "priya_travels",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    community: "Travel India",
    content: "Kerala backwaters are calling! 🌴 Just booked my tickets for next weekend. If anyone has recommendations for hidden homestays in Alleppey, drop them below!",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    likes: 89,
    comments: 23,
    shares: 5,
    time: "8h ago",
    createdAt: Date.now() - 28800000,
  },
];

// Default ads for demo
const DEFAULT_ADS: Ad[] = [
  {
    id: "ad-1",
    brand: "Decathlon India",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Decathlon_logo.svg/2560px-Decathlon_logo.svg.png",
    title: "Summer Fitness Sale - Up to 40% Off",
    description: "Get ready for summer with our biggest fitness sale! Premium running shoes, yoga mats, and gym equipment.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
    price: 2999,
    originalPrice: 4999,
    discount: "40%",
    link: "https://decathlon.in",
    cta: "Shop Now",
    likes: 1240,
    comments: 89,
    status: "active",
    createdAt: Date.now() - 86400000,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS);
  const [ads, setAds] = useState<Ad[]>(DEFAULT_ADS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("auth_user");
      const savedPosts = localStorage.getItem("engagehub_posts");
      const savedAds = localStorage.getItem("engagehub_ads");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedPosts) {
        const customPosts: Post[] = JSON.parse(savedPosts);
        setPosts([...DEFAULT_POSTS, ...customPosts]);
      }
      if (savedAds) {
        const customAds: Ad[] = JSON.parse(savedAds);
        setAds([...DEFAULT_ADS, ...customAds]);
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  const addPost = useCallback((postData: Omit<Post, "id" | "likes" | "comments" | "shares" | "time" | "createdAt">) => {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      likes: 0,
      comments: 0,
      shares: 0,
      time: "Just now",
      createdAt: Date.now(),
    };

    setPosts(prev => {
      const customPosts = prev.filter(p => !DEFAULT_POSTS.find(dp => dp.id === p.id));
      const updated = [newPost, ...customPosts];
      localStorage.setItem("engagehub_posts", JSON.stringify(updated));
      return [newPost, ...DEFAULT_POSTS];
    });
  }, []);

  const deletePost = useCallback((postId: string) => {
    setPosts(prev => {
      const updated = prev.filter(p => p.id !== postId);
      const customPosts = updated.filter(p => !DEFAULT_POSTS.find(dp => dp.id === p.id));
      localStorage.setItem("engagehub_posts", JSON.stringify(customPosts));
      return updated;
    });
  }, []);

  const likePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  }, []);

  const addAd = useCallback((adData: Omit<Ad, "id" | "likes" | "comments" | "status" | "createdAt">) => {
    const newAd: Ad = {
      ...adData,
      id: `ad-${Date.now()}`,
      likes: 0,
      comments: 0,
      status: "active",
      createdAt: Date.now(),
    };

    setAds(prev => {
      const customAds = prev.filter(a => !DEFAULT_ADS.find(da => da.id === a.id));
      const updated = [newAd, ...customAds];
      localStorage.setItem("engagehub_ads", JSON.stringify(updated));
      return [newAd, ...DEFAULT_ADS];
    });
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <p className="text-muted-foreground">Loading Swaynix...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, posts, addPost, deletePost, likePost, ads, addAd }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
