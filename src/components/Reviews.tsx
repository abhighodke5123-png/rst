import React, { useState, useEffect } from "react";
import { Review } from "../types";
import { Star, MessageSquare, Plus, Check, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp, getDocs } from "firebase/firestore";

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Listen to reviews collection in real-time, ordered by createdAt descending
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedReviews: Review[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedReviews.push({
          id: doc.id,
          author: data.author,
          avatar: data.avatar,
          rating: data.rating,
          destination: data.destination,
          content: data.content,
          date: data.date,
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        });
      });
      setReviewsList(loadedReviews);
    }, (error) => {
      console.error("Error fetching reviews:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (e) {
      console.error("Error deleting review:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    // Use current date for display
    const dateOpts: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    const displayDate = new Date().toLocaleDateString('en-US', dateOpts);

    try {
      await addDoc(collection(db, "reviews"), {
        author: newAuthor,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=150`,
        rating: newRating,
        destination: newDestination || "Exploring India",
        content: newContent,
        date: displayDate,
        createdAt: serverTimestamp()
      });

      // Reset Form
      setNewAuthor("");
      setNewDestination("");
      setNewContent("");
      setNewRating(5);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsFormOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  const isNewReview = (createdAtMs: number) => {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - createdAtMs <= sevenDaysInMs;
  };

  const visibleReviews = isExpanded ? reviewsList : reviewsList.slice(0, 3);

  return (
    <section id="reviews" className="py-32 px-6 bg-[#07080a] relative border-t border-white/5 overflow-hidden">
      <div className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-xs tracking-widest text-amber-400 uppercase font-bold mb-3 block font-display">
              Unfiltered Feedback
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight font-display">
              Traveler <span className="font-editorial text-amber-300 font-normal italic text-5xl sm:text-6xl md:text-7xl">Chronicles</span>
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl font-light">
              Unscripted stories and verified field dispatches shared directly by the RAASTA travel community.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="self-start md:self-auto flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-widest px-7 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Write Dispatch</span>
          </button>
        </div>

        {/* Dynamic Form Popup or Accordion */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-16 overflow-hidden"
            >
              <div className="glass border border-white/15 p-8 sm:p-10 rounded-[32px] max-w-2xl mx-auto shadow-2xl bg-gradient-to-b from-[#181a24] to-[#0d0f14]">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-14 h-14 bg-emerald-400/20 border border-emerald-400/40 rounded-full flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                      <Check className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-display">Dispatch Published!</h3>
                    <p className="text-sm text-zinc-400 font-light">Your genuine field report is now live for fellow adventurers.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <h3 className="font-black text-white text-xs uppercase tracking-widest font-display">Log Field Experience</h3>
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="text-zinc-400 hover:text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2 font-display">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rohan Sharma"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/60 placeholder:text-zinc-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2 font-display">
                          Route Destination
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Spiti Valley Circuit"
                          value={newDestination}
                          onChange={(e) => setNewDestination(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/60 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2 font-display">
                        Your Story / Field Log
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Share your unscripted travel memory, favorite moments, captain highlights..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400/60 placeholder:text-zinc-600 resize-none font-light leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 font-display">Rating:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  star <= newRating ? "fill-amber-400 text-amber-400" : "text-zinc-700"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-white text-black hover:bg-amber-300 font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Publish Report
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Grid Reviews Display */}
        {reviewsList.length === 0 ? (
          <div className="text-center py-16 glass border border-white/10 rounded-[32px]">
            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-300 text-base font-semibold">No dispatches logged yet.</p>
            <p className="text-zinc-500 text-xs mt-1">Be the first explorer to share your field dispatch!</p>
          </div>
        ) : (
          <div className="space-y-12">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {visibleReviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group relative glass border border-white/10 rounded-[32px] p-8 flex flex-col justify-between hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-xl"
                  >
                    {/* NEW Badge */}
                    {review.createdAt && isNewReview(review.createdAt) && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3.5 py-1 rounded-bl-2xl z-10 shadow-md">
                        NEW
                      </div>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      title="Remove this review"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-400 hover:text-red-400 hover:bg-white/10 rounded-full cursor-pointer z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 mb-6 pr-6">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-zinc-300 text-sm font-light leading-relaxed italic mb-8">
                        "{review.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        onError={(e) => {
                          // Fallback avatar if unsplash image fails
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`;
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-white/15"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white font-display leading-tight">
                          {review.author}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-light mt-0.5 flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                          <span className="text-amber-300/80 font-medium">{review.destination}</span>
                          <span className="hidden sm:inline text-zinc-600">•</span>
                          <span>{review.date}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {reviewsList.length > 3 && (
              <motion.div layout className="flex justify-center">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white hover:text-black border border-white/15 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all duration-300 shadow-md cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>View More Dispatches ({reviewsList.length})</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
