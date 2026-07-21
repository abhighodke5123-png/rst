import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-zinc-50 border border-zinc-300 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50 sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-black">Privacy Policy</h2>
              <p className="text-xs text-zinc-500 mt-1">Last Updated: July 10, 2026</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-full text-zinc-600 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-zinc-700 text-sm leading-relaxed space-y-8">
            <section>
              <p>At Raasta Travels, we value your privacy and are committed to protecting your personal information.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-black mb-3">Information We Collect</h3>
              <p className="mb-2">We may collect:</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600 marker:text-zinc-600">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Travel preferences</li>
                <li>Booking details</li>
                <li>Payment information (processed securely through trusted payment partners)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-black mb-3">How We Use Your Information</h3>
              <p className="mb-2">We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600 marker:text-zinc-600">
                <li>Process bookings</li>
                <li>Provide customer support</li>
                <li>Send booking confirmations</li>
                <li>Improve our services</li>
                <li>Share important travel updates</li>
                <li>Respond to inquiries</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-black mb-3">Data Security</h3>
              <p>We use appropriate security measures to protect your personal information from unauthorized access, misuse, or disclosure.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-black mb-3">Third-Party Services</h3>
              <p>We may work with trusted partners such as payment gateways, hotels, airlines, and transport providers to complete your booking. These providers have their own privacy policies.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-black mb-3">Cookies</h3>
              <p>Our website may use cookies to improve user experience, remember preferences, and analyze website traffic.</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-black mb-3">Your Rights</h3>
              <p className="mb-2">You may request to:</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600 marker:text-zinc-600">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your personal data where applicable</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-black mb-3">Contact</h3>
              <p>If you have questions regarding this Privacy Policy, please contact Raasta Travels through the contact details provided on our website.</p>
            </section>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-zinc-200 bg-zinc-50/80 backdrop-blur-md">
             <button
              onClick={onClose}
              className="w-full py-3 bg-black text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition"
            >
              Understood
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
