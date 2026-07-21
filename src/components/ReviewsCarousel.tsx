import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Plus, MessageSquare } from "lucide-react";
import ReviewSubmissionModal from "./ReviewSubmissionModal";

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("raasta_custom_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [
      {
        id: "tpl-1",
        name: "Rohan Advani",
        trip: "Spiti Valley Caravan",
        text: "Spiti with RAASTA is unlike any other journey. The level of care, the expert captaincy, and the campfire jams at Kaza campsite created bonds for life. Recommending this to every serious overlander!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
      },
      {
        id: "tpl-2",
        name: "Malini Sen",
        trip: "Gokarna Cliffside Trek",
        text: "The half-moon beach cliff walk on Gokarna backpacker trail was gorgeous. But the highlight has to be witnessing bioluminescence in the pitch-dark ocean water. Literally felt like Magic!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
      },
      {
        id: "tpl-3",
        name: "Devendra Verma",
        trip: "Goa Offbeat Backwaters",
        text: "Thought I had seen Goa inside out, but RAASTA showed me the true heart. The Fontainhas Heritage Walk was filled with quirky history, and the secret beach barbeque was stellar.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=150"
      }
    ];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If reviews get deleted or cleared, adjust index
  useEffect(() => {
    if (reviews.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= reviews.length) {
      setCurrentIndex(reviews.length - 1);
    }
  }, [reviews, currentIndex]);

  const next = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };
  
  const prev = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleAddReview = (newReview: { name: string; trip: string; text: string; rating: number; image: string }) => {
    const updated = [{ id: Date.now(), ...newReview }, ...reviews];
    setReviews(updated);
    localStorage.setItem("raasta_custom_reviews", JSON.stringify(updated));
    setCurrentIndex(0); // Go to the newly added review
  };

  return (
    <section className="py-32 bg-[#040404] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-emerald/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Stories from <br/><span className="text-zinc-500">the road.</span></h2>
            <p className="text-zinc-400 font-light text-lg">Walked the unscripted road with RAASTA? Share your authentic travel stories with our growing community.</p>
            
            {reviews.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all cursor-pointer group"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                Submit Your Review
              </button>
            )}
          </div>
          
          {reviews.length > 1 && (
            <div className="flex gap-4">
              <button onClick={prev} className="p-4 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer group">
                <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={next} className="p-4 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer group">
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="glass rounded-[40px] p-8 sm:p-14 flex flex-col gap-6 items-center justify-center text-center min-h-[350px] relative overflow-hidden">
            <div className="absolute top-8 right-12 text-[120px] leading-none font-serif text-white/5 pointer-events-none">"</div>
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-2">
              <MessageSquare className="w-8 h-8 text-brand-orange" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">No stories yet</h3>
            <p className="text-zinc-400 font-light max-w-md leading-relaxed text-base">
              Be the first to share your journey! Leave a review of your experience with RAASTA to inspire new travelers.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-8 py-3.5 rounded-full text-sm font-bold transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              Leave the First Review
            </button>
          </div>
        ) : (
          <div className="relative h-[450px] sm:h-[350px]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute inset-0 w-full"
              >
                <div className="glass rounded-[40px] p-8 sm:p-14 flex flex-col gap-8 items-center sm:items-start h-full relative overflow-hidden">
                  {/* Decorative quote mark */}
                  <div className="absolute top-8 right-12 text-[120px] leading-none font-serif text-white/5 pointer-events-none">"</div>
                  
                  <div className="flex flex-col h-full justify-center flex-1 text-center sm:text-left relative z-10 w-full max-w-4xl">
                    <div className="flex justify-center sm:justify-start gap-1.5 text-brand-orange mb-8">
                      {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-current" />
                      ))}
                    </div>
                    <p className="text-xl sm:text-3xl font-light leading-relaxed text-white mb-10">
                      "{reviews[currentIndex].text}"
                    </p>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                      <img 
                        src={reviews[currentIndex].image} 
                        alt={reviews[currentIndex].name} 
                        className="w-14 h-14 rounded-full object-cover border border-white/20" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-white tracking-tight">{reviews[currentIndex].name}</h4>
                        <span className="text-sm text-brand-blue font-medium">{reviews[currentIndex].trip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      <ReviewSubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddReview} 
      />
    </section>
  );
}
