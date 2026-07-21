/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GALLERY_ITEMS } from "../data";
import { GalleryItem } from "../types";
import { Heart, Search, Camera, X, PlusCircle, User, MessageCircle, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem("raastagallery");
      if (saved) {
        const parsed = JSON.parse(saved) as GalleryItem[];
        const mergedPresets = GALLERY_ITEMS.map((preset) => {
          const cached = parsed.find((p) => p.id === preset.id);
          if (cached) {
            return { ...cached, url: preset.url, title: preset.title, destination: preset.destination, category: preset.category };
          }
          return preset;
        });
        const presetIds = new Set(GALLERY_ITEMS.map((g) => g.id));
        const userUploads = parsed.filter((p) => !presetIds.has(p.id));
        return [...userUploads, ...mergedPresets];
      }
      return GALLERY_ITEMS;
    } catch (e) {
      console.error("Local storage parsing failed for raastagallery", e);
      return GALLERY_ITEMS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // States for virtual mockup upload
  const [uploadOpen, setUploadOpen] = useState(false);
  const [upName, setUpName] = useState("");
  const [upTitle, setUpTitle] = useState("");
  const [upDest, setUpDest] = useState("Goa");
  const [upCat, setUpCat] = useState<"Beaches" | "Mountains" | "Roads" | "People">("Beaches");
  const [selectedPhotoPresetUrl, setSelectedPhotoPresetUrl] = useState("https://images.pexels.com/photos/210214/pexels-photo-210214.jpeg?auto=compress&cs=tinysrgb&w=950");

  const categoriesChoices = ["All", "Beaches", "Mountains", "Roads", "People"];

  useEffect(() => {
    localStorage.setItem("raastagallery", JSON.stringify(items));
  }, [items]);

  // Handle click like reaction
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering open zoom modal
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, likes: item.likes + 1 };
        }
        return item;
      })
    );
  };

  // Preset mockup images choice
  const presetPhotos = [
    { name: "Monsoon Dusk", url: "https://images.pexels.com/photos/27531833/pexels-photo-27531833.jpeg?auto=compress&cs=tinysrgb&w=950" },
    { name: "Ocean Surf", url: "https://images.pexels.com/photos/1009136/pexels-photo-1009136.jpeg?auto=compress&cs=tinysrgb&w=950" },
    { name: "Vespa Walk", url: "https://images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=950" },
    { name: "Sunset Cliff", url: "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&cs=tinysrgb&w=950" },
    { name: "Foggy Valleys", url: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=950" }
  ];

  // Simulated Custom snapshot injection
  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upName || !upTitle) return;

    const newItem: GalleryItem = {
      id: "gal-sim-" + Date.now(),
      url: selectedPhotoPresetUrl,
      title: upTitle,
      destination: upDest,
      category: upCat,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      likes: Math.floor(Math.random() * 20),
      photographer: upName
    };

    setItems([newItem, ...items]);
    
    // reset form fields
    setUpName("");
    setUpTitle("");
    setUploadOpen(false);
  };

  // Filter gallery items list
  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-32 px-6 bg-brand-bg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/10 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto relative z-10"
      >
        
        {/* Header and trigger details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Snapshots <br/><span className="text-zinc-500">from the road.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl font-light">
              Moments frozen under wide Himalayan skies, inside foggy coastal cafes, and around late-night seaside bonfires.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 self-start md:self-end">
            {/* Category selection */}
            <div className="flex flex-wrap gap-2 p-1.5 glass rounded-2xl">
              {categoriesChoices.map((tc) => (
                <button
                  key={tc}
                  onClick={() => setActiveCategory(tc)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === tc
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tc}
                </button>
              ))}
            </div>

            {/* trigger local simulation popup */}
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              <Camera className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Photography Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((photo) => (
              <motion.div
                layout
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative rounded-[32px] overflow-hidden cursor-crosshair border border-white/10 bg-white/5 break-inside-avoid"
              >
                {/* Photo file */}
                <img
                  alt={photo.title}
                  src={photo.url}
                  className="w-full object-cover transition duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  style={{ minHeight: "250px" }}
                />

                {/* Overlays details */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040404] via-[#040404]/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                  <span className="text-[10px] font-bold tracking-wider glass border border-white/20 text-white px-3 py-1 rounded-full uppercase">
                    {photo.destination}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider glass border border-white/20 text-brand-emerald px-3 py-1 rounded-full uppercase">
                    {photo.category}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight tracking-tight mb-1">
                      {photo.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      By {photo.photographer} • {photo.date}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleLike(photo.id, e)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full glass hover:bg-white/20 hover:scale-110 active:scale-95 transition-all border border-white/20 text-white shrink-0"
                  >
                    <Heart className="w-4 h-4 fill-brand-orange text-brand-orange shrink-0" />
                    <span className="text-xs font-semibold">{photo.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* FULL LIGHTBOX ZOOM OVERLAY MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="glass border border-white/10 rounded-[40px] overflow-hidden w-full max-w-5xl shadow-2xl relative z-10 flex flex-col md:flex-row max-h-[85vh]"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 bg-black/50 p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Aspect Ratio zoom photo */}
              <div className="bg-[#040404] flex-1 flex items-center justify-center max-h-[50vh] md:max-h-full overflow-hidden">
                <img
                  alt={selectedPhoto.title}
                  src={selectedPhoto.url}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Photo specs block */}
              <div className="p-10 md:w-96 flex flex-col justify-between shrink-0 bg-white/5 border-t md:border-t-0 md:border-l border-white/10 backdrop-blur-md">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">
                      {selectedPhoto.title}
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm text-zinc-400 font-light">
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span>Route Location</span>
                      <span className="text-white font-medium">{selectedPhoto.destination}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span>Classification</span>
                      <span className="text-brand-emerald font-medium">{selectedPhoto.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span>Captured On</span>
                      <span className="text-white font-medium">{selectedPhoto.date}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-3">
                      <span>Scenic Artist</span>
                      <span className="text-white font-medium">{selectedPhoto.photographer}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      handleLike(selectedPhoto.id, e);
                      // sync with active modal state likes
                      setSelectedPhoto({ ...selectedPhoto, likes: selectedPhoto.likes + 1 });
                    }}
                    className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange font-bold text-sm hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-current shrink-0" />
                    <span>Applaud ({selectedPhoto.likes})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOCK UPLOAD MODEL DRAWER */}
      <AnimatePresence>
        {uploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUploadOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass border border-white/10 rounded-[40px] p-8 w-full max-w-xl shadow-2xl relative z-10"
            >
              <button
                onClick={() => setUploadOpen(false)}
                className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 p-3 rounded-full text-zinc-400 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8 flex items-center gap-4">
                <div className="p-3 bg-brand-blue/20 border border-brand-blue/30 rounded-2xl text-brand-blue">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Upload Snapshot</h3>
                  <p className="text-sm text-zinc-400 mt-1 font-light">Share your journey with the community.</p>
                </div>
              </div>

              <form onSubmit={handleSimulateUpload} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abhi"
                      value={upName}
                      onChange={(e) => setUpName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                      Photo Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunrise above Kaza"
                      value={upTitle}
                      onChange={(e) => setUpTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                      Destination
                    </label>
                    <select
                      value={upDest}
                      onChange={(e) => setUpDest(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none appearance-none"
                    >
                      <option value="Goa" className="bg-[#040404]">Goa Route</option>
                      <option value="Gokarna" className="bg-[#040404]">Gokarna Route</option>
                      <option value="Spiti Valley" className="bg-[#040404]">Spiti Valley</option>
                      <option value="Himalayas" className="bg-[#040404]">Other Pass</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-zinc-500 mb-2 tracking-wider">
                      Category
                    </label>
                    <select
                      value={upCat}
                      onChange={(e) => setUpCat(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-sm text-white focus:outline-none appearance-none"
                    >
                      <option value="Beaches" className="bg-[#040404]">Beaches</option>
                      <option value="Mountains" className="bg-[#040404]">Mountains</option>
                      <option value="Roads" className="bg-[#040404]">Roads</option>
                      <option value="People" className="bg-[#040404]">People</option>
                    </select>
                  </div>
                </div>

                {/* Simulated File Selection Presets */}
                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 mb-3 tracking-wider">
                    Select Photo
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {presetPhotos.map((preset) => (
                      <div
                        key={preset.name}
                        onClick={() => setSelectedPhotoPresetUrl(preset.url)}
                        className={`h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${
                          selectedPhotoPresetUrl === preset.url
                            ? "border-brand-emerald scale-105 shadow-lg shadow-brand-emerald/20"
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setUploadOpen(false)}
                    className="px-6 py-3.5 rounded-2xl border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-white text-black hover:bg-zinc-200 text-sm font-bold transition-colors"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
