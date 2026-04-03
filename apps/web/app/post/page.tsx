"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Send, X, Sparkles, Check } from "lucide-react";
import Link from "next/link";

const COMMUNITIES = [
  { id: "code-mumbai", name: "Code Mumbai", icon: "💻", color: "#00D4FF" },
  { id: "bollywood-beats", name: "Bollywood Beats", icon: "🎵", color: "#9D4EDD" },
  { id: "cricket-fans", name: "Cricket Fans", icon: "🏏", color: "#FF6B6B" },
  { id: "travel-india", name: "Travel India", icon: "✈️", color: "#FF6B9D" },
  { id: "foodie-delhi", name: "Delhi Foodies", icon: "🍳", color: "#FB8500" },
  { id: "shutterbugs", name: "Indian Shutterbugs", icon: "📸", color: "#38B000" },
  { id: "yoga-wellness", name: "Yoga & Wellness", icon: "🧘", color: "#06FFB4" },
  { id: "art-culture", name: "Art & Culture", icon: "🎨", color: "#C77DFF" },
  { id: "dance-bhangra", name: "Bhangra & Dance", icon: "💃", color: "#FF006E" },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoggedIn, addPost } = useAuth();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;
    if (!selectedCommunity) {
      alert("Please select a community");
      return;
    }

    setIsSubmitting(true);

    const community = COMMUNITIES.find(c => c.id === selectedCommunity);

    addPost({
      userId: user?.id || "anonymous",
      author: user?.name || "Anonymous",
      authorHandle: user?.handle || "anonymous",
      authorAvatar: user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      community: community?.name || selectedCommunity,
      content: content.trim(),
      image: imageUrl.trim() || null,
    });

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 px-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">Please login to create posts</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Post Published!</h2>
          <p className="text-muted-foreground">Redirecting to feed...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Post</h1>
            <p className="text-muted-foreground">Share something with your communities</p>
          </div>
        </div>

        {/* User Card */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-4 flex items-center gap-4">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
              alt={user?.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-foreground">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">@{user?.handle || "user"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Create Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              What's on your mind?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Community Selection */}
              <div className="space-y-3">
                <Label>Select Community</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMUNITIES.map((community) => (
                    <Badge
                      key={community.id}
                      role="button"
                      onClick={() => setSelectedCommunity(community.id)}
                      className={`cursor-pointer transition-all ${
                        selectedCommunity === community.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      style={{
                        borderColor: selectedCommunity === community.id ? community.color : undefined,
                        borderWidth: selectedCommunity === community.id ? "2px" : undefined,
                      }}
                    >
                      {community.icon} {community.name}
                    </Badge>
                  ))}
                </div>
                {selectedCommunity && (
                  <p className="text-sm text-muted-foreground">
                    Posting to: <span className="text-primary font-medium">{COMMUNITIES.find(c => c.id === selectedCommunity)?.name}</span>
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Your Post</Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, experiences, or questions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] resize-none"
                  required
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{content.length} characters</span>
                </div>
              </div>

              {/* Optional Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Image URL (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <Button type="button" variant="outline" size="icon" onClick={() => setImageUrl("")}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border">
                    <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!content.trim() || !selectedCommunity || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isSubmitting ? (
                    <Sparkles className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
