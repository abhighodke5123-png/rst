/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Destinations from "./components/Destinations";
import UpcomingTrips from "./components/UpcomingTrips";
import CommunityReferral from "./components/CommunityReferral";
import AboutSection from "./components/AboutSection";
import TripQuiz from "./components/TripQuiz";
import AboutContact from "./components/AboutContact";
import MyBookingsLedger from "./components/MyBookingsLedger";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import TermsRegulationsModal from "./components/TermsRegulationsModal";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";
import { Trip, Booking } from "./types";
import NotificationInbox from "./components/NotificationInbox";
import { TRIPS } from "./data";
import { SlidersHorizontal, Compass, HelpCircle, MessageSquareWarning, X, ShieldCheck } from "lucide-react";
import WhyChooseUs from "./components/WhyChooseUs";
import SocialFeed from "./components/SocialFeed";
import BlogHub from "./components/BlogHub";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function App() {
  // Master Active App View State
  const [view, setView] = useState<"home" | "login" | "signup" | "dashboard" | "admin">("home");

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);

  // Master Scheduled departures list state - synced from server API
  const [tripsList, setTripsList] = useState<Trip[]>(TRIPS);

  // Authenticated user's real bookings
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Active overlays controls
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);
  const [initialFilterDestinationId, setInitialFilterDestinationId] = useState<string | undefined>(undefined);
  const [quizOpen, setQuizOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsTab, setTermsTab] = useState<"terms" | "refunds" | "agreement">("terms");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [cookieConsent, setCookieConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("raastacookieconsent");
    if (!consent) setCookieConsent(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("raastacookieconsent", "true");
    setCookieConsent(true);
  };

  // 1. Synchronize user details from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user doc from Firestore to get role
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let role = "user";
          if (userDoc.exists()) {
            role = userDoc.data().role;
          } else {
            // Check if admin email
            role = (user.email?.includes("admin") || user.email?.includes("derek@raasta.com") || user.email?.includes("abhighodke5123@gmail.com")) ? "admin" : "user";
            // Create user document if it doesn't exist
            await setDoc(doc(db, "users", user.uid), {
              id: user.uid,
              name: user.displayName || "User",
              email: user.email,
              role
            });
          }
          setCurrentUser({
            id: user.uid,
            name: user.displayName || "User",
            email: user.email || "",
            role
          });
        } catch (error) {
          console.error("Error fetching user role", error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch live tours & user bookings (if authenticated) on load
  const syncServerLogData = async () => {
    try {
      // Automate Firestore alignment: ensure Goa & Gokarna trips exist with correct prices
      const goaTrip: Trip = {
        id: "trip-goa-1",
        destinationId: "goa",
        destinationName: "Goa Beach & Party Escape",
        dates: "12 – 15 July 2025",
        price: 8999,
        originalPrice: 10999,
        seatsTotal: 15,
        seatsAvailable: 4,
        description: "An intimate Monsoon escape covering old Goa's historic forts, secret South Goa beaches, and rain-washed coastal views.",
        status: "Selling Fast"
      };

      const gokarnaTrip: Trip = {
        id: "trip-gokarna-1",
        destinationId: "gokarna",
        destinationName: "Gokarna Beach Trek Combo",
        dates: "19 – 21 July 2025",
        price: 7999,
        originalPrice: 9999,
        seatsTotal: 15,
        seatsAvailable: 8,
        description: "Trek pristine beaches, explore the mystical monoliths of Yana Caves, and capture the green ruins of Mirjan Fort.",
        status: "Almost Full"
      };

      // Set correct documents
      await setDoc(doc(db, "trips", "trip-goa-1"), goaTrip);
      await setDoc(doc(db, "trips", "trip-gokarna-1"), gokarnaTrip);

      // Fetch dynamic live departures list
      const tripsSnap = await getDocs(collection(db, "trips"));
      
      // Clean up other old trips if they exist in Firestore
      for (const tripDoc of tripsSnap.docs) {
        if (tripDoc.id !== "trip-goa-1" && tripDoc.id !== "trip-gokarna-1") {
          await deleteDoc(doc(db, "trips", tripDoc.id));
        }
      }

      // Re-fetch clean list
      const freshTripsSnap = await getDocs(collection(db, "trips"));
      const tripsData = freshTripsSnap.docs.map(doc => doc.data() as Trip);
      if (freshTripsSnap.size > 0) {
        setTripsList(tripsData);
      } else {
        setTripsList([goaTrip, gokarnaTrip]);
      }

      // Fetch bookings list (depending on login status)
      if (currentUser) {
        const q = query(collection(db, "bookings"), where("email", "==", currentUser.email));
        const bookingsSnap = await getDocs(q);
        const bookingsData = bookingsSnap.docs.map(doc => doc.data() as Booking);
        setBookings(bookingsData);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to synchronize with Firebase:", err);
    }
  };

  // Synchronize unread notifications real-time count
  const syncUnreadNotificationsCount = async () => {
    if (!currentUser) {
      setNotificationCount(0);
      return;
    }
    try {
      const q = query(collection(db, "notifications"), where("recipientEmail", "==", currentUser.email));
      const notifsSnap = await getDocs(q);
      const data = notifsSnap.docs.map(doc => doc.data());
      const unreadList = (data || []).filter((n: any) => !n.read);
      setNotificationCount(unreadList.length);
    } catch (err) {
      console.error("Failed to fetch notification states count", err);
    }
  };

  useEffect(() => {
    syncServerLogData();
    syncUnreadNotificationsCount();
  }, [currentUser, view]);

  useEffect(() => {
    if (!currentUser) return;
    const handle = setInterval(() => {
      syncUnreadNotificationsCount();
    }, 6000);
    return () => clearInterval(handle);
  }, [currentUser]);

  // Handle open booking triggers
  const handleOpenBookingForm = (trip: Trip) => {
    // If user is not logged in, we still allow booking by prompting them inputs
    setSelectedTripForBooking(trip);
  };

  // Close reservation form modal
  const handleCloseBookingForm = () => {
    setSelectedTripForBooking(null);
  };

  // Handle successful reservation creation from BookingForm
  const handleBookingSuccess = (newBooking: Booking) => {
    setSelectedTripForBooking(null);
    
    // Refresh client data logs from backend server
    syncServerLogData();

    // Direct user gracefully to dashboard
    if (currentUser) {
      setView("dashboard");
    } else {
      // Save booking in local cache temporarily so guest can view it in his slide-out panel
      const updatedGuestBookings = [newBooking, ...bookings];
      setBookings(updatedGuestBookings);
      setBookingsOpen(true);
    }
  };

  // Cancel guest bookings (local client operations fallback)
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Do you want to cancel this seat reservation?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      syncServerLogData();
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.error(err);
      alert("Cancellation request rejected.");
    }
  };

  // Select destination for scheduled departures filters
  const handleSelectDestinationForDepartures = (destId: string) => {
    setInitialFilterDestinationId(destId);
    setView("home");

    // Scroll downstream directly to departures
    setTimeout(() => {
      const departuresSection = document.getElementById("trips");
      if (departuresSection) {
        departuresSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Clear departures initial category filter
  const handleClearInitialFilter = () => {
    setInitialFilterDestinationId(undefined);
  };

  // Handle login successful redirection
  const handleLoginSuccess = (userPayload: { id: string; name: string; email: string; role: string }) => {
    setCurrentUser(userPayload);
    if (userPayload.role === "admin") {
      setView("admin");
    } else {
      setView("dashboard");
    }
  };

  // Handle Logout Session
  const handleLogout = () => {
    setCurrentUser(null);
    setView("home");
  };

  // Conditional Rendering based on active view state
  if (view === "login") {
    return (
      <Login
        onBack={() => setView("home")}
        onSuccess={handleLoginSuccess}
        onNavigateToSignup={() => setView("signup")}
      />
    );
  }

  if (view === "signup") {
    return (
      <Signup
        onBack={() => setView("home")}
        onSuccess={handleLoginSuccess}
        onNavigateToLogin={() => setView("login")}
      />
    );
  }

  if (view === "dashboard" && currentUser) {
    return (
      <>
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
          onNavigateToHome={() => setView("home")}
          onReserveMore={() => {
            setView("home");
            setTimeout(() => {
              document.getElementById("trips")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          notificationCount={notificationCount}
        />
        <NotificationInbox
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          currentUser={currentUser}
        />
      </>
    );
  }

  if (view === "admin" && currentUser && currentUser.role === "admin") {
    return (
      <>
        <Admin
          user={currentUser}
          onLogout={handleLogout}
          onNavigateToHome={() => setView("home")}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          notificationCount={notificationCount}
        />
        <NotificationInbox
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          currentUser={currentUser}
        />
      </>
    );
  }

  // Fallback if trying to load auth pages when logged out, revert state
  return (
    <div className="bg-white text-black antialiased selection:bg-black selection:text-white min-h-screen flex flex-col justify-between font-sans relative overflow-x-hidden">
      
      {/* 1. Dynamic User Sesssions Navbar */}
      <Navbar
        onQuizClick={() => setQuizOpen(true)}
        onBookingsClick={() => setBookingsOpen(true)}
        bookingCount={bookings.length}
        currentUser={currentUser}
        onAuthClick={() => setView("login")}
        onDashboardClick={() => {
          if (currentUser?.role === "admin") {
            setView("admin");
          } else {
            setView("dashboard");
          }
        }}
        onLogout={handleLogout}
        onLogoClick={() => setView("home")}
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        notificationCount={notificationCount}
      />

      {/* 2. Hero cinematic section */}
      <Hero
        onExploreClick={() => {
          const target = document.getElementById("trips");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }}
        onPackagesClick={() => {
          const target = document.getElementById("destinations");
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div id="destinations"></div>

      {/* 3. Destinations loop explore section */}
      <Destinations onSelectDestinationForDepartures={handleSelectDestinationForDepartures} />

      {/* Why Choose Us */}
      <WhyChooseUs />

      <div id="trips"></div>

      {/* 5. Live departures listing and booking portal */}
      <UpcomingTrips
        tripsList={tripsList}
        onBookTrip={handleOpenBookingForm}
        selectedTripForBooking={selectedTripForBooking}
        onCloseBookingForm={handleCloseBookingForm}
        onBookingSuccess={handleBookingSuccess}
        initialFilterDestinationId={initialFilterDestinationId}
        onClearInitialFilter={handleClearInitialFilter}
      />

      {/* Social Feed */}
      <div id="gallery"></div>
      <SocialFeed />

      {/* Blog Hub */}
      <div id="blog"></div>
      <BlogHub />

      {/* About Us Section */}
      <div id="about"></div>
      <AboutSection />

      {/* Community & Referral Banner */}
      <CommunityReferral />

      {/* 8. FAQs & contact inquiry bento */}
      <AboutContact />

      {/* FOOTER */}
      <footer className="bg-[#040404] border-t border-white/10 pt-20 pb-10 px-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-8 text-sm text-zinc-400 font-light mb-16 relative z-10">
          <div className="max-w-sm">
            <span className="text-2xl font-bold tracking-tight text-white mb-6 block">RAASTA.</span>
            <p className="text-zinc-500 mb-6 leading-relaxed">
              Curating authentic road trips and unscripted travel experiences across India. We believe in the journey as much as the destination.
            </p>
            <div className="text-zinc-500 text-xs space-y-2">
              <p>Registered Entity: RAASTA Travel & Experiences Pvt. Ltd.</p>
              <p>GSTIN: 27AABCU9603R1ZM</p>
              <p>Address: 4th Floor, Nomad Hub, Koramangala, Bengaluru 560034</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-16 lg:gap-24">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Company</h4>
              <a href="#about" className="text-zinc-400 hover:text-white transition-colors">About Us</a>
              <a href="#trips" className="text-zinc-400 hover:text-white transition-colors">Upcoming Trips</a>
              <a href="#careers" className="text-zinc-400 hover:text-white transition-colors">Careers</a>
              <a href="#contact" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Legal & Compliance</h4>
              <button onClick={() => setPrivacyOpen(true)} className="text-zinc-400 hover:text-white transition-colors text-left cursor-pointer">Privacy Policy (DPDP Act)</button>
              <button onClick={() => { setTermsTab("terms"); setTermsOpen(true); }} className="text-zinc-400 hover:text-white transition-colors text-left cursor-pointer">Terms & Conditions</button>
              <button onClick={() => { setTermsTab("refunds"); setTermsOpen(true); }} className="text-zinc-400 hover:text-white transition-colors text-left cursor-pointer">Cancellation & Refund Policy</button>
              <button onClick={() => { setTermsTab("agreement"); setTermsOpen(true); }} className="text-zinc-400 hover:text-white transition-colors text-left cursor-pointer">User Agreement</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <p className="text-zinc-500 text-xs">© {new Date().getFullYear()} RAASTA Travels. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-brand-emerald text-xs uppercase font-bold tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Secure SSL Checkout
            </span>
            <div className="w-px h-4 bg-white/10"></div>
            <a href="https://www.instagram.com/raasta.trips?igsh=Y2JlMXJ4ZzdkOGc5" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-brand-orange transition-colors group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/919322309802?text=Hi%20RAASTA,%20I'm%20looking%20for%20a%20curated%20road%20trip!"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <span className="absolute right-full mr-3 whitespace-nowrap bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Connect with Expert
        </span>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      </a>

      {/* Cookie Consent Banner */}
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:w-96 bg-zinc-900 text-white p-5 rounded-t-2xl md:rounded-2xl shadow-2xl z-50 border border-zinc-800">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-sm">We use cookies 🍪</h4>
            <button onClick={() => setCookieConsent(true)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            We use cookies to improve your experience, analyze site traffic, and serve tailored ads. By continuing, you agree to our Privacy Policy.
          </p>
          <div className="flex gap-3">
            <button onClick={acceptCookies} className="flex-1 bg-yellow-500 text-black py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 transition cursor-pointer">
              Accept
            </button>
            <button onClick={() => setCookieConsent(true)} className="flex-1 bg-zinc-800 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-700 transition cursor-pointer">
              Decline
            </button>
          </div>
        </div>
      )}

      {/* FLOATING DIALOGS & OVERLAYS INTERACTIVE CONTROLLERS */}

      {/* Find Your ideal Route interactive Quiz */}
      <TripQuiz
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        onSelectMatchingDestination={handleSelectDestinationForDepartures}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      {/* Terms & Regulations Modal */}
      <TermsRegulationsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        initialTab={termsTab}
      />

      {/* Customer Bookings secure ledger panel */}
      <MyBookingsLedger
        isOpen={bookingsOpen}
        onClose={() => setBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
      />

      {/* Real-time Concierge simulated email inbox overlay */}
      <NotificationInbox
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
