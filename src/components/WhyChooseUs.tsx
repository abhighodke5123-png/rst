import React from "react";
import { ShieldCheck, HeartHandshake, Headphones, MapPin, Users } from "lucide-react";
import { motion } from "motion/react";

const HIGHLIGHTS = [
  {
    title: "Verified Vehicles & Drivers",
    description: "Safety is our top priority. We only work with vetted transport partners and experienced drivers.",
    icon: <ShieldCheck className="w-8 h-8 text-brand-blue" />
  },
  {
    title: "Small-Group Curation",
    description: "Travel with like-minded people. We cap our group sizes to keep the experience intimate and authentic.",
    icon: <Users className="w-8 h-8 text-brand-emerald" />
  },
  {
    title: "24/7 Trip Support",
    description: "Our dedicated on-ground team is available round the clock to assist you during your entire journey.",
    icon: <Headphones className="w-8 h-8 text-brand-orange" />
  },
  {
    title: "Value For Money",
    description: "No hidden costs. We provide clear, transparent pricing and the best experiences for your budget.",
    icon: <HeartHandshake className="w-8 h-8 text-white" />
  },
  {
    title: "Curated Bucket-List Routes",
    description: "We don't just follow the map. We create itineraries that explore offbeat gems and iconic spots alike.",
    icon: <MapPin className="w-8 h-8 text-brand-blue" />
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-emerald">RAASTA</span></h2>
          <p className="text-zinc-400 font-light text-lg">We handle the logistics so you can focus on making memories. Here is what sets our curated road trips apart.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HIGHLIGHTS.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass p-8 rounded-[32px] hover:-translate-y-2 transition-transform duration-500 flex flex-col items-start group"
            >
              <div className="p-4 bg-white/5 rounded-2xl mb-6 group-hover:bg-white/10 transition-colors">
                {highlight.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{highlight.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm font-light">{highlight.description}</p>
            </motion.div>
          ))}
          
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass p-8 rounded-[32px] flex flex-col justify-center bg-gradient-to-br from-brand-blue/10 to-brand-emerald/10"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-white mb-1">5K+</div>
                <div className="text-xs text-brand-emerald font-semibold uppercase tracking-wider">Travelers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">150+</div>
                <div className="text-xs text-brand-blue font-semibold uppercase tracking-wider">Trips</div>
              </div>

              <div>
                <div className="text-4xl font-bold text-white mb-1">98%</div>
                <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Repeat</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
