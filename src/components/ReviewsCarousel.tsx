import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
import ReviewSubmissionModal from "./ReviewSubmissionModal";

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Aarav Sharma",
    trip: "Spiti Valley Expedition",
    text: "Absolutely mind-blowing experience. The RAASTA team handled everything from permits to oxygen cylinders. The road trip was stunning and I made friends for a lifetime.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 2,
    name: "Priya Desai",
    trip: "Kerala Backwaters & Hills",
    text: "I was a bit hesitant about a solo trip, but the group was amazing. The itinerary through Kerala's backwaters and tea hills was perfectly balanced. Highly recommend!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 3,
    name: "Rahul & Sneha",
    trip: "Goa Coastal Drive",
    text: "Not your regular Goa trip. They took us to hidden beaches and local cafes we would never have found ourselves. Great cars, great vibes.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1581404917879-53e19259efda?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleAddReview = (newReview: { name: string; trip: string; text: string; rating: number; image: string }) => {
    setReviews([{ id: Date.now(), ...newReview }, ...reviews]);
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
            <p className="text-zinc-400 font-light text-lg">Don't just take our word for it. Hear from travelers who have experienced the RAASTA way of exploring.</p>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all cursor-pointer group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Submit Your Review
            </button>
          </div>
          <div className="flex gap-4">
            <button onClick={prev} className="p-4 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer group">
              <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
            </button>
            <button onClick={next} className="p-4 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer group">
              <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

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
      </div>

      <ReviewSubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddReview} 
      />
    </section>
  );
}
