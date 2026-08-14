import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles, Compass, User, LogOut, ShieldAlert, Mail, PhoneCall, MessageCircle, Ticket, Bell } from "lucide-react";
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

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const menuItems = [
    { label: "Destinations", href: "#destinations" },
    { label: "Departures", href: "#trips" },
    { label: "Gallery", href: "#gallery" },
    { label: "Stories", href: "#blog" },
    { label: "Reviews", href: "#reviews" },
    { label: "About", href: "#about" },
    { label: "Contact & FAQ", href: "#contact" }
  ];

  return (
    <header
      id="navbar-header"
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 transform ${
        scrolled ? "bg-[#07080a]/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl" : "bg-transparent py-5"
      } ${visible || isOpen ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo and Brand */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer text-left"
        >
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-base tracking-tighter group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/20 font-display">
            R
          </span>
          <div className="text-left">
            <span className="text-xl font-black tracking-tight text-white font-display block leading-none">
              RAASTA<span className="text-amber-400">.</span>
            </span>
            <span className="text-[8px] font-black tracking-widest text-amber-300/80 uppercase block mt-1 font-display">
              Trips & Expeditions
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        {!hideNavAnchors && (
          <nav className="hidden xl:flex items-center gap-7 text-xs font-bold uppercase tracking-widest font-display">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-zinc-300 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Trip Quiz Matchmaker Button */}
          <button
            onClick={onQuizClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full glass text-xs font-bold text-amber-300 hover:bg-white/10 transition-all cursor-pointer border border-amber-400/30 font-display"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Trip Quiz</span>
          </button>

          {/* Bookings Ledger Button */}
          <button
            onClick={onBookingsClick}
            className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full glass text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10 font-display"
            title="View My Bookings"
          >
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>My Trips</span>
            {bookingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center font-display">
                {bookingCount}
              </span>
            )}
          </button>

          {/* Direct Phone link */}
          <a
            href="tel:+917348929802"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full glass text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            title="Call +91 7348929802"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-xs text-zinc-200">7348929802</span>
          </a>

          {/* User Auth or Dashboard */}
          {!currentUser ? (
            <button
              onClick={onAuthClick}
              className="px-5 py-2 text-xs font-black uppercase tracking-widest bg-amber-400 text-black hover:bg-amber-300 rounded-full transition-colors cursor-pointer shadow-lg shadow-amber-500/20 font-display"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-full glass text-zinc-300 hover:text-white hover:bg-white/10 transition cursor-pointer border border-white/10"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              <button
                onClick={onDashboardClick}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer border border-white/10 font-display"
              >
                {currentUser.role === "admin" ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-current" />
                )}
                <span>{currentUser.role === "admin" ? "Admin" : "Dashboard"}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onBookingsClick}
            className="p-2 rounded-full glass text-zinc-300 border border-white/10"
            title="My Bookings"
          >
            <Ticket className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl glass text-white focus:outline-none border border-white/10"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-white/10 absolute top-full left-0 w-full overflow-hidden shadow-2xl bg-[#07080a]/98 backdrop-blur-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-3 text-sm font-medium text-white">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="py-2.5 text-left border-b border-white/5 text-zinc-300 hover:text-amber-300 font-bold text-xs uppercase tracking-widest flex items-center justify-between font-display"
                >
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="flex flex-col gap-3 pt-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onQuizClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl glass text-amber-300 font-bold text-xs uppercase tracking-widest border border-amber-400/30 font-display"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Route Discovery Quiz
                </button>

                <a
                  href="tel:+917348929802"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 text-white hover:bg-white/10 text-xs font-semibold border border-white/10"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Call Us: 7348929802</span>
                </a>

                {!currentUser ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onAuthClick();
                    }}
                    className="w-full py-3.5 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 font-display"
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
                      className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold text-xs uppercase tracking-wider font-display"
                    >
                      {currentUser.role === "admin" ? "Admin Panel" : "My Dashboard"}
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onLogout();
                      }}
                      className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-semibold text-xs uppercase tracking-wider font-display"
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
