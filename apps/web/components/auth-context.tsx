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
  likedBy: string[]; // track who liked
  comments: number;
  commentsList: Comment[];
  shares: number;
  sharedBy: string[]; // track who shared
  time: string;
  createdAt: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  time: string;
  createdAt: number;
  likes: number;
  likedBy: string[];
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
  impressions: number;
  clicks: number;
  revenue: number;
  status: "active" | "scheduled" | "paused";
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
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  posts: Post[];
  addPost: (post: Omit<Post, "id" | "likes" | "likedBy" | "comments" | "commentsList" | "shares" | "sharedBy" | "time" | "createdAt">) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  sharePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  hasLikedPost: (postId: string) => boolean;
  hasSharedPost: (postId: string) => boolean;
  ads: Ad[];
  addAd: (ad: Omit<Ad, "id" | "likes" | "comments" | "impressions" | "clicks" | "revenue" | "status" | "createdAt">) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationCount: number;
  connections: string[]; // user IDs the current user follows
  toggleConnection: (userId: string, userName: string) => void;
  joinedCohorts: string[];
  toggleCohort: (cohortId: string, cohortName: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  posts: [],
  addPost: () => {},
  deletePost: () => {},
  likePost: () => {},
  sharePost: () => {},
  addComment: () => {},
  likeComment: () => {},
  hasLikedPost: () => false,
  hasSharedPost: () => false,
  ads: [],
  addAd: () => {},
  notifications: [],
  markNotificationRead: () => {},
  markAllNotificationsRead: () => {},
  unreadNotificationCount: 0,
  connections: [],
  toggleConnection: () => {},
  joinedCohorts: [],
  toggleCohort: () => {},
});

// ─── Default seed data ──────────────────────────────────────────────────────

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
    likedBy: [],
    comments: 12,
    commentsList: [
      {
        id: "c1-1",
        postId: "p1",
        author: "Sanya Patel",
        authorHandle: "sanya_dev",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        text: "This is amazing! I tried it last week and the caching is so much better 🚀",
        time: "2h ago",
        createdAt: Date.now() - 7200000,
        likes: 5,
        likedBy: [],
      },
      {
        id: "c1-2",
        postId: "p1",
        author: "Aditya Joshi",
        authorHandle: "aditya_js",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        text: "How does it compare to traditional API routes? Curious about migration efforts.",
        time: "1h ago",
        createdAt: Date.now() - 3600000,
        likes: 3,
        likedBy: [],
      },
    ],
    shares: 3,
    sharedBy: [],
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
    likedBy: [],
    comments: 34,
    commentsList: [
      {
        id: "c2-1",
        postId: "p2",
        author: "Vikram Reddy",
        authorHandle: "vikram_beats",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        text: "The entire album is masterpiece level! 🔥",
        time: "4h ago",
        createdAt: Date.now() - 14400000,
        likes: 8,
        likedBy: [],
      },
    ],
    shares: 8,
    sharedBy: [],
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
    likedBy: [],
    comments: 67,
    commentsList: [
      {
        id: "c3-1",
        postId: "p3",
        author: "Priya Sharma",
        authorHandle: "priya_cricket",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        text: "Best match of the season! That six in the final over was incredible! 🏆",
        time: "6h ago",
        createdAt: Date.now() - 21600000,
        likes: 15,
        likedBy: [],
      },
      {
        id: "c3-2",
        postId: "p3",
        author: "Rohan Gupta",
        authorHandle: "rohan_codes",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        text: "I missed it! Watching the highlights now 😅",
        time: "5h ago",
        createdAt: Date.now() - 18000000,
        likes: 4,
        likedBy: [],
      },
      {
        id: "c3-3",
        postId: "p3",
        author: "Ananya Singh",
        authorHandle: "ananya_sports",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        text: "India's bowling was exceptional! 🔥",
        time: "5h ago",
        createdAt: Date.now() - 18000000,
        likes: 7,
        likedBy: [],
      },
    ],
    shares: 15,
    sharedBy: [],
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
    likedBy: [],
    comments: 23,
    commentsList: [
      {
        id: "c4-1",
        postId: "p4",
        author: "Arjun Mehta",
        authorHandle: "arjun_travels",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        text: "Check out the houseboat stays at Punnamada Lake! Best experience ever 🛶",
        time: "8h ago",
        createdAt: Date.now() - 28800000,
        likes: 12,
        likedBy: [],
      },
    ],
    shares: 5,
    sharedBy: [],
    time: "8h ago",
    createdAt: Date.now() - 28800000,
  },
];

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
    impressions: 48200,
    clicks: 3140,
    revenue: 94200,
    status: "active",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "ad-2",
    brand: "Zomato",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    title: "Order Now — 50% off your first 3 orders",
    description: "Hungry? Get your favourite meals delivered in 30 minutes or less. Use code SWAYNIX50.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    price: 0,
    originalPrice: 0,
    discount: "50%",
    link: "https://zomato.com",
    cta: "Order Now",
    likes: 2100,
    comments: 144,
    impressions: 72000,
    clicks: 5800,
    revenue: 116000,
    status: "active",
    createdAt: Date.now() - 172800000,
  },
  {
    id: "ad-3",
    brand: "Myntra",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Myntra_logo.svg/2560px-Myntra_logo.svg.png",
    title: "End of Reason Sale — Fashion at 60% Off",
    description: "Trending styles, top brands — all at unbeatable prices. Shop 5000+ new arrivals this season.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    price: 0,
    originalPrice: 0,
    discount: "60%",
    link: "https://myntra.com",
    cta: "Shop the Sale",
    likes: 3400,
    comments: 210,
    impressions: 91000,
    clicks: 7200,
    revenue: 180000,
    status: "active",
    createdAt: Date.now() - 259200000,
  },
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "like",
    fromUser: "Rohan Gupta",
    fromAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    message: "liked your post about the Kerala trip",
    postId: "p4",
    read: false,
    createdAt: Date.now() - 1800000,
  },
  {
    id: "n2",
    type: "comment",
    fromUser: "Neha Kumar",
    fromAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    message: "commented on your post: \"This looks amazing! 🌴\"",
    postId: "p4",
    read: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: "n3",
    type: "follow",
    fromUser: "Vikram Singh",
    fromAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    message: "started following you",
    read: true,
    createdAt: Date.now() - 7200000,
  },
  {
    id: "n4",
    type: "join",
    fromUser: "Priya Sharma",
    fromAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    message: "joined your cohort Travel India 🌏",
    read: true,
    createdAt: Date.now() - 14400000,
  },
];

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS);
  const [ads, setAds] = useState<Ad[]>(DEFAULT_ADS);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [connections, setConnections] = useState<string[]>([]);
  const [joinedCohorts, setJoinedCohorts] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── hydrate from localStorage ──────────────────────────────────────────
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
        // Merge: custom first, then defaults (no duplicates)
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

      if (savedNotifications) {
        const saved: Notification[] = JSON.parse(savedNotifications);
        setNotifications(saved);
      }

      if (savedConnections) setConnections(JSON.parse(savedConnections));
      if (savedCohorts) setJoinedCohorts(JSON.parse(savedCohorts));
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // ── persist posts (custom only) whenever posts change ─────────────────
  const persistPosts = useCallback((updated: Post[]) => {
    const defaultIds = new Set(DEFAULT_POSTS.map((p) => p.id));
    const customPosts = updated.filter((p) => !defaultIds.has(p.id));
    localStorage.setItem("swaynix_posts", JSON.stringify(customPosts));
  }, []);

  // ── helper: push a notification ───────────────────────────────────────
  const pushNotification = useCallback((n: Omit<Notification, "id" | "createdAt" | "read">) => {
    const newN: Notification = {
      ...n,
      id: `notif-${Date.now()}`,
      createdAt: Date.now(),
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newN, ...prev];
      localStorage.setItem("swaynix_notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ── auth ───────────────────────────────────────────────────────────────
  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth_user");
  }, []);

  // ── posts ──────────────────────────────────────────────────────────────
  const addPost = useCallback(
    (postData: Omit<Post, "id" | "likes" | "likedBy" | "comments" | "commentsList" | "shares" | "sharedBy" | "time" | "createdAt">) => {
      const newPost: Post = {
        ...postData,
        id: `post-${Date.now()}`,
        likes: 0,
        likedBy: [],
        comments: 0,
        commentsList: [],
        shares: 0,
        sharedBy: [],
        time: "Just now",
        createdAt: Date.now(),
      };
      setPosts((prev) => {
        const updated = [newPost, ...prev];
        persistPosts(updated);
        return updated;
      });
    },
    [persistPosts]
  );

  const deletePost = useCallback(
    (postId: string) => {
      setPosts((prev) => {
        const updated = prev.filter((p) => p.id !== postId);
        persistPosts(updated);
        return updated;
      });
    },
    [persistPosts]
  );

  const likePost = useCallback(
    (postId: string) => {
      if (!user) return;
      setPosts((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== postId) return p;
          const alreadyLiked = p.likedBy.includes(user.id);
          return {
            ...p,
            likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
            likedBy: alreadyLiked
              ? p.likedBy.filter((id) => id !== user.id)
              : [...p.likedBy, user.id],
          };
        });
        persistPosts(updated);
        return updated;
      });
    },
    [user, persistPosts]
  );

  const hasLikedPost = useCallback(
    (postId: string) => {
      if (!user) return false;
      const post = posts.find((p) => p.id === postId);
      return post ? post.likedBy.includes(user.id) : false;
    },
    [user, posts]
  );

  const sharePost = useCallback(
    (postId: string) => {
      if (!user) return;
      setPosts((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== postId) return p;
          const alreadyShared = p.sharedBy.includes(user.id);
          if (alreadyShared) return p; // can't un-share
          return {
            ...p,
            shares: p.shares + 1,
            sharedBy: [...p.sharedBy, user.id],
          };
        });
        persistPosts(updated);
        return updated;
      });
    },
    [user, persistPosts]
  );

  const hasSharedPost = useCallback(
    (postId: string) => {
      if (!user) return false;
      const post = posts.find((p) => p.id === postId);
      return post ? post.sharedBy.includes(user.id) : false;
    },
    [user, posts]
  );

  const addComment = useCallback(
    (postId: string, text: string) => {
      if (!user) return;
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId,
        author: user.name,
        authorHandle: user.handle,
        authorAvatar: user.avatar || "",
        text,
        time: "Just now",
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
      };
      setPosts((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== postId) return p;
          return {
            ...p,
            comments: p.comments + 1,
            commentsList: [...p.commentsList, newComment],
          };
        });
        persistPosts(updated);
        return updated;
      });
    },
    [user, persistPosts]
  );

  const likeComment = useCallback(
    (postId: string, commentId: string) => {
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
                likedBy: alreadyLiked
                  ? c.likedBy.filter((id) => id !== user.id)
                  : [...c.likedBy, user.id],
              };
            }),
          };
        });
        persistPosts(updated);
        return updated;
      });
    },
    [user, persistPosts]
  );

  // ── ads ────────────────────────────────────────────────────────────────
  const addAd = useCallback(
    (adData: Omit<Ad, "id" | "likes" | "comments" | "impressions" | "clicks" | "revenue" | "status" | "createdAt">) => {
      const newAd: Ad = {
        ...adData,
        id: `ad-${Date.now()}`,
        likes: 0,
        comments: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
        status: "active",
        createdAt: Date.now(),
      };
      setAds((prev) => {
        const defaultIds = new Set(DEFAULT_ADS.map((a) => a.id));
        const customAds = prev.filter((a) => !defaultIds.has(a.id));
        const updated = [newAd, ...customAds];
        localStorage.setItem("swaynix_ads", JSON.stringify(updated));
        return [newAd, ...DEFAULT_ADS];
      });
    },
    []
  );

  // ── notifications ──────────────────────────────────────────────────────
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

  // ── connections (follow/unfollow) ──────────────────────────────────────
  const toggleConnection = useCallback(
    (userId: string, userName: string) => {
      setConnections((prev) => {
        const isFollowing = prev.includes(userId);
        const updated = isFollowing
          ? prev.filter((id) => id !== userId)
          : [...prev, userId];
        localStorage.setItem("swaynix_connections", JSON.stringify(updated));

        if (!isFollowing) {
          pushNotification({
            type: "follow",
            fromUser: userName,
            fromAvatar: "",
            message: `You are now connected with ${userName}`,
          });
        }
        return updated;
      });
    },
    [pushNotification]
  );

  // ── cohorts ────────────────────────────────────────────────────────────
  const toggleCohort = useCallback(
    (cohortId: string, cohortName: string) => {
      setJoinedCohorts((prev) => {
        const isJoined = prev.includes(cohortId);
        const updated = isJoined
          ? prev.filter((id) => id !== cohortId)
          : [...prev, cohortId];
        localStorage.setItem("swaynix_cohorts", JSON.stringify(updated));

        if (!isJoined) {
          pushNotification({
            type: "join",
            fromUser: "Swaynix",
            fromAvatar: "",
            message: `You joined ${cohortName} 🎉`,
          });
        }
        return updated;
      });
    },
    [pushNotification]
  );

  // ── loading gate ───────────────────────────────────────────────────────
  // Don't block children rendering during loading to avoid hydration mismatch
  // Show loading overlay instead
  const isLoading = !isLoaded;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        posts,
        addPost,
        deletePost,
        likePost,
        sharePost,
        addComment,
        likeComment,
        hasLikedPost,
        hasSharedPost,
        ads,
        addAd,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationCount,
        connections,
        toggleConnection,
        joinedCohorts,
        toggleCohort,
      }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
              <span className="text-white font-black text-2xl">S</span>
            </div>
            <p className="text-muted-foreground">Loading Swaynix...</p>
          </div>
        </div>
      )}
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