import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Briefcase, MapPin, Sparkles, Send, CheckCircle2, ArrowRight } from "lucide-react";

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OPEN_ROLES = [
  {
    id: "trip-lead",
    title: "Trip Captain / Expedition Leader",
    location: "Goa / Gokarna / Spiti (On-Ground)",
    type: "Full-Time & Seasonal",
    experience: "1+ years in outdoor guiding",
    description: "Lead curated small groups of 12-15 nomads across coastal or mountain trails. Keep energy high, manage on-ground logistics, and ensure unforgettable group bonding.",
    tags: ["Leadership", "Wilderness First Aid", "Group Dynamics"]
  },
  {
    id: "experience-curator",
    title: "Travel Experience Curator & Route Designer",
    location: "Bengaluru (Hybrid)",
    type: "Full-Time",
    experience: "2+ years in travel curation",
    description: "Scout undiscovered homestays, hidden waterfalls, and secret cliff viewpoints across India to design authentic, non-touristy itineraries.",
    tags: ["Itinerary Design", "Vendor Relations", "Storytelling"]
  },
  {
    id: "visual-storyteller",
    title: "Visual Storyteller & Content Creator",
    location: "Remote / On-Trip",
    type: "Contract / Project",
    experience: "Portfolio of travel photography/reels",
    description: "Travel with our caravans to capture cinematic drone footage, candid traveler portraits, and high-energy Instagram reels.",
    tags: ["Cinematography", "Premiere/CapCut", "Community Vibe"]
  }
];

export default function CareersModal({ isOpen, onClose }: CareersModalProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantNotes, setApplicantNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) return;

    // Send application via WhatsApp as direct fallback
    const message = `*New Raasta Career Application*%0A*Role:* ${selectedRole || "General Application"}%0A*Name:* ${encodeURIComponent(applicantName)}%0A*Email:* ${encodeURIComponent(applicantEmail)}%0A*Phone:* ${encodeURIComponent(applicantPhone)}%0A*Notes:* ${encodeURIComponent(applicantNotes)}`;
    window.open(`https://wa.me/917348929802?text=${message}`, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedRole(null);
      setApplicantName("");
      setApplicantEmail("");
      setApplicantPhone("");
      setApplicantNotes("");
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0b0c10] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-white z-10"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#0b0c10] sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-2xl text-amber-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight font-display text-white">Join the RAASTA Crew</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Turn your passion for the open road into a lifelong vocation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full glass hover:bg-white/20 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8">
            {submitted ? (
              <div className="p-12 text-center flex flex-col items-center justify-center glass rounded-3xl border border-emerald-500/30">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold font-display mb-2">Application Received!</h3>
                <p className="text-zinc-400 text-sm max-w-md">
                  Thank you for applying. We are reviewing your profile and will connect with you on WhatsApp or email within 48 hours.
                </p>
              </div>
            ) : selectedRole ? (
              /* Application Form for Selected Role */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-display">Applying For</span>
                    <h3 className="text-xl font-bold font-display text-white mt-0.5">{selectedRole}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    View other openings
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Aryan Sharma"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="e.g. aryan@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="e.g. 7348929802"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Tell us about your travel background or portfolio link</label>
                    <textarea
                      rows={4}
                      value={applicantNotes}
                      onChange={(e) => setApplicantNotes(e.target.value)}
                      placeholder="Share your experience, outdoor treks done, Instagram profile link, or why you want to join Raasta..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(null)}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-sm transition cursor-pointer font-display"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-black hover:bg-amber-300 font-bold text-sm transition cursor-pointer shadow-lg shadow-amber-500/20 font-display"
                    >
                      <Send className="w-4 h-4" />
                      Submit Application via WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Roles List */
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-400/10 to-emerald-400/10 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-white font-display">Why Work With Raasta?</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                      Paid travel across scenic India, flexible project schedules, gear stipends, free road trips, and an incredible nomad community.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
                    <Sparkles className="w-3.5 h-3.5" /> Hiring Now
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {OPEN_ROLES.map((role) => (
                    <div
                      key={role.id}
                      className="glass border border-white/10 rounded-2xl p-6 hover:border-amber-400/40 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="text-lg font-bold font-display text-white group-hover:text-amber-400 transition-colors">
                            {role.title}
                          </h4>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-zinc-300 w-fit">
                            {role.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            {role.location}
                          </span>
                          <span>•</span>
                          <span>{role.experience}</span>
                        </div>
                        <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">
                          {role.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {role.tags.map((tag) => (
                            <span key={tag} className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 text-zinc-400 border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedRole(role.title)}
                        className="self-end flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-black hover:bg-amber-300 font-bold text-xs transition cursor-pointer shadow-md shadow-amber-500/20 font-display"
                      >
                        Apply for this Role
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
