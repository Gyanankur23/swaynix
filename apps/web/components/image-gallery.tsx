"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface RandomImage {
  id: number;
  url: string;
  width: number;
  height: number;
  author: string;
}

interface ImageGalleryProps {
  count?: number;
  columns?: number;
  seed?: string;
}

// Generate random images using Picsum Photos
function generateRandomImages(count: number, seed: string): RandomImage[] {
  const images: RandomImage[] = [];
  const topics = ["tech", "nature", "architecture", "people", "business"];
  
  for (let i = 0; i < count; i++) {
    const width = 400 + Math.floor(Math.random() * 400);
    const height = 300 + Math.floor(Math.random() * 300);
    const topic = topics[i % topics.length];
    // Use different seeds for variety
    const imageSeed = `${seed}-${i}-${Date.now()}`;
    images.push({
      id: i,
      url: `https://picsum.photos/seed/${imageSeed}/${width}/${height}`,
      width,
      height,
      author: `Artist ${i + 1}`,
    });
  }
  return images;
}

// Unsplash random images (as backup)
function getUnsplashUrl(query: string, width: number, height: number): string {
  return `https://source.unsplash.com/random/${width}x${height}/?${query}&sig=${Math.random()}`;
}

export function ImageGallery({ count = 12, columns = 3, seed = "swaynix" }: ImageGalleryProps) {
  const [images, setImages] = useState<RandomImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate images on mount
    const newImages = generateRandomImages(count, seed);
    setImages(newImages);
    setIsLoading(false);
  }, [count, seed]);

  const openModal = (index: number) => setSelectedImage(index);
  const closeModal = () => setSelectedImage(null);

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="aspect-square bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative group cursor-pointer overflow-hidden rounded-xl"
            onClick={() => openModal(index)}
          >
            <img
              src={image.url}
              alt={`Random image ${index + 1}`}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-0 group-hover:scale-100" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-foreground text-sm font-medium">{image.author}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 border border-primary/5 shadow-2xl"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-foreground hover:text-primary transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={goToPrev}
            className="absolute left-4 text-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <img
            src={images[selectedImage].url}
            alt={`Image ${selectedImage + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />

          <button
            onClick={goToNext}
            className="absolute right-4 text-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground text-center">
            <p className="font-medium">{images[selectedImage].author}</p>
            <p className="text-sm text-muted-foreground">{selectedImage + 1} / {images.length}</p>
          </div>
        </motion.div>
      )}
    </>
  );
}

// Floating image component for backgrounds
export function FloatingImage({ 
  query, 
  className, 
  size = 200,
  delay = 0,
  position 
}: { 
  query: string; 
  className?: string;
  size?: number;
  delay?: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}) {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    setImageUrl(`https://picsum.photos/seed/${query}/${size}/${size}`);
  }, [query, size]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute rounded-2xl overflow-hidden shadow-2xl ${className}`}
      style={{ ...position }}
    >
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={imageUrl}
          alt={query}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

// Masonry image grid
export function MasonryGallery({ count = 20 }: { count?: number }) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const newImages = Array.from({ length: count }, (_, i) =>
      `https://picsum.photos/seed/gallery-${i}/400/${300 + (i % 3) * 100}`
    );
    setImages(newImages);
  }, [count]);

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((url, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="break-inside-avoid rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
        >
          <div className="relative">
            <img
              src={url}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ImageCard({ 
  query, 
  title, 
  description 
}: { 
  query: string; 
  title: string; 
  description?: string;
}) {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const seed = `${query}-${Date.now()}`;
    setImageUrl(`https://picsum.photos/seed/${seed}/600/400`);
  }, [query]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
    </div>
  );
}

// Avatar image generator
export function RandomAvatar({ 
  seed, 
  size = 48,
  className = ""
}: { 
  seed: string; 
  size?: number;
  className?: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    // Use DiceBear API for avatars
    const styles = ["adventurer", "avataaars", "bottts", "fun-emoji", "lorelei"];
    const style = styles[Math.abs(seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % styles.length];
    setAvatarUrl(`https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&size=${size}`);
  }, [seed, size]);

  return (
    <img
      src={avatarUrl || `https://via.placeholder.com/${size}`}
      alt={`Avatar for ${seed}`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
}
