"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-context";
import { useToast } from "@/components/ui/toast-provider";
import { 
  User, Bell, Shield, Globe, Smartphone,
  Mail, Key, ChevronRight, LogOut, Trash2, Camera,
  Sparkles, Palette, Fingerprint, Lock, Download,
  CheckCircle2, AlertCircle, FileJson, Languages,
  MapPin, Link as LinkIcon, ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, login, logout } = useAuth();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: "India",
    website: "swaynix.com"
  });

  const [language, setLanguage] = useState("English (US)");
  const [visibility, setVisibility] = useState("Public");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        bio: user.role === 'business' ? "Official Brand Partner Hub." : "Passionate Swaynix community member.",
        location: "India",
        website: user.role === 'business' ? `${user.name.toLowerCase().replace(' ', '')}.in` : "swaynix.com"
      });
    }
  }, [user]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        login({ ...user, avatar: newAvatar });
        toast("Profile picture updated", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      login({ ...user, ...editForm });
      toast("Profile updated successfully", "success");
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-80 font-inter">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Simple Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-xl font-medium">Manage your account, security, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          
          <div className="space-y-12">
            
            {/* Account Information */}
            <Card className="border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-10 border-b bg-muted/5">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                    <Avatar className="w-32 h-32 md:w-36 md:h-36 border-4 border-white shadow-xl transition-transform group-hover:scale-105">
                      <AvatarImage src={user?.avatar} className="object-cover" />
                      <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                        {user?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                      <Camera className="w-5 h-5" />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>

                  <div className="flex-1 w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-muted-foreground ml-1">Full Name</Label>
                            <Input 
                                disabled={!isEditing}
                                value={editForm.name} 
                                onChange={e => setEditForm({...editForm, name: e.target.value})} 
                                className="h-14 rounded-2xl bg-muted/20 border-none px-6 text-lg font-semibold focus:bg-white transition-all shadow-inner" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-muted-foreground ml-1">Location</Label>
                            <Input 
                                disabled={!isEditing}
                                value={editForm.location} 
                                onChange={e => setEditForm({...editForm, location: e.target.value})} 
                                className="h-14 rounded-2xl bg-muted/20 border-none px-6 text-lg font-semibold focus:bg-white transition-all shadow-inner" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-muted-foreground ml-1">Bio</Label>
                        <Textarea 
                            disabled={!isEditing}
                            value={editForm.bio} 
                            onChange={e => setEditForm({...editForm, bio: e.target.value})} 
                            className="rounded-2xl bg-muted/20 border-none p-6 text-lg font-medium min-h-[100px] resize-none focus:bg-white transition-all shadow-inner" 
                        />
                    </div>
                    <Button 
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        className={`h-14 px-10 rounded-2xl font-bold text-lg shadow-lg transition-all ${isEditing ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/30"}`}
                    >
                        {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Preferences */}
            <Card className="border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-10 border-b bg-muted/5">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Palette className="w-6 h-6 text-primary" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SelectField 
                        label="Language" 
                        value={language} 
                        options={["English (US)", "English (UK)", "Hindi", "Marathi", "Spanish"]} 
                        onChange={setLanguage} 
                        icon={Languages}
                    />
                    <SelectField 
                        label="Account Visibility" 
                        value={visibility} 
                        options={["Public", "Private", "Friends Only"]} 
                        onChange={setVisibility} 
                        icon={Shield}
                    />
                    {/* Theme is permanently locked to Light */}
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-muted-foreground ml-1">Display Theme</Label>
                        <div className="h-14 w-full bg-muted/10 rounded-2xl px-6 flex items-center justify-between border border-primary/10">
                            <div className="flex items-center gap-3 font-semibold text-lg">
                                <Globe className="w-5 h-5 text-primary opacity-60" />
                                Light Mode
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">Always On</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-sm font-bold text-muted-foreground ml-1">Notification Controls</Label>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl">
                                <span className="font-semibold">Email Notifications</span>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl">
                                <span className="font-semibold">Push Notifications</span>
                                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                            </div>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout Section */}
            <div className="pt-8">
                 <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full h-16 rounded-2xl text-red-500 font-bold text-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                 >
                    <LogOut className="w-6 h-6 mr-4" />
                    Logout
                 </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange, icon: Icon }: any) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="space-y-2 relative">
            <Label className="text-sm font-bold text-muted-foreground ml-1">{label}</Label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-full bg-muted/20 rounded-2xl px-6 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-all font-semibold text-lg group"
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary opacity-60" />
                    {value}
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-muted z-50 overflow-hidden"
                        >
                            {options.map((opt: string) => (
                                <div 
                                    key={opt}
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    className={`px-6 py-4 hover:bg-primary/5 cursor-pointer transition-all font-medium ${value === opt ? "text-primary bg-primary/5" : "text-foreground"}`}
                                >
                                    {opt}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
