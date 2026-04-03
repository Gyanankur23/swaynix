import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Hash, ArrowRight, Target } from "lucide-react";
import Link from "next/link";

interface CohortCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  metadata: {
    tags?: string[];
    topics?: string[];
    difficulty?: string;
    engagement_model?: string;
  };
  memberCount: number;
  matchScore?: number;
  matchingTopics?: string[];
}

/**
 * CohortCard Component
 * Displays cohort information with interest-based matching indicators
 */
export function CohortCard({
  name,
  slug,
  description,
  metadata,
  memberCount,
  matchScore,
  matchingTopics
}: CohortCardProps) {
  const topics = metadata?.tags || metadata?.topics || [];
  const isRecommended = matchScore && matchScore > 0;

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {description}
            </CardDescription>
          </div>
          
          {isRecommended && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded text-xs font-medium text-green-700 dark:text-green-400 shrink-0">
              <Target className="w-3 h-3" />
              {matchScore} match
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Topics */}
        <div className="flex flex-wrap gap-1.5">
          {topics.slice(0, 4).map((topic) => (
            <Badge 
              key={topic} 
              variant={matchingTopics?.includes(topic) ? "default" : "secondary"}
              className="text-xs"
            >
              <Hash className="w-3 h-3 mr-0.5" />
              {topic}
            </Badge>
          ))}
          {topics.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{topics.length - 4}
            </Badge>
          )}
        </div>

        {/* Stats & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {memberCount.toLocaleString()} members
            </span>
            {metadata.difficulty && (
              <Badge variant="outline" className="text-xs capitalize">
                {metadata.difficulty}
              </Badge>
            )}
          </div>

          <Link href={`/cohort/${slug}`}>
            <Button size="sm" variant="ghost" className="gap-1">
              Explore
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Matching Topics Highlight */}
        {matchingTopics && matchingTopics.length > 0 && (
          <p className="text-xs text-green-600 dark:text-green-400">
            Matches your interests in: {matchingTopics.slice(0, 3).join(", ")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
