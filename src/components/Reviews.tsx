import React, { useState } from "react";
import { REVIEWS } from "../data";
import { Review } from "../types";
import { Star, MessageSquare, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem("raasta_custom_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...REVIEWS];
        }
      }
    } catch (e) {
      // ignore
    }
    return REVIEWS;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    const newReview: Review = {
      id: `custom-rev-${Date.now()}`,
      author: newAuthor,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=150`,
      rating: newRating,
      destination: newDestination || "Exploring India",
      content: newContent,
      date: "Just now"
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);

    try {
      const userCreatedOnly = updated.filter(r => r.id.startsWith("custom-rev-"));
      localStorage.setItem("raasta_custom_reviews", JSON.stringify(userCreatedOnly));
    } catch (err) {
      // ignore
    }

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
  };

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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-16 bg-white border border-zinc-200 p-8 rounded-2xl max-w-xl shadow-lg"
            >
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-1">Review Shared Successfully!</h3>
                  <p className="text-xs text-zinc-500">Your genuine travel story is now visible to the community.</p>
                </div>
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Grid Reviews Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsList.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
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
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
                    {review.destination} • {review.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
