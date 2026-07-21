import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Play, MapPin, Compass } from "lucide-react";

export default function Experiences() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  const experiences = [
    {
      title: "Spiti Valley Expedition",
      location: "Himachal Pradesh",
      type: "High Altitude Desert",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2952&auto=format&fit=crop",
    },
    {
      title: "Meghalaya Monsoons",
      location: "North East",
      type: "Rainforest Trails",
      image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2836&auto=format&fit=crop",
    },
    {
      title: "Rann of Kutch",
      location: "Gujarat",
      type: "White Desert Safari",
      image: "https://images.unsplash.com/photo-1623947475176-58dc18eb7400?q=80&w=2874&auto=format&fit=crop",
    },
    {
      title: "Wayanad Escapes",
      location: "Kerala",
      type: "Forest Retreats",
      image: "https://images.unsplash.com/photo-1590765949684-213197477b67?q=80&w=2864&auto=format&fit=crop",
    },
    {
      title: "Ladakh Monasteries",
      location: "Jammu & Kashmir",
      type: "Cultural Heritage",
      image: "https://images.unsplash.com/photo-1502472621453-29f798836ec8?q=80&w=2938&auto=format&fit=crop",
    },
    {
      title: "Andaman Scuba Dive",
      location: "Andaman Islands",
      type: "Marine Life",
      image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=2846&auto=format&fit=crop",
    }
  ];

  return (
    <section className="py-32 relative bg-[#080808] overflow-hidden" ref={containerRef}>
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-emerald/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <Compass className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Unscripted Journeys</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Cinematic <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Experiences.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              We don't just visit places; we immerse ourselves. Browse through visual stories of our most unforgettable expeditions.
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Navigators or just some aesthetic counter */}
            <div className="text-right">
              <span className="text-4xl font-light text-white">06</span>
              <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Curated Trails</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full overflow-x-hidden pt-8 pb-16">
        <motion.div 
          className="flex gap-6 px-6 md:px-12 w-max"
          style={{ x }}
        >
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              className="relative group w-[300px] h-[400px] sm:w-[400px] sm:h-[550px] rounded-[32px] overflow-hidden shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-500 group-hover:bg-black/20"></div>
              <img 
                src={exp.image} 
                alt={exp.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                <div className="self-end opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <button className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                    <Play className="w-5 h-5 ml-1" />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-brand-orange" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest drop-shadow-md">{exp.location}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{exp.title}</h3>
                  <span className="text-sm font-light text-zinc-300 backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full border border-white/10 inline-block">
                    {exp.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Duplicate for infinite feel, or just empty space */}
          <div className="w-[10vw]"></div>
        </motion.div>
      </div>
    </section>
  );
}
