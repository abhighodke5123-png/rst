/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles, Compass, User, LogOut, ShieldAlert, Mail, PhoneCall, MessageCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onQuizClick: () => void;
  onBookingsClick: () => void;
  bookingCount: number;
  currentUser: { id: string; name: string; email: string; role: string } | null;
  onAuthClick: () => void;
  onDashboardClick: () => void;
  onLogout: () => void;
  onLogoClick: () => void;
  hideNavAnchors?: boolean;
  onNotificationsClick: () => void;
  notificationCount: number;
}

export default function Navbar({
  onQuizClick,
  onBookingsClick,
  bookingCount,
  currentUser,
  onAuthClick,
  onDashboardClick,
  onLogout,
  onLogoClick,
  hideNavAnchors = false,
  onNotificationsClick,
  notificationCount
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY < 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide
        setVisible(false);
      } else {
        // Scrolling up - show
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = hideNavAnchors
    ? []
    : [
        { label: "Trips", href: "#trips" },
        { label: "Gallery", href: "#gallery" },
        { label: "About", href: "#about" },
        { label: "FAQ", href: "#about" }
      ];

  const categories = [
    { label: "Weekend Getaways", href: "#weekend" },
    { label: "Himalayan Road Trips", href: "#himalayan" },
    { label: "Group Trips", href: "#group" },
    { label: "Bike Trips", href: "#bike" },
    { label: "Custom Trips", href: "#custom" }
  ];

  return (
    <header
      id="navbar-header"
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 transform ${
        scrolled
          ? "glass-nav py-4"
          : "bg-transparent py-6"
      } ${
        visible || isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo and Brand */}
        <button onClick={onLogoClick} className="flex items-center gap-3 group focus:outline-none cursor-pointer">
          <span className="text-2xl font-bold tracking-tight text-white font-sans">
            RAASTA
          </span>
        </button>

        {/* Desktop Navigation */}
        {!hideNavAnchors && (
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-white hover:text-brand-blue transition-colors">Home</a>
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+919322309802" className="text-zinc-300 hover:text-white transition-colors">
            Contact
          </a>

          {!currentUser ? (
            /* User is logged out */
            <button
              onClick={onAuthClick}
              className="px-6 py-2.5 text-sm font-semibold bg-white text-black hover:bg-zinc-200 rounded-full transition-colors cursor-pointer"
            >
              Login / Signup
            </button>
          ) : (
            /* User is logged in successfully */
            <div className="flex items-center gap-2">
              <button
                onClick={onDashboardClick}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {currentUser.role === "admin" ? (
                  <ShieldAlert className="w-4 h-4 text-brand-emerald" />
                ) : (
                  <User className="w-4 h-4 text-current" />
                )}
                <span>{currentUser.role === "admin" ? "Admin" : "Dashboard"}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 focus:outline-none text-white"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-nav border-t border-white/10 absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="px-6 pt-2 pb-6 flex flex-col gap-4 text-sm font-semibold text-white">
              <a href="/" onClick={() => setIsOpen(false)} className="py-2 block border-b border-white/5">Home</a>
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="py-2 block border-b border-white/5 text-zinc-300 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-3">
                <a
                  href="tel:+919322309802"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10"
                >
                  <PhoneCall className="w-4 h-4" />
                  Contact Us
                </a>

                {!currentUser ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onAuthClick();
                    }}
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold"
                  >
                    Login / Signup
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onDashboardClick();
                      }}
                      className="w-full py-3 rounded-xl bg-white/10 text-white"
                    >
                      {currentUser.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onLogout();
                      }}
                      className="w-full py-3 rounded-xl bg-red-500/10 text-red-400"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
