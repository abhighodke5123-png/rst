import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Users, Clock, Flame, ShieldAlert, CreditCard } from "lucide-react";

interface TermsRegulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "terms" | "refunds" | "agreement";
}

export default function TermsRegulationsModal({ isOpen, onClose, initialTab = "terms" }: TermsRegulationsModalProps) {
  const [activeTab, setActiveTab] = React.useState<"terms" | "refunds" | "agreement">(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        ></motion.div>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0b0c10] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-zinc-100 z-10"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-[#0b0c10] sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-display tracking-tight">
                  RAASTA Expedition Regulations
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Official Trip Guidelines & Compliance System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-white/5 p-2 gap-2 text-xs font-bold font-display">
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-center transition-all cursor-pointer ${
                activeTab === "terms"
                  ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Trip Regulations
            </button>
            <button
              onClick={() => setActiveTab("refunds")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-center transition-all cursor-pointer ${
                activeTab === "refunds"
                  ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Cancellation & Refund Policy
            </button>
            <button
              onClick={() => setActiveTab("agreement")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-center transition-all cursor-pointer ${
                activeTab === "agreement"
                  ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              User Agreement
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-zinc-300 text-sm leading-relaxed space-y-6 font-light">
            {activeTab === "terms" && (
              <>
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-base font-display">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <span>1. Code of Conduct & Safety</span>
                  </div>
                  <p>
                    All participants must maintain a decorum of safety and mutual respect during the journey.
                    Our road trips traverse diverse ecological zones and local communities across India.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 marker:text-amber-400">
                    <li>
                      <strong className="text-zinc-200">Zero Tolerance Policy:</strong> Possession or consumption of illegal substances is strictly forbidden. Anyone found carrying or consuming drugs will be immediately offloaded, and local law enforcement will be informed.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Alcohol Misconduct:</strong> While moderate consumption of alcohol is permitted during leisure hours at designated overnight stays (unless prohibited by local laws), drinking inside any moving vehicle is strictly illegal and will lead to termination of the trip.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Environmental Respect:</strong> RAASTA is a plastic-aware organization. Littering on beaches, mountain trails, or water bodies is punishable by a fine of ₹1,000.
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-base font-display">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span>2. Transport & Punctuality Protocols</span>
                  </div>
                  <p>
                    Road travel involves precise timing schedules to bypass traffic congestion and reach sunset spots/forts safely.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 marker:text-emerald-400">
                    <li>
                      <strong className="text-zinc-200">Departure Cut-offs:</strong> High-speed transfers wait for a maximum of 15 minutes past the scheduled departure time. Travelers missing the vehicle must join the next leg of the trip at their own cost.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Assigned Seating:</strong> Seats inside vans/buses are rotated daily by the Trip Captain to ensure everyone gets equal access to premium front views.
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-base font-display">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>3. Adventure Activities & Liability Disclaimer</span>
                  </div>
                  <p>
                    Activities such as high-altitude beach treks, water sports (parasailing, scuba, jet-ski), and natural lagoon swims carry inherent elements of risk.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 marker:text-amber-400">
                    <li>
                      <strong className="text-zinc-200">Mandatory Gear:</strong> Wearing certified life jackets is compulsory during all marine sports and boat rides. No exceptions.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Trip Captain Directives:</strong> The Trip Captain's assessment of weather hazards, heavy rain, landslide warnings, or high tides is final. Routes may be altered instantly for group safety.
                    </li>
                  </ul>
                </section>
              </>
            )}

            {activeTab === "refunds" && (
              <>
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-base font-display">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <span>Standard Cancellation Policy</span>
                  </div>
                  <p>
                    Because we book stays, permits, and vehicles in advance to offer custom group packages, our cancellations are strictly automated as follows:
                  </p>
                  
                  {/* Visual table */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 text-xs font-mono">
                    <div className="grid grid-cols-2 bg-white/10 p-3 font-bold text-white border-b border-white/10 font-display">
                      <div>Timeline Prior to Departure</div>
                      <div>Refund Percentage</div>
                    </div>
                    <div className="grid grid-cols-2 p-3 border-b border-white/5">
                      <div>More than 15 Days</div>
                      <div className="text-emerald-400 font-bold">100% Refund (or 100% Credit Voucher)</div>
                    </div>
                    <div className="grid grid-cols-2 p-3 border-b border-white/5">
                      <div>7 to 14 Days</div>
                      <div className="text-amber-400 font-bold">50% Refund (or 100% Credit Voucher)</div>
                    </div>
                    <div className="grid grid-cols-2 p-3">
                      <div>Less than 7 Days</div>
                      <div className="text-red-400 font-bold">No Refund / No Credit Voucher</div>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs mt-2">
                    *Processing fee of 3% is applicable on absolute bank refunds to cover transaction gateway costs.
                  </p>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-base font-display">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>Acts of God & Weather Anomalies</span>
                  </div>
                  <p>
                    In the event of weather-triggered blockages (monsoon flooding, cloudbursts, landslide warnings, administrative lockdowns):
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400 marker:text-amber-400">
                    <li>RAASTA Travels will issue a non-expiring credit voucher worth 100% of your paid amount. This can be redeemed on any future destination.</li>
                    <li>Cash refunds will not be processed for disruptions arising from climate force majeure or highway-level state restrictions.</li>
                  </ul>
                </section>
              </>
            )}

            {activeTab === "agreement" && (
              <>
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold text-base font-display">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span>User Booking & Liability Release Agreement</span>
                  </div>
                  <p>
                    By clicking "Agree and Book" or reserving an online ticket through our portal, you certify:
                  </p>
                  <ol className="list-decimal pl-5 space-y-3 text-xs text-zinc-400 marker:text-amber-400">
                    <li>
                      <strong className="text-zinc-200">Fitness Self-Declaration:</strong> You are in sound health and are free from underlying respiratory, cardiovascular, or physical conditions that might restrict walking, beach trekking, or mild hiking.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Luggage Liability:</strong> RAASTA is not responsible for any lost, damaged, or stolen baggage. We recommend keeping cash, expensive camera gear, and passports on your person in a water-sealed bag.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Media Consent:</strong> Our trips frequently feature a dedicated photographer/drone captain. You grant RAASTA permission to use captured photos and group video reels for marketing on Instagram and other platforms, unless requested otherwise via email prior to start.
                    </li>
                  </ol>
                </section>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/10 bg-[#07080a] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <span className="text-zinc-400 text-xs font-mono">Helpline: +91 7348929802 | raastatrips.in@gmail.com</span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition shadow-lg shadow-amber-500/20 cursor-pointer font-display"
            >
              I Agree & Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
