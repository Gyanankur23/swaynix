"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_SUBNICHES, getParentCategory, type ParentCategoryId } from "@/lib/explore-taxonomy";
import { EXPLORE_COHORTS } from "@/lib/cohorts-data";
import { useAuth } from "@/components/auth-context";
import { useToast } from "@/components/ui/toast-provider";

function cohortById(id: string) {
  return EXPLORE_COHORTS.find((c) => c.id === id);
}

export default function ExploreCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = use(params);
  const parent = getParentCategory(categoryId);
  const subs = CATEGORY_SUBNICHES[categoryId as ParentCategoryId];
  const { joinedCohorts, toggleCohort } = useAuth();
  const { toast } = useToast();

  if (!parent || !subs) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 px-6 lg:pl-80 font-jakarta">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-2xl font-bold text-foreground">Category not found</p>
          <Link href="/explore">
            <Button className="rounded-2xl">Back to Explore</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hubsInCategory = EXPLORE_COHORTS.filter((c) => c.category === categoryId);

  const handleJoin = (cohortId: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCohort(cohortId, name);
    const joining = !joinedCohorts.includes(cohortId);
    toast(joining ? `Joined ${name}` : `Left ${name}`, joining ? "success" : "info");
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-6 md:px-10 lg:pl-80 font-jakarta">
      <div className="max-w-5xl mx-auto space-y-12">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          All categories
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{parent.icon}</span>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
                {parent.label}
              </h1>
              <p className="text-muted-foreground font-medium text-lg mt-3 max-w-2xl">
                Pick a more specific lane—each opens related hubs you can join.
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full">
            {parent.posts.toLocaleString()} active signals · {hubsInCategory.length} hubs in this space
          </Badge>
        </motion.div>

        <div className="space-y-16">
          {subs.map((sub, idx) => (
            <motion.section
              key={sub.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-primary/10 pb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{sub.title}</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl">{sub.description}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {sub.cohortIds.map((cid) => {
                  const cohort = cohortById(cid);
                  if (!cohort) return null;
                  return (
                    <Link key={`${sub.slug}-${cid}`} href={`/cohort/${cohort.id}`}>
                      <Card className="h-full border border-primary/10 shadow-premium rounded-3xl overflow-hidden bg-white hover:ring-2 hover:ring-primary/20 transition-all group">
                        <div className="h-40 relative overflow-hidden">
                          <img
                            src={cohort.image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xl font-bold text-foreground leading-tight">{cohort.name}</h3>
                            <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-1" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{cohort.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-bold text-foreground flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              {(cohort.members / 1000).toFixed(1)}K
                            </span>
                            <Button
                              size="sm"
                              className={`rounded-full font-bold ${
                                joinedCohorts.includes(cohort.id)
                                  ? "bg-green-600 hover:bg-green-600"
                                  : "bg-primary hover:bg-primary/90"
                              }`}
                              onClick={(e) => handleJoin(cohort.id, cohort.name, e)}
                            >
                              {joinedCohorts.includes(cohort.id) ? "Joined" : "Join hub"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm pt-8">
          Not sure?{" "}
          <Link href="/explore" className="text-primary font-bold underline-offset-4 hover:underline">
            Browse all hubs on Discover
          </Link>
        </p>
      </div>
    </div>
  );
}
