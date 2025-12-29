
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wind, ArrowLeft, Quote } from 'lucide-react';
import { getPerfumeRecommendations } from './geminiService';
import { PerfumeRecommendation } from './types';
import PerfumeCard from './components/PerfumeCard';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [submittedInput, setSubmittedInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PerfumeRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setSubmittedInput(input);
    try {
      const results = await getPerfumeRecommendations(input);
      setRecommendations(results);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecommendations(null);
    setInput('');
    setSubmittedInput('');
    setError(null);
  };

  return (
    <div className="min-h-screen selection:bg-[#C8A46D] selection:text-white pb-20">
      <AnimatePresence>
        {loading && <LoadingOverlay />}
      </AnimatePresence>

      <header className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-block mb-6"
          >
            <div className="w-12 h-px bg-[#C8A46D] mx-auto mb-4 opacity-50" />
            <Wind className="mx-auto text-[#C8A46D] mb-4" size={32} strokeWidth={1.5} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-[#2E2E32] mb-6 tracking-tight"
          >
            عطر امضای خود را پیدا کنید
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-[#2E2E32]/60 font-light leading-relaxed max-w-2xl mx-auto"
          >
            حس و حال، خاطره‌ای خاص، یا نام عطری که دوست دارید را بنویسید تا هوش مصنوعی برترین گزینه‌ها را به شما پیشنهاد دهد.
          </motion.p>
        </div>
      </header>

      <main className="px-6">
        {!recommendations ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="مثلاً: بوی باران روی خاک گرم، یا عطری شبیه به عطر سیلور سنت اما با ماندگاری بیشتر..."
                className="w-full h-44 p-8 rounded-[2.5rem] bg-white border border-[#C8A46D]/20 text-lg glow-input transition-all duration-300 resize-none outline-none text-[#2E2E32] leading-relaxed shadow-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute bottom-5 left-5 bg-[#C8A46D] hover:bg-[#B69259] disabled:opacity-50 text-white py-4 px-6 rounded-2xl transition-all duration-300 flex items-center gap-3 group shadow-xl"
              >
                <span className="font-bold">جستجوی رایحه</span>
                <Search size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </form>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-6 text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto" ref={resultsRef}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 bg-white/40 p-8 rounded-[2rem] border border-[#C8A46D]/10 backdrop-blur-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[#C8A46D] mb-2">
                  <Quote size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">درخواست شما</span>
                </div>
                <p className="text-xl font-medium text-[#2E2E32] leading-relaxed italic">
                  "{submittedInput}"
                </p>
              </div>
              <button 
                onClick={reset}
                className="flex items-center gap-2 bg-[#C8A46D]/10 text-[#C8A46D] hover:bg-[#C8A46D] hover:text-white px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm"
              >
                <span>جستجوی جدید</span>
                <ArrowLeft size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {recommendations.map((perfume, idx) => (
                <PerfumeCard key={idx} perfume={perfume} index={idx} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 border-t border-[#C8A46D]/10 pt-12 pb-16 text-center opacity-60">
        <p className="text-xs tracking-widest uppercase font-medium text-[#2E2E32]">
          Luxury Fragrance AI &copy; 2025 | هوشمندترین مشاور عطر شما
        </p>
      </footer>
    </div>
  );
};

export default App;
