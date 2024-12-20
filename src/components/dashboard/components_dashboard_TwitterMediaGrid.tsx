import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Utility function to clean URLs
const cleanMediaUrl = (url: string): string => {
  return url.replace(/\/+$/, '').trim();
};

interface TwitterMediaGridProps {
  mediaUrls: string[];
}

export const TwitterMediaGrid: React.FC<TwitterMediaGridProps> = ({ mediaUrls }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const uniqueMediaUrls = useMemo(() => {
    if (!mediaUrls?.length) return [];
    const cleanedUrls = mediaUrls.map(cleanMediaUrl);
    return [...new Set(cleanedUrls)];
  }, [mediaUrls]);

  // Determine grid layout based on number of images
  const gridClass = useMemo(() => {
    const count = uniqueMediaUrls.length;
    switch (count) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-2';
      default: return 'grid-cols-2';
    }
  }, [uniqueMediaUrls]);

  const getImageHeight = (index: number, total: number) => {
    // Single image
    if (total === 1) return 'h-64';
    
    // First image in 3-image layout
    if (total === 3 && index === 0) return 'h-64';
    
    // All other cases
    return 'h-40';
  };

  if (!uniqueMediaUrls.length) return null;

  return (
    <>
      <div className={`grid ${gridClass} gap-1 rounded-xl overflow-hidden mt-2 mb-4 max-w-xl mx-auto`}>
        {uniqueMediaUrls.slice(0, 4).map((url, index) => (
          <div 
            key={url}
            className={`relative ${
              uniqueMediaUrls.length === 3 && index === 0 ? 'row-span-2' : ''
            } ${getImageHeight(index, uniqueMediaUrls.length)} overflow-hidden group`}
          >
            <img
              src={url}
              alt={`Media ${index + 1}`}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              onClick={() => setSelectedImage(url)}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.png";
              }}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="sr-only">View full image</span>
              </div>
            </div>

            {/* Additional Images Indicator */}
            {uniqueMediaUrls.length > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-lg font-medium">
                  +{uniqueMediaUrls.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={selectedImage!}
              alt="Full size media"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TwitterMediaGrid;