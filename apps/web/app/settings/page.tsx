"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { 
  User, Bell, Shield, Moon, Sun, Globe, Smartphone,
  Mail, Key, ChevronRight, LogOut, Trash2
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const isDarkMode = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 pt-24 lg:pl-72">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Section */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <User className="w-5 h-5 text-purple-500" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Arjun Sharma</h3>
                <p className="text-slate-500 dark:text-slate-400">@arjun_sharma</p>
                <p className="text-sm text-slate-400 mt-1">Mumbai, India</p>
              </div>
              <Button variant="outline" className="border-purple-500/30 text-purple-500 hover:bg-purple-500/10">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Moon className="w-5 h-5 text-indigo-500" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{isDarkMode ? "Dark Mode" : "Light Mode"}</p>
                  <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
            </div>
            
            <Separator className="bg-slate-200 dark:bg-slate-700" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Language</p>
                  <p className="text-sm text-slate-500">English (India)</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Bell className="w-5 h-5 text-amber-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive updates via email</p>
                </div>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            
            <Separator className="bg-slate-200 dark:bg-slate-700" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-slate-500">Receive push notifications</p>
                </div>
              </div>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Shield className="w-5 h-5 text-green-500" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
                  <p className="text-sm text-slate-500">Update your password</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator className="bg-slate-200 dark:bg-slate-700" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-500">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-green-500 border-green-500/30">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Log Out</p>
                <p className="text-sm text-red-400/70">Sign out from all devices</p>
              </div>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
