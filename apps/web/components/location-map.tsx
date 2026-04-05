"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast-provider";
import {
  MapPin, Navigation, Users, MessageCircle, Share2,
  LocateFixed, ChevronRight, Sparkles, Search, Filter,
  Compass, Zap, Crown, Check, Target, Radar, Globe,
  ShieldCheck, ArrowUpRight
} from "lucide-react";

// Leaflet imports
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';

// Fix for default Leaflet icon not showing up in Next.js
const fixLeafletIcon = () => {
    if (typeof window !== 'undefined') {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }
};

const INDIAN_METROS = [
  { id: "mumbai", name: "Mumbai", lat: 19.0760, lng: 72.8777, tag: "Hub City", icon: "🎬", color: "#FF6B6B" },
  { id: "delhi", name: "Delhi NCR", lat: 28.6139, lng: 77.2090, tag: "Governance", icon: "🏛️", color: "#4ECDC4" },
  { id: "bangalore", name: "Bangalore", lat: 12.9716, lng: 77.5946, tag: "Tech Sector", icon: "💻", color: "#96CEB4" },
  { id: "hyderabad", name: "Hyderabad", lat: 17.3850, lng: 78.4867, tag: "Pearl Hub", icon: "🍜", color: "#FFEAA7" },
  { id: "chennai", name: "Chennai", lat: 13.0827, lng: 80.2707, tag: "Culture Node", icon: "🎭", color: "#DDA0DD" },
];

const CITY_USERS: any = {
  mumbai: [
    { id: 1, name: "Aarav Patel", lat: 19.0800, lng: 72.8800, interests: ["Bollywood", "Surf"], status: "online", avatar: "AP" },
    { id: 2, name: "Zara Khan", lat: 19.0700, lng: 72.8700, interests: ["Fashion", "Tech"], status: "online", avatar: "ZK" },
  ],
  delhi: [
    { id: 3, name: "Arjun Singh", lat: 28.6200, lng: 77.2100, interests: ["History", "Art"], status: "online", avatar: "AS" },
    { id: 4, name: "Priya Gupta", lat: 28.6000, lng: 77.2000, interests: ["Politics", "Law"], status: "online", avatar: "PG" },
  ],
  bangalore: [
    { id: 5, name: "Rahul Kumar", lat: 12.9800, lng: 77.6000, interests: ["Dev", "Web3"], status: "online", avatar: "RK" },
    { id: 6, name: "Sneha Rao", lat: 12.9600, lng: 77.5800, interests: ["Figma", "Yoga"], status: "online", avatar: "SR" },
  ],
};

export function LocationMap() {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState(INDIAN_METROS[0]);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<Set<number>>(new Set());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fixLeafletIcon();
  }, []);

  const currentUsers = CITY_USERS[selectedCity.id] || [];

  const handleConnect = (userId: number, name: string) => {
    setConnectedUsers(prev => {
      const newSet = new Set(prev);
      const isConnecting = !newSet.has(userId);
      if (!isConnecting) newSet.delete(userId); else newSet.add(userId);
      toast(isConnecting ? `Signal Synchronized with ${name}` : `Connection Severed with ${name}`, isConnecting ? "success" : "info");
      return newSet;
    });
  };

  const toggleGps = () => {
    setIsGpsActive(true);
    toast("Initiating Real-Time GPS Signal Broadcast...", "brand");
    setTimeout(() => {
        toast("Human Signal Active: India/Mumbai Node Detected", "success");
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black italic text-xs tracking-widest px-6 py-1.5 rounded-full uppercase">Real-Time Signal Localization</Badge>
          <h2 className="text-5xl font-black italic text-foreground tracking-tighter leading-none font-jakarta">Global Pulse Map</h2>
          <p className="text-muted-foreground font-medium text-lg italic font-inter">Discover 2.4K human connections in your immediate sector.</p>
        </div>
        <Button 
            onClick={toggleGps}
            className={`h-16 px-10 rounded-[1.5rem] font-black italic text-xl shadow-2xl transition-all hover:translate-y-[-4px] ${isGpsActive ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-primary text-white shadow-primary/20'}`}
        >
            <LocateFixed className={`w-6 h-6 mr-3 ${isGpsActive ? 'animate-pulse' : ''}`} />
            {isGpsActive ? "GPS Signal Live" : "Broadcast My Signal"}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {INDIAN_METROS.map((city) => (
          <motion.button
            key={city.id}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCity(city)}
            className={`relative p-6 rounded-[2rem] text-left border-2 transition-all font-jakarta shadow-sm ${
              selectedCity.id === city.id
                ? "bg-primary text-white border-primary shadow-premium"
                : "bg-white text-muted-foreground border-muted hover:border-primary/20"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
                <span className="text-3xl filter drop-shadow-md">{city.icon}</span>
                <Radar className={`w-4 h-4 ${selectedCity.id === city.id ? 'animate-spin opacity-100' : 'opacity-20'}`} />
            </div>
            <p className="font-black italic text-lg leading-none tracking-tight">{city.name}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${selectedCity.id === city.id ? 'text-white/70' : 'text-primary'}`}>
                {city.tag}
            </p>
          </motion.button>
        ))}
      </div>

      <Card className="border-0 shadow-premium rounded-[3rem] bg-white overflow-hidden border-2 border-primary/5 group relative">
        <CardContent className="p-0">
          <div className="h-[500px] w-full relative z-0">
             {isClient && (
               <MapContainer 
                  key={selectedCity.id}
                  center={[selectedCity.lat, selectedCity.lng]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  attributionControl={false}
               >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  
                  <Circle 
                      center={[selectedCity.lat, selectedCity.lng]} 
                      radius={1000}
                      pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.05 }}
                  />

                  {currentUsers.map((user: any) => (
                      <div key={user.id}>
                          <Marker position={[user.lat, user.lng]}>
                              <Popup className="swaynix-popup">
                                  <div className="p-4 text-center space-y-3 min-w-[180px] font-jakarta">
                                      <Avatar className="w-16 h-16 mx-auto border-4 border-primary/10 shadow-lg">
                                          <AvatarFallback className="bg-primary text-white font-black italic">{user.avatar}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <p className="font-black italic text-xl tracking-tight leading-none">{user.name}</p>
                                          <p className="text-[10px] font-black text-primary uppercase mt-1">Interests Matching: 84%</p>
                                      </div>
                                      <Button size="sm" className="w-full h-10 bg-primary rounded-xl font-black italic shadow-lg" onClick={() => handleConnect(user.id, user.name)}>
                                          {connectedUsers.has(user.id) ? "Sync'd" : "Connect Signal"}
                                      </Button>
                                  </div>
                              </Popup>
                          </Marker>
                          <Circle 
                              center={[user.lat, user.lng]} 
                              radius={400}
                              pathOptions={{ color: 'rgb(255, 138, 76)', fillColor: 'rgb(255, 138, 76)', fillOpacity: 0.2 }}
                          />
                      </div>
                  ))}
               </MapContainer>
             )}

             <div className="absolute top-8 right-8 z-10 flex flex-col gap-4">
                 <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary/20 space-y-3 font-jakarta">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Sector Scan Active
                    </p>
                    <div className="h-1 w-40 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="h-full w-full bg-primary" 
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black italic text-foreground uppercase">58 ACTIVE SIGNALS</p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase italic">Signal Strength: 100%</p>
                    </div>
                 </div>
             </div>

             <div className="absolute left-8 bottom-8 z-10">
                <Badge className="bg-foreground text-background font-black italic px-6 py-2 rounded-full shadow-2xl backdrop-blur-md border-none font-jakarta">
                    <Navigation className="w-4 h-4 mr-3 text-primary animate-bounce font-inter" /> Select Hub Marker to Synchronize
                </Badge>
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        <AnimatePresence mode="popLayout">
        {currentUsers.map((user: any) => (
          <motion.div 
            key={user.id} 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
          >
            <Card className="border shadow-premium rounded-[3rem] bg-white overflow-hidden p-8 hover:shadow-2xl transition-all border-primary/5 group">
                <div className="flex items-center gap-6 mb-8 font-jakarta">
                    <div className="relative">
                        <Avatar className="w-20 h-20 border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
                            <AvatarFallback className="bg-primary text-white font-black italic text-2xl">{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black italic tracking-tighter leading-none">{user.name}</h3>
                        <p className="text-primary font-black italic text-sm">Signal: ONLINE</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                    {user.interests.map((interest: string) => (
                        <Badge key={interest} variant="outline" className="rounded-full px-4 py-1.5 border-primary/20 text-primary font-black italic text-[9px] uppercase tracking-widest font-jakarta">
                            {interest}
                        </Badge>
                    ))}
                </div>

                <Button 
                    variant={connectedUsers.has(user.id) ? "outline" : "default"}
                    className={`w-full h-14 rounded-2xl font-black italic text-lg shadow-xl transition-all font-jakarta shadow-primary/10 ${connectedUsers.has(user.id) ? 'border-green-500 text-green-600' : 'bg-primary text-white shadow-primary/20'}`}
                    onClick={() => handleConnect(user.id, user.name)}
                >
                    {connectedUsers.has(user.id) ? (
                        <><ShieldCheck className="w-6 h-6 mr-3" /> Synchronized</>
                    ) : (
                        <><Sparkles className="w-6 h-6 mr-3" /> Connect Hub</>
                    )}
                </Button>
            </Card>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
