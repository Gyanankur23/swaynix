"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, UserPlus, UserCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth, Post } from "@/components/auth-context";
import { getPublicProfile } from "@/lib/public-profiles";
import { useToast } from "@/components/ui/toast-provider";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle: rawHandle } = use(params);
  const handle = decodeURIComponent(rawHandle).toLowerCase();
  const router = useRouter();
  const { user, posts, connections, toggleConnection } = useAuth();
  const { toast } = useToast();

  const profile = getPublicProfile(handle);
  const isSelf = user?.handle?.toLowerCase() === handle;
  const connected = connections.includes(handle);

  useEffect(() => {
    if (isSelf) router.replace("/profile");
  }, [isSelf, router]);

  const theirPosts = posts.filter(
    (p: Post) => p.authorHandle?.toLowerCase() === handle
  );

  if (isSelf) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center font-inter">
        <p className="text-muted-foreground">Opening your profile…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 px-6 lg:pl-80 font-inter">
        <div className="max-w-lg mx-auto text-center space-y-6 pt-12">
          <p className="text-2xl font-bold text-foreground">No public profile for @{handle}</p>
          <p className="text-muted-foreground">They may not be in the directory yet. Connect from Explore → Nearby.</p>
          <Link href="/explore">
            <Button className="rounded-2xl">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const onConnect = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    toggleConnection(handle, profile.name);
    toast(
      connected ? `Disconnected from ${profile.name}` : `Connected with ${profile.name}`,
      connected ? "info" : "success"
    );
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72 font-inter">
      <div className="max-w-3xl mx-auto space-y-10">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Explore
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-primary/10 shadow-premium rounded-[2.5rem] overflow-hidden bg-white">
            <CardContent className="p-10 flex flex-col md:flex-row gap-8 items-start">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary/10 shadow-lg">
                <AvatarImage src={profile.avatar} className="object-cover" />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {profile.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground tracking-tight">{profile.name}</h1>
                  <p className="text-primary font-bold text-xl mt-1">@{profile.handle}</p>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">{profile.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-primary/20 text-foreground rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{profile.city}</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    className={`rounded-2xl font-bold h-12 px-8 ${
                      connected ? "bg-white border-2 border-primary text-primary hover:bg-primary/5" : ""
                    }`}
                    variant={connected ? "outline" : "default"}
                    onClick={onConnect}
                  >
                    {!user ? (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" /> Log in to connect
                      </>
                    ) : connected ? (
                      <>
                        <UserCheck className="w-5 h-5 mr-2" /> Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" /> Connect
                      </>
                    )}
                  </Button>
                  {user && (
                    <Button variant="outline" className="rounded-2xl font-bold h-12 px-8 border-primary/20" asChild>
                      <Link href="/messages">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Message
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent posts</h2>
          {theirPosts.length === 0 ? (
            <p className="text-muted-foreground">No posts synced to this profile yet.</p>
          ) : (
            <div className="space-y-6">
              {theirPosts.slice(0, 8).map((post) => (
                <Card key={post.id} className="border border-primary/10 rounded-3xl p-6 shadow-sm">
                  <p className="text-foreground leading-relaxed">{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="" className="mt-4 rounded-2xl w-full max-h-80 object-cover" />
                  )}
                  <p className="text-xs text-muted-foreground mt-4 font-bold uppercase tracking-widest">{post.time}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
