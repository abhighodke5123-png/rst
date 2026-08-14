import React, { useState } from "react";
import { ArrowRight, Clock, User, X, Share2, Bookmark, Check, Sparkles, MapPin, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import image1 from "../assets/images/regenerated_image_1784553671699.jpg";
// @ts-ignore
import image2 from "../assets/images/regenerated_image_1784553814795.jpg";
// @ts-ignore
import image3 from "../assets/images/regenerated_image_1784553813616.jpg";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  image: string;
  category: string;
  date: string;
  content: string[];
  keyHighlights: string[];
}

const ARTICLES: Article[] = [
  {
    id: "himalayan-packing-list",
    title: "10 Must-Pack Items for a Himalayan Road Trip",
    excerpt: "Don't get caught in the cold. Here is our definitive packing list for high-altitude adventures across Spiti and Ladakh.",
    author: "RAASTA Expedition Leads",
    readTime: "5 min read",
    date: "July 2026",
    image: image1,
    category: "Packing Guide",
    keyHighlights: [
      "Thermal base layers with moisture-wicking merino wool",
      "Hydration reservoir & Diamox / altitude sickness tablets",
      "Polarized UV400 sunglasses to counter intense mountain glare",
      "20,000mAh rugged power bank (cold drains batteries 2x faster)"
    ],
    content: [
      "High altitude travel in the Himalayas requires thoughtful preparation. Temperatures can fluctuate from +20°C in direct afternoon sun down to -5°C at mountain passes like Kunzum La and Rohtang within a matter of hours.",
      "Layering is everything. Always pack three essential layers: a breathable moisture-wicking base layer, an insulating fleece mid-layer, and a windproof/waterproof outer shell jacket.",
      "Stay hydrated: Drink at least 3 to 4 liters of water daily with electrolytes to help your body acclimatize effectively to oxygen levels above 10,000 feet."
    ]
  },
  {
    id: "spiti-valley-secrets",
    title: "The Ultimate Guide to Spiti Valley & Beyond",
    excerpt: "Everything you need to know about high passes, permits, ancient monasteries, and hidden stargazing hamlets in the Middle Land.",
    author: "Sneha D.",
    readTime: "8 min read",
    date: "June 2026",
    image: image2,
    category: "Route Guides",
    keyHighlights: [
      "Key Monastery morning monk prayer rituals",
      "Sending postcards from the World's Highest Post Office in Hikkim (14,567 ft)",
      "Camping by the crescent jewel of Chandratal Lake",
      "Finding 500-million-year-old marine fossils in Langza"
    ],
    content: [
      "Spiti, literally meaning 'The Middle Land' between India and Tibet, is a surreal cold desert moonscape nestled high in Himachal Pradesh.",
      "The drive through Kaza, Tabo, Dhankar, and Kibber features rugged dirt trails framed by towering 6,000-meter snowcapped peaks.",
      "At Raasta, we organize small caravans of 4x4 SUVs so every nomad gets a window seat, seasoned mountain drivers, and certified oxygen support on every high pass."
    ]
  },
  {
    id: "magic-of-group-travel",
    title: "Why Group Travel with Strangers Changes Everything",
    excerpt: "Solo travel is liberating, but sharing a sunrise viewpoint and campfire playlist with strangers creates lifelong connections.",
    author: "Rahul S.",
    readTime: "4 min read",
    date: "May 2026",
    image: image3,
    category: "Travel Stories",
    keyHighlights: [
      "Shared laughs around beach campfires and homestay dinners",
      "No logistics anxiety: vehicles, routes, and stays are vetted",
      "Meeting creative nomads, founders, photographers, and dreamers",
      "Returning with friends who turn into lifelong travel buddies"
    ],
    content: [
      "Taking that first leap to travel with people you've never met can feel intimidating. But the moment the road begins and the playlist starts playing, barriers melt instantly.",
      "When you share a flat tire in the mountains or jump into secret ocean waves together in Gokarna, everyday titles and city masks disappear. You connect on a raw, human level.",
      "Our Raasta cohorts average 12 to 15 people—intimate enough that everyone knows each other's name, yet large enough for diverse, fascinating conversations under starry skies."
    ]
  }
];

export default function BlogHub() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Packing Guide", "Route Guides", "Travel Stories"];

  const filteredArticles = activeCategory === "All"
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(b => b !== id));
    } else {
      setBookmarked([...bookmarked, id]);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="blog" className="py-28 bg-[#07080a] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block font-display">
              Field Notes & Curated Guides
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
              Chronicles from the Open Road
            </h2>
            <p className="text-zinc-400 font-light mt-3 text-base leading-relaxed">
              Expert gear preparation, route dispatches, and authentic travel memoirs curated by seasoned Raasta expedition captains.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-[#0b0c10] border border-white/10 p-1.5 rounded-2xl shadow-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer font-display ${
                  activeCategory === cat
                    ? "bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => {
            const isSaved = bookmarked.includes(article.id);
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedArticle(article)}
                className="bg-[#0b0c10] border border-white/10 rounded-[32px] overflow-hidden hover:border-amber-400/40 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-400 font-display">
                      {article.category}
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-colors ${
                        isSaved ? "bg-amber-400 text-black border-amber-400" : "bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Save Story"}
                    >
                      <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="p-6 md:p-7">
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-amber-400 transition-colors font-display">
                      {article.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-light line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-400/80" />
                    <span className="text-zinc-300">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FULL ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0b0c10] border border-white/15 rounded-[36px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-white z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white z-30 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Banner */}
              <div className="relative h-64 sm:h-80 w-full shrink-0">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3.5 py-1 bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3 backdrop-blur-md font-display">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight font-display">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-zinc-200">
                      <User className="w-4 h-4 text-amber-400" />
                      By {selectedArticle.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {selectedArticle.readTime}
                    </span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-white bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl transition cursor-pointer font-display text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Key Highlights Card */}
                <div className="p-5 rounded-2xl border border-amber-400/20 bg-amber-400/5">
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2 font-display">
                    <Sparkles className="w-4 h-4" /> Expedition Key Highlights
                  </h4>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {selectedArticle.keyHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span className="font-light">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Body Paragraphs */}
                <div className="space-y-4 text-zinc-300 leading-relaxed font-light text-base">
                  {selectedArticle.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-zinc-400 text-center sm:text-left font-light">
                    Ready to hit the highway with Raasta? Check out our upcoming scheduled departures.
                  </p>
                  <a
                    href="#trips"
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-3 rounded-2xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition shadow-lg shadow-amber-500/20 font-display"
                  >
                    Explore Scheduled Trips
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
