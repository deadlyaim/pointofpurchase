import React, { useState } from 'react';
import { Star, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../data/reviews';

interface ReviewCardProps {
  key?: string | number;
  review: Review;
  onPhotoClick: (photoUrl: string) => void;
}

export default function ReviewCard({ review, onPhotoClick }: ReviewCardProps) {
  const hasMultiplePhotos = !!(review.photos && review.photos.length > 0);
  const photosList = review.photos || [review.photo];
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const activePhoto = photosList[activePhotoIdx];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % photosList.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev - 1 + photosList.length) % photosList.length);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Tag */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[8px] font-bold tracking-wider text-slate-600 uppercase truncate max-w-[120px]">
            {review.productName}
          </span>
          <div className="flex text-amber-400">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 fill-current" />
            ))}
          </div>
        </div>
        
        {/* Review Photo Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 mb-2 group/photo">
          <img 
            src={activePhoto} 
            alt={`Review by ${review.author}`} 
            className="h-full w-full object-cover transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          
          {/* Zoom Overlay */}
          <div 
            className="absolute inset-0 bg-black/15 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            onClick={() => onPhotoClick(activePhoto)}
          >
            <span className="bg-white/95 backdrop-blur-xs text-gray-900 font-sans text-[9px] font-bold px-2 py-1 rounded-full shadow-xs scale-95 group-hover/photo:scale-100 transition-all">
              Ver Foto
            </span>
          </div>

          {/* Carousel navigation arrows */}
          {hasMultiplePhotos && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-xs transition-all opacity-0 group-hover/photo:opacity-100 z-10"
                type="button"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-xs transition-all opacity-0 group-hover/photo:opacity-100 z-10"
                type="button"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </>
          )}

          {/* Slide Indicators/Dots */}
          {hasMultiplePhotos && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 z-10 bg-black/20 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
              {photosList.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx(index);
                  }}
                  className={`h-1 rounded-full transition-all ${
                    activePhotoIdx === index ? 'w-2.5 bg-white' : 'w-1 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mini Thumbnails list for multiple photos */}
        {hasMultiplePhotos && (
          <div className="flex gap-1 mb-2 pb-0.5 overflow-x-auto justify-center">
            {photosList.map((photoUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                  activePhotoIdx === idx ? 'border-gray-950 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={photoUrl} className="h-full w-full object-cover" referrerPolicy="no-referrer" alt="" />
              </button>
            ))}
          </div>
        )}

        {/* Author & Rating */}
        <div className="flex items-center gap-1 mb-1">
          <span className="font-sans text-[11px] font-bold text-gray-900">{review.author}</span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1 py-0.5 text-[7px] font-bold text-emerald-700">
            <Check className="h-1.5 w-1.5 stroke-[3]" />
            Verificado
          </span>
        </div>

        {/* Comment */}
        <p className="font-sans text-[11px] text-gray-500 leading-relaxed italic">
          "{review.comment}"
        </p>
      </div>
    </div>
  );
}
