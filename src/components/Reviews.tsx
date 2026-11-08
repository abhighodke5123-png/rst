import React, { useState, useEffect } from "react";
import { Review } from "../types";
import { REVIEWS } from "../data";
import { Star, Quote, CheckCircle2, HeartHandshake } from "lucide-react";
import { motion } from "motion/react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);

  useEffect(() => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const loadedReviews: Review[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              loadedReviews.push({
                id: doc.id,
                author: data.author || "Traveler",
                avatar: data.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
                rating: data.rating || 5,
                destination: data.destination || "Overland Route",
                content: data.content || "",
                date: data.date || "2026",
                tripCollection: data.tripCollection || "explore",
                verifiedTraveler: true
              });
            });
            if (loadedReviews.length > 0) {
              setReviewsList(loadedReviews);
            }
          }
        },
        (error) => {
          console.warn("Firestore reviews sync fallback to static curated:", error);
          setReviewsList(REVIEWS);
        }
      );

      return () => unsubscribe();
    } catch {
      setReviewsList(REVIEWS);
    }
  }, []);

  return (
    <section id="reviews" className="py-24 sm:py-32 px-6 bg-[#182622] relative border-t border-[#8C9A82]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#202522] border border-[#8C9A82]/30 text-[#D4A96C] text-xs font-semibold uppercase tracking-widest mb-4">
              <Quote className="w-3.5 h-3.5" />
              <span>Verified Dispatches</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#EDE9DF] tracking-tight">
              Traveller <span className="italic text-[#D4A96C]">Stories</span>
            </h2>
            <p className="text-[#EDE9DF]/80 text-base sm:text-lg font-light leading-relaxed mt-4">
              Real memories from adventurers who took the road with us. No artificial hype, no staged reviews.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#202522] px-5 py-3 rounded-2xl border border-[#8C9A82]/30 text-xs font-mono">
            <span className="text-[#D4A96C] font-bold text-sm">4.9 / 5.0</span>
            <span className="text-[#EDE9DF]/40">•</span>
            <span className="text-[#EDE9DF]/80">500+ Explorers Guided</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsList.slice(0, 6).map((rev, idx) => (
            <motion.div
              key={rev.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-[#202522] border border-[#8C9A82]/25 p-8 rounded-[32px] flex flex-col justify-between hover:border-[#D4A96C]/40 transition-colors shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4A96C] text-[#D4A96C]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#EDE9DF]/50 uppercase">
                    {rev.date}
                  </span>
                </div>

                <Quote className="w-7 h-7 text-[#D4A96C]/30 mb-3" />
                <p className="text-[#EDE9DF]/85 text-xs sm:text-sm leading-relaxed font-light mb-6">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-5 border-t border-[#8C9A82]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-[#8C9A82]/30"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-[#EDE9DF]">{rev.author}</h4>
                    <span className="text-[10px] text-[#D4A96C] font-mono block">{rev.destination}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
