import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Star, Image as ImageIcon } from "lucide-react";

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { name: string; trip: string; text: string; rating: number; image: string }) => void;
}

export default function ReviewSubmissionModal({ isOpen, onClose, onSubmit }: ReviewSubmissionModalProps) {
  const [name, setName] = useState("");
  const [trip, setTrip] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !trip || !text || !imagePreview) return;
    
    onSubmit({
      name,
      trip,
      text,
      rating,
      image: imagePreview
    });
    
    // Reset form
    setName("");
    setTrip("");
    setText("");
    setRating(5);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
        >
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h2 className="text-xl font-bold text-white">Leave a Review</h2>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-500/50 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  required
                  value={trip}
                  onChange={(e) => setTrip(e.target.value)}
                  placeholder="e.g. Spiti Valley Expedition"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-500/50 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-zinc-700"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Your Experience
              </label>
              <textarea
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your story..."
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-yellow-500/50 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Trip Photo
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  imagePreview ? "border-yellow-500/50 bg-yellow-500/5" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-900"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-zinc-300 font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-zinc-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name || !trip || !text || !imagePreview}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl text-sm font-extrabold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Submit Review
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
