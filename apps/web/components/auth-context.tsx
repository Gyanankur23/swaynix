"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

// ── Make.com Webhook for Welcome Emails ──────────────────────────────
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/k69woaycvnll1j5fk8inotl68oolevpr";

const sendEmail = async (userEmail: string, userName: string, type: "welcome" | "welcome-back"): Promise<void> => {
  console.log(`📧 Sending ${type} email to:`, userEmail);
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, name: userName, type }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    console.log(`✅ ${type} email sent successfully`);
  } catch (error) {
    console.error(`❌ Failed to send ${type} email:`, error);
  }
};

// Track users who have received emails this session
const emailedUsers = { welcome: new Set<string>(), welcomeBack: new Set<string>() };

const BUSINESS_DOMAINS = [
  { domain: "decathlon.com", name: "Decathlon India", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Decathlon_logo.svg/2560px-Decathlon_logo.svg.png", color: "#0072bc" },
  { domain: "partner.com", name: "Swaynix Partner", logo: "/partner_logo.png", color: "#f97316" },
];

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
  interests?: string[];
  mfaEnabled?: boolean;
  savedPosts?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  author: string;
  authorHandle?: string;
  authorAvatar: string;
  content: string;
  time: string;
  likes: number;
  likedBy: string[];
}

export interface Post {
  id: string;
  userId: string;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  community: string;
  content: string;
  image?: string;
  likes: number;
  likedBy: string[];
  comments: number;
  commentsList: Comment[];
  shares: number;
  sharedBy: string[];
  time: string;
  createdAt: number;
  tags?: string[];
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
  link: string;
  cta: string;
  likes: number;
  comments: number;
  discount: string;
  impressions: number;
  clicks: number;
  revenue: number;
  status: "active" | "paused" | "ended";
  createdAt: number;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "join" | "mention" | "share";
  fromUser: string;
  fromAvatar: string;
  message: string;
  postId?: string;
  read: boolean;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  signup: (userData: Omit<User, 'id' | 'role' | 'avatar' | 'level'>) => void;
  logout: () => void;
  posts: Post[];
  addPost: (content: string, image?: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  sharePost: (postId: string) => void;
  ads: Ad[];
  addAd: (title: string, description: string, image: string, price: number, link: string) => void;
  hasLikedPost: (postId: string) => boolean;
  hasSharedPost: (postId: string) => boolean;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationCount: number;
  connections: string[]; // user IDs the current user follows
  toggleConnection: (userId: string, userName: string) => void;
  joinedCohorts: string[];
  toggleCohort: (cohortId: string, cohortName: string) => void;
  toggleMFA: () => void;
  toggleFavorite: (postId: string) => void;
  isFavorite: (postId: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  signup: () => {},
  logout: () => {},
  posts: [],
  addPost: (content: string, image?: string) => {},
  deletePost: () => {},
  likePost: () => {},
  addComment: () => {},
  likeComment: () => {},
  sharePost: () => {},
  ads: [],
  addAd: (title: string, description: string, image: string, price: number, link: string) => {},
  hasLikedPost: () => false,
  hasSharedPost: () => false,
  notifications: [],
  markNotificationRead: () => {},
  markAllNotificationsRead: () => {},
  unreadNotificationCount: 0,
  connections: [],
  toggleConnection: () => {},
  joinedCohorts: [],
  toggleCohort: () => {},
  toggleMFA: () => {},
  toggleFavorite: () => {},
  isFavorite: () => false,
});

// ─── Default seed data ──────────────────────────────────────────────────────

const DEFAULT_POSTS: Post[] = [
  {
    id: "p1",
    userId: "user-1",
    author: "Rohan Gupta",
    authorHandle: "rohan_codes",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    community: "Code Mumbai",
    content: "Just shipped a new feature using Next.js 15 Server Actions! The performance gains are incredible. Anyone else experimenting with the new App Router? 🚀",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000",
    likes: 45,
    likedBy: [],
    comments: 12,
    commentsList: [
      {
        id: "c1-1",
        userId: "user-5",
        author: "Sanya Patel",
        authorHandle: "sanya_dev",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
        content: "This is amazing! I tried it last week and the caching is so much better 🚀",
        time: "2h ago",
        likes: 5,
        likedBy: []
      },
      {
        id: "c1-2",
        userId: "user-6",
        author: "Aditya Joshi",
        authorHandle: "aditya_js",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
        content: "How does it compare to traditional API routes? Curious about migration efforts.",
        time: "1h ago",
        likes: 3,
        likedBy: []
      }
    ],
    shares: 3,
    sharedBy: [],
    time: "2h ago",
    createdAt: Date.now() - 7200000,
    tags: ["Technology", "React"]
  },
  {
    id: "p2",
    userId: "user-2",
    author: "Ishita Roy",
    authorHandle: "ishita_travels",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    community: "Travel India",
    content: "Just reached Manali! The weather is amazing and the views are breathtaking. Highly recommend visiting this time of the year. 🏔️❄️",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000",
    likes: 342,
    likedBy: [],
    comments: 24,
    commentsList: [
      {
        id: "c2-1",
        userId: "user-7",
        author: "Vikram Singh",
        authorHandle: "vikram_vlogs",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        content: "Manali is gorgeous! Enjoy your trip.",
        time: "3h ago",
        likes: 15,
        likedBy: []
      }
    ],
    shares: 12,
    sharedBy: [],
    time: "5h ago",
    createdAt: Date.now() - 18000000,
    tags: ["Travel"]
  }
];

const DEFAULT_ADS: Ad[] = [
  {
    id: "ad-decathlon-1",
    brand: "Decathlon India",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Decathlon_logo.svg/2560px-Decathlon_logo.svg.png",
    title: "Summer Fitness Sale - Up to 40% Off",
    description: "Get ready for summer with our biggest fitness sale! Premium running shoes, yoga mats, and gym equipment.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000",
    price: 2999,
    originalPrice: 4999,
    discount: "40%",
    link: "https://www.decathlon.in/",
    cta: "Shop Now",
    likes: 4500,
    comments: 120,
    impressions: 120000,
    clicks: 8500,
    revenue: 255000,
    status: "active",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "ad-decathlon-2",
    brand: "Decathlon India",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Decathlon_logo.svg/2560px-Decathlon_logo.svg.png",
    title: "Football Collection 2024",
    description: "Pro-grade football boots and kits now available. Master the field with Kipsta Gear.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000",
    price: 1999,
    originalPrice: 2499,
    discount: "20%",
    link: "https://www.decathlon.in/football-18545?id=18545&type=c",
    cta: "Gear Up",
    likes: 3200,
    comments: 85,
    impressions: 85000,
    clicks: 4200,
    revenue: 145000,
    status: "active",
    createdAt: Date.now() - 172800000,
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "like",
    fromUser: "Rohan Gupta",
    fromAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    message: "liked your post about the Kerala trip",
    postId: "p4",
    read: false,
    createdAt: Date.now() - 1800000,
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS);
  const [ads, setAds] = useState<Ad[]>(DEFAULT_ADS);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [connections, setConnections] = useState<string[]>([]);
  const [joinedCohorts, setJoinedCohorts] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("auth_user");
      const savedPosts = localStorage.getItem("swaynix_posts");
      const savedAds = localStorage.getItem("swaynix_ads");
      const savedNotifications = localStorage.getItem("swaynix_notifications");
      const savedConnections = localStorage.getItem("swaynix_connections");
      const savedCohorts = localStorage.getItem("swaynix_cohorts");

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedPosts) {
        const customPosts: Post[] = JSON.parse(savedPosts);
        const defaultIds = new Set(DEFAULT_POSTS.map((p) => p.id));
        const onlyCustom = customPosts.filter((p) => !defaultIds.has(p.id));
        setPosts([...onlyCustom, ...DEFAULT_POSTS]);
      }
      if (savedAds) {
        const customAds: Ad[] = JSON.parse(savedAds);
        const defaultIds = new Set(DEFAULT_ADS.map((a) => a.id));
        const onlyCustom = customAds.filter((a) => !defaultIds.has(a.id));
        setAds([...onlyCustom, ...DEFAULT_ADS]);
      }
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
      if (savedConnections) setConnections(JSON.parse(savedConnections));
      if (savedCohorts) setJoinedCohorts(JSON.parse(savedCohorts));
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  const persistPosts = useCallback((updated: Post[]) => {
    const defaultIds = new Set(DEFAULT_POSTS.map((p) => p.id));
    const customPosts = updated.filter((p) => !defaultIds.has(p.id));
    localStorage.setItem("swaynix_posts", JSON.stringify(customPosts));
  }, []);

  const pushNotification = useCallback((n: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newN: Notification = { ...n, id: `notif-${Date.now()}`, createdAt: Date.now(), read: false };
    setNotifications((prev) => {
      const updated = [newN, ...prev];
      localStorage.setItem("swaynix_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  }, []);

  const signup = useCallback((userData: Omit<User, 'id' | 'role' | 'avatar' | 'level'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: "member",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      level: 1,
      handle: userData.handle || userData.name.toLowerCase().replace(/\s/g, "_"),
      savedPosts: [],
      joinDate: new Date().toISOString(),
      interests: userData.interests || []
    };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  }, []);

  const toggleFavorite = useCallback((postId: string) => {
    if (!user) return;
    const updatedSaved = user.savedPosts?.includes(postId)
      ? user.savedPosts.filter(id => id !== postId)
      : [...(user.savedPosts || []), postId];
    const updatedUser = { ...user, savedPosts: updatedSaved };
    setUser(updatedUser);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  }, [user]);

  const isFavorite = useCallback((postId: string) => {
    return user?.savedPosts?.includes(postId) || false;
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  const addPost = useCallback((content: string, image?: string) => {
    if (!user) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: user.id,
      author: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar || "",
      community: "General",
      content,
      image,
      likes: 0,
      likedBy: [],
      comments: 0,
      commentsList: [],
      shares: 0,
      sharedBy: [],
      time: "Just now",
      createdAt: Date.now(),
      tags: ["General"]
    };
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      persistPosts(updated);
      return updated;
    });
  }, [user, persistPosts]);

  const deletePost = useCallback((postId: string) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      persistPosts(updated);
      return updated;
    });
  }, [persistPosts]);

  const likePost = useCallback((postId: string) => {
    if (!user) return;
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likedBy.includes(user.id);
        return {
          ...p,
          likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
          likedBy: alreadyLiked ? p.likedBy.filter((id) => id !== user.id) : [...p.likedBy, user.id],
        };
      });
      persistPosts(updated);
      return updated;
    });
  }, [user, persistPosts]);

  const hasLikedPost = useCallback((postId: string) => {
    if (!user) return false;
    const post = posts.find((p) => p.id === postId);
    return post ? post.likedBy.includes(user.id) : false;
  }, [user, posts]);

  const sharePost = useCallback((postId: string) => {
    if (!user) return;
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.sharedBy.includes(user.id)) return p;
        return { ...p, shares: p.shares + 1, sharedBy: [...p.sharedBy, user.id] };
      });
      persistPosts(updated);
      return updated;
    });
  }, [user, persistPosts]);

  const hasSharedPost = useCallback((postId: string) => {
    if (!user) return false;
    const post = posts.find((p) => p.id === postId);
    return post ? post.sharedBy.includes(user.id) : false;
  }, [user, posts]);

  const addComment = useCallback((postId: string, content: string) => {
    if (!user) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user.id,
      author: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar || "",
      content,
      time: "Just now",
      likes: 0,
      likedBy: [],
    };
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, comments: p.comments + 1, commentsList: [...p.commentsList, newComment] };
      });
      persistPosts(updated);
      return updated;
    });
  }, [user, persistPosts]);

  const likeComment = useCallback((postId: string, commentId: string) => {
    if (!user) return;
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsList: p.commentsList.map((c) => {
            if (c.id !== commentId) return c;
            const alreadyLiked = c.likedBy.includes(user.id);
            return {
              ...c,
              likes: alreadyLiked ? c.likes - 1 : c.likes + 1,
              likedBy: alreadyLiked ? c.likedBy.filter((id) => id !== user.id) : [...c.likedBy, user.id],
            };
          }),
        };
      });
      persistPosts(updated);
      return updated;
    });
  }, [user, persistPosts]);

  const addAd = useCallback((title: string, description: string, image: string, price: number, link: string) => {
    if (!user) return;
    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      brand: user.name,
      brandLogo: user.avatar || "",
      title, description, image, price, originalPrice: price * 1.2, link, cta: "Shop Now",
      likes: 0, comments: 0, discount: "20%", impressions: 0, clicks: 0, revenue: 0, status: "active", createdAt: Date.now()
    };
    setAds((prev) => {
      const updated = [newAd, ...prev];
      localStorage.setItem("swaynix_ads", JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem("swaynix_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("swaynix_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const toggleConnection = useCallback((userId: string, userName: string) => {
    setConnections((prev) => {
      const isFollowing = prev.includes(userId);
      const updated = isFollowing ? prev.filter((id) => id !== userId) : [...prev, userId];
      localStorage.setItem("swaynix_connections", JSON.stringify(updated));
      if (!isFollowing) pushNotification({ type: "follow", fromUser: userName, fromAvatar: "", message: `You are now connected with ${userName}` });
      return updated;
    });
  }, [pushNotification]);

  const toggleCohort = useCallback((cohortId: string, cohortName: string) => {
    setJoinedCohorts((prev) => {
      const isJoined = prev.includes(cohortId);
      const updated = isJoined ? prev.filter((id) => id !== cohortId) : [...prev, cohortId];
      localStorage.setItem("swaynix_cohorts", JSON.stringify(updated));
      if (!isJoined) pushNotification({ type: "join", fromUser: "Swaynix", fromAvatar: "", message: `You joined ${cohortName} 🎉` });
      return updated;
    });
  }, [pushNotification]);

  const toggleMFA = useCallback(() => {
    if (!user) return;
    const updatedUser = { ...user, mfaEnabled: !user.mfaEnabled };
    setUser(updatedUser);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  }, [user]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{
        user, isLoggedIn: !!user, login, signup, logout, posts, addPost, deletePost, likePost, sharePost, addComment, likeComment,
        hasLikedPost, hasSharedPost, ads, addAd, notifications, markNotificationRead, markAllNotificationsRead,
        unreadNotificationCount, connections, toggleConnection, joinedCohorts, toggleCohort, toggleMFA,
        toggleFavorite, isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}