"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, Paperclip, Smile, Phone, Video, MoreVertical, 
  ArrowLeft, Users, Image as ImageIcon, Mic, Check, CheckCheck,
  Heart, Reply, ArrowDown, AlertCircle, X
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { llmService } from "@/lib/llm-service";
import { moderateMessage, type ModerationResult } from "@/lib/content-moderation";

// Indian community members with realistic profiles for all 22 cohorts
const COMMUNITY_MEMBERS: Record<string, Array<{id: string, name: string, avatar: string, role: string, bio: string}>> = {
  "travel-india": [
    { id: "m1", name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "traveler", bio: "Backpacker exploring hidden gems" },
    { id: "m2", name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "photographer", bio: "Capturing India's beauty" },
    { id: "m3", name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "guide", bio: "Local guide from Kerala" },
    { id: "m4", name: "Ananya Singh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "traveler", bio: "Solo female traveler" },
    { id: "m5", name: "Rohan Gupta", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100", role: "blogger", bio: "Travel blogger & vlogger" },
  ],
  "code-mumbai": [
    { id: "m1", name: "Rohan Gupta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "developer", bio: "Full stack dev at startup" },
    { id: "m2", name: "Sanya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "engineer", bio: "Backend engineer at Google" },
    { id: "m3", name: "Aditya Joshi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "founder", bio: "Tech founder & mentor" },
    { id: "m4", name: "Meera Krishnan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "developer", bio: "React & Node.js expert" },
  ],
  "bollywood-beats": [
    { id: "m1", name: "Zara Khan", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "singer", bio: "Aspiring playback singer" },
    { id: "m2", name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "producer", bio: "Music producer & composer" },
    { id: "m3", name: "Divya Nair", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "dancer", bio: "Bollywood dance instructor" },
    { id: "m4", name: "Karan Singh", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "critic", bio: "Music critic & blogger" },
  ],
  "dance-bhangra": [
    { id: "m1", name: "Harpreet Kaur", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "dancer", bio: "Professional Bhangra dancer" },
    { id: "m2", name: "Rajveer Singh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "instructor", bio: "Dance academy owner" },
    { id: "m3", name: "Simran Kaur", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "performer", bio: "Giddha & folk dancer" },
    { id: "m4", name: "Gurpreet Singh", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "choreographer", bio: "Wedding choreographer" },
  ],
  "foodie-delhi": [
    { id: "m1", name: "Karthik Iyer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "chef", bio: "Home chef & biryani expert" },
    { id: "m2", name: "Neha Kumar", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "foodie", bio: "Street food hunter" },
    { id: "m3", name: "Divya Nair", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "critic", bio: "Food critic & blogger" },
    { id: "m4", name: "Amit Shah", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "chef", bio: "South Indian cuisine specialist" },
  ],
  "shutterbugs": [
    { id: "m1", name: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "photographer", bio: "Wildlife photographer" },
    { id: "m2", name: "Neha Kapoor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "portrait", bio: "Portrait & wedding photographer" },
    { id: "m3", name: "Vikram Rao", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "landscape", bio: "Landscape & travel photographer" },
    { id: "m4", name: "Ananya Sharma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "street", bio: "Street photography enthusiast" },
  ],
  "yoga-wellness": [
    { id: "m1", name: "Dr. Anjali Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "instructor", bio: "Yoga therapist & healer" },
    { id: "m2", name: "Ravi Shankar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "guru", bio: "Meditation teacher" },
    { id: "m3", name: "Meera Iyer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "practitioner", bio: "Ayurveda wellness coach" },
    { id: "m4", name: "Suresh Kumar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "trainer", bio: "Fitness & yoga trainer" },
  ],
  "art-culture": [
    { id: "m1", name: "Priya Menon", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "artist", bio: "Contemporary artist" },
    { id: "m2", name: "Arvind Rao", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "curator", bio: "Museum curator" },
    { id: "m3", name: "Lakshmi Devi", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "folk", bio: "Traditional folk artist" },
    { id: "m4", name: "Karthik Subram", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "sculptor", bio: "Sculptor & installation artist" },
  ],
  "cinema-club": [
    { id: "m1", name: "Fatima Khan", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "critic", bio: "Film critic & reviewer" },
    { id: "m2", name: "Rajesh Khanna", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "buff", bio: "Classic cinema enthusiast" },
    { id: "m3", name: "Sonia Kapoor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "director", bio: "Indie filmmaker" },
    { id: "m4", name: "Imran Qureshi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "writer", bio: "Screenwriter" },
  ],
  "book-worms": [
    { id: "m1", name: "Ananya Sen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "reader", bio: "Book reviewer & blogger" },
    { id: "m2", name: "Rohan Desai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "author", bio: "Aspiring novelist" },
    { id: "m3", name: "Priya Banerjee", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "librarian", bio: "Librarian & book curator" },
    { id: "m4", name: "Amit Mishra", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "poet", bio: "Poetry enthusiast" },
  ],
  "game-on": [
    { id: "m1", name: "Nikhil Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "gamer", bio: "Esports competitor" },
    { id: "m2", name: "Sneha Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "streamer", bio: "Twitch streamer" },
    { id: "m3", name: "Varun Gupta", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "developer", bio: "Game developer" },
    { id: "m4", name: "Riya Singh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "casual", bio: "Mobile gaming enthusiast" },
  ],
  "startup-hub": [
    { id: "m1", name: "Kunal Shah", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "founder", bio: "Serial entrepreneur" },
    { id: "m2", name: "Nidhi Gupta", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "investor", bio: "Angel investor" },
    { id: "m3", name: "Prateek Jain", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "cto", bio: "CTO at fintech startup" },
    { id: "m4", name: "Shreya Rao", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "product", bio: "Product manager" },
  ],
  "cricket-fans": [
    { id: "m1", name: "Sourav Das", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "fanatic", bio: "Die-hard cricket fan" },
    { id: "m2", name: "Priya Banerjee", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "analyst", bio: "Cricket analyst" },
    { id: "m3", name: "Viraj Patel", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "player", bio: "Club cricketer" },
    { id: "m4", name: "Anjali Sharma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "supporter", bio: "Team India supporter" },
  ],
  "fashion-desi": [
    { id: "m1", name: "Ritu Kumar", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "designer", bio: "Fashion designer" },
    { id: "m2", name: "Arjun Kapoor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "stylist", bio: "Celebrity stylist" },
    { id: "m3", name: "Zara Sheikh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "influencer", bio: "Fashion influencer" },
    { id: "m4", name: "Rahul Mehta", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "boutique", bio: "Boutique owner" },
  ],
  "pets-india": [
    { id: "m1", name: "Anjali Shah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "parent", bio: "Dog mom to 3 Labradors" },
    { id: "m2", name: "Vivek Rao", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "vet", bio: "Veterinarian" },
    { id: "m3", name: "Priya Jain", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "rescuer", bio: "Animal rescuer" },
    { id: "m4", name: "Karan Malhotra", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "trainer", bio: "Dog trainer" },
  ],
  "career-growth": [
    { id: "m1", name: "Sanjay Gupta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "mentor", bio: "Career coach" },
    { id: "m2", name: "Neha Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "hr", bio: "HR professional" },
    { id: "m3", name: "Rohit Kumar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "recruiter", bio: "Tech recruiter" },
    { id: "m4", name: "Meera Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "seeker", bio: "Job seeker" },
  ],
  "sustainability": [
    { id: "m1", name: "Dr. Ravi Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "activist", bio: "Climate activist" },
    { id: "m2", name: "Anita Singh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "eco", bio: "Sustainable living coach" },
    { id: "m3", name: "Priya Rao", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "gardener", bio: "Urban gardener" },
    { id: "m4", name: "Arun Nair", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "scientist", bio: "Environmental scientist" },
  ],
  "finance-tips": [
    { id: "m1", name: "CA Rajesh Gupta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "advisor", bio: "Chartered Accountant" },
    { id: "m2", name: "Priya Shah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "investor", bio: "Stock market investor" },
    { id: "m3", name: "Vikram Mehta", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "crypto", bio: "Crypto enthusiast" },
    { id: "m4", name: "Ananya Krishnan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "planner", bio: "Financial planner" },
  ],
  "parenting-india": [
    { id: "m1", name: "Dr. Sunita Rao", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "pediatrician", bio: "Child specialist" },
    { id: "m2", name: "Rahul Khanna", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "dad", bio: "Father of two" },
    { id: "m3", name: "Meera Shah", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "mom", bio: "Working mother" },
    { id: "m4", name: "Anil Kumar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "coach", bio: "Parenting coach" },
  ],
  "home-decor": [
    { id: "m1", name: "Interior Ritu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "designer", bio: "Interior designer" },
    { id: "m2", name: "Arjun Patel", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "diy", bio: "DIY enthusiast" },
    { id: "m3", name: "Shweta Gupta", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "decorator", bio: "Home stylist" },
    { id: "m4", name: "Karan Singh", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "architect", bio: "Architect" },
  ],
  "language-learn": [
    { id: "m1", name: "Prof. Anjali", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "teacher", bio: "Hindi professor" },
    { id: "m2", name: "John Smith", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "learner", bio: "Learning Hindi" },
    { id: "m3", name: "Lakshmi Iyer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "tutor", bio: "Tamil tutor" },
    { id: "m4", name: "Rahul Das", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "polyglot", bio: "Speaks 5 languages" },
  ],
  "mental-health": [
    { id: "m1", name: "Dr. Priya Rao", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "psychologist", bio: "Clinical psychologist" },
    { id: "m2", name: "Arun Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "counselor", bio: "Mental health counselor" },
    { id: "m3", name: "Sneha Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "advocate", bio: "Mental health advocate" },
    { id: "m4", name: "Rohit Shah", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "survivor", bio: "Lived experience sharer" },
  ],
  "default": [
    { id: "m1", name: "Community Member", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "member", bio: "Active community member" },
    { id: "m2", name: "Regular User", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "member", bio: "Loves engaging with community" },
  ]
};

// Community photos by category for all 22 cohorts
const COMMUNITY_PHOTOS: Record<string, string[]> = {
  "travel-india": [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
  ],
  "foodie-delhi": [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
  ],
  "code-mumbai": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400",
  ],
  "bollywood-beats": [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
    "https://images.unsplash.com/photo-1508854710579-5cecc3a9ff17?w=400",
  ],
  "dance-bhangra": [
    "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400",
    "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400",
    "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400",
    "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400",
  ],
  "shutterbugs": [
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400",
  ],
  "yoga-wellness": [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
    "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400",
    "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400",
  ],
  "art-culture": [
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400",
  ],
  "cinema-club": [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
  ],
  "book-worms": [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
  ],
  "game-on": [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    "https://images.unsplash.com/photo-1511512578048-dfbdd0405575?w=400",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0a?w=400",
  ],
  "startup-hub": [
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400",
  ],
  "cricket-fans": [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400",
    "https://images.unsplash.com/photo-1562077772-3bd80f391966?w=400",
    "https://images.unsplash.com/photo-1589801258579-3b56f7e7af6f?w=400",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3f966?w=400",
  ],
  "fashion-desi": [
    "https://images.unsplash.com/photo-1583391733950-3bd4e45efb3?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400",
  ],
  "pets-india": [
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
  ],
  "career-growth": [
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
  ],
  "sustainability": [
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400",
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400",
  ],
  "finance-tips": [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
  ],
  "parenting-india": [
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400",
    "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
    "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400",
  ],
  "home-decor": [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400",
  ],
  "language-learn": [
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    "https://images.unsplash.com/photo-1488751045188-3c996d141f3c?w=400",
  ],
  "mental-health": [
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
  ],
  "default": [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
  ]
};

// Community info for all 22 cohorts
const COMMUNITY_INFO: Record<string, {name: string, icon: string, color: string, description: string}> = {
  "travel-india": { name: "Travel India", icon: "✈️", color: "#FF6B9D", description: "Discover hidden gems across India" },
  "code-mumbai": { name: "Code Mumbai", icon: "💻", color: "#00D4FF", description: "Mumbai's developer community" },
  "bollywood-beats": { name: "Bollywood Beats", icon: "🎵", color: "#9D4EDD", description: "Desi music lovers unite" },
  "dance-bhangra": { name: "Bhangra & Dance", icon: "💃", color: "#FF006E", description: "Punjabi beats and moves" },
  "foodie-delhi": { name: "Delhi Foodies", icon: "🍳", color: "#FB8500", description: "Street food to fine dining" },
  "shutterbugs": { name: "Indian Shutterbugs", icon: "📸", color: "#38B000", description: "Capture India's beauty" },
  "yoga-wellness": { name: "Yoga & Wellness", icon: "🧘", color: "#06FFB4", description: "Mind, body & soul" },
  "art-culture": { name: "Art & Culture", icon: "🎨", color: "#C77DFF", description: "Traditional to contemporary" },
  "cinema-club": { name: "Cinema Club", icon: "🎬", color: "#E63946", description: "Bollywood to Hollywood" },
  "book-worms": { name: "Book Worms", icon: "📚", color: "#F4A261", description: "Reading circles & discussions" },
  "game-on": { name: "Game On", icon: "🎮", color: "#7209B7", description: "Esports & casual gaming" },
  "startup-hub": { name: "Startup Hub", icon: "🚀", color: "#00F5FF", description: "Founders & innovators" },
  "cricket-fans": { name: "Cricket Fans India", icon: "🏏", color: "#1D4ED8", description: "Bleed blue! Cricket discussions" },
  "fashion-desi": { name: "Desi Fashion", icon: "�", color: "#EC4899", description: "Ethnic to modern Indian fashion" },
  "pets-india": { name: "Pet Parents India", icon: "🐕", color: "#10B981", description: "Dogs, cats & desi pets" },
  "career-growth": { name: "Career Growth", icon: "💼", color: "#6366F1", description: "Jobs, skills & mentorship" },
  "sustainability": { name: "Green India", icon: "🌱", color: "#059669", description: "Sustainable living & climate action" },
  "finance-tips": { name: "Finance & Investing", icon: "💰", color: "#F59E0B", description: "Stocks, crypto & savings" },
  "parenting-india": { name: "Indian Parents", icon: "👶", color: "#8B5CF6", description: "Parenting tips & support" },
  "home-decor": { name: "Home Decor India", icon: "�", color: "#D946EF", description: "Interior design & DIY" },
  "language-learn": { name: "Language Learners", icon: "🗣️", color: "#3B82F6", description: "Hindi, regional & foreign languages" },
  "mental-health": { name: "Mental Wellness", icon: "🧠", color: "#14B8A6", description: "Mental health support & awareness" },
};

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
  type: "text" | "image" | "voice";
  imageUrl?: string;
  isMe: boolean;
  status: "sent" | "delivered" | "read";
}

// LLM Response Generator - Simulates human responses for all 22 cohorts
function generateHumanResponse(userMessage: string, communityId: string, previousMessages: Message[]): string {
  const responses: Record<string, string[]> = {
    "travel-india": [
      "Oh wow, that sounds amazing! I've been to Kerala during monsoon and it's absolutely magical. The tea plantations in Munnar are breathtaking.",
      "You should definitely try the backwaters in Alleppey! I stayed in a houseboat last year and it was unforgettable. 🌴",
      "If you're planning a trip, try visiting during Onam festival. The culture, food, and snake boat races are incredible!",
      "Pro tip: Book your stays in advance during peak season. I use MakeMyTrip or directly contact homestays for better deals.",
      "Have you considered Coorg too? It's called the Scotland of India for a reason. Perfect for coffee lovers! ☕",
      "I just returned from a trek in the Western Ghats. The views are to die for! Would you like some photos?",
    ],
    "foodie-delhi": [
      "That biryani looks delicious! I use a special blend of spices from Old Delhi. The secret is slow cooking on dum. 🍛",
      "You should try the paranthe wali gali in Chandni Chowk! Best stuffed parathas ever. I go there every Sunday.",
      "Homemade butter chicken recipe: marinate overnight, use kasuri methi, and never skip the cream at the end!",
      "Street food tip: Always check where locals are eating. If there's a crowd, the food is fresh and tasty!",
      "I learned this recipe from my grandmother. The key is patience and love. Want the full recipe?",
      "Have you tried chole kulche from Kamla Nagar? Game changer! I can share the exact location.",
    ],
    "code-mumbai": [
      "I faced the same issue last week! Try using React Query for data fetching, it handles caching beautifully.",
      "For that error, check if you're using the correct Node version. I recommend nvm for managing versions.",
      "We're hiring at our startup! Looking for full-stack devs with React and Node experience. DM me if interested. 💼",
      "Try the new Next.js 15 features, the App Router has improved performance significantly. Just migrated our app!",
      "Anyone attending the React India conference next month? Would love to meet fellow Mumbai devs!",
      "For system design interviews, focus on scalability and trade-offs. I cleared my Google interview using this approach.",
    ],
    "bollywood-beats": [
      "ARR's new composition is pure magic! The way he blends traditional instruments with modern beats is unmatched. 🎵",
      "Just listened to the Laapataa Ladies soundtrack. Such underrated gems in there!",
      "Arijit's voice gives me goosebumps every time. Which is your favorite song of his?",
      "Old Bollywood songs hit different! Kishore Kumar and RD Burman were way ahead of their time.",
      "Have you guys checked out the indie music scene? Some incredible artists coming up from Delhi and Mumbai.",
      "Planning a road trip this weekend. Need playlist suggestions - desi hip hop or classic Bollywood?",
    ],
    "dance-bhangra": [
      "Bhangra is not just dance, it's therapy! The energy is unmatched. Anyone else feels the same? 💃",
      "Just learned the proper shoulder shimmy technique. Game changer for my performance!",
      "Giddha has such rich cultural significance. Love how it tells stories through movement.",
      "Wedding season is here! Book your choreographers early, good ones get reserved months ahead.",
      "Practice tip: Start slow, focus on footwork first. Speed comes naturally with muscle memory.",
      "Anyone attending the Bhangra competition in Ludhiana next month? Let's form a team!",
    ],
    "shutterbugs": [
      "Golden hour at India Gate is absolutely magical. Best time for portrait photography! 📸",
      "Just got the new Sony A7IV. The low light performance is incredible for night street photography.",
      "Wildlife photography tip: Patience is everything. Waited 4 hours for the perfect tiger shot at Ranthambore.",
      "Sharing some landscape shots from Spiti Valley. The colors there are unreal - no filter needed!",
      "Anyone interested in a photowalk this weekend? Thinking of exploring Old Delhi's narrow lanes.",
      "Composition tip: Use the rule of thirds, but don't be afraid to break it for creative shots.",
    ],
    "yoga-wellness": [
      "Started practicing Surya Namaskar every morning. The difference in my energy levels is incredible! 🧘",
      "Pranayama has changed my life. Just 10 minutes of deep breathing reduces stress significantly.",
      "Ayurvedic tip: Drink warm water with lemon first thing in the morning. Works wonders for digestion.",
      "Looking for a good yoga retreat in Rishikesh. Any recommendations from the community?",
      "Meditation doesn't have to be long - even 5 minutes of mindful breathing helps center yourself.",
      "Just completed my 200-hour yoga teacher training! Happy to answer any questions about it.",
    ],
    "art-culture": [
      "Visited the India Art Fair last week. Some incredible contemporary artists representing our culture! 🎨",
      "Madhubani paintings tell such beautiful stories. Started learning this traditional art form recently.",
      "The way our folk art captures everyday life is fascinating. Every region has its unique style.",
      "Working on a series combining traditional motifs with modern abstract techniques. Will share soon!",
      "Art supply recommendation: The Indian brand Camel has really upped their quality recently.",
      "Anyone visiting the upcoming Kochi Biennale? Would love to meet fellow art enthusiasts there.",
    ],
    "cinema-club": [
      "Laapataa Ladies is such a refreshing film! Bollywood needs more stories like this. 🎬",
      "Just watched all the Oscar nominations. Poor Things was visually stunning but Anatomy of a Fall hit harder.",
      "Christopher Nolan is a genius but our own Anurag Kashyap tells stories that resonate more with us.",
      "Movie recommendation: Check out the Malayalam film industry. Some incredible storytelling happening there!",
      "Film editing is such an underrated art. The way scenes flow can make or break a movie.",
      "Planning a movie marathon this weekend. Suggest your favorite underrated Bollywood gems!",
    ],
    "book-worms": [
      "Just finished 'The Immortals of Meluha'. Amish Tripathi's storytelling is so engaging! 📚",
      "Looking for recommendations on Indian mythology retellings. Read Devdutt Pattanaik, need more!",
      "There's something special about holding a physical book. The smell of old books is heavenly.",
      "Started a reading challenge this year - 52 books in 52 weeks. Currently on book 12!",
      "Book club meetup this Saturday at Cha Bar, CP. Join us for coffee and literary discussions!",
      "Manto's short stories are raw and powerful. Essential reading for understanding partition.",
    ],
    "game-on": [
      "Finally reached Immortal rank in Valorant! The grind was real but so worth it. 🎮",
      "BGMI tournament this weekend with my squad. We're practicing everyday for this!",
      "Just built my dream gaming PC. RTX 4080 handles everything at 4K like a beast.",
      "Esports in India is growing so fast. Who's watching the VCT matches currently?",
      "Looking for teammates for our COD Mobile clan. DM if you're interested in competitive play!",
      "Retro gaming hits different. Just replayed GTA San Andreas and the nostalgia was overwhelming.",
    ],
    "startup-hub": [
      "Just secured our seed round! The pitching process was intense but we learned so much. 🚀",
      "Startup tip: Focus on solving real problems, not just building features. Customer feedback is gold.",
      "Network effects are everything in SaaS. How are you all approaching early user acquisition?",
      "Looking for a technical co-founder for my edtech startup. DMs open for serious conversations.",
      "The hustle culture is overrated. Sustainable growth comes from consistent effort, not 18-hour days.",
      "Anyone attending the TiE Global Summit next month? Great networking opportunity for founders!",
    ],
    "cricket-fans": [
      "What a match yesterday! Rohit's captaincy is just brilliant. The way he rotates bowlers! 🏏",
      "Gill's technique against spinners has improved so much. Future captain material right there.",
      "IPL season is almost here! Which team are you supporting this year? I'm all in for RCB!",
      "Was lucky enough to watch the match at Wankhede yesterday. The atmosphere was electric!",
      "Virat's cover drive is still the best in the world. No debate about it.",
      "Fantasy league players: Who are you picking as captain this week? Hardik or Bumrah?",
    ],
    "fashion-desi": [
      "Just got my hands on a beautiful Banarasi silk saree. The craftsmanship is breathtaking! 👗",
      "Fusion fashion is where it's at. Pairing kurtas with jeans and sneakers is my go-to look.",
      "Lakme Fashion Week had some incredible sustainable fashion collections this year.",
      "Thrifting in Sarojini Nagar is an art form. Found a designer piece for ₹500 yesterday!",
      "Minimal makeup with bold ethnic jewelry is such a powerful combination. Less is more!",
      "Who else is obsessed with Indo-western outfits? Perfect for our unpredictable weather.",
    ],
    "pets-india": [
      "My Indie adopted from the street is the most loving creature ever. Desi dogs are the best! 🐕",
      "Pet nutrition tip: Avoid grain-heavy commercial food. Fresh homemade meals are so much healthier.",
      "Just rescued a kitten from my neighborhood. Taking her to the vet tomorrow for a checkup.",
      "Dog training advice: Consistency is key. Use positive reinforcement, never punishment.",
      "Looking for a good pet-friendly cafe in Bangalore. Want to take my labrador out this weekend!",
      "Pet parents, share your grooming routines! My golden retriever sheds way too much 😅",
    ],
    "career-growth": [
      "Just switched careers from engineering to product management. Best decision I ever made! 💼",
      "Resume tip: Quantify your achievements. Numbers speak louder than adjectives.",
      "LinkedIn networking works! Got my current job through a connection I made commenting on posts.",
      "Imposter syndrome is real but remember - you were hired for a reason. Trust your abilities.",
      "Skill recommendation: Learn data analysis regardless of your field. It's becoming essential everywhere.",
      "Mock interview buddy needed! Preparing for FAANG interviews. DM if interested in practicing together.",
    ],
    "sustainability": [
      "Started composting at home and it's surprisingly easy! My plants have never been happier. 🌱",
      "Sustainable living tip: Carry your own water bottle and bag. Small changes make big differences.",
      "Just installed solar panels on my rooftop. The savings on electricity bills are incredible!",
      "Fast fashion is killing our planet. Thrifting and slow fashion are the way forward.",
      "Climate anxiety is real but channel it into action. Join local groups making a difference.",
      "Anyone interested in starting a community garden in our neighborhood? Let's make it happen!",
    ],
    "finance-tips": [
      "Started SIP in index funds 3 years ago. The compound growth is finally showing! 💰",
      "Financial tip: Keep 6 months of expenses as emergency fund before investing anywhere.",
      "Crypto is volatile but blockchain technology is here to stay. DYOR before investing!",
      "Just filed my taxes. Pro tip: Start collecting documents early to avoid last minute stress.",
      "Credit card reward points can add up to significant savings if used smartly. I fund my travel with them!",
      "Anyone using smallcase for investing? The thematic baskets are perfect for beginners.",
    ],
    "parenting-india": [
      "Screen time management is the biggest challenge! How do other parents handle this? 👶",
      "Traditional Indian parenting wisdom combined with modern child psychology works best.",
      "Just found an amazing Montessori preschool for my toddler. The learning methodology is impressive!",
      "Meal planning tip: Batch cook on Sundays. Saves so much stress during weekdays.",
      "Parenting is hard but those bedtime cuddles make everything worth it. Cherish these moments!",
      "Looking for playdate groups in Gurgaon for my 4-year-old. Any recommendations?",
    ],
    "home-decor": [
      "Just did a complete makeover of my living room using only thrifted items. Budget decor win! 🏠",
      "Indoor plants change everything about a space. My pothos collection is growing rapidly.",
      "DIY tip: Use old sarees to make cushion covers. Adds such beautiful ethnic touches to your home.",
      "Natural lighting is everything! Removed heavy curtains and the space feels so much bigger.",
      "Minimalist decor doesn't mean boring. It's about intentional pieces that spark joy.",
      "Where do you guys shop for affordable but quality furniture? IKEA is good but need more options.",
    ],
    "language-learn": [
      "Learning a new language as an adult is hard but so rewarding! Currently tackling German. 🗣️",
      "Hindi imposition debates aside, knowing multiple Indian languages opens so many doors.",
      "Language learning app recommendation: Duolingo plus traditional textbook study works best.",
      "Just started learning Tamil. The script is beautiful but pronunciation is tricky!",
      "Watching movies with subtitles is an underrated language learning tool. Works wonders!",
      "Any Sanskrit learners here? The grammatical structure is so logical and beautiful.",
    ],
    "mental-health": [
      "Therapy changed my life. There's no shame in seeking help - it's a sign of strength. 🧠",
      "Anxiety tip: The 5-4-3-2-1 grounding technique works instantly. Try it during panic moments.",
      "Mental health awareness in India is growing but we still have a long way to go.",
      "Self-care isn't selfish. You can't pour from an empty cup. Take time for yourself.",
      "Just started meditation using the Headspace app. 10 minutes daily makes such a difference.",
      "Support group forming for people dealing with workplace burnout. DM if interested in joining.",
    ],
  };

  // Get responses for the specific community or fallback to general
  const communityResponses = responses[communityId] || responses["travel-india"];
  
  // Pick random response
  return communityResponses[Math.floor(Math.random() * communityResponses.length)];
}

export default function CommunityChatPage() {
  const params = useParams();
  const communityId = (params.id as string) || "travel-india";
  const community = COMMUNITY_INFO[communityId] || COMMUNITY_INFO["travel-india"];
  const members = COMMUNITY_MEMBERS[communityId] || COMMUNITY_MEMBERS["default"];
  const photos = COMMUNITY_PHOTOS[communityId] || COMMUNITY_PHOTOS["default"];
  
  // Domain-specific initial messages for each cohort
  const getInitialMessages = (communityId: string, community: typeof COMMUNITY_INFO["travel-india"], members: typeof COMMUNITY_MEMBERS["default"], photos: string[]): Message[] => {
    const welcomeMessage: Message = {
      id: "1",
      senderId: "system",
      senderName: community.name,
      senderAvatar: "",
      text: `Welcome to ${community.name}! ${community.description}. Share your experiences and connect with fellow enthusiasts.`,
      time: "10:00 AM",
      type: "text",
      isMe: false,
      status: "read"
    };

    // Domain-specific opening messages
    const openingMessages: Record<string, string> = {
      "travel-india": "Hey everyone! Just shared some photos from my recent trip to Kerala. The backwaters were absolutely magical! 🌴",
      "code-mumbai": "Morning devs! Just deployed our new microservice architecture. The performance gains are incredible! 🚀",
      "bollywood-beats": "Have you guys heard the new album from Laapataa Ladies? Such refreshing music! 🎵",
      "dance-bhangra": "Just finished a 3-hour Bhangra practice session! My legs are burning but the energy was amazing! 💃",
      "foodie-delhi": "Found the most amazing butter chicken at this hidden gem in Old Delhi. Food coma incoming! 🍛",
      "shutterbugs": "Captured some incredible shots during golden hour at India Gate. The lighting was perfect! 📸",
      "yoga-wellness": "Completed 108 Surya Namaskars this morning. Feeling so energized and centered! 🧘",
      "art-culture": "Just visited the India Art Fair and my mind is blown by the contemporary artists! 🎨",
      "cinema-club": "Watched Laapataa Ladies yesterday. Such a refreshing take on rural India! Highly recommend. 🎬",
      "book-worms": "Just finished 'The Immortals of Meluha'. Amish Tripathi is a master storyteller! 📚",
      "game-on": "Finally hit Immortal rank in Valorant! The grind was real but worth it! 🎮",
      "startup-hub": "Just secured our first angel investment! The pitching journey was intense but we learned so much. 🚀",
      "cricket-fans": "What a match yesterday! Rohit's captaincy decisions were spot on. That last over had me on edge! 🏏",
      "fashion-desi": "Just got this beautiful Banarasi saree for my cousin's wedding. The craftsmanship is unreal! 👗",
      "pets-india": "My rescued Indie just learned a new trick! These desi dogs are so intelligent and loving. 🐕",
      "career-growth": "Just switched from engineering to product management. Best career decision ever! 💼",
      "sustainability": "Started composting at home this month. My plants have never looked happier! 🌱",
      "finance-tips": "My SIP returns just crossed 15% CAGR over 3 years. Patience really pays off! 💰",
      "parenting-india": "Finally found a Montessori school that actually follows the methodology. So relieved! 👶",
      "home-decor": "Just transformed my living room using only thrifted items. Budget decor win! 🏠",
      "language-learn": "Successfully held a 10-minute conversation in German today! Small wins matter. 🗣️",
      "mental-health": "Completed my first therapy session today. It takes courage to seek help and I'm proud of myself. 🧠",
    };

    const openingText = openingMessages[communityId] || `Hey everyone! Excited to be part of ${community.name}. Looking forward to connecting with you all!`;

    const firstMessage: Message = {
      id: "2",
      senderId: members[0].id,
      senderName: members[0].name,
      senderAvatar: members[0].avatar,
      text: openingText,
      time: "10:05 AM",
      type: "text",
      isMe: false,
      status: "read"
    };

    const imageMessage: Message = {
      id: "3",
      senderId: members[1]?.id || members[0].id,
      senderName: members[1]?.name || members[0].name,
      senderAvatar: members[1]?.avatar || members[0].avatar,
      text: "",
      time: "10:06 AM",
      type: "image",
      imageUrl: photos[0],
      isMe: false,
      status: "read"
    };

    return [welcomeMessage, firstMessage, imageMessage];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages(communityId, community, members, photos));
  
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [moderationError, setModerationError] = useState<ModerationResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    // Clear previous moderation error
    setModerationError(null);
    
    // Check content moderation
    const moderationResult = moderateMessage(newMessage);
    if (!moderationResult.allowed) {
      // Block message and show alert
      setModerationError(moderationResult);
      return;
    }
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderAvatar: "",
      text: newMessage,
      time: timeString,
      type: "text",
      isMe: true,
      status: "sent"
    };
    
    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");
    
    // Generate LLM response
    setIsTyping(true);
    
    try {
      const { message: llmResponse, photoUrl } = await llmService.generateResponse(
        newMessage,
        communityId,
        Math.random() > 0.7 // 30% chance of including a photo
      );
      
      // Calculate realistic typing delay based on message length
      const typingDelay = llmService.getTypingDelay(llmResponse.content.length);
      
      setTimeout(() => {
        const replyMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: `member_${Math.random().toString(36).substr(2, 5)}`,
          senderName: llmResponse.senderName || "Community Member",
          senderAvatar: llmResponse.senderAvatar || "",
          text: llmResponse.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: photoUrl ? "image" : "text",
          imageUrl: photoUrl,
          isMe: false,
          status: "delivered"
        };
        
        setMessages(prev => [...prev, replyMsg]);
        setIsTyping(false);
      }, typingDelay);
      
    } catch (error) {
      console.error("Failed to generate response:", error);
      setIsTyping(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="min-h-screen bg-background pt-16 pb-0 lg:pl-72">
      {/* Telegram-style Chat Container */}
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-orange-50/50 to-amber-50/30 dark:from-slate-900 dark:to-slate-950">
        
        {/* Chat Header - Telegram Style */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
          <Link href={`/cohort/${communityId}`} className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback style={{ backgroundColor: community.color }} className="text-white text-lg">
                {community.icon}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">{community.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {245 + Math.floor(Math.random() * 100)} members online
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Messages Area - Telegram Style Bubbles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isMe && msg.senderId !== "system" && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarImage src={msg.senderAvatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {msg.senderName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[75%] ${msg.isMe ? 'ml-12' : 'mr-12'}`}>
                {!msg.isMe && msg.senderId !== "system" && idx > 0 && messages[idx-1].senderId !== msg.senderId && (
                  <p className="text-xs text-muted-foreground ml-1 mb-0.5">{msg.senderName}</p>
                )}
                
                {msg.type === "text" && (
                  <div className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.isMe 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : msg.senderId === "system"
                        ? 'bg-muted text-muted-foreground text-center mx-auto max-w-md'
                        : 'bg-white dark:bg-slate-700 text-foreground rounded-bl-sm shadow-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      <span className="text-[10px]">{msg.time}</span>
                      {msg.isMe && (
                        msg.status === "read" ? <CheckCheck className="w-3 h-3" /> :
                        msg.status === "delivered" ? <Check className="w-3 h-3" /> :
                        <Check className="w-3 h-3 opacity-50" />
                      )}
                    </div>
                  </div>
                )}
                
                {msg.type === "image" && (
                  <div className="relative rounded-2xl overflow-hidden shadow-sm max-w-[280px]">
                    <img src={msg.imageUrl} alt="Shared" className="w-full h-auto" />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      {msg.time}
                      <CheckCheck className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area - Telegram Style */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-border p-2">
          {/* Content Moderation Alert */}
          {moderationError && !moderationError.allowed && (
            <div className="mb-2 mx-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">Content Blocked</p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{moderationError.message}</p>
                  {moderationError.blockedWord && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      Detected: &ldquo;{moderationError.blockedWord}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setModerationError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground flex-shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 bg-muted rounded-2xl flex items-end px-3 py-2 gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0">
                <Smile className="h-5 w-5" />
              </Button>
              
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-1 text-sm min-h-[24px] max-h-[120px] resize-none"
              />
              
              {!newMessage.trim() ? (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0">
                  <Mic className="h-5 w-5" />
                </Button>
              ) : null}
            </div>
            
            <Button 
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0 p-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
