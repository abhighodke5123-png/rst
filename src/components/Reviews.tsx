import React, { useState, useEffect } from "react";
import { Review } from "../types";
import { REVIEWS } from "../data";
import { Star, MessageSquare, Quote, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
              });
            });
            if (loadedReviews.length > 0) {
              setReviewsList(loadedReviews);
            }
          }
        },
        (error) => {
          // Gracefully retain curated REVIEWS on error
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
    <section id="reviews" className="py-32 px-6 bg-[#07080a] relative border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-mono">
              [ 04 // DISPATCHES FROM THE ROAD ]
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-display uppercase leading-[1.08]">
              Traveler Stories & <br />
              <span className="font-editorial text-amber-300 font-normal italic lowercase text-5xl sm:text-6xl md:text-7xl">
                raw field notes.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 glass px-5 py-3 rounded-2xl border border-white/10 text-xs font-mono">
            <span className="text-amber-400 font-bold">4.9 / 5.0</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-300">500+ Verified Journeys</span>
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
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-[#0b0c10] border border-white/10 p-8 rounded-[32px] flex flex-col justify-between hover:border-amber-400/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {rev.date}
                  </span>
                </div>

                <Quote className="w-6 h-6 text-amber-400/30 mb-4" />
                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-light mb-8">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">{rev.author}</h4>
                    <span className="text-[11px] text-amber-400 font-mono block">{rev.destination}</span>
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
