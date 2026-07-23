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
    <section id="reviews" className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-3">
              Traveler Stories
            </h2>
            <p className="text-zinc-600 text-sm max-w-md font-sans">
              Authentic stories and unfiltered field reports shared by the RAASTA travel community.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="self-start md:self-auto flex items-center gap-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Share Your Journey
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
              <div className="bg-white border border-zinc-200 p-8 rounded-2xl max-w-xl shadow-lg">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-1">Thanks! Your review has been submitted.</h3>
                    <p className="text-xs text-zinc-500">Your genuine travel story is now visible to the community.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                      <h3 className="font-bold text-black text-sm uppercase tracking-wider">Write a Review</h3>
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="text-zinc-400 hover:text-black text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rohan Sharma"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1.5">
                          Destination
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Goa Beach Trek"
                          value={newDestination}
                          onChange={(e) => setNewDestination(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1.5">
                        Your Story
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Share your unscripted travel memory with us..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-sans resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
                    >
                      Submit Field Report
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Grid Reviews Display */}
        {reviewsList.length === 0 ? (
          <div className="text-center py-12 bg-white border border-zinc-200 rounded-2xl">
            <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm font-medium">No reviews yet.</p>
            <p className="text-zinc-400 text-xs mt-1">Be the first to share your field report!</p>
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
                    className="group relative bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* NEW Badge */}
                    {review.createdAt && isNewReview(review.createdAt) && (
                      <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                        NEW
                      </div>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      title="Remove this review"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 rounded-full cursor-pointer z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="flex items-center gap-1 mb-4 pr-6">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-zinc-700 text-xs font-sans leading-relaxed italic mb-6">
                        "{review.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        onError={(e) => {
                          // Fallback avatar if unsplash image fails
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`;
                        }}
                        className="w-9 h-9 rounded-full object-cover border border-zinc-100"
                      />
                      <div>
                        <h4 className="text-[11px] font-extrabold text-black font-sans leading-tight">
                          {review.author}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-sans mt-0.5 flex flex-col sm:flex-row sm:items-center sm:gap-1">
                          <span>{review.destination}</span>
                          <span className="hidden sm:inline">•</span>
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
                  className="flex items-center gap-2 bg-white border border-zinc-200 hover:border-black text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      View More Reviews
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
