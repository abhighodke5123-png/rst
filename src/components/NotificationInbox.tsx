/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Mail, X, Check, Eye, Trash, ShieldAlert, Sparkles, Inbox, MessageSquare, AlertTriangle, Calendar, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Notification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  timestamp: string;
  type: "welcome" | "booking" | "cancellation" | "new-trip" | "otp";
  read: boolean;
}

interface NotificationInboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string; email: string; role: string } | null;
}

import { collection, query, where, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function NotificationInbox({ isOpen, onClose, currentUser }: NotificationInboxProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(collection(db, "notifications"), where("recipientEmail", "==", currentUser.email));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => doc.data() as Notification);
      // Sort by timestamp desc
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load simulated outbox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchLogs();
    }
  }, [isOpen, currentUser]);

  const markAllRead = async () => {
    if (!currentUser) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach((n) => {
        if (!n.read) {
          const ref = doc(db, "notifications", n.id);
          batch.update(ref, { read: true });
        }
      });
      await batch.commit();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop screen grey glass */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/75 backdrop-blur-xs"
            onClick={onClose}
          ></motion.div>

          {/* Sldie over right side container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="absolute top-0 right-0 h-full w-full max-w-lg bg-zinc-50 border-l border-zinc-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header section */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-100/10">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-yellow-500">
                  <Mail className="w-5 h-5 animate-pulse" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-650 text-[9px] font-black text-black px-1">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-black tracking-tight">Concierge Mail Inbox</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 tracking-wide uppercase font-bold">
                    {currentUser?.role === "admin" ? "System Notification Broadcasts Audit" : "Simulated email notifications inbox"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="px-3 py-1.5 text-[9px] font-black text-zinc-600 hover:text-black border border-zinc-200 rounded-lg hover:bg-zinc-100 uppercase tracking-widest transition cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Client inbox listing */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60 custom-scrollbar p-1">
              {!currentUser ? (
                <div className="p-12 text-center text-zinc-650 flex flex-col items-center justify-center space-y-4">
                  <Inbox className="w-12 h-12 text-zinc-800" />
                  <p className="text-xs font-semibold leading-relaxed">Sign in to your Seeker account to capture live transacted notification logs.</p>
                </div>
              ) : loading && notifications.length === 0 ? (
                <div className="p-12 text-center text-zinc-650 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider animate-pulse">
                  <RefreshCw className="w-4 h-4 text-zinc-550 animate-spin" />
                  <span>Linking RAASTA Sockets...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center text-zinc-650 flex flex-col items-center justify-center space-y-4">
                  <div className="p-3 bg-zinc-100/40 rounded-full">
                    <Inbox className="w-8 h-8 text-zinc-700" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-600 block uppercase tracking-wider">Your Mailbox is Empty</span>
                    <span className="text-[11px] text-zinc-500 leading-normal block max-w-xs">
                      Simulated registration, booking confirmation, cancellation receipts, and trip news broadcasts appear automatically in this sandbox outbox!
                    </span>
                  </div>
                </div>
              ) : (
                notifications.map((notif) => {
                  const isSelected = selectedNotif?.id === notif.id;
                  return (
                    <div
                      key={notif.id}
                      className={`p-5 transition hover:bg-zinc-100/40 relative cursor-pointer ${
                        !notif.read ? "bg-zinc-100/15" : ""
                      } ${isSelected ? "bg-zinc-100/60" : ""}`}
                      onClick={() => setSelectedNotif(isSelected ? null : notif)}
                    >
                      {/* Notification unread marker bar indicator */}
                      {!notif.read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                      )}

                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                              Concierge System Email
                            </span>
                            {notif.type === "welcome" && (
                              <span className="text-[8px] font-black uppercase tracking-wider bg-[#1c3fdc]/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full">
                                Access Active
                              </span>
                            )}
                            {notif.type === "booking" && (
                              <span className="text-[8px] font-black uppercase tracking-wider bg-[#064e3b]/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                                Invoice Checked
                              </span>
                            )}
                            {notif.type === "cancellation" && (
                              <span className="text-[8px] font-black uppercase tracking-wider bg-red-950/20 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                                Refund Sent
                              </span>
                            )}
                            {notif.type === "new-trip" && (
                              <span className="text-[8px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">
                                Live Launch
                              </span>
                            )}
                            {notif.type === "otp" && (
                              <span className="text-[8px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-650 border border-purple-500/20 px-1.5 py-0.5 rounded-full">
                                Security Code
                              </span>
                            )}
                          </div>
                          <h4 className={`text-xs tracking-tight ${!notif.read ? "font-extrabold text-black" : "font-medium text-zinc-700"}`}>
                            {notif.subject}
                          </h4>
                          <p className="text-[10px] text-zinc-600 line-clamp-2 leading-relaxed">
                            {notif.bodyText}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-650 tracking-wider shrink-0 whitespace-nowrap mt-1">
                          {notif.timestamp}
                        </span>
                      </div>

                      {/* Expanded View with High-Fidelity preview box */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-zinc-200 relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-inner relative max-h-[440px] overflow-y-auto p-4 flex flex-col gap-4">
                              {/* Headers layout block */}
                              <div className="text-[10px] text-zinc-500 border-b border-zinc-200 pb-3 space-y-1 leading-normal font-medium">
                                <div><strong className="text-zinc-600 uppercase tracking-widest text-[9px]">Sender:</strong> RAASTA Automatic Concierge Relaying Hub &lt;raastatrips.in@gmail.com&gt;</div>
                                <div><strong className="text-zinc-600 uppercase tracking-widest text-[9px]">Recipient:</strong> {notif.recipientName} &lt;{notif.recipientEmail}&gt;</div>
                                <div><strong className="text-zinc-600 uppercase tracking-widest text-[9px]">Verification Status:</strong> Programmatically Signed (ECC Sandbox Cert #445)</div>
                              </div>

                              {/* Simulated email HTML output */}
                              <div
                                className="sandbox-email-wrapper select-text overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: notif.bodyHtml }}
                              ></div>
                            </div>

                            {/* Alert advising console outputs */}
                            <div className="mt-3 p-3 bg-zinc-100/30 border border-zinc-200 rounded-xl flex items-center gap-2.5">
                              <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
                              <span className="text-[10px] text-zinc-500 leading-normal font-medium max-w-sm">
                                System also printed a copy of this email to the node standard out. Verify inside terminal container logs!
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer status board */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-100/20 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              RAASTA SMTP Relay Engine • Version 2026.01
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
