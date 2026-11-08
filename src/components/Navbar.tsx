import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles, Compass, User, LogOut, ShieldAlert, PhoneCall, MessageCircle, Ticket, Bell, Send } from "lucide-react";
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
  onEnquireClick: () => void;
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
  onEnquireClick,
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
    { label: "Home", href: "#hero" },
    { label: "Explore Trips", href: "#trips" },
    { label: "Collections", href: "#collections" },
    { label: "Destinations", href: "#destinations" },
    { label: "Stories", href: "#reviews" },
    { label: "Meet The Team", href: "#team" },
    { label: "About Us", href: "#about" },
    { label: "Contact & FAQ", href: "#contact" }
  ];

  return (
    <header
      id="navbar-header"
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 transform ${
        scrolled
          ? "bg-[#182622]/95 backdrop-blur-xl border-b border-[#8C9A82]/20 py-3.5 shadow-2xl"
          : "bg-transparent py-5"
      } ${visible || isOpen ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Raasta Logo & Tagline */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#D4A96C] text-[#182622] flex items-center justify-center font-black text-lg tracking-tight group-hover:scale-105 transition-transform shadow-lg shadow-[#D4A96C]/20 font-serif font-bold">
            R
          </div>
          <div className="text-left">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#EDE9DF] block leading-none">
              RAASTA TRIPS<span className="text-[#D4A96C]">.</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#D4A96C] uppercase block mt-1">
              Find Your Way. Make Your Story.
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        {!hideNavAnchors && (
          <nav className="hidden xl:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-[#EDE9DF]/80 hover:text-[#D4A96C] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Action Buttons & Enquire Now */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Direct Phone / WhatsApp quick connect */}
          <a
            href="https://wa.me/919226638440"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#202522] text-xs font-mono text-[#EDE9DF]/80 hover:text-[#D4A96C] hover:bg-[#202522]/80 transition-colors cursor-pointer border border-[#8C9A82]/25"
            title="Chat on WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs">9226638440</span>
          </a>

          {/* Prominent Enquire Now Button */}
          <button
            onClick={onEnquireClick}
            className="px-5 py-2.5 rounded-full bg-[#D4A96C] text-[#182622] hover:bg-[#d8b37c] font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#D4A96C]/20 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enquire Now</span>
          </button>

          {/* User Auth or Dashboard */}
          {!currentUser ? (
            <button
              onClick={onAuthClick}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#202522] text-[#EDE9DF] hover:bg-[#202522]/80 rounded-full transition-colors cursor-pointer border border-[#8C9A82]/30"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-full bg-[#202522] text-[#EDE9DF]/80 hover:text-white hover:bg-[#202522]/80 transition cursor-pointer border border-[#8C9A82]/20"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D4A96C] text-[#182622] text-[9px] font-black flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              <button
                onClick={onDashboardClick}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full bg-[#202522] text-[#EDE9DF] hover:bg-[#202522]/80 transition-colors cursor-pointer border border-[#8C9A82]/30"
              >
                {currentUser.role === "admin" ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-[#D4A96C]" />
                ) : (
                  <User className="w-3.5 h-3.5 text-current" />
                )}
                <span>{currentUser.role === "admin" ? "Admin Portal" : "My Dashboard"}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-full text-[#EDE9DF]/60 hover:text-white hover:bg-[#202522]/80 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle & quick enquire */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onEnquireClick}
            className="px-3.5 py-1.5 rounded-full bg-[#D4A96C] text-[#182622] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            Enquire
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-[#202522] text-[#EDE9DF] focus:outline-none border border-[#8C9A82]/25"
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
            className="md:hidden border-t border-[#8C9A82]/20 absolute top-full left-0 w-full overflow-hidden shadow-2xl bg-[#182622]/98 backdrop-blur-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-3 text-sm font-medium text-[#EDE9DF]">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="py-2.5 text-left border-b border-[#8C9A82]/15 text-[#EDE9DF]/80 hover:text-[#D4A96C] font-semibold text-xs uppercase tracking-wider flex items-center justify-between"
                >
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onEnquireClick();
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#D4A96C] text-[#182622] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enquire for a Trip</span>
                </button>

                <a
                  href="https://wa.me/919226638440"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#202522] text-[#EDE9DF] hover:bg-[#202522]/80 text-xs font-semibold border border-[#8C9A82]/25"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: +91 9226638440</span>
                </a>

                {!currentUser ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onAuthClick();
                    }}
                    className="w-full py-3 rounded-xl bg-[#202522] text-[#EDE9DF] font-semibold text-xs uppercase tracking-wider border border-[#8C9A82]/30"
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
                      className="w-full py-3 rounded-xl bg-[#202522] text-[#EDE9DF] font-semibold text-xs uppercase tracking-wider"
                    >
                      {currentUser.role === "admin" ? "Admin Panel" : "My Dashboard"}
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onLogout();
                      }}
                      className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 font-semibold text-xs uppercase tracking-wider"
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