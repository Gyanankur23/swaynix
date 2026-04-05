"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";

interface Ad {
  id: string;
  type: "ad";
  companyName: string;
  title: string;
  body: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl: string;
}

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute -top-3 left-4 z-10">
        <Badge className="bg-primary/10 text-primary text-xs border border-primary/20">
          <Sparkles className="w-3 h-3 mr-1" />
          Sponsored
        </Badge>
      </div>

      <Card className="bg-white border-2 border-primary/10 overflow-hidden shadow-premium">
        <CardContent className="p-0">
          <div className="p-4 pt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {ad.companyName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-foreground font-bold">{ad.companyName}</p>
              <p className="text-muted-foreground text-xs">Promoted</p>
            </div>
          </div>

          <div className="px-4 pb-3">
            <h3 className="text-foreground font-bold text-lg mb-2">{ad.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{ad.body}</p>
          </div>

          {ad.imageUrl && (
            <div className="relative overflow-hidden">
              <img 
                src={ad.imageUrl} 
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          <div className="p-4 border-t border-primary/10">
            <Button 
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base rounded-xl"
              onClick={() => window.open(ad.ctaUrl, "_blank")}
            >
              {ad.ctaText}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-muted-foreground text-xs text-center mt-2">
              Targeted based on your interests
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
