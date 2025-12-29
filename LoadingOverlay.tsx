
import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F1EB]/80 backdrop-blur-sm">
      <div className="relative">
        <div className="w-16 h-16 rounded-full gold-pulse flex items-center justify-center border-2 border-[#C8A46D]">
          <div className="w-8 h-8 rounded-full bg-[#C8A46D] opacity-20" />
        </div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-6 text-[#C8A46D] font-medium text-lg"
      >
        در حال خلق داستانی برای شما...
      </motion.p>
    </div>
  );
};

export default LoadingOverlay;
