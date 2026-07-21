import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Compass, Map, ShieldCheck, HeartHandshake, Eye } from "lucide-react";
// @ts-expect-error - Vite handles asset imports dynamically
import aboutImg from "../assets/images/regenerated_image_1784642536092.jpg";

export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 bg-[#040404] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-emerald">RAASTA Travels</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light">
            Your Journey Begins with Raasta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-zinc-400 leading-relaxed text-lg font-light">
              At RAASTA Travels, we believe every journey should be memorable, affordable, and hassle-free. Whether you're looking for a relaxing beach vacation, an adventurous mountain escape, or a carefully planned group tour, we make travel simple and enjoyable.
            </p>
            <p className="text-zinc-400 leading-relaxed text-lg font-light">
              Our mission is to provide well-organized travel experiences with transparent pricing, reliable support, and personalized service. We work with trusted travel partners to offer quality accommodations, transportation, sightseeing, and guided experiences.
            </p>
            <p className="text-brand-orange font-bold text-xl pt-6 border-t border-white/10 tracking-wide">
              Travel More. Worry Less. Explore with Raasta.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-[40px] overflow-hidden border border-white/10 group"
          >
            <img 
              src={aboutImg} 
              alt="Travelers exploring together" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-white font-medium text-lg leading-relaxed">Whether you're planning your first trip or your next adventure, Raasta Travels is here to help you explore with confidence.</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* What We Offer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass border border-white/10 p-10 rounded-[32px] hover:border-white/20 transition-colors"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-brand-blue/10 text-brand-blue mb-8 border border-brand-blue/20">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">What We Offer</h3>
            <ul className="space-y-4">
              {[
                "Domestic tour packages",
                "Weekend getaways",
                "Group tours",
                "Customized holiday packages",
                "Hotel bookings",
                "Transportation assistance",
                "Travel planning and consultation"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-zinc-400 font-light">
                  <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass border border-white/10 p-10 rounded-[32px] hover:border-white/20 transition-colors"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-brand-emerald/10 text-brand-emerald mb-8 border border-brand-emerald/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Why Choose Us?</h3>
            <ul className="space-y-4">
              {[
                "Carefully curated itineraries",
                "Affordable and transparent pricing",
                "Personalized customer support",
                "Trusted travel partners",
                "Safe and comfortable travel experiences",
                "Easy booking process"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-zinc-400 font-light">
                  <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass border border-white/10 p-10 rounded-[32px] hover:border-white/20 transition-colors flex flex-col"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-brand-orange/10 text-brand-orange mb-8 border border-brand-orange/20">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">Our Vision</h3>
            <p className="text-zinc-400 leading-relaxed text-lg flex-grow font-light">
              To become one of India's most trusted travel brands by creating unforgettable experiences and making travel accessible to everyone.
            </p>
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
              <HeartHandshake className="w-12 h-12 text-zinc-600" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
