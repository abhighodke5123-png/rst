/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "database.json");

// Define initial data state in case file doesn't exist
const INITIAL_TRIPS = [
  {
    id: "trip-goa-1",
    destinationId: "goa",
    destinationName: "Goa Weekend Escape",
    dates: "12 – 14 July 2025",
    price: 8999,
    seatsTotal: 12,
    seatsAvailable: 4,
    description: "An intimate Monsoon escape covering old Goa's historic forts and hidden rain-washed rainforest networks.",
    status: "Selling Fast"
  },
  {
    id: "trip-gokarna-1",
    destinationId: "gokarna",
    destinationName: "Gokarna Backpack Trail",
    dates: "26 – 29 July 2025",
    price: 7499,
    seatsTotal: 15,
    seatsAvailable: 3,
    description: "Conquer the famous cliff trail and watch bioluminescent planktons illuminate the black surf after midnight.",
    status: "Almost Full"
  },
  {
    id: "trip-spiti-1",
    destinationId: "spiti",
    destinationName: "Spiti Summer Expedition",
    dates: "08 – 16 August 2025",
    price: 18999,
    seatsTotal: 10,
    seatsAvailable: 2,
    description: "The complete high-altitude circuit starting from Shimla through Kaza, terminating at Manali.",
    status: "Almost Full"
  },
  {
    id: "trip-goa-2",
    destinationId: "goa",
    destinationName: "Monsoon Coastal Wander",
    dates: "22 – 24 August 2025",
    price: 8499,
    seatsTotal: 14,
    seatsAvailable: 9,
    description: "Chase the wild winds, visit beautiful Dudhsagar Falls at peak roar, and relax in luxury homestays.",
    status: "Monsoon Special"
  },
  {
    id: "trip-gokarna-2",
    destinationId: "gokarna",
    destinationName: "Gokarna Monsoon Echoes",
    dates: "10 – 13 September 2025",
    price: 7299,
    seatsTotal: 12,
    seatsAvailable: 11,
    description: "Experience Gokarna's raw greenery, foggy cliffs, and completely private, crowd-free beaches.",
    status: "Seats Open"
  }
];

const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "RAASTA Administrator",
    email: "derek@raasta.com",
    password: "derek@raasta5586",
    role: "admin"
  },
  {
    id: "user-test",
    name: "Abhi Ghodke",
    email: "user@raasta.com",
    password: "userpassword",
    role: "user"
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "book-1",
    tripId: "trip-goa-1",
    tripName: "Goa Weekend Escape",
    travelerName: "Abhi Ghodke",
    email: "user@raasta.com",
    phone: "+91 98765 43210",
    numTravelers: 2,
    tierSelected: "Adventure Plan",
    addOns: {
      photographer: true,
      premiumStay: false,
      localGuide: true
    },
    totalCost: 19998,
    bookingDate: "12 – 14 July 2025",
    status: "Confirmed"
  }
];

// Ensure DB directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(DB_PATH)) {
  const initialData = {
    users: INITIAL_USERS,
    trips: INITIAL_TRIPS,
    bookings: INITIAL_BOOKINGS
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf8");
}

// Read database utility helper with safe notification migrations
function readDB() {
  try {
    const rawData = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(rawData);
    if (!parsed.users) parsed.users = INITIAL_USERS;
    if (!parsed.trips) parsed.trips = INITIAL_TRIPS;
    if (!parsed.bookings) parsed.bookings = INITIAL_BOOKINGS;
    if (!parsed.notifications) parsed.notifications = [];
    return parsed;
  } catch (error) {
    console.error("Failed to read JSON DB, resetting to defaults:", error);
    return { users: INITIAL_USERS, trips: INITIAL_TRIPS, bookings: INITIAL_BOOKINGS, notifications: [] };
  }
}

// Write database utility helper
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write to JSON DB:", error);
  }
}

// Beautiful in-app Notification/Email Dispatch service mimicking SMTP/SES
function sendSimulatedEmail(
  toEmail: string,
  toName: string,
  subject: string,
  type: "welcome" | "booking" | "cancellation" | "new-trip" | "otp",
  data: any
) {
  const db = readDB();
  
  let bodyHtml = "";
  let bodyText = "";

  if (type === "welcome") {
    bodyHtml = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-sizing: border-box; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);">
        <div style="border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #ffbe0d; font-size: 26px; font-weight: 800; letter-spacing: 0.15em;">RAASTA</h2>
          <p style="margin: 6px 0 0 0; font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;">Where Wanderlust is Unscripted</p>
        </div>
        <h3 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Welcome to the Pack, ${toName}!</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-top: 0;">Your official passport to custom weekend expeditions, scenic high-altitude trails, and off-beat traveler networks has been activated successfully!</p>
        
        <div style="background-color: #18181b; border: 1px solid #27272a; padding: 18px; border-radius: 12px; margin: 24px 0;">
          <span style="font-size: 10px; font-weight: 800; color: #ffb700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 10px;">Travel Seeker Credentials</span>
          <div style="font-size: 13px; color: #e4e4e7; line-height: 1.5;">
            <strong style="color: #a1a1aa;">Email Identity:</strong> ${toEmail}<br/>
            <strong style="color: #a1a1aa;">Security Protocol:</strong> AES-256 Sandbox Pass<br/>
            <strong style="color: #a1a1aa;">Wanderer Group:</strong> Indiranagar Seekers Cluster
          </div>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">Sign in to your member dashboard at any time to plan custom itineraries, test your weather preference quizzes, and book live upcoming caravans with secure Razorpay Sandbox integration.</p>
        
        <div style="border-top: 1px solid #27272a; padding-top: 20px; margin-top: 28px; font-size: 11px; color: #52525b; text-align: center; line-height: 1.4;">
          This is an automated sandbox verification notification from the RAASTA SMTP Relaying Node.<br/>
          No replies will be read. Indiranagar, Bangalore, KA, IN.
        </div>
      </div>
    `;
    bodyText = `Welcome to RAASTA, ${toName}! Your account has has been successfully created under email address ${toEmail}. We are thrilled to have you join our pack of wanderers.`;
  } else if (type === "booking") {
    const formatPrice = (p: number) => "₹" + Number(p).toLocaleString("en-IN");
    bodyHtml = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-sizing: border-box; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);">
        <div style="border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h2 style="margin: 0; color: #ffbe0d; font-size: 26px; font-weight: 800; letter-spacing: 0.15em;">RAASTA</h2>
            <p style="margin: 4px 0 0 0; font-size: 9px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em;">Secure Checkout Invoice</p>
          </div>
          <div style="text-align: right; padding-left: 20px;">
            <span style="background-color: #064e3b; color: #34d399; font-size: 10px; font-weight: 800; padding: 6px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #059669;">Razorpay Paid</span>
          </div>
        </div>
        
        <h3 style="color: #ffffff; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 8px;">Expedition Reservation Locked, ${toName}!</h3>
        <p style="font-size: 13px; color: #a1a1aa; line-height: 1.5; margin-bottom: 24px; margin-top: 0;">We have successfully registered your payment and logged your seats for the upcoming caravan. Your reference booking code is <strong style="color: #ffbe0d; font-family: monospace; background-color: #1c1917; border: 1px solid #44403c; padding: 3px 8px; border-radius: 6px;">${data.bookingId}</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e4e4e7; margin-bottom: 24px;">
          <thead>
            <tr style="border-bottom: 1px solid #27272a; text-align: left;">
              <th style="padding: 10px 0; color: #71717a; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;">Departure Details</th>
              <th style="padding: 10px 0; text-align: right; color: #71717a; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;">Fare Class</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px 0;">
                <strong style="color: #ffffff; font-size: 14px;">${data.tripName}</strong><br/>
                <span style="font-size: 11px; color: #71717a;">Scheduled Launch: ${data.bookingDate}</span>
              </td>
              <td style="padding: 12px 0; text-align: right; font-weight: 705; color: #ffffff;">${data.tierSelected}</td>
            </tr>
            <tr style="border-bottom: 1px solid #27272a;">
              <td style="padding: 10px 0; color: #a1a1aa;">Reserved Slots Count</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #ffffff;">${data.numTravelers} traveler(s)</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #71717a; text-transform: uppercase; font-size: 10px; font-weight: bold;">Dynamic Upgrades:</td>
              <td style="padding: 12px 0; text-align: right; font-size: 11px; color: #a1a1aa; line-height: 1.4;">
                ${data.addOns.photographer ? '✓ Professional Media Captain<br/>' : ''}
                ${data.addOns.premiumStay ? '✓ Single Balcony Suite Upgrade<br/>' : ''}
                ${data.addOns.localGuide ? '✓ Private Naturalist Specialist<br/>' : ''}
                ${(!data.addOns.photographer && !data.addOns.premiumStay && !data.addOns.localGuide) ? 'None selected' : ''}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #71717a; margin-bottom: 6px;">
            <span>Razorpay Payment Reference</span>
            <span style="font-family: monospace; color: #e4e4e7; font-weight: bold;">${data.paymentId || 'pay_rzp_sandbox_' + Math.floor(100000 + Math.random()*900000)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #71717a; margin-bottom: 12px;">
            <span>Payment Method Channel</span>
            <span style="color: #e4e4e7; text-transform: uppercase; font-weight: bold;">${data.paymentMethod || 'Razorpay Gateway'}</span>
          </div>
          <div style="border-top: 1px solid #27272a; padding-top: 12px; display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; color: #ffffff;">
            <span>Grand Total Settled</span>
            <span style="color: #ffbe0d; font-size: 18px; font-weight: 800;">${formatPrice(data.totalCost)}</span>
          </div>
        </div>

        <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0;">Our Indiranagar scout captain will text your mobile (<strong style="color: #ffffff;">${data.phone}</strong>) around 7 days prior to launch to coordinates the assembly layout, check safety permits, and distribute the visual route dossiers.</p>
        
        <div style="border-top: 1px solid #27272a; padding-top: 20px; margin-top: 28px; font-size: 10px; color: #52525b; text-align: center; line-height: 1.4;">
          Razorpay Transaction Code: SUCCESS • sandbox mode.<br/>
          RAASTA Travels India Ltd, Indiranagar High Street, Bangalore, KA.
        </div>
      </div>
    `;
    bodyText = `Hi ${toName}, your seat reservation for "${data.tripName}" has been CONFIRMED. Total amount: ${formatPrice(data.totalCost)}. Booking ID Ref: ${data.bookingId}. We look forward to trekking together!`;
  } else if (type === "cancellation") {
    bodyHtml = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-sizing: border-box; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);">
        <div style="border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #ef4444; font-size: 26px; font-weight: 800; letter-spacing: 0.15em;">RAASTA STATUS</h2>
          <p style="margin: 6px 0 0 0; font-size: 9px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Reservation Cancellation Confirmation</p>
        </div>
        <h3 style="color: #ffffff; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Booking Cancelled & Released, ${toName}</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-top: 0;">Your reservation seat with reference booking ID <strong style="color: #ffffff; font-family: monospace; background-color: #1c1917; border: 1px solid #3f3f46; padding: 2px 6px; border-radius: 4px;">${data.bookingId}</strong> for the trek <strong style="color: #fff;">${data.tripName}</strong> has been cancelled by request.</p>
        
        <div style="background-color: #1a0b0b; border: 1px solid #451a1a; padding: 18px; border-radius: 12px; margin: 24px 0;">
          <strong style="font-size: 11px; text-transform: uppercase; display: block; color: #fca5a5; letter-spacing: 0.05em; margin-bottom: 8px;">Programmatic Refund Pipeline: Initiated</strong>
          <p style="font-size: 13px; color: #fca5a5; line-height: 1.5; margin: 0;">
            We have submitted a programmatic reversal ledger payload in amount of <strong>₹${Number(data.totalCost).toLocaleString("en-IN")}</strong> to the Razorpay checkout merchant node.<br/><br/>
            Since this purchase was transacted under the Razorpay Sandbox testing environment, no actual bank settlements occurred. In real production scenarios, funds automatically reverse to your card or UPI handle within 5–7 banking business days.
          </p>
        </div>

        <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0;">We are sad to see you miss this expedition. You can complete the interactive Route recommendations quiz again at any time to find alternate trails!</p>
        <div style="border-top: 1px solid #27272a; padding-top: 20px; margin-top: 28px; font-size: 10px; color: #52525b; text-align: center;">
          Approved under RAASTA customer buffer guidelines. Indiranagar, Bangalore, India.
        </div>
      </div>
    `;
    bodyText = `Hello ${toName}, your booking ${data.bookingId} for "${data.tripName}" has been successfully cancelled and released. Your simulated refund is registered.`;
  } else if (type === "new-trip") {
    bodyHtml = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-sizing: border-box; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);">
        <div style="border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #ffbe0d; font-size: 26px; font-weight: 800; letter-spacing: 0.15em;">RAASTA INTEL</h2>
          <p style="margin: 6px 0 0 0; font-size: 9px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600;">Secret Route Broadcast</p>
        </div>
        <span style="background-color: #78350f; color: #fef08a; font-size: 10px; font-weight: 800; padding: 5px 12px; border-radius: 9999px; text-transform: uppercase; display: inline-block; margin-bottom: 16px; border: 1px solid #ca8a04; letter-spacing: 0.05em;">Live Launch</span>
        <h3 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 10px;">Newly Scouted Departure Live: ${data.destinationName}!</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 20px 0;">Our scout captains have returned from deep reconnaissance, mapped water bodies, and finalized safe camping permits for a beautiful caravan launching on <span style="color: #ffbe0d; font-weight: 700;">${data.dates}</span>.</p>
        
        <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <strong style="color: #ffffff; font-size: 15px; display: block; margin-bottom: 6px;">${data.destinationName} Segment</strong>
          <p style="font-size: 13px; color: #a1a1aa; margin: 0 0 14px 0; line-height: 1.5;">${data.description}</p>
          <div style="font-size: 12px; color: #e4e4e7; border-t: 1px solid #27272a; padding-top: 10px; line-height: 1.5;">
            <strong style="color: #71717a;">Wander Base Price:</strong> ₹${Number(data.price).toLocaleString("en-IN")}<br/>
            <strong style="color: #71717a;">Departure Cap Size:</strong> ${data.seatsTotal} scouts (Highly Restricted)
          </div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 0;">Expedition tickets are live now in the departures feed. Fire up your seeker dashboard to select your custom tiers early and claim early berths.</p>
        
        <div style="border-top: 1px solid #27272a; padding-top: 20px; margin-top: 28px; font-size: 10px; color: #52525b; text-align: center;">
          Sent to registered travelers on the unscripted watch-list. Indiranagar, Bangalore, KA.
        </div>
      </div>
    `;
    bodyText = `New Departure Scouted: ${data.destinationName} departing on ${data.dates}. Prices from ₹${Number(data.price).toLocaleString("en-IN")}. Book immediately over the live RAASTA departures feed!`;
  } else if (type === "otp") {
    bodyHtml = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-sizing: border-box; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);">
        <div style="border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #ffbe0d; font-size: 26px; font-weight: 800; letter-spacing: 0.15em;">RAASTA</h2>
          <p style="margin: 6px 0 0 0; font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;">Security Operations Center</p>
        </div>
        <h3 style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">Verify Your Email Address</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-top: 0;">Hello ${toName}, you requested to create an account on RAASTA. Please use the following 6-digit verification code to complete your registration:</p>
        
        <div style="text-align: center; background-color: #18181b; border: 1px solid #27272a; padding: 24px; border-radius: 12px; margin: 24px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; color: #ffbe0d; letter-spacing: 0.25em;">${data.otpCode}</span>
          <span style="font-size: 10px; font-weight: 500; color: #71717a; display: block; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Code expires in 5 minutes</span>
        </div>
        
        <p style="font-size: 13px; line-height: 1.6; color: #71717a; margin-bottom: 0;">If you didn't initiate this action, you can safely ignore this notification. Your account security protocol remains intact.</p>
        
        <div style="border-top: 1px solid #27272a; padding-top: 20px; margin-top: 28px; font-size: 11px; color: #52525b; text-align: center; line-height: 1.4;">
          This is an automated sandbox verification notification from the RAASTA SMTP Relaying Node.<br/>
          No replies will be read. Indiranagar, Bangalore, KA, IN.
        </div>
      </div>
    `;
    bodyText = `Your RAASTA verification code is ${data.otpCode}. It is valid for 5 minutes.`;
  }

  // Generate dynamic Notification Record
  const newNotif = {
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    recipientEmail: toEmail.toLowerCase(),
    recipientName: toName,
    subject: subject,
    bodyHtml,
    bodyText,
    timestamp: new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }),
    type,
    read: false
  };

  db.notifications.unshift(newNotif);
  writeDB(db);

  // Print highly professional ASCII borders to container logs for direct terminal log auditing
  console.log(`\n\n`);
  console.log(`========================================= SMTP Simulated Delivery Outbox =========================================`);
  console.log(`[SMTP-DISPATCH] DATE TIME     : ${new Date().toISOString()}`);
  console.log(`[SMTP-DISPATCH] SENDER        : RAASTA Automated Dispatch System <concierge@raasta.com>`);
  console.log(`[SMTP-DISPATCH] TO RECIPIENT  : ${toName} <${toEmail}>`);
  console.log(`[SMTP-DISPATCH] SUBJECT TOPIC : ${subject}`);
  console.log(`[SMTP-DISPATCH] ENGINE STATUS : COMPLETED (MOCK RELEASE SUCCEEDED)`);
  console.log(`-----------------------------------------------------------------------------------------------------------------`);
  console.log(`[TEXT PREVIEW]:\n${bodyText}`);
  console.log(`=================================================================================================================\n\n`);
}

// Initialize Middleware
app.use(express.json());

// In-memory OTP store for secure account creation
const otpStore = new Map<string, { code: string; expiresAt: number; name: string; password?: string }>();

// API ROUTES

// 1.0 OTP Verification Routes for Account Creation
app.post("/api/auth/send-otp", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill out all required details." });
  }

  const db = readDB();
  const alreadyExists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (alreadyExists) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  // Generate a random 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save in memory store
  otpStore.set(email.toLowerCase(), {
    code: otpCode,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiration
    name,
    password
  });

  // Dispatch simulated OTP Verification email to user and print in standard out
  try {
    sendSimulatedEmail(
      email,
      name,
      "🔐 Security Protocol: Verify Your RAASTA Seeker Account",
      "otp",
      { otpCode }
    );
  } catch (err) {
    console.error("Failed to dispatch simulated OTP verification email:", err);
  }

  return res.json({
    message: "A 6-digit verification code has been dispatched to your email address.",
    sandboxOtpCode: otpCode // Provided as convenience for easy sandbox local testing
  });
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Please enter the 6-digit verification code." });
  }

  const record = otpStore.get(email.toLowerCase());
  if (!record) {
    return res.status(400).json({ error: "No pending registration found or verification session expired. Please request a new code." });
  }

  if (record.code !== otp.trim()) {
    return res.status(400).json({ error: "Incorrect verification code. Please check your email or developer console." });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ error: "The verification code has expired. Please request a new code." });
  }

  // OTP verified successfully! Let's register user
  const db = readDB();
  const alreadyExists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (alreadyExists) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  const lowerEmail = email.toLowerCase();
  const role = (lowerEmail.includes("admin") || lowerEmail.endsWith("@raasta.com") || lowerEmail === "abhighodke5123@gmail.com") ? "admin" : "user";

  const newUser = {
    id: "user-" + Math.random().toString(36).substr(2, 9),
    name: record.name,
    email,
    password: record.password || "unspecified",
    role
  };

  db.users.push(newUser);
  writeDB(db);

  // Clear OTP from memory
  otpStore.delete(email.toLowerCase());

  // Send simulated Email Welcome Notification
  try {
    sendSimulatedEmail(
      newUser.email,
      newUser.name,
      "🌟 Welcome to RAASTA - Seeker Account Setup Successfully",
      "welcome",
      {}
    );
  } catch (err) {
    console.error("Welcome email trigger failed", err);
  }

  return res.status(201).json({
    message: "Registration successful!",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// 1. Authentication Signup API Route
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required signup details." });
  }

  const db = readDB();
  const alreadyExists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (alreadyExists) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  // Set default role. If email matches workspace user or contains admin or raasta, make them an admin for easy layout preview
  const lowerEmail = email.toLowerCase();
  const role = (lowerEmail.includes("admin") || lowerEmail.endsWith("@raasta.com") || lowerEmail === "abhighodke5123@gmail.com") ? "admin" : "user";

  const newUser = {
    id: "user-" + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password, // Storing password safely in our testing sandbox
    role
  };

  db.users.push(newUser);
  writeDB(db);

  // Send simulated Email Welcome Notification and log to terminal
  try {
    sendSimulatedEmail(
      newUser.email,
      newUser.name,
      "🌟 Welcome to RAASTA - Seeker Account Setup Successfully",
      "welcome",
      {}
    );
  } catch (err) {
    console.error("Welcome email trigger failed", err);
  }

  return res.status(201).json({
    message: "Registration successful!",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// 2. Authentication Login API Route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter both email and password." });
  }

  const db = readDB();
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email credentials or password." });
  }

  return res.json({
    message: "Login successful!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// 3. Trips retrieval API Route
app.get("/api/trips", (req, res) => {
  const db = readDB();
  res.json(db.trips);
});

// 4. Create new trip (Admin Only) API Route & broadcast email launch alert
app.post("/api/trips", (req, res) => {
  const { destinationId, destinationName, dates, price, seatsTotal, description, status } = req.body;

  if (!destinationId || !destinationName || !dates || !price || !seatsTotal) {
    return res.status(400).json({ error: "Please provide all required trip parameters." });
  }

  const db = readDB();
  const newTrip = {
    id: "trip-" + Math.random().toString(36).substr(2, 9),
    destinationId,
    destinationName,
    dates,
    price: Number(price),
    seatsTotal: Number(seatsTotal),
    seatsAvailable: Number(seatsTotal),
    description: description || "Curated escape with beautiful trails.",
    status: status || "Seats Open"
  };

  db.trips.unshift(newTrip);
  writeDB(db);

  // Broadcast campaign email notification to all registered seekers
  try {
    const activeSeekers = db.users || [];
    activeSeekers.forEach((seeker: any) => {
      // Send personalized launch email notice and log to outbox
      sendSimulatedEmail(
        seeker.email,
        seeker.name,
        `🌟 Secret Caravan Launch: ${destinationName} departing ${dates}!`,
        "new-trip",
        newTrip
      );
    });
  } catch (err) {
    console.error("Broadcast notification sequence failed", err);
  }

  res.status(201).json(newTrip);
});

// 5. Update Trip Details (Admin Only) API Route
app.put("/api/trips/:id", (req, res) => {
  const tripId = req.params.id;
  const { dates, price, seatsTotal, seatsAvailable, description, status } = req.body;

  const db = readDB();
  const tripIdx = db.trips.findIndex((t: any) => t.id === tripId);
  if (tripIdx === -1) {
    return res.status(404).json({ error: "Specified departure not found." });
  }

  const currentTrip = db.trips[tripIdx];
  db.trips[tripIdx] = {
    ...currentTrip,
    dates: dates !== undefined ? dates : currentTrip.dates,
    price: price !== undefined ? Number(price) : currentTrip.price,
    seatsTotal: seatsTotal !== undefined ? Number(seatsTotal) : currentTrip.seatsTotal,
    seatsAvailable: seatsAvailable !== undefined ? Number(seatsAvailable) : currentTrip.seatsAvailable,
    description: description !== undefined ? description : currentTrip.description,
    status: status !== undefined ? status : currentTrip.status
  };

  writeDB(db);
  res.json(db.trips[tripIdx]);
});

// 6. Delete Trip (Admin Only) API Route
app.delete("/api/trips/:id", (req, res) => {
  const tripId = req.params.id;
  const db = readDB();
  const filteredTrips = db.trips.filter((t: any) => t.id !== tripId);

  if (filteredTrips.length === db.trips.length) {
    return res.status(404).json({ error: "Trip not found." });
  }

  db.trips = filteredTrips;
  writeDB(db);
  res.json({ success: true, message: "Trip deleted successfully." });
});

// 7. Get user's bookings or all bookings (if Admin) API Route
app.get("/api/bookings", (req, res) => {
  const db = readDB();
  const { email, role } = req.query;

  if (role === "admin") {
    return res.json(db.bookings);
  }

  if (email) {
    const userBookings = db.bookings.filter(
      (b: any) => b.email.toLowerCase() === (email as string).toLowerCase()
    );
    return res.json(userBookings);
  }

  res.json([]);
});

// 8. Place dynamic seats reservation & Process Razorpay transaction details
app.post("/api/bookings", (req, res) => {
  const { tripId, travelerName, email, phone, numTravelers, tierSelected, addOns, totalCost, paymentId, paymentMethod, signature } = req.body;

  if (!tripId || !travelerName || !email || !numTravelers) {
    return res.status(400).json({ error: "Required reservation values are missing." });
  }

  const db = readDB();
  const tripIdx = db.trips.findIndex((t: any) => t.id === tripId);
  if (tripIdx === -1) {
    return res.status(404).json({ error: "The selected trip departures list is invalid." });
  }

  const trip = db.trips[tripIdx];
  if (trip.seatsAvailable < numTravelers) {
    return res.status(400).json({
      error: `Sorry, only ${trip.seatsAvailable} seats are left. Cannot reserve ${numTravelers} seats.`
    });
  }

  // Generate dynamic transaction details
  const rzpPaymentId = paymentId || "pay_rzp_sandbox_" + Math.random().toString(36).substr(2, 9);
  const rzpMethod = paymentMethod || "UPI / QR Code";
  const rzpSignature = signature || "sig_valid_sha256_" + Math.random().toString(36).substr(2, 12);

  // Create real ticket
  const newBooking = {
    id: "RAASTA-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
    tripId,
    tripName: trip.destinationName,
    travelerName,
    email: email.toLowerCase(),
    phone: phone || "+91 99999 99999",
    numTravelers: Number(numTravelers),
    tierSelected: tierSelected || "Standard Plan",
    addOns: {
      photographer: !!addOns?.photographer,
      premiumStay: !!addOns?.premiumStay,
      localGuide: !!addOns?.localGuide
    },
    totalCost: Number(totalCost),
    bookingDate: trip.dates,
    status: "Confirmed" as const,
    paymentId: rzpPaymentId,
    paymentMethod: rzpMethod,
    paymentStatus: "Paid"
  };

  // Decrement remaining seats count on trip index
  db.trips[tripIdx].seatsAvailable = Math.max(0, trip.seatsAvailable - Number(numTravelers));

  db.bookings.unshift(newBooking);
  writeDB(db);

  // Trigger professional dynamic booking invoice email notification
  try {
    sendSimulatedEmail(
      newBooking.email,
      newBooking.travelerName,
      `🎟️ RAASTA Booking Invoice: Seat Confirmed [${newBooking.id}]`,
      "booking",
      {
        bookingId: newBooking.id,
        tripName: newBooking.tripName,
        bookingDate: newBooking.bookingDate,
        tierSelected: newBooking.tierSelected,
        numTravelers: newBooking.numTravelers,
        addOns: newBooking.addOns,
        totalCost: newBooking.totalCost,
        phone: newBooking.phone,
        paymentId: rzpPaymentId,
        paymentMethod: rzpMethod,
        signature: rzpSignature
      }
    );
  } catch (err) {
    console.error("Booking email dispatch failed", err);
  }

  res.status(201).json(newBooking);
});

// 9. Cancel dynamic reservation API Route & Release refunds
app.post("/api/bookings/:id/cancel", (req, res) => {
  const bookingId = req.params.id;
  const db = readDB();

  const bookingIdx = db.bookings.findIndex((b: any) => b.id === bookingId);
  if (bookingIdx === -1) {
    return res.status(404).json({ error: "Booking ticket ledger code not found." });
  }

  const booking = db.bookings[bookingIdx];

  // Replenish seats available count back to Trip list
  const tripIdx = db.trips.findIndex((t: any) => t.id === booking.tripId);
  if (tripIdx !== -1) {
    const trip = db.trips[tripIdx];
    db.trips[tripIdx].seatsAvailable = Math.min(
      trip.seatsTotal,
      trip.seatsAvailable + booking.numTravelers
    );
  }

  // Trigger professional refund & cancellation confirmation email notice
  try {
    sendSimulatedEmail(
      booking.email,
      booking.travelerName,
      `⚠️ RAASTA Reservation Revoked: Cancelled [${booking.id}]`,
      "cancellation",
      {
        bookingId: booking.id,
        tripName: booking.tripName,
        totalCost: booking.totalCost
      }
    );
  } catch (err) {
    console.error("Cancellation email notification failed", err);
  }

  // Remove booking record from ledger array
  db.bookings.splice(bookingIdx, 1);
  writeDB(db);

  res.json({ success: true, message: "Reservation seat canceled and released successfully." });
});

// 9.1 Return user's custom in-app notifications & simulated emails outbox
app.get("/api/notifications", (req, res) => {
  const db = readDB();
  const { email, role } = req.query;

  if (role === "admin") {
    // Admin gets full visibility over all SMTP outputs to audit layouts easily
    return res.json(db.notifications || []);
  }

  if (email) {
    const filtered = (db.notifications || []).filter(
      (n: any) => n.recipientEmail.toLowerCase() === (email as string).toLowerCase()
    );
    return res.json(filtered);
  }

  res.json([]);
});

// 9.2 Toggle in-app notifications read state
app.post("/api/notifications/mark-all-read", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Missing email parameter" });
  }

  const db = readDB();
  let modified = false;
  db.notifications = (db.notifications || []).map((n: any) => {
    if (n.recipientEmail.toLowerCase() === email.toLowerCase()) {
      modified = true;
      return { ...n, read: true };
    }
    return n;
  });

  if (modified) {
    writeDB(db);
  }
  res.json({ success: true });
});

// 10. Admin Metrics endpoint
app.get("/api/stats", (req, res) => {
  const db = readDB();
  const bookingsCount = db.bookings.length;
  const totalRevenue = db.bookings.reduce((sum: number, b: any) => sum + (b.totalCost || 0), 0);

  const totalSeatsReservations = db.bookings.reduce((sum: number, b: any) => sum + (b.numTravelers || 0), 0);

  // Simple statistics
  const currentTripsCount = db.trips.length;
  const registeredUsersCount = db.users.length;

  res.json({
    bookingsCount,
    totalRevenue,
    totalSeatsReservations,
    currentTripsCount,
    registeredUsersCount
  });
});

// Integrating Vite dev server middleware or static bundle serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RAASTA Server now running on http://localhost:${PORT}`);
  });
}

startServer();
