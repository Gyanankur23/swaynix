"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Calendar, ArrowLeft, Hash, MessageSquare, Heart, Share2, MapPin, Sparkles, Check, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

// All cohorts data with Indian themes
const COHORTS_DATA: Record<string, any> = {
  "travel-india": {
    id: "travel-india",
    name: "Travel India",
    slug: "travel-india",
    description: "Discover hidden gems, share travel stories, and connect with fellow explorers across India. From the beaches of Goa to the mountains of Himachal, let's explore together!",
    member_count: 45600,
    color: "#FF6B9D",
    icon: "✈️",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    tags: ["Travel", "Backpacking", "Solo Travel", "Road Trips", "Hidden Gems"],
    location: "All India",
    admins: ["Priya Sharma", "Arjun Mehta"],
  },
  "code-mumbai": {
    id: "code-mumbai",
    name: "Code Mumbai",
    slug: "code-mumbai",
    description: "Mumbai's developer community. Weekly meetups, hackathons, and coding sessions. From React to Rust, all technologies welcome!",
    member_count: 12300,
    color: "#00D4FF",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    tags: ["Programming", "Web Dev", "Mobile", "AI/ML", "DevOps"],
    location: "Mumbai",
    admins: ["Rohan Gupta", "Sanya Patel"],
  },
  "bollywood-beats": {
    id: "bollywood-beats",
    name: "Bollywood Beats",
    slug: "bollywood-beats",
    description: "Desi music lovers unite! Share your playlists, discover indie artists, and discuss everything from classic Bollywood to modern fusion.",
    member_count: 78900,
    color: "#9D4EDD",
    icon: "🎵",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
    tags: ["Bollywood", "Indie Music", "Classical", "Fusion", "Playlists"],
    location: "All India",
    admins: ["Neha Kumar", "Vikram Reddy"],
  },
  "dance-bhangra": {
    id: "dance-bhangra",
    name: "Bhangra & Dance",
    slug: "dance-bhangra",
    description: "Punjabi beats and moves! Learn Bhangra, share dance videos, and connect with dancers across India. All dance forms welcome!",
    member_count: 23400,
    color: "#FF006E",
    icon: "💃",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800",
    tags: ["Bhangra", "Classical", "Hip Hop", "Contemporary", "Folk"],
    location: "Punjab & Worldwide",
    admins: ["Ananya Singh", "Karthik Iyer"],
  },
  "foodie-delhi": {
    id: "foodie-delhi",
    name: "Delhi Foodies",
    slug: "foodie-delhi",
    description: "From street food in Chandni Chowk to fine dining in South Delhi. Share reviews, recipes, and hidden food gems!",
    member_count: 56700,
    color: "#FB8500",
    icon: "🍳",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    tags: ["Street Food", "Recipes", "Reviews", "Cafe Hopping", "Cooking"],
    location: "Delhi NCR",
    admins: ["Divya Nair", "Rajesh Khanna"],
  },
  "shutterbugs": {
    id: "shutterbugs",
    name: "Indian Shutterbugs",
    slug: "shutterbugs",
    description: "Capture India's beauty through your lens. Share photos, get feedback, and join photo walks in your city.",
    member_count: 18900,
    color: "#38B000",
    icon: "📸",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
    tags: ["Photography", "Landscapes", "Portraits", "Street", "Mobile"],
    location: "All India",
    admins: ["Meera Chopra", "Aditya Joshi"],
  },
  "yoga-wellness": {
    id: "yoga-wellness",
    name: "Yoga & Wellness",
    slug: "yoga-wellness",
    description: "Mind, body & soul. Share yoga tips, meditation techniques, and wellness practices rooted in Indian tradition.",
    member_count: 34500,
    color: "#06FFB4",
    icon: "🧘",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    tags: ["Yoga", "Meditation", "Ayurveda", "Fitness", "Mental Health"],
    location: "All India",
    admins: ["Dr. Priya Patel", "Yogesh Kumar"],
  },
  "art-culture": {
    id: "art-culture",
    name: "Art & Culture",
    slug: "art-culture",
    description: "Traditional to contemporary. Showcase your art, discuss Indian culture, and connect with fellow artists.",
    member_count: 12300,
    color: "#C77DFF",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    tags: ["Painting", "Sculpture", "Digital Art", "Culture", "Heritage"],
    location: "All India",
    admins: ["Aarti Sharma", "Krishna Rao"],
  },
};

// Domain-specific posts generator for each community type
const generateCommunityPosts = (cohortId: string, cohortName: string, color: string) => {
  const domainPosts: Record<string, Array<{
    id: number;
    author: string;
    avatar: string;
    content: string;
    likes: number;
    comments: number;
    time: string;
    commentsList: Array<{id: string; author: string; text: string; time: string; likes: number}>;
  }>> = {
    "travel-india": [
      {
        id: 1,
        author: "Priya Sharma",
        avatar: "PS",
        content: "Just returned from a magical week in Kerala! The backwaters of Alleppey are absolutely breathtaking. Stayed at a traditional houseboat and woke up to misty mornings 🌴✨ Has anyone else experienced the monsoon magic there?",
        likes: 234,
        comments: 45,
        time: "2 hours ago",
        commentsList: [
          { id: "c1", author: "Arjun Mehta", text: "This is on my bucket list! 😍", time: "1h ago", likes: 12 },
          { id: "c2", author: "Vikram Reddy", text: "Best time to visit is September-October!", time: "45m ago", likes: 8 },
          { id: "c3", author: "Neha Kumar", text: "The food there is incredible 🍛", time: "30m ago", likes: 5 }
        ]
      },
      {
        id: 2,
        author: "Rohan Gupta",
        avatar: "RG",
        content: "Planning a road trip from Delhi to Himachal next weekend. Looking for offbeat places away from tourist crowds. Any hidden gems you'd recommend? 🏔️",
        likes: 156,
        comments: 32,
        time: "5 hours ago",
        commentsList: [
          { id: "c4", author: "Ananya Singh", text: "Tirthan Valley is pristine!", time: "4h ago", likes: 15 },
          { id: "c5", author: "Priya Sharma", text: "Check out Shangarh meadows! 🌲", time: "3h ago", likes: 9 }
        ]
      },
      {
        id: 3,
        author: "Ananya Singh",
        avatar: "AS",
        content: "Hosted a photowalk in Old Delhi yesterday with 30+ members! The architecture, the chaos, the colors - everything was picture perfect. Sharing some shots from Chandni Chowk 📸",
        likes: 567,
        comments: 89,
        time: "1 day ago",
        commentsList: [
          { id: "c6", author: "Vikram Reddy", text: "The paratha wali gali shots were amazing!", time: "20h ago", likes: 25 },
          { id: "c7", author: "Rohan Gupta", text: "When is the next one? Count me in! 🙋‍♂️", time: "18h ago", likes: 18 },
          { id: "c8", author: "Priya Sharma", text: "Love the spice market captures!", time: "15h ago", likes: 12 }
        ]
      }
    ],
    "code-mumbai": [
      {
        id: 1,
        author: "Rohan Desai",
        avatar: "RD",
        content: "Just shipped our new microservices architecture using Next.js 15 and Docker! The performance boost is insane - 40% faster load times. Happy to share our migration journey if anyone's interested 🚀",
        likes: 445,
        comments: 67,
        time: "3 hours ago",
        commentsList: [
          { id: "c1", author: "Sanya Patel", text: "Would love a blog post on this!", time: "2h ago", likes: 22 },
          { id: "c2", author: "Aditya Joshi", text: "How was the Docker learning curve?", time: "1h ago", likes: 15 },
          { id: "c3", author: "Meera Krishnan", text: "We did similar migration, happy to connect!", time: "45m ago", likes: 8 }
        ]
      },
      {
        id: 2,
        author: "Sanya Patel",
        avatar: "SP",
        content: "Anyone attending the React India Conference next month? Would be great to meet fellow Mumbai devs there! Also, we're hosting a pre-conference meetup at our office in BKC 🎯",
        likes: 289,
        comments: 54,
        time: "6 hours ago",
        commentsList: [
          { id: "c4", author: "Rohan Desai", text: "Count me in! 🙋‍♂️", time: "5h ago", likes: 12 },
          { id: "c5", author: "Aditya Joshi", text: "Is it open for juniors too?", time: "4h ago", likes: 8 },
          { id: "c6", author: "Meera Krishnan", text: "I'll be at the conference!", time: "3h ago", likes: 6 }
        ]
      },
      {
        id: 3,
        author: "Aditya Joshi",
        avatar: "AJ",
        content: "Built an AI-powered code review tool over the weekend using OpenAI API. It catches bugs, suggests optimizations, and even explains complex logic. DM if you want early access! 🤖",
        likes: 678,
        comments: 92,
        time: "1 day ago",
        commentsList: [
          { id: "c7", author: "Rohan Desai", text: "This sounds incredible! 🔥", time: "20h ago", likes: 35 },
          { id: "c8", author: "Sanya Patel", text: "Does it work with TypeScript?", time: "18h ago", likes: 18 },
          { id: "c9", author: "Meera Krishnan", text: "Just sent you a DM!", time: "15h ago", likes: 12 }
        ]
      }
    ],
    "bollywood-beats": [
      {
        id: 1,
        author: "Zara Khan",
        avatar: "ZK",
        content: "AR Rahman's new album 'Vendhu Thanindhathu Kaadu' is pure magic! 🎵 The fusion of traditional Tamil folk with modern orchestration is breathtaking. 'Mallipoo' is on repeat! What's your favorite track?",
        likes: 567,
        comments: 78,
        time: "4 hours ago",
        commentsList: [
          { id: "c1", author: "Arjun Mehta", text: "The entire album is a masterpiece! 🔥", time: "3h ago", likes: 25 },
          { id: "c2", author: "Divya Nair", text: "'Kaattumalli' gives me goosebumps!", time: "2h ago", likes: 18 },
          { id: "c3", author: "Karan Singh", text: "Rahman never disappoints 🙌", time: "1h ago", likes: 12 }
        ]
      },
      {
        id: 2,
        author: "Arjun Mehta",
        avatar: "AM",
        content: "Found this amazing indie artist from Bangalore - 'When Chai Met Toast'. Their track 'Firefly' is perfect for rainy evenings ☕🍞 Any other indie recommendations?",
        likes: 234,
        comments: 45,
        time: "8 hours ago",
        commentsList: [
          { id: "c4", author: "Zara Khan", text: "Love them! Try 'Prateek Kuhad' too 🎸", time: "6h ago", likes: 20 },
          { id: "c5", author: "Divya Nair", text: "'The Local Train' from Delhi is 🔥", time: "5h ago", likes: 15 }
        ]
      },
      {
        id: 3,
        author: "Divya Nair",
        avatar: "DN",
        content: "Throwback to the golden era of Bollywood music! 🎬 Created a playlist of 90s hits - Kumar Sanu, Alka Yagnik, Udit Narayan pure nostalgia! Link in comments if anyone wants it 💿",
        likes: 892,
        comments: 123,
        time: "2 days ago",
        commentsList: [
          { id: "c6", author: "Zara Khan", text: "The 90s had the best melodies! 🎵", time: "1d ago", likes: 45 },
          { id: "c7", author: "Karan Singh", text: "Please share the playlist! 😍", time: "20h ago", likes: 32 },
          { id: "c8", author: "Arjun Mehta", text: "'Tujhe Dekha To' will never get old", time: "18h ago", likes: 28 }
        ]
      }
    ],
    "foodie-delhi": [
      {
        id: 1,
        author: "Kabir Malhotra",
        avatar: "KM",
        content: "Discovered this hidden gem in Old Delhi - Kallu Nihari since 1990! The nihari with khameeri roti is absolutely legendary. Perfect for winter mornings 🍖❄️ Who's joining me next Sunday?",
        likes: 445,
        comments: 67,
        time: "3 hours ago",
        commentsList: [
          { id: "c1", author: "Anaya Gupta", text: "Their nihari is the best in Delhi! 🌶️", time: "2h ago", likes: 18 },
          { id: "c2", author: "Dev Khanna", text: "I'm in! What time? 🙋‍♂️", time: "1h ago", likes: 12 },
          { id: "c3", author: "Shivani R", text: "Try their paya too! Delicious 😋", time: "45m ago", likes: 8 }
        ]
      },
      {
        id: 2,
        author: "Anaya Gupta",
        avatar: "AG",
        content: "Weekend baking session result! 🧁 Made these chocolate truffle cupcakes with salted caramel frosting. My kitchen smells like heaven right now. Recipe in comments if anyone wants!",
        likes: 678,
        comments: 89,
        time: "6 hours ago",
        commentsList: [
          { id: "c4", author: "Dev Khanna", text: "They look amazing! 🤤", time: "5h ago", likes: 25 },
          { id: "c5", author: "Kabir Malhotra", text: "Please share the recipe! 🙏", time: "4h ago", likes: 18 },
          { id: "c6", author: "Shivani R", text: "Can I place an order? 😂", time: "3h ago", likes: 15 }
        ]
      },
      {
        id: 3,
        author: "Dev Khanna",
        avatar: "DK",
        content: "Cafe hopping in Hauz Khas Village today! Found this amazing Korean cafe with the fluffiest soufflé pancakes. Seoul Kitchen - highly recommend their matcha latte too 🥞☕",
        likes: 234,
        comments: 45,
        time: "1 day ago",
        commentsList: [
          { id: "c7", author: "Anaya Gupta", text: "Adding to my list! 📍", time: "20h ago", likes: 12 },
          { id: "c8", author: "Kabir Malhotra", text: "How are the prices?", time: "18h ago", likes: 8 },
          { id: "c9", author: "Shivani R", text: "Love that place! 🥰", time: "15h ago", likes: 6 }
        ]
      }
    ],
    "cricket-fans": [
      {
        id: 1,
        author: "Sourav Das",
        avatar: "SD",
        content: "What a match yesterday! That last over had everyone on the edge of their seats. India's bowling in the death overs was exceptional. This is why we love Test cricket! 🏏🇮🇳",
        likes: 1234,
        comments: 234,
        time: "5 hours ago",
        commentsList: [
          { id: "c1", author: "Priya Banerjee", text: "Best match of the series! 🔥", time: "4h ago", likes: 45 },
          { id: "c2", author: "Amit Mishra", text: "Bumrah is a legend! 🐐", time: "3h ago", likes: 38 },
          { id: "c3", author: "Viraj Patel", text: "That catch in the slips! 😱", time: "2h ago", likes: 28 }
        ]
      },
      {
        id: 2,
        author: "Priya Banerjee",
        avatar: "PB",
        content: "IPL auction predictions! Who do you think will be the most expensive player this year? My bet is on Shubman Gill or Cameron Green. The bidding wars are going to be intense! 💰🏆",
        likes: 567,
        comments: 123,
        time: "12 hours ago",
        commentsList: [
          { id: "c4", author: "Sourav Das", text: "Gill will definitely go high! 📈", time: "10h ago", likes: 25 },
          { id: "c5", author: "Amit Mishra", text: "Don't underestimate Sam Curran 💪", time: "8h ago", likes: 18 },
          { id: "c6", author: "Viraj Patel", text: "RCB needs a good bowler tbh 😅", time: "6h ago", likes: 42 }
        ]
      },
      {
        id: 3,
        author: "Amit Mishra",
        avatar: "AM",
        content: "Gully cricket memories! 🏏 Who else grew up playing with the 'one tip one hand' rule? And the fights over 'pitch pe out hai' 😂 Those were the days!",
        likes: 892,
        comments: 156,
        time: "2 days ago",
        commentsList: [
          { id: "c7", author: "Sourav Das", text: "'Last ball hai bhai!' 😂", time: "1d ago", likes: 55 },
          { id: "c8", author: "Priya Banerjee", text: "'Stumping hai!' every time 😅", time: "20h ago", likes: 42 },
          { id: "c9", author: "Viraj Patel", text: "Missing those Sunday mornings! 🌅", time: "18h ago", likes: 35 }
        ]
      }
    ],
    "default": [
      {
        id: 1,
        author: "Community Member",
        avatar: "CM",
        content: `Just shared some amazing content from my experience with ${cohortName}! This community is so vibrant and engaging.`,
        likes: 234,
        comments: 45,
        time: "2 hours ago",
        commentsList: [
          { id: "c1", author: "Active User", text: "Love this! Thanks for sharing 🙌", time: "1h ago", likes: 12 },
          { id: "c2", author: "New Member", text: "This is exactly why I joined!", time: "45m ago", likes: 8 }
        ]
      },
      {
        id: 2,
        author: "Enthusiast",
        avatar: "EN",
        content: `Looking for recommendations related to ${cohortName}. What has been your best experience so far? Drop them in the comments! 🎯`,
        likes: 156,
        comments: 32,
        time: "5 hours ago",
        commentsList: [
          { id: "c3", author: "Regular", text: "So many great options! 😊", time: "4h ago", likes: 6 }
        ]
      },
      {
        id: 3,
        author: "Host",
        avatar: "HO",
        content: "Hosted an amazing event yesterday! 50+ people joined and the energy was incredible. Thank you to everyone who participated. More events coming soon! 🙏✨",
        likes: 567,
        comments: 89,
        time: "1 day ago",
        commentsList: [
          { id: "c4", author: "Attendee", text: "It was fantastic! 🔥", time: "20h ago", likes: 25 },
          { id: "c5", author: "Fan", text: "Can't wait for the next one! 🎉", time: "18h ago", likes: 18 }
        ]
      }
    ]
  };

  return domainPosts[cohortId] || domainPosts["default"];
};

const generateMembers = () => [
  { id: 1, name: "Arjun Sharma", avatar: "AS", role: "Admin" },
  { id: 2, name: "Priya Patel", avatar: "PP", role: "Admin" },
  { id: 3, name: "Rohan Gupta", avatar: "RG", role: "Member" },
  { id: 4, name: "Ananya Singh", avatar: "AS", role: "Member" },
  { id: 5, name: "Vikram Reddy", avatar: "VR", role: "Member" },
  { id: 6, name: "Neha Kumar", avatar: "NK", role: "Member" },
  { id: 7, name: "Aditya Joshi", avatar: "AJ", role: "Member" },
  { id: 8, name: "Sanya Malhotra", avatar: "SM", role: "Member" },
];

interface CohortPageProps {
  params: Promise<{ id: string }>;
}

export default function CohortPage({ params }: CohortPageProps) {
  const { id } = use(params);
  const [isJoined, setIsJoined] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // Load joined state from "backend"
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("joined_communities");
    if (saved) {
      const joinedSet = new Set(JSON.parse(saved));
      setIsJoined(joinedSet.has(id));
    }
  }, [id]);

  const handleJoinToggle = () => {
    const newJoinedState = !isJoined;
    setIsJoined(newJoinedState);
    
    // Update "backend"
    const saved = localStorage.getItem("joined_communities");
    let joinedSet = new Set<string>();
    if (saved) {
      joinedSet = new Set(JSON.parse(saved));
    }
    
    if (newJoinedState) {
      joinedSet.add(id);
    } else {
      joinedSet.delete(id);
    }
    localStorage.setItem("joined_communities", JSON.stringify(Array.from(joinedSet)));
  };

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleLikePost = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const cohort = COHORTS_DATA[id] || {
    id,
    name: id?.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Community",
    slug: id || "community",
    description: "A vibrant community of enthusiasts sharing their passion and experiences.",
    member_count: 5000,
    color: "#8B5CF6",
    icon: "🌟",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
    tags: ["Community", "Learning", "Sharing"],
    location: "India",
    admins: ["Community Admin"],
  };
  
  // Use domain-specific posts for the community
  const posts = generateCommunityPosts(id, cohort.name, cohort.color);

  const members = [
    { id: 1, name: "Arjun Sharma", avatar: "AS", role: "Admin" },
    { id: 2, name: "Priya Patel", avatar: "PP", role: "Admin" },
    { id: 3, name: "Rohan Gupta", avatar: "RG", role: "Member" },
    { id: 4, name: "Ananya Singh", avatar: "AS", role: "Member" },
    { id: 5, name: "Vikram Reddy", avatar: "VR", role: "Member" },
    { id: 6, name: "Neha Kumar", avatar: "NK", role: "Member" },
    { id: 7, name: "Aditya Joshi", avatar: "AJ", role: "Member" },
    { id: 8, name: "Sanya Malhotra", avatar: "SM", role: "Member" },
  ];

  const relatedCohorts = Object.values(COHORTS_DATA).filter((c: any) => c.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/explore">
          <Button variant="ghost" className="mb-6 -ml-4 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Communities
          </Button>
        </Link>

        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8">
          <img src={cohort.image} alt={cohort.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-lg" style={{ backgroundColor: cohort.color }}>
                {cohort.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-black text-white">{cohort.name}</h1>
                <p className="text-white/80 text-lg">@{cohort.slug}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <p className="text-lg text-muted-foreground leading-relaxed">{cohort.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {cohort.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="border-primary/30 text-primary">
                  <Hash className="w-3 h-3 mr-1" />{tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-lg font-bold rounded-xl transition-all" 
              style={{ backgroundColor: isJoined ? "#10B981" : cohort.color }}
              onClick={handleJoinToggle}
            >
              {isJoined ? (
                <><Check className="w-5 h-5 mr-2" />Joined</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" />Join Community</>
              )}
            </Button>
            <Link href={`/cohort/${cohort.id}/chat`}>
              <Button variant="outline" className="w-full h-12 rounded-xl border-border hover:bg-primary/10 hover:text-primary hover:border-primary">
                <MessageSquare className="w-5 h-5 mr-2" />Open Community Chat
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-12 rounded-xl border-border">
              <Share2 className="w-5 h-5 mr-2" />Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2" style={{ color: cohort.color }} />
              <p className="text-2xl font-black text-card-foreground">{(cohort.member_count / 1000).toFixed(1)}K</p>
              <p className="text-muted-foreground text-sm">Members</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-black text-card-foreground">2.4K</p>
              <p className="text-muted-foreground text-sm">Discussions</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-pink-500" />
              <p className="text-2xl font-black text-card-foreground">12</p>
              <p className="text-muted-foreground text-sm">Events this month</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: cohort.color }} />
              <p className="text-2xl font-black text-card-foreground">{cohort.location}</p>
              <p className="text-muted-foreground text-sm">Location</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-500" />Recent Discussions
            </h2>
            {posts.map((post) => {
              const isCommentsExpanded = expandedComments.has(post.id);
              const isPostLiked = likedPosts.has(post.id);
              const visibleComments = isCommentsExpanded 
                ? post.commentsList 
                : post.commentsList.slice(0, 2);
              
              return (
                <Card key={post.id} className="bg-card border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="font-bold text-white" style={{ backgroundColor: cohort.color }}>{post.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-card-foreground">{post.author}</p>
                          <span className="text-muted-foreground text-sm">{post.time}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                        
                        {/* Post Actions */}
                        <div className="flex items-center gap-6 mt-4">
                          <button 
                            onClick={() => toggleLikePost(post.id)}
                            className={`flex items-center gap-1 transition-colors ${
                              isPostLiked ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${isPostLiked ? "fill-current" : ""}`} />
                            <span className="text-sm">{post.likes + (isPostLiked ? 1 : 0)}</span>
                          </button>
                          <button 
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1 text-muted-foreground hover:text-purple-500 transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors">
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-4 pt-4 border-t border-border">
                          {/* View all comments link */}
                          {post.commentsList.length > 2 && (
                            <button
                              onClick={() => toggleComments(post.id)}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 flex items-center gap-1"
                            >
                              {isCommentsExpanded ? (
                                <>Hide comments <ChevronUp className="w-4 h-4" /></>
                              ) : (
                                <>View all {post.comments} comments <ChevronDown className="w-4 h-4" /></>
                              )}
                            </button>
                          )}
                          
                          {/* Comments List */}
                          <AnimatePresence>
                            <div className="space-y-3">
                              {visibleComments.map((comment, idx) => {
                                const isCommentLiked = likedComments.has(comment.id);
                                return (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-start gap-2"
                                  >
                                    <Avatar className="w-7 h-7 flex-shrink-0">
                                      <AvatarFallback className="text-xs bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                                        {comment.author.slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start gap-2">
                                        <span className="font-semibold text-sm text-foreground">{comment.author}</span>
                                        <span className="text-sm text-muted-foreground flex-1 break-words">{comment.text}</span>
                                      </div>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                                        <button
                                          onClick={() => toggleLikeComment(comment.id)}
                                          className={`text-xs transition-colors ${
                                            isCommentLiked 
                                              ? "text-pink-500 font-medium" 
                                              : "text-muted-foreground hover:text-pink-500"
                                          }`}
                                        >
                                          {isCommentLiked ? "Liked" : "Like"}
                                        </button>
                                        <span className="text-xs text-muted-foreground">
                                          {comment.likes + (isCommentLiked ? 1 : 0)} likes
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => toggleLikeComment(comment.id)}
                                      className={`flex-shrink-0 ${
                                        isCommentLiked ? "text-pink-500" : "text-muted-foreground"
                                      }`}
                                    >
                                      <Heart className={`w-4 h-4 ${isCommentLiked ? "fill-current" : ""}`} />
                                    </button>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </AnimatePresence>
                          
                          {/* Add Comment Input */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                            <Avatar className="w-7 h-7 flex-shrink-0">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                ME
                              </AvatarFallback>
                            </Avatar>
                            <Input
                              placeholder="Add a comment..."
                              className="flex-1 h-9 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                            />
                            <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: cohort.color }} />Community Admins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cohort.admins.map((admin: string) => (
                  <div key={admin} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold">{admin.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-card-foreground">{admin}</p>
                      <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-500">Admin</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-card-foreground">Active Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-bold">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground text-sm">{member.name}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs rounded-full">Connect</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-card-foreground">Related Communities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedCohorts.map((related: any) => (
                  <Link key={related.id} href={`/cohort/${related.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: related.color }}>{related.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{related.name}</p>
                        <p className="text-muted-foreground text-xs">{(related.member_count / 1000).toFixed(1)}K members</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
