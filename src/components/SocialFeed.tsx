import React from "react";
import { Instagram, Play } from "lucide-react";
// @ts-ignore
import image1 from "../assets/images/regenerated_image_1784553461485.jpg";
// @ts-ignore
import image2 from "../assets/images/regenerated_image_1784553462944.jpg";
// @ts-ignore
import image4 from "../assets/images/regenerated_image_1784553466412.jpg";

const REELS = [
  {
    image: image1,
    views: "124K",
    location: "Ladakh"
  },
  {
    image: image2,
    views: "89K",
    location: "Spiti"
  },
  {
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=400&h=600",
    views: "210K",
    location: "Kerala"
  },
  {
    image: image4,
    views: "56K",
    location: "Goa"
  }
];

export default function SocialFeed() {
  return (
    <section className="py-24 bg-white border-y border-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 tracking-tight">Live from the Road</h2>
            <p className="text-zinc-600 font-medium">Follow our adventures on Instagram. Join a community of over 50,000 travelers.</p>
          </div>
          <a 
            href="https://www.instagram.com/raasta.trips?igsh=Y2JlMXJ4ZzdkOGc5" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-pink-50 text-pink-600 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-pink-100 transition"
          >
            <Instagram className="w-5 h-5" />
            Follow @raasta.trips
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {REELS.map((reel, index) => (
            <div key={index} className="group relative rounded-2xl overflow-hidden aspect-[9/16] cursor-pointer bg-zinc-100">
              <img 
                src={reel.image} 
                alt={reel.location} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                <Play className="w-5 h-5 fill-current ml-1" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                <span className="text-sm font-bold">{reel.location}</span>
                <span className="text-xs font-semibold flex items-center gap-1">
                  <Play className="w-3 h-3" /> {reel.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
