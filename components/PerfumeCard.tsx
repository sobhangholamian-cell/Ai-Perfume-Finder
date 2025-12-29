
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ImageOff } from 'lucide-react';
import { PerfumeRecommendation } from '../types';

interface PerfumeCardProps {
  perfume: PerfumeRecommendation;
  index: number;
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, index }) => {
  const [imageError, setImageError] = useState(false);

  // High-quality elegant fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-[2.5rem] flex flex-col h-full border border-white/40 shadow-2xl overflow-hidden hover:shadow-[#C8A46D]/20 transition-all duration-500 group"
    >
      {/* Product Image Section */}
      <div className="relative h-72 bg-white flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F1EB]/10 pointer-events-none" />
        
        {!imageError ? (
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15 + 0.3, duration: 1.2, ease: "easeOut" }}
            src={perfume.imageUrl} 
            alt={`${perfume.brand} ${perfume.name}`} 
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out z-10"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center text-[#C8A46D]/40">
            <ImageOff size={40} strokeWidth={1} className="mb-2 relative z-10" />
            <span className="text-[9px] uppercase tracking-[0.2em] relative z-10 font-bold">تصویر یافت نشد</span>
            <img 
              src={fallbackImage} 
              alt="placeholder" 
              className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay grayscale"
            />
          </div>
        )}

        <div className="absolute top-6 left-6 z-20">
           <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-sm text-[#C8A46D] border border-[#C8A46D]/10">
             <Sparkles size={16} />
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-1 bg-white/5 border-t border-[#C8A46D]/10">
        <div className="mb-5">
          <p className="text-[#C8A46D] font-bold tracking-[0.2em] uppercase text-[10px] mb-1.5">{perfume.brand}</p>
          <h3 className="text-xl font-black text-[#2E2E32] leading-tight group-hover:text-[#C8A46D] transition-colors duration-300">
            {perfume.name}
          </h3>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-1.5">
            {perfume.scentProfile.map((note, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-white/60 text-[#2E2E32]/80 text-[10px] font-bold rounded-full border border-[#C8A46D]/5 shadow-sm"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto relative">
          <div className="absolute top-0 right-0 w-8 h-px bg-[#C8A46D]/20" />
          <div className="text-[13px] leading-[1.8] text-[#2E2E32]/80 text-justify pt-5 font-light">
            {perfume.story.split(/(\*\*.*?\*\*)/g).map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-[#2E2E32] font-bold">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerfumeCard;
