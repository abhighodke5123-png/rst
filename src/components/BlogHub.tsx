import React from "react";
import { ArrowRight, Clock, User } from "lucide-react";
import { motion } from "motion/react";
// @ts-ignore
import image1 from "../assets/images/regenerated_image_1784553671699.jpg";
// @ts-ignore
import image2 from "../assets/images/regenerated_image_1784553814795.jpg";
// @ts-ignore
import image3 from "../assets/images/regenerated_image_1784553813616.jpg";

const ARTICLES = [
  {
    title: "10 Must-Pack Items for a Himalayan Road Trip",
    excerpt: "Don't get caught in the cold. Here is our definitive packing list for high-altitude adventures.",
    author: "RAASTA Experts",
    readTime: "5 min read",
    image: image1,
    category: "Packing Guide"
  },
  {
    title: "The Ultimate Guide to Spiti Valley",
    excerpt: "Everything you need to know about permits, routes, and hidden gems in the Middle Land.",
    author: "Sneha D.",
    readTime: "8 min read",
    image: image2,
    category: "Route Guides"
  },
  {
    title: "Why Group Travel is the Best Way to Explore",
    excerpt: "Solo travel is great, but sharing a journey with like-minded strangers creates bonds that last a lifetime.",
    author: "Rahul S.",
    readTime: "4 min read",
    image: image3,
    category: "Travel Stories"
  }
];

export default function BlogHub() {
  return (
    <section className="py-24 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 tracking-tight">Stories & Guides</h2>
            <p className="text-zinc-600 font-medium">Expert advice, route guides, and travel stories from the road.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black hover:text-yellow-600 transition">
            View All Articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-3 leading-snug group-hover:text-yellow-600 transition-colors">{article.title}</h3>
                <p className="text-zinc-600 text-sm mb-6 leading-relaxed">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
