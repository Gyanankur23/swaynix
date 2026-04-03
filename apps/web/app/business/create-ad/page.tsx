"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, Upload, Image as ImageIcon, DollarSign,
  Target, Users, Calendar, Megaphone, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

// Target communities
const TARGET_COMMUNITIES = [
  { id: "cricket-fans", name: "Cricket Fans India", members: 89000, icon: "🏏" },
  { id: "yoga-wellness", name: "Yoga & Wellness", members: 34500, icon: "🧘" },
  { id: "travel-india", name: "Travel India", members: 45600, icon: "✈️" },
  { id: "fitness", name: "Fitness Enthusiasts", members: 52300, icon: "💪" },
  { id: "code-mumbai", name: "Code Mumbai", members: 12300, icon: "💻" },
  { id: "sports", name: "Sports & Fitness", members: 67000, icon: "⚽" },
];

export default function CreateAdPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState(20);
  const [budget, setBudget] = useState(10000);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(["cricket-fans", "sports"]);
  const [duration, setDuration] = useState(30);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = () => {
    // Simulate image upload with sports equipment images
    const sportsImages = [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600",
    ];
    setUploadedImage(sportsImages[Math.floor(Math.random() * sportsImages.length)]);
  };

  const toggleCommunity = (id: string) => {
    setSelectedCommunities(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Redirect after showing success
    setTimeout(() => {
      router.push("/business");
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-24 lg:pb-8 lg:pl-72 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Ad Created Successfully!</h2>
          <p className="text-muted-foreground">Your ad is now under review and will be live soon.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 lg:pb-8 lg:pl-72">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/business">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create New Ad</h1>
            <p className="text-muted-foreground">Promote your products to targeted communities</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image Upload */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Product Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedImage ? (
                <div className="relative">
                  <img src={uploadedImage} alt="Product" className="w-full h-64 object-cover rounded-lg" />
                  <Button 
                    type="button"
                    variant="secondary" 
                    className="absolute bottom-4 right-4"
                    onClick={handleImageUpload}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">Click to upload product image</p>
                    <p className="text-sm text-muted-foreground">Recommended: 1080x1080px, JPG or PNG</p>
                  </div>
                </button>
              )}
            </CardContent>
          </Card>

          {/* Ad Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Ad Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Ad Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Sale - Up to 40% Off Running Shoes"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your offer, product features, or promotion details..."
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Original Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2999"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <div className="pt-2">
                    <Slider
                      value={[discountPercent]}
                      onValueChange={(v) => setDiscountPercent(v[0])}
                      max={70}
                      step={5}
                    />
                    <p className="text-sm text-muted-foreground mt-1">{discountPercent}% off</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Communities */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Target Communities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TARGET_COMMUNITIES.map((community) => (
                  <button
                    key={community.id}
                    type="button"
                    onClick={() => toggleCommunity(community.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedCommunities.includes(community.id)
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/30"
                    }`}
                  >
                    <span className="text-2xl">{community.icon}</span>
                    <p className="font-medium text-foreground mt-2">{community.name}</p>
                    <p className="text-xs text-muted-foreground">{(community.members / 1000).toFixed(1)}K members</p>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                <Users className="w-4 h-4 inline mr-1" />
                Estimated reach: {selectedCommunities.length * 45000}+ users
              </p>
            </CardContent>
          </Card>

          {/* Budget & Duration */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Budget & Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Daily Budget</Label>
                  <span className="font-semibold">₹{budget.toLocaleString()}</span>
                </div>
                <Slider
                  value={[budget]}
                  onValueChange={(v) => setBudget(v[0])}
                  min={1000}
                  max={50000}
                  step={1000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹1,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Campaign Duration</Label>
                  <span className="font-semibold">{duration} days</span>
                </div>
                <Slider
                  value={[duration]}
                  onValueChange={(v) => setDuration(v[0])}
                  min={7}
                  max={60}
                  step={7}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>7 days</span>
                  <span>60 days</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-bold text-lg">₹{(budget * duration).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated reach</span>
                  <span>{(selectedCommunities.length * 15000).toLocaleString()}+ users</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/business" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              disabled={isSubmitting || !adTitle || !adDescription}
            >
              {isSubmitting ? "Creating..." : "Create Ad Campaign"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
