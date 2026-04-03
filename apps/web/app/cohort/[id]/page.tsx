"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, ArrowLeft, Hash, MessageSquare, Heart, Share2, MapPin, Sparkles, Check } from "lucide-react";

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

const generatePosts = (cohortId: string, cohortName: string, color: string) => [
  {
    id: 1,
    author: "Priya Sharma",
    avatar: "PS",
    content: `Just shared some amazing photos from my trip to Kerala in ${cohortName}! The backwaters are absolutely magical. Has anyone else visited recently?`,
    likes: 234,
    comments: 45,
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "Rohan Gupta",
    avatar: "RG",
    content: `Looking for recommendations for the upcoming weekend. What's your favorite spot in ${cohortName}? Need something offbeat!`,
    likes: 156,
    comments: 32,
    time: "5 hours ago",
  },
  {
    id: 3,
    author: "Ananya Singh",
    avatar: "AS",
    content: `Hosted a workshop yesterday and it was amazing! 50+ people joined. The community here is so supportive. Thank you everyone! 🙏`,
    likes: 567,
    comments: 89,
    time: "1 day ago",
  },
];

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
  
  const posts = [
    {
      id: 1,
      author: "Priya Sharma",
      avatar: "PS",
      content: `Just shared some amazing photos from my trip to Kerala in ${cohort.name}! The backwaters are absolutely magical. Has anyone else visited recently?`,
      likes: 234,
      comments: 45,
      time: "2 hours ago",
    },
    {
      id: 2,
      author: "Rohan Gupta",
      avatar: "RG",
      content: `Looking for recommendations for the upcoming weekend. What's your favorite spot in ${cohort.name}? Need something offbeat!`,
      likes: 156,
      comments: 32,
      time: "5 hours ago",
    },
    {
      id: 3,
      author: "Ananya Singh",
      avatar: "AS",
      content: `Hosted a workshop yesterday and it was amazing! 50+ people joined. The community here is so supportive. Thank you everyone! 🙏`,
      likes: 567,
      comments: 89,
      time: "1 day ago",
    },
  ];

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
            {posts.map((post) => (
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
                      <div className="flex items-center gap-6 mt-4">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-pink-500 transition-colors"><Heart className="w-5 h-5" /><span className="text-sm">{post.likes}</span></button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-purple-500 transition-colors"><MessageSquare className="w-5 h-5" /><span className="text-sm">{post.comments}</span></button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors"><Share2 className="w-5 h-5" /><span className="text-sm">Share</span></button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
