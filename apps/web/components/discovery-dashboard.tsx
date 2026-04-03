"use client";

import { useState, useEffect } from "react";
import { CohortCard } from "./cohort-card";
import { EngagementCard } from "./engagement-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, TrendingUp, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface DiscoveryDashboardProps {
  userId: string;
}

/**
 * DiscoveryDashboard Component
 * Primary feed showing "Recommended Cohorts" based on JSONB matcher
 * Anti-FOMO: No global timeline, only cohort recommendations
 */
export function DiscoveryDashboard({ userId }: DiscoveryDashboardProps) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"recommended" | "trending" | "discover">("recommended");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // Fetch recommendations (uses JSONB matcher)
      const recRes = await fetch(`${API_URL}/api/users/${userId}/recommendations`);
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData.data || []);
      }

      // Fetch trending
      const trendRes = await fetch(`${API_URL}/api/cohorts/trending`);
      if (trendRes.ok) {
        const trendData = await trendRes.json();
        setTrending(trendData.data || []);
      }

      // Fetch user engagement data
      const userRes = await fetch(`${API_URL}/api/users/${userId}/score`);
      if (userRes.ok) {
        const userScoreData = await userRes.json();
        setUserData(userScoreData.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const interests = searchQuery.split(",").map(i => i.trim());
      const res = await fetch(
        `${API_URL}/api/cohorts/discover?interests=${interests.join(",")}`
      );
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.data || []);
        setActiveTab("discover");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const displayCohorts = activeTab === "trending" ? trending : recommendations;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with User Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Engagement Card */}
        {userData && (
          <div className="lg:w-80 shrink-0">
            <EngagementCard
              userId={userId}
              username={userData.username}
              engagementScore={userData.engagement_score}
              level={userData.level}
              contributionLevel={userData.contributionLevel}
            />
          </div>
        )}

        {/* Right: Search & Discovery */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                placeholder="Search by interests (e.g., technology, art, wellness)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={activeTab === "recommended" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("recommended")}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Recommended
              <Badge variant="secondary" className="ml-1">
                {recommendations.length}
              </Badge>
            </Button>
            
            <Button
              variant={activeTab === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("trending")}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
              <Badge variant="secondary" className="ml-1">
                {trending.length}
              </Badge>
            </Button>

            {activeTab === "discover" && (
              <Button
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Compass className="w-4 h-4" />
                Search Results
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cohort Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {activeTab === "recommended" && "Recommended for You"}
          {activeTab === "trending" && "Trending Cohorts"}
          {activeTab === "discover" && "Discovery Results"}
        </h2>
        
        {displayCohorts.length === 0 ? (
          <div className="text-center py-12 bg-secondary/30 rounded-lg">
            <Compass className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {activeTab === "recommended" 
                ? "No recommendations yet. Try searching for your interests!"
                : "No cohorts found. Try adjusting your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayCohorts.map((cohort) => (
              <CohortCard
                key={cohort.id}
                id={cohort.id}
                name={cohort.name}
                slug={cohort.slug}
                description={cohort.description}
                metadata={cohort.metadata}
                memberCount={cohort.member_count}
                matchScore={cohort.match_score}
                matchingTopics={cohort.matching_topics}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
