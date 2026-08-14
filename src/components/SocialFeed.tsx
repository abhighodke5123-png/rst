import React, { useState } from "react";
import { Instagram, Play, Heart, MessageCircle, ExternalLink, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import image1 from "../assets/images/regenerated_image_1784553461485.jpg";
// @ts-ignore
import image2 from "../assets/images/regenerated_image_1784553462944.jpg";
// @ts-ignore
import image4 from "../assets/images/regenerated_image_1784553466412.jpg";

interface Reel {
  id: string;
  image: string;
  views: string;
  likes: number;
  location: string;
  caption: string;
  tag: string;
}

const REELS: Reel[] = [
  {
    id: "reel-ladakh",
    image: image1,
    views: "124K",
    likes: 4820,
    location: "Ladakh High Passes",
    caption: "Waking up to 17,000 ft views with warm chai and the best road trip crew. 🏔️✨",
    tag: "#RaastaNomads #Ladakh"
  },
  {
    id: "reel-spiti",
    image: image2,
    views: "89K",
    likes: 3150,
    location: "Spiti Valley & Chandratal",
    caption: "Moonscapes and million-star skies in the heart of Himachal. 🌌",
    tag: "#SpitiDiaries #RaastaTrips"
  },
  {
    id: "reel-kerala",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=600&h=900",
    views: "210K",
    likes: 7890,
    location: "Gokarna Secret Beaches",
    caption: "Cliff jumping, sunset acoustic jams, and bioluminescence at Om Beach! 🌊🎶",
    tag: "#GokarnaVibes #BeachTrek"
  },
  {
    id: "reel-goa",
    image: image4,
    views: "56K",
    likes: 2410,
    location: "South Goa Monsoon Trails",
    caption: "Green mossy Portuguese villas, hidden river streams, and rain on the windshield. 🌧️🌴",
    tag: "#MonsoonRoadTrip #Goa"
  }
];

export default function SocialFeed() {
  const [likesMap, setLikesMap] = useState<{ [key: string]: { count: number; liked: boolean } }>({
    "reel-ladakh": { count: 4820, liked: false },
    "reel-spiti": { count: 3150, liked: false },
    "reel-kerala": { count: 7890, liked: false },
    "reel-goa": { count: 2410, liked: false }
  });

  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  const toggleLike = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikesMap((prev) => {
      const current = prev[reelId] || { count: 100, liked: false };
      return {
        ...prev,
        [reelId]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked
        }
      };
    });
  };

  return (
    <section id="gallery" className="py-28 bg-[#07080a] border-t border-white/5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block font-display">
              Instagram @raasta.trips
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
              Live from the Caravan
            </h2>
            <p className="text-zinc-400 font-light mt-3 text-base leading-relaxed">
              Unfiltered moments, campfire singalongs, and raw mountain sunrises captured by our traveler tribe.
            </p>
          </div>
          
          <a
            href="https://www.instagram.com/raasta.trips?igsh=Y2JlMXJ4ZzdkOGc5"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold tracking-wide text-xs rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/10 group cursor-pointer font-display"
          >
            <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Follow @raasta.trips
          </a>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {REELS.map((reel) => {
            const likeState = likesMap[reel.id] || { count: reel.likes, liked: false };
            return (
              <div
                key={reel.id}
                onClick={() => setActiveReel(reel)}
                className="group relative rounded-[32px] overflow-hidden aspect-[9/16] cursor-pointer bg-[#0b0c10] border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1.5"
              >
                <img
                  src={reel.image}
                  alt={reel.location}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-black/20 to-black/40 group-hover:from-[#07080a]/90 transition-colors" />

                {/* Top Location tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {reel.location.split(" ")[0]}
                  </span>

                  <button
                    onClick={(e) => toggleLike(reel.id, e)}
                    className={`p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 transition-all ${
                      likeState.liked ? "bg-red-500/20 text-red-500 border-red-500/30 scale-110" : "text-white/80 hover:text-white"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={likeState.liked ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-amber-400/20 backdrop-blur-md border border-amber-400/30 rounded-full flex items-center justify-center text-amber-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110 shadow-lg shadow-amber-500/20">
                  <Play className="w-6 h-6 fill-current ml-1 text-amber-400" />
                </div>

                {/* Bottom Stats & Details */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h4 className="text-sm font-bold tracking-tight mb-1 truncate font-display">
                    {reel.location}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3 text-amber-400" /> {reel.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400" fill="currentColor" /> {likeState.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REEL LIGHTBOX / DETAILS MODAL */}
      <AnimatePresence>
        {activeReel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReel(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0b0c10] border border-white/15 rounded-[36px] overflow-hidden shadow-2xl z-10 text-white"
            >
              <button
                onClick={() => setActiveReel(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white z-30 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[4/5] w-full">
                <img
                  src={activeReel.image}
                  alt={activeReel.location}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-xs font-bold text-amber-400 mb-2 backdrop-blur-md font-display uppercase tracking-wider">
                    {activeReel.location}
                  </span>
                  <p className="text-white text-sm leading-relaxed font-light mb-2">
                    {activeReel.caption}
                  </p>
                  <p className="text-xs text-amber-400/80 font-medium font-mono">{activeReel.tag}</p>
                </div>
              </div>

              <div className="p-6 bg-[#0b0c10] flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => toggleLike(activeReel.id, e)}
                    className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 ${likesMap[activeReel.id]?.liked ? "text-red-500 fill-current" : ""}`}
                    />
                    <span>{likesMap[activeReel.id]?.count.toLocaleString() || activeReel.likes} likes</span>
                  </button>
                </div>

                <a
                  href="https://www.instagram.com/raasta.trips?igsh=Y2JlMXJ4ZzdkOGc5"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 text-black font-black text-xs hover:bg-amber-300 transition cursor-pointer font-display shadow-lg shadow-amber-500/20"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  View on Instagram
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
