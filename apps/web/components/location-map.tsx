"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  MapPin, Navigation, Users, MessageCircle, Share2,
  LocateFixed, ChevronRight, Sparkles, Search, Filter,
  Compass, Zap, Crown, Check
} from "lucide-react";

// Indian metro cities data with coordinates
const INDIAN_METROS = [
  { id: "mumbai", name: "Mumbai", lat: 19.0760, lng: 72.8777, population: "20.4M", tag: "City of Dreams", icon: "🎬", color: "#FF6B6B" },
  { id: "delhi", name: "Delhi NCR", lat: 28.6139, lng: 77.2090, population: "30.3M", tag: "Dilwalon Ki", icon: "🏛️", color: "#4ECDC4" },
  { id: "bangalore", name: "Bangalore", lat: 12.9716, lng: 77.5946, population: "12.3M", tag: "Silicon Valley", icon: "💻", color: "#96CEB4" },
  { id: "hyderabad", name: "Hyderabad", lat: 17.3850, lng: 78.4867, population: "10.5M", tag: "Pearl City", icon: "🍜", color: "#FFEAA7" },
  { id: "chennai", name: "Chennai", lat: 13.0827, lng: 80.2707, population: "11.5M", tag: "Cultural Capital", icon: "🎭", color: "#DDA0DD" },
  { id: "pune", name: "Pune", lat: 18.5204, lng: 73.8567, population: "7.2M", tag: "Oxford of East", icon: "🏫", color: "#98D8C8" },
  { id: "kolkata", name: "Kolkata", lat: 22.5726, lng: 88.3639, population: "14.8M", tag: "City of Joy", icon: "☕", color: "#F7DC6F" },
  { id: "ahmedabad", name: "Ahmedabad", lat: 23.0225, lng: 72.5714, population: "8.8M", tag: "Heritage City", icon: "🏗️", color: "#BB8FCE" },
  { id: "jaipur", name: "Jaipur", lat: 26.9124, lng: 75.7873, population: "4.3M", tag: "Pink City", icon: "🏰", color: "#FF9FF3" },
  { id: "lucknow", name: "Lucknow", lat: 26.8467, lng: 80.9462, population: "3.6M", tag: "City of Nawabs", icon: "🍢", color: "#F8B500" },
];

// City-specific nearby users with unique names and interests per city
const CITY_USERS: Record<string, Array<{id: number, name: string, distance: string, interests: string[], status: string, avatar: string}>> = {
  mumbai: [
    { id: 1, name: "Aarav Patel", distance: "0.3 km", interests: ["Bollywood", "Marine Drive"], status: "online", avatar: "AP" },
    { id: 2, name: "Zara Khan", distance: "0.8 km", interests: ["Fashion", "Marine Lines"], status: "online", avatar: "ZK" },
    { id: 3, name: "Rohan Desai", distance: "1.5 km", interests: ["Finance", "BSE"], status: "offline", avatar: "RD" },
    { id: 4, name: "Mira Joshi", distance: "2.2 km", interests: ["Street Food", "Juhu Beach"], status: "online", avatar: "MJ" },
    { id: 5, name: "Vikram Mehta", distance: "3.1 km", interests: ["Startups", "Bandra"], status: "offline", avatar: "VM" },
  ],
  delhi: [
    { id: 1, name: "Arjun Singh", distance: "0.4 km", interests: ["History", "CP"], status: "online", avatar: "AS" },
    { id: 2, name: "Priya Gupta", distance: "1.1 km", interests: ["Politics", "Lutyens"], status: "online", avatar: "PG" },
    { id: 3, name: "Kabir Malhotra", distance: "1.8 km", interests: ["Food", "Old Delhi"], status: "offline", avatar: "KM" },
    { id: 4, name: "Anaya Sharma", distance: "2.5 km", interests: ["Art", "Hauz Khas"], status: "online", avatar: "AS" },
    { id: 5, name: "Dev Khanna", distance: "3.3 km", interests: ["Photography", "India Gate"], status: "offline", avatar: "DK" },
  ],
  bangalore: [
    { id: 1, name: "Rahul Kumar", distance: "0.2 km", interests: ["Tech", "Koramangala"], status: "online", avatar: "RK" },
    { id: 2, name: "Sneha Rao", distance: "0.9 km", interests: ["Startups", "HSR"], status: "online", avatar: "SR" },
    { id: 3, name: "Nikhil Nair", distance: "1.6 km", interests: ["Craft Beer", "Indiranagar"], status: "offline", avatar: "NN" },
    { id: 4, name: "Divya Iyer", distance: "2.3 km", interests: ["Yoga", "Ulsoor"], status: "online", avatar: "DI" },
    { id: 5, name: "Arun Reddy", distance: "3.0 km", interests: ["Cycling", "MG Road"], status: "offline", avatar: "AR" },
  ],
  hyderabad: [
    { id: 1, name: "Aditya Reddy", distance: "0.5 km", interests: ["Biryani", "Charminar"], status: "online", avatar: "AR" },
    { id: 2, name: "Kavya Goud", distance: "1.2 km", interests: ["IT", "Gachibowli"], status: "online", avatar: "KG" },
    { id: 3, name: "Ravi Chandra", distance: "1.9 km", interests: ["History", "Golconda"], status: "offline", avatar: "RC" },
    { id: 4, name: "Meena Rao", distance: "2.6 km", interests: ["Pearls", "Begum Bazaar"], status: "online", avatar: "MR" },
    { id: 5, name: "Santosh Yadav", distance: "3.4 km", interests: ["Movies", "Ramoji"], status: "offline", avatar: "SY" },
  ],
  chennai: [
    { id: 1, name: "Karthik Venkat", distance: "0.3 km", interests: ["Classical Music", "Mylapore"], status: "online", avatar: "KV" },
    { id: 2, name: "Lakshmi Iyer", distance: "1.0 km", interests: ["Filter Coffee", "T Nagar"], status: "online", avatar: "LI" },
    { id: 3, name: "Suresh Babu", distance: "1.7 km", interests: ["Marina Beach", "Cricket"], status: "offline", avatar: "SB" },
    { id: 4, name: "Anjali Krishnan", distance: "2.4 km", interests: ["Bharatanatyam", "Kapaleeshwar"], status: "online", avatar: "AK" },
    { id: 5, name: "Manoj Pillai", distance: "3.2 km", interests: ["Movies", "Kollywood"], status: "offline", avatar: "MP" },
  ],
  pune: [
    { id: 1, name: "Rohit Jadhav", distance: "0.4 km", interests: ["Education", "FC Road"], status: "online", avatar: "RJ" },
    { id: 2, name: "Neha Patil", distance: "1.1 km", interests: ["Trekking", "Sinhagad"], status: "online", avatar: "NP" },
    { id: 3, name: "Pranav Deshmukh", distance: "1.8 km", interests: ["Cars", "Mumbai-Pune"], status: "offline", avatar: "PD" },
    { id: 4, name: "Sakshi Kulkarni", distance: "2.5 km", interests: ["Music", "Sawai"], status: "online", avatar: "SK" },
    { id: 5, name: "Amit Joshi", distance: "3.3 km", interests: ["Defence", "Khadki"], status: "offline", avatar: "AJ" },
  ],
  kolkata: [
    { id: 1, name: "Sourav Das", distance: "0.3 km", interests: ["Football", "Salt Lake"], status: "online", avatar: "SD" },
    { id: 2, name: "Raima Sen", distance: "1.0 km", interests: ["Theatre", "Park Street"], status: "online", avatar: "RS" },
    { id: 3, name: "Abhishek Banerjee", distance: "1.7 km", interests: ["Politics", "Writers"], status: "offline", avatar: "AB" },
    { id: 4, name: "Priyanka Ghosh", distance: "2.4 km", interests: ["Sweets", "Rosogolla"], status: "online", avatar: "PG" },
    { id: 5, name: "Dipankar Roy", distance: "3.2 km", interests: ["Durga Puja", "Pandal"], status: "offline", avatar: "DR" },
  ],
  ahmedabad: [
    { id: 1, name: "Harsh Shah", distance: "0.5 km", interests: ["Business", "SG Highway"], status: "online", avatar: "HS" },
    { id: 2, name: "Pooja Patel", distance: "1.2 km", interests: ["Dandiya", "Garba"], status: "online", avatar: "PP" },
    { id: 3, name: "Kunal Modi", distance: "1.9 km", interests: ["Textiles", "Maninagar"], status: "offline", avatar: "KM" },
    { id: 4, name: "Isha Thakkar", distance: "2.6 km", interests: ["Food", "Thali"], status: "online", avatar: "IT" },
    { id: 5, name: "Deep Trivedi", distance: "3.4 km", interests: ["Sabarmati", "Riverfront"], status: "offline", avatar: "DT" },
  ],
  jaipur: [
    { id: 1, name: "Rajveer Rathore", distance: "0.4 km", interests: ["Heritage", "Hawa Mahal"], status: "online", avatar: "RR" },
    { id: 2, name: "Priyanshi Shekhawat", distance: "1.1 km", interests: ["Jewelry", "Johari"], status: "online", avatar: "PS" },
    { id: 3, name: "Veer Singh", distance: "1.8 km", interests: ["Royalty", "City Palace"], status: "offline", avatar: "VS" },
    { id: 4, name: "Komal Kachhwaha", distance: "2.5 km", interests: ["Block Print", "Sanganer"], status: "online", avatar: "KK" },
    { id: 5, name: "Hemant Purohit", distance: "3.3 km", interests: ["Elephants", "Amer"], status: "offline", avatar: "HP" },
  ],
  lucknow: [
    { id: 1, name: "Faiz Ahmed", distance: "0.3 km", interests: ["Shayari", "Hazratganj"], status: "online", avatar: "FA" },
    { id: 2, name: "Zoya Siddiqui", distance: "1.0 km", interests: ["Chikankari", "Nakhas"], status: "online", avatar: "ZS" },
    { id: 3, name: "Imran Khan", distance: "1.7 km", interests: ["Kebabs", "Tunday"], status: "offline", avatar: "IK" },
    { id: 4, name: "Rubina Kausar", distance: "2.4 km", interests: ["Kathak", "Gomti"], status: "online", avatar: "RK" },
    { id: 5, name: "Tariq Hussain", distance: "3.2 km", interests: ["Politics", "Assembly"], status: "offline", avatar: "TH" },
  ],
};

export function LocationMap() {
  const [selectedCity, setSelectedCity] = useState(INDIAN_METROS[0]);
  const [showNearby, setShowNearby] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<Set<number>>(new Set());

  const nearbyUsers = CITY_USERS[selectedCity.id] || CITY_USERS.mumbai;

  // Load connected users from "backend"
  useEffect(() => {
    const saved = localStorage.getItem("connected_users");
    if (saved) {
      setConnectedUsers(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleConnect = (userId: number) => {
    setConnectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      localStorage.setItem("connected_users", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  // Simulate getting user location
  const getUserLocation = () => {
    // In production, use navigator.geolocation.getCurrentPosition
    setUserLocation({ lat: selectedCity.lat + 0.01, lng: selectedCity.lng + 0.01 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <MapPin className="w-7 h-7 text-pink-500" />
            Discover Nearby
          </h2>
          <p className="text-gray-400">Connect with people in your city</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={getUserLocation}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
          >
            <LocateFixed className="w-4 h-4 mr-2" />
            Find My Location
          </Button>
        </div>
      </div>

      {/* City Selector - PVR Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {INDIAN_METROS.map((city) => (
          <motion.button
            key={city.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCity(city)}
            className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all ${
              selectedCity.id === city.id
                ? "ring-2 ring-offset-2 ring-offset-slate-950 ring-white shadow-lg"
                : "hover:shadow-md"
            }`}
            style={{
              background: selectedCity.id === city.id
                ? `linear-gradient(135deg, ${city.color}40, ${city.color}20)`
                : "rgba(255,255,255,0.05)",
              borderColor: selectedCity.id === city.id ? city.color : "transparent",
              borderWidth: "2px",
            }}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{city.icon}</span>
              {selectedCity.id === city.id && (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: city.color }} />
              )}
            </div>
            <p className="font-bold text-white mt-2">{city.name}</p>
            <p className="text-gray-400 text-xs">{city.tag}</p>
            <p className="text-gray-500 text-xs mt-1">{city.population} people</p>
          </motion.button>
        ))}
      </div>

      {/* Map Visualization */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-white/10 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-96 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            {/* City Center Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${selectedCity.color}30` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: selectedCity.color }}
                >
                  {selectedCity.icon}
                </div>
              </motion.div>
              <p className="text-white font-bold text-center mt-2 bg-black/50 px-3 py-1 rounded-full text-sm">
                {selectedCity.name}
              </p>
            </div>

            {/* Nearby User Markers */}
            {showNearby && nearbyUsers.map((user: (typeof nearbyUsers)[number], idx: number) => (
              <motion.div
                key={user.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="absolute"
                style={{
                  top: `${20 + (idx * 15)}%`,
                  left: `${15 + (idx * 12)}%`,
                }}
              >
                <div className="relative group cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                    user.status === "online" ? "ring-2 ring-green-400 ring-offset-2 ring-offset-slate-950" : ""
                  }}`}
                    style={{ backgroundColor: selectedCity.color }}
                  >
                    {user.avatar}
                  </div>
                  {user.status === "online" && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950" />
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-white text-slate-900 px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
                      <p className="font-bold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.distance} away</p>
                      <p className="text-xs text-purple-600">{user.interests.join(" • ")}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* User Location Marker */}
            {userLocation && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-1/4 right-1/4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500 rounded-full"
                  />
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white relative z-10">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <p className="text-white text-xs font-bold mt-1 text-center">You</p>
                </div>
              </motion.div>
            )}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-gray-300">Online</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-gray-300">Offline</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearbyUsers.map((user: (typeof nearbyUsers)[number]) => (
          <Card key={user.id} className="bg-card border-border hover:bg-muted transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback
                  className="text-white font-bold"
                  style={{ backgroundColor: selectedCity.color }}
                >
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{user.name}</p>
                  {user.status === "online" && (
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{user.distance} away</p>
                <div className="flex gap-1 mt-1">
                  {user.interests.map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-xs border-primary/30 text-primary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                size="sm" 
                className={`transition-all ${connectedUsers.has(user.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-purple-600 to-pink-500'}`}
                onClick={() => handleConnect(user.id)}
              >
                {connectedUsers.has(user.id) ? (
                  <><Check className="w-4 h-4 mr-1" /> Connected</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-1" /> Connect</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
