import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Users } from "lucide-react";

interface EngagementCardProps {
  userId: string;
  username: string;
  engagementScore: number;
  level: number;
  contributionLevel: string;
  hideFollowerCount?: boolean;
}

/**
 * EngagementCard Component
 * Displays user level and engagement without follower counts
 * Anti-FOMO: Shows quality metrics only, never follower/subscriber counts
 */
export function EngagementCard({
  userId,
  username,
  engagementScore,
  level,
  contributionLevel,
  hideFollowerCount = true
}: EngagementCardProps) {
  // Calculate progress to next level
  const levelThresholds = [0, 10, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  const currentThreshold = levelThresholds[level - 1] || 0;
  const nextThreshold = levelThresholds[level] || currentThreshold * 2;
  const progressInLevel = engagementScore - currentThreshold;
  const levelRange = nextThreshold - currentThreshold;
  const progressPercentage = Math.min(100, Math.floor((progressInLevel / levelRange) * 100));

  // Get level color
  const getLevelColor = (lvl: number) => {
    if (lvl >= 8) return "bg-gradient-to-r from-amber-500 to-orange-600";
    if (lvl >= 5) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (lvl >= 3) return "bg-gradient-to-r from-green-500 to-emerald-500";
    return "bg-gradient-to-r from-slate-500 to-gray-500";
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">@{username}</CardTitle>
            <CardDescription>Engagement Profile</CardDescription>
          </div>
          <div className={`w-12 h-12 rounded-full ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-lg`}>
            {level}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level Badge */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-medium">Level {level}</span>
          <Badge variant="secondary" className="ml-auto">
            {contributionLevel}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${getLevelColor(level)} transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {nextThreshold - engagementScore} points to next level
          </p>
        </div>

        {/* Stats - Anti-FOMO: Never show follower counts */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-semibold">{engagementScore.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Engagement Score</p>
          </div>
          
          {/* Hidden follower count - replaced with community metric */}
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <Users className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <p className="text-lg font-semibold">
              {engagementScore > 1000 ? "Active" : "Newcomer"}
            </p>
            <p className="text-xs text-muted-foreground">Status</p>
          </div>
        </div>

        {/* Anti-FOMO Notice */}
        {hideFollowerCount && (
          <p className="text-xs text-center text-muted-foreground italic">
            Follower counts hidden • Focus on quality engagement
          </p>
        )}
      </CardContent>
    </Card>
  );
}
