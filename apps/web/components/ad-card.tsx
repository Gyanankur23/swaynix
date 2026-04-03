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
      {/* Sponsored Label */}
      <div className="absolute -top-3 left-4 z-10">
        <Badge className="bg-gray-800 text-gray-400 text-xs border border-gray-700">
          <Sparkles className="w-3 h-3 mr-1" />
          Sponsored
        </Badge>
      </div>

      <Card className="bg-gray-900 border-gray-700 overflow-hidden border-2">
        <CardContent className="p-0">
          {/* Company Header */}
          <div className="p-4 pt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FF85]/20 to-[#00FF85]/5 flex items-center justify-center">
              <span className="text-[#00FF85] font-bold text-lg">
                {ad.companyName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-white font-bold">{ad.companyName}</p>
              <p className="text-gray-500 text-xs">Promoted</p>
            </div>
          </div>

          {/* Ad Content */}
          <div className="px-4 pb-3">
            <h3 className="text-white font-bold text-lg mb-2">{ad.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{ad.body}</p>
          </div>

          {/* Ad Image */}
          {ad.imageUrl && (
            <div className="relative overflow-hidden">
              <img 
                src={ad.imageUrl} 
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
            </div>
          )}

          {/* CTA Button - Larger for mobile touch targets */}
          <div className="p-4 border-t border-gray-800">
            <Button 
              className="w-full h-12 bg-[#00FF85] text-black hover:bg-[#00FF85]/90 font-bold text-base rounded-xl"
              onClick={() => window.open(ad.ctaUrl, "_blank")}
            >
              {ad.ctaText}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            {/* Anti-FOMO: No public engagement counts shown */}
            <p className="text-gray-600 text-xs text-center mt-2">
              Targeted based on your interests
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
