import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Landmark,
  FileText,
  Building2,
  Calculator,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Users,
  RefreshCw,
  ShoppingCart,
  Award,
  Share2,
  FileWarning,
  Clock,
  Info,
  Percent,
  Wallet,
  Receipt,
  ScrollText,
  BadgeCheck,
  MessageCircleMore,
  Star,
  LogIn,
  LogOut,
  LayoutDashboard,
  Search,
  Lock,
  Ticket,
  ClipboardList,
  UserCheck,
  BadgeDollarSign,
  PlayCircle,
  ListChecks,
  PackageCheck,
  RotateCcw,
  XCircle,
  Landmark as BankIcon,
  Globe,
  Send,
  Bot,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useT, useLang, LANGS } from "./src/i18n.jsx";

/* ------------------------------------------------------------------ */
/*  BRAND TOKENS                                                       */
/* ------------------------------------------------------------------ */
// Matches the live ICFS site: deep forest-green header/hero, emerald
// accents, white cards on a soft gray canvas.
const BRAND = {
  deep: "#0b5d3b", // header / hero background
  deepDark: "#08432a", // hover / darker panels
  accent: "#0f8a52", // buttons, links, active states
};

/* ------------------------------------------------------------------ */
/*  SOP-DERIVED WORKFLOW DATA                                          */
/*  Source: Prize Bond Workflows SOP (SBP Prize Bonds Unit)            */
/* ------------------------------------------------------------------ */

const FORM_LIST_NOTE = [
  "Application for Payment of Face Value of Claim",
  "National Prize Bonds Application Form",
  "Prize Money Claim Application Form",
  "Premium Prize Bonds Application Form",
];

// Shared opening steps common to every National Prize Bond journey.
const NATIONAL_INTAKE_FLOW = [
  {
    counter: "Token",
    title: "Collect your token",
    icon: Ticket,
    desc: "Take a token at the entrance to begin your visit. You'll be called to Counter 3 in order.",
  },
  {
    counter: "Counter 3",
    title: "Collect & fill the form",
    icon: ClipboardList,
    desc: "Pick up the form that matches your request from Counter 3.",
    bullets: FORM_LIST_NOTE,
  },
  {
    counter: "Counter 18 / 19",
    title: "Know Your Customer (KYC)",
    icon: UserCheck,
    desc: "Your form and CNIC are verified before anything else proceeds.",
    bullets: [
      "New customer: form + 2 CNIC copies",
      "Already-registered customer: form + 1 CNIC copy",
      "CNIC must not be expired — an expired CNIC is not accepted",
      "If a CNIC renewal is already in process, bring the NADRA token/acknowledgment receipt as proof",
      "If verification fails you'll be told the service isn't available yet; if cleared, your amount is entered and tagged as National, and your CNIC/designation data is recorded",
    ],
  },
];

// Shared opening steps common to every Premium Prize Bond journey.
const PREMIUM_INTAKE_FLOW = [
  {
    counter: "Token",
    title: "Collect your token",
    icon: Ticket,
    desc: "Take a token at the entrance to begin your visit. You'll be called to Counter 3 in order.",
  },
  {
    counter: "Counter 3",
    title: "Collect & fill the form",
    icon: ClipboardList,
    desc: "Pick up the form that matches your request — the same form set used for National Prize Bonds.",
    bullets: FORM_LIST_NOTE,
  },
  {
    counter: "Counter 18 / 19",
    title: "Know Your Customer (KYC)",
    icon: UserCheck,
    desc: "Your form and CNIC are verified before anything else proceeds.",
    bullets: [
      "New customer: form + 2 CNIC copies",
      "Already-registered customer: form + 1 CNIC copy",
      "CNIC must not be expired — an expired CNIC is not accepted",
      "If a CNIC renewal is already in process, bring the NADRA token/acknowledgment receipt as proof",
      "If verification fails you'll be told the service isn't available yet; if cleared, your amount is entered and tagged as Premium, and your CNIC/designation data is recorded",
    ],
  },
  {
    counter: "Counter 20 / 21",
    title: "Registration",
    icon: FileText,
    desc: "Premium Prize Bonds are registered instruments, so every application is registered here before payment.",
    bullets: [
      "Documents needed: Cheque / Cash / Payment Order, ID card copy, Account Maintenance Certificate (AMC), and an emergency contact number",
      "Original bonds plus photocopies — 2 signatures are required on every bond",
      "One ID card copy per application form",
      "A separate form is required for each individual denomination",
      "The form must be filled in full",
      "Your bank account must be held with a conventional (non-Islamic) bank",
    ],
  },
];

const CHEQUE_STEP = {
  counter: "Counter 22 / 23",
  title: "Cheque submission & receipt",
  icon: Receipt,
  desc: "Payment is submitted and receipted here before your case moves to the final service counter.",
  bullets: [
    "Cheque payments: allow 1 working day for clearance",
    "Cash payments: processed immediately",
  ],
};

const ENCASHMENT_NOTE_BULLETS = [
  "Cheque payments are credited to your account — this requires a registered IBAN and a copy of your ID card",
  "If your account is with an Islamic bank, payment is instead made via your EasyPaisa account or in cash",
];

const PREMIUM_SUB = [
  {
    key: "encashment",
    title: "Encashment",
    icon: RefreshCw,
    summary: "Redeem your Premium Prize Bond for its full face value.",
    intro:
      "Premium Prize Bonds can be encashed at full face value through the standard SBP-BSC counter journey: Token, Form, KYC, Registration, Cheque handling, and finally Sale/Encashment authorization.",
    flow: [
      ...PREMIUM_INTAKE_FLOW,
      CHEQUE_STEP,
      {
        counter: "Counter 26 / 27",
        title: "Premium Bond Services — Encashment",
        icon: BadgeDollarSign,
        desc: "Sale and Encashment are handled across two linked counters: 26 for input, 27 for authorization.",
        bullets: [
          "Counter 26 — Input: your encashment request is entered against the bond",
          "Counter 27 — Authorization: a second officer authorizes and finalizes the payment",
          ...ENCASHMENT_NOTE_BULLETS,
        ],
      },
    ],
    documents: [
      "Original Premium Prize Bond certificate(s), signed twice on the back",
      "Valid, unexpired CNIC / NICOP of the registered holder",
      "Account Maintenance Certificate (AMC) for a conventional bank account",
      "Registered IBAN details for cheque-based encashment",
    ],
    notes: [
      "Encashment is only allowed to the registered holder or their authorized representative, since Premium Prize Bonds are registered instruments.",
      "A separate application form is required for each denomination you are encashing.",
    ],
  },
  {
    key: "succession",
    title: "Succession",
    icon: Users,
    summary: "Transfer bonds to legal heirs after the holder's demise.",
    intro:
      "Succession is a two-phase process: SBP-BSC first issues a Certificate of Investment so NADRA can issue the Succession Certificate, and only then does the legal heir re-submit to complete registration.",
    flow: [
      {
        counter: "Phase 1",
        title: "Apply for the Certificate of Investment",
        icon: ClipboardList,
        desc: "The legal heir applies to the Chief Manager, Islamabad, to obtain a Certificate of Investment.",
        bullets: [
          "Application to the Chief Manager, Islamabad (Isb) by the applicant (legal heir)",
          "Copy of CNIC — applicant and deceased",
          "Family Registration Certificate (FRC)",
          "Death Certificate",
        ],
      },
      {
        counter: "NADRA",
        title: "Obtain the Succession Certificate",
        icon: ShieldCheck,
        desc: "SBP-BSC's Certificate of Investment is submitted to NADRA, which issues the Succession Certificate empowering the legal heir.",
      },
      {
        counter: "Re-submission",
        title: "Re-submit to SBP-BSC",
        icon: FileText,
        desc: "Once NADRA issues the Succession Certificate, the empowered legal heir re-submits a complete document set.",
        bullets: [
          "Application to the Chief Manager, Islamabad (Isb) by the applicant",
          "Attested copy of CNIC — applicant and deceased",
          "FRC, with attested CNIC copies of every member listed on it",
          "Attested Death Certificate",
          "Attested Succession Certificate",
          "Copies of the Prize Bonds",
          "Account Maintenance Certificate (for a conventional / non-Islamic account)",
        ],
      },
      {
        counter: "Registration",
        title: "Bond signing & registration",
        icon: FileText,
        desc: "The bonds are re-registered in the legal heir's name once documents are verified.",
        bullets: ["All bonds must carry 2 signatures each, on the back of the bond."],
      },
    ],
    documents: [
      "Death certificate of the bondholder (attested for re-submission)",
      "Family Registration Certificate (FRC), with attested CNICs of all listed members",
      "Succession Certificate issued by NADRA (attested)",
      "CNIC copies of applicant and deceased",
      "Copies of the Prize Bonds",
      "Account Maintenance Certificate for a conventional bank account",
    ],
    notes: [
      "The process runs in two distinct stages — do not attempt the re-submission documents until NADRA has actually issued the Succession Certificate.",
      "The receiving account must be with a conventional (non-Islamic) bank.",
    ],
  },
  {
    key: "lost",
    title: "Lost Bond",
    icon: FileWarning,
    summary: "Report a lost or stolen bond and request a duplicate.",
    intro:
      "If a Premium Prize Bond certificate is lost, stolen, or destroyed, report it immediately and route a duplicate request through the standard KYC and Registration counters to protect against fraudulent encashment.",
    flow: [
      {
        counter: "Police",
        title: "Lodge an FIR",
        icon: AlertCircle,
        desc: "Report the loss at the nearest police station, describing the bond(s) and their numbers if known.",
      },
      ...PREMIUM_INTAKE_FLOW,
      CHEQUE_STEP,
      {
        counter: "Counter 26 / 27",
        title: "Duplicate bond issuance",
        icon: BadgeDollarSign,
        desc: "The reported bond number is blocked in SBP-BSC records; after the prescribed verification period, a duplicate is authorized and issued.",
      },
    ],
    documents: [
      "Copy of FIR / police report",
      "Indemnity Bond on the requisite stamp paper",
      "Unexpired CNIC of the registered holder",
      "Bond number(s) / purchase receipt, if available",
    ],
    notes: [
      "Reporting the loss promptly reduces the risk of a third party fraudulently encashing the bond.",
      "The verification/objection period before a duplicate is issued is set by SBP-BSC policy and can vary by denomination.",
    ],
  },
  {
    key: "claim",
    title: "Claim Prize Money",
    icon: Award,
    summary: "Claim the prize amount won in a Premium Prize Bond draw.",
    intro:
      "Winners present the winning bond through the same Token → Form → KYC → Registration → Cheque journey; the prize is authorized and credited at the final service counter.",
    flow: [
      ...PREMIUM_INTAKE_FLOW,
      CHEQUE_STEP,
      {
        counter: "Counter 26 / 27",
        title: "Prize authorization & payment",
        icon: BadgeDollarSign,
        desc: "The bond is checked against the draw result and ownership records; once cleared, the net prize amount (after withholding tax) is released.",
        bullets: ENCASHMENT_NOTE_BULLETS,
      },
    ],
    documents: [
      "Original winning Premium Prize Bond certificate, signed twice on the back",
      "Unexpired CNIC of the registered holder",
      "Account Maintenance Certificate (AMC) / registered IBAN details",
      "Duly filled Prize Money Claim Application Form",
    ],
    notes: [
      "Withholding tax is deducted at source under Section 156 of the Income Tax Ordinance, 2001, at the Filer or Non-Filer rate.",
      "Claims must generally be lodged within the limitation period prescribed by SBP-BSC / National Savings rules from the draw date.",
    ],
  },
  {
    key: "transfer",
    title: "Transfer",
    icon: Share2,
    summary: "Transfer ownership of a bond from one holder to another.",
    intro:
      "Ownership transfers for registered Premium Prize Bonds are routed through the same KYC and Registration counters used for encashment, with both parties verified before re-registration.",
    flow: [
      ...PREMIUM_INTAKE_FLOW,
      {
        counter: "Counter 20 / 21",
        title: "Transfer registration",
        icon: FileText,
        desc: "Both transferor and transferee are verified and the bonds are re-registered in the transferee's name.",
        bullets: [
          "A completed Transfer Deed / Application from both parties",
          "One ID card copy per application form, for each party",
          "2 signatures required on every bond",
          "The transferee's receiving account must be with a conventional (non-Islamic) bank",
        ],
      },
    ],
    documents: [
      "Original Premium Prize Bond certificate(s)",
      "Unexpired CNIC copies of transferor and transferee",
      "Duly signed Transfer Deed / Application",
      "Account Maintenance Certificate for the transferee",
    ],
    notes: [
      "Transfers are subject to verification that neither party is restricted from holding prize bonds under applicable regulations.",
      "Confirm current requirements with your field office before visiting, as denomination-specific rules can apply.",
    ],
  },
  {
    key: "purchase",
    title: "Purchase",
    icon: ShoppingCart,
    summary: "Buy new Premium Prize Bonds from authorized branches.",
    intro:
      "Premium Prize Bonds are registered bonds in Rs. 25,000 and Rs. 40,000 denominations, purchased through the standard Token, Form, and KYC/Registration counters in the buyer's name.",
    flow: [
      ...PREMIUM_INTAKE_FLOW,
      CHEQUE_STEP,
      {
        counter: "Counter 26 / 27",
        title: "Bond issuance",
        icon: BadgeDollarSign,
        desc: "Once payment clears, the bond is issued in registered form in the applicant's name.",
      },
    ],
    documents: [
      "Unexpired CNIC / NICOP",
      "Payment — cash, cheque, or payment order, as accepted by the branch",
      "Account Maintenance Certificate (AMC) for a conventional bank account",
      "Duly filled Premium Prize Bonds Application Form (a separate form per denomination)",
    ],
    notes: [
      "Since Premium Prize Bonds are registered instruments, they cannot be held anonymously or endorsed like bearer bonds.",
      "Minors may hold bonds through a guardian, subject to standard KYC requirements.",
    ],
  },
];

const NATIONAL_SUB = [
  {
    key: "claim",
    title: "Claim Prize Money",
    icon: Award,
    summary: "Claim the prize amount won in a National Prize Bond draw.",
    intro:
      "National Prize Bonds are bearer instruments — the presenter of a winning bond, once verified through KYC, can claim the prize money. There is no Registration counter step, since National bonds are not registered.",
    flow: [
      ...NATIONAL_INTAKE_FLOW,
      CHEQUE_STEP,
      {
        counter: "Counter 30 / 31",
        title: "National Bond Services — Prize authorization",
        icon: BadgeDollarSign,
        desc: "A CI Number is generated for the transaction and recorded on the cheque before payment is released.",
        bullets: ENCASHMENT_NOTE_BULLETS,
      },
    ],
    documents: [
      "Original winning National Prize Bond",
      "Unexpired CNIC of the claimant",
      "Registered IBAN details / ID card copy for cheque-based payment",
      "Duly filled Prize Money Claim Application Form",
    ],
    notes: [
      "Since National Prize Bonds are bearer instruments, the prize is generally paid to whoever presents a valid winning bond — keep your bonds secure.",
      "Claims are subject to the limitation period prescribed for prize money claims from the date of the draw.",
    ],
  },
  {
    key: "damaged",
    title: "Damaged Bond",
    icon: FileWarning,
    summary: "Exchange a torn or defaced bond for a fresh certificate.",
    intro:
      "A National Prize Bond that is torn, defaced, or otherwise damaged — but still identifiable — can be exchanged for a fresh bond of the same denomination and number at Counter 30/31.",
    flow: [
      ...NATIONAL_INTAKE_FLOW,
      {
        counter: "Counter 30 / 31",
        title: "National Bond Services — Fresh Bond issuance",
        icon: BadgeDollarSign,
        desc: "The damaged bond is examined to confirm the denomination, number, and security features are still verifiable before a replacement is issued.",
        bullets: [
          "Fresh Bonds require the bond number — recorded on the form and entered into the system",
          "Restamping, dating, and presentation of your cheque/cash plus ID card are all handled at this step",
        ],
      },
    ],
    documents: [
      "The damaged / mutilated bond certificate",
      "Unexpired CNIC of the presenter",
      "Duly filled National Prize Bonds Application Form",
    ],
    notes: [
      "Bonds too badly damaged for the number or denomination to be verified may not be eligible for exchange — this is assessed case-by-case at the counter.",
      "There is generally no fee for exchanging a genuinely damaged bond, though this may vary by policy.",
    ],
  },
  {
    key: "encashment",
    title: "Encashment",
    icon: RefreshCw,
    summary: "Redeem a National Prize Bond for its full face value.",
    intro:
      "National Prize Bonds can be encashed for full face value at any time. As bearer instruments they skip the Registration counter and move straight from KYC to Cheque handling and National Bond Services.",
    flow: [
      ...NATIONAL_INTAKE_FLOW,
      CHEQUE_STEP,
      {
        counter: "Counter 30 / 31",
        title: "National Bond Services — Encashment",
        icon: BadgeDollarSign,
        desc: "A CI Number is generated for the transaction, recorded on the cheque, and encashment is authorized as a Reissuable Bond service — no bond number is required.",
        bullets: ENCASHMENT_NOTE_BULLETS,
      },
    ],
    documents: [
      "Original National Prize Bond certificate(s)",
      "Unexpired CNIC of the presenter",
      "Registered IBAN + ID card copy, for cheque-based encashment",
    ],
    notes: [
      "As bearer instruments, National Prize Bonds can be encashed by whoever presents them; store them securely.",
      "Large-value encashments may require additional verification per State Bank's prevailing AML/KYC guidelines.",
    ],
  },
  {
    key: "purchase",
    title: "Purchase",
    icon: ShoppingCart,
    summary: "Buy new National Prize Bonds over the counter.",
    intro:
      "National Prize Bonds are available in Rs. 100, Rs. 200, Rs. 750, and Rs. 1,500 denominations and are issued over the counter, in bearer form, once your form is processed.",
    flow: [
      {
        counter: "Token",
        title: "Collect your token",
        icon: Ticket,
        desc: "Take a token at the entrance to begin your visit.",
      },
      {
        counter: "Counter 3",
        title: "Collect & fill the form",
        icon: ClipboardList,
        desc: "Choose your denomination and quantity, and fill in the National Prize Bonds Application Form.",
      },
      {
        counter: "Counter 22 / 23",
        title: "Payment",
        icon: Receipt,
        desc: "Pay the face value in cash or by cheque, as accepted by the branch. Cash purchases are issued immediately.",
      },
      {
        counter: "Counter 30 / 31",
        title: "Bond issuance",
        icon: BadgeDollarSign,
        desc: "Bonds are issued as Fresh Bonds, recorded with unique serial numbers for the draw.",
      },
    ],
    documents: [
      "CNIC, for record-keeping on larger purchases, per branch policy",
      "Payment for the face value of the bonds",
    ],
    notes: [
      "National Prize Bonds are bearer instruments — no name is registered against them, so keep them safe like cash.",
      "Record your bond numbers separately in case of loss, to support any future claim or report.",
    ],
  },
];

// Each entry points at a real PDF served from /public/forms so the Download
// button actually delivers the file.
const FORMS = [
  { code: "PB-1", title: "National Prize Bonds Application Form", tag: "National", icon: BadgeCheck, file: "/forms/national-application.pdf" },
  { code: "PB-2", title: "Premium Prize Bonds Application Form", tag: "Premium", icon: Landmark, file: "/forms/premium-application-form.pdf" },
  { code: "PB-3", title: "Premium Prize Bonds Application Form (PPB-7)", tag: "Premium", icon: FileText, file: "/forms/premium-application-PPB-7.pdf" },
  { code: "PB-4", title: "Premium Prize Bonds — Purchase / Encashment", tag: "Premium", icon: ShoppingCart, file: "/forms/premium-purchase-encashment.pdf" },
  { code: "PB-5", title: "Prize Money Claim Application Form (PB-23)", tag: "General", icon: Award, file: "/forms/prize-money-claim-PB-23.pdf" },
  { code: "PB-6", title: "Application for Payment of Face Value of Claim (PBL-1-A)", tag: "General", icon: Receipt, file: "/forms/face-value-claim-PBL-1-A.pdf" },
  { code: "PB-7", title: "Indemnity Form (Lost / Stolen Prize Bond)", tag: "Premium", icon: FileWarning, file: "/forms/indemnity-form.pdf" },
];

const FIELD_OFFICES = [
  { city: "Karachi", address: "SBP-BSC Field Office, I.I. Chundrigar Road, Karachi", phone: "021-111-727-273" },
  { city: "Lahore", address: "SBP-BSC Field Office, Shahrah-e-Quaid-e-Azam, Lahore", phone: "042-111-727-273" },
  { city: "Islamabad", address: "SBP-BSC Field Office, Jinnah Avenue, Blue Area, Islamabad", phone: "051-111-727-273" },
  { city: "Peshawar", address: "SBP-BSC Field Office, Saddar Road, Peshawar Cantt", phone: "091-111-727-273" },
  { city: "Quetta", address: "SBP-BSC Field Office, Jinnah Road, Quetta", phone: "081-111-727-273" },
  { city: "Multan", address: "SBP-BSC Field Office, Abdali Road, Multan", phone: "061-111-727-273" },
  { city: "Faisalabad", address: "SBP-BSC Field Office, Susan Road, Faisalabad", phone: "041-111-727-273" },
  { city: "Sialkot", address: "SBP-BSC Field Office, Paris Road, Sialkot", phone: "052-111-727-273" },
];

const NATIONAL_PRIZES = {
  100: { first: { amount: 700000, count: 1 }, second: { amount: 200000, count: 3 }, third: { amount: 1000, count: 1199 } },
  200: { first: { amount: 750000, count: 1 }, second: { amount: 250000, count: 5 }, third: { amount: 1250, count: 2394 } },
  750: { first: { amount: 1500000, count: 1 }, second: { amount: 500000, count: 3 }, third: { amount: 9300, count: 1696 } },
  1500: { first: { amount: 3000000, count: 1 }, second: { amount: 1000000, count: 3 }, third: { amount: 18500, count: 1696 } },
};

const PREMIUM_PRIZES = {
  25000: { first: { amount: 30000000, count: 1 }, second: { amount: 10000000, count: 3 }, third: { amount: 300000, count: 660 } },
  40000: { first: { amount: 80000000, count: 1 }, second: { amount: 30000000, count: 3 }, third: { amount: 500000, count: 660 } },
};

const TIER_LABEL = { first: "1st Prize", second: "2nd Prize", third: "3rd Prize" };

/* ------------------------------------------------------------------ */
/*  DEMO DATA — STAFF DASHBOARD                                        */
/* ------------------------------------------------------------------ */

const DASHBOARD_STATS = [
  { label: "Total Complaints", value: "128", tone: "text-emerald-700", icon: ClipboardList, chip: "bg-emerald-50 text-emerald-700" },
  { label: "Pending", value: "34", tone: "text-amber-600", icon: Clock, chip: "bg-amber-50 text-amber-600" },
  { label: "In Progress", value: "19", tone: "text-blue-600", icon: RefreshCw, chip: "bg-blue-50 text-blue-600" },
  { label: "Resolved", value: "75", tone: "text-emerald-700", icon: CheckCircle2, chip: "bg-emerald-50 text-emerald-700" },
  { label: "Avg Rating", value: "4.2", tone: "text-emerald-700", star: true, icon: Star, chip: "bg-amber-50 text-amber-500" },
];

const COMPLAINTS_OVER_TIME = [
  { label: "Feb", value: 14 },
  { label: "Mar", value: 22 },
  { label: "Apr", value: 18 },
  { label: "May", value: 27 },
  { label: "Jun", value: 31 },
  { label: "Jul", value: 17 },
];

const RATING_DISTRIBUTION = [
  { label: "1 Star", value: 3 },
  { label: "2 Star", value: 5 },
  { label: "3 Star", value: 12 },
  { label: "4 Star", value: 28 },
  { label: "5 Star", value: 41 },
];

const SEED_COMPLAINTS = [
  { id: "CMP-1001", name: "Ahmed Khan", email: "ahmed.khan@example.com", phone: "0300-1234567", complaint: "Bond claim not processed after 3 weeks", status: "Pending", date: "Aug 01, 2026" },
  { id: "CMP-1002", name: "Sara Malik", email: "sara.malik@example.com", phone: "0333-9876543", complaint: "Transfer of ownership request stuck", status: "In Progress", date: "Jul 29, 2026" },
  { id: "CMP-1003", name: "Bilal Hussain", email: "bilal.h@example.com", phone: "0321-4567890", complaint: "Lost bond duplicate process unclear", status: "Resolved", date: "Jul 26, 2026" },
  { id: "CMP-1004", name: "Fatima Raza", email: "fatima.raza@example.com", phone: "0345-1122334", complaint: "Encashment amount incorrect", status: "Pending", date: "Jul 24, 2026" },
  { id: "CMP-1005", name: "Usman Tariq", email: "usman.tariq@example.com", phone: "0312-5566778", complaint: "Death case succession documents rejected", status: "Resolved", date: "Jul 20, 2026" },
];

const SEED_REVIEWS = [
  { id: "REV-2001", name: "Hina Aslam", email: "hina.aslam@example.com", rating: 5, comment: "Very smooth process, staff was helpful.", date: "Aug 02, 2026" },
  { id: "REV-2002", name: "Kamran Shah", email: "kamran.shah@example.com", rating: 3, comment: "Took longer than expected to get a response.", date: "Jul 30, 2026" },
  { id: "REV-2003", name: "Ayesha Noor", email: "ayesha.noor@example.com", rating: 4, comment: "Good experience overall, portal could be faster.", date: "Jul 27, 2026" },
  { id: "REV-2004", name: "Zubair Ahmed", email: "zubair.ahmed@example.com", rating: 5, comment: "No comment provided.", date: "Jul 25, 2026" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */

function pkr(n) {
  return "Rs. " + Number(n).toLocaleString("en-US");
}

function Stars({ value, size = "w-4 h-4" }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={size + " " + (i <= value ? "fill-amber-400 text-amber-400" : "text-slate-300")}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL UI PRIMITIVES                                                 */
/* ------------------------------------------------------------------ */

function Breadcrumb({ items, onNavigate }) {
  const t = useT();
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
      {items.map((it, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          {it.page ? (
            <button
              onClick={() => onNavigate(it.page, it.payload)}
              className="hover:text-emerald-700 hover:underline underline-offset-2 transition-colors"
            >
              {t(it.label)}
            </button>
          ) : (
            <span className="text-slate-800 font-medium">{t(it.label)}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  const t = useT();
  return (
    <div className="mb-10 text-center max-w-2xl mx-auto">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700 mb-2">{t(eyebrow)}</p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#0b3b26]">{t(title)}</h1>
      {subtitle && <p className="mt-3 text-slate-600 leading-relaxed">{t(subtitle)}</p>}
    </div>
  );
}

function OptionCard({ icon: Icon, title, summary, onClick }) {
  const t = useT();
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      <div className="w-11 h-11 rounded-lg bg-[#0b5d3b] text-white flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-[#0b3b26] text-base mb-1.5">{t(title)}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{t(summary)}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
        {t("Start journey")} <ChevronRight className="w-4 h-4" />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGO                                                                */
/* ------------------------------------------------------------------ */

function Logo({ light }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="bg-white rounded-lg px-2 py-1 shrink-0 flex items-center">
        <img
          src="/sbp-logo.png"
          alt="State Bank of Pakistan"
          className="h-8 sm:h-9 w-auto"
        />
      </div>
      <div className="text-left leading-tight hidden sm:block">
        <p className={"text-sm font-bold tracking-wide " + (light ? "text-white" : "text-[#0b3b26]")}>ICFS</p>
        <p className={"text-[11px] " + (light ? "text-emerald-100" : "text-slate-500")}>
          SBP Banking Services Corporation
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME PAGE                                                           */
/* ------------------------------------------------------------------ */

function HomePage({ go }) {
  const t = useT();
  const cards = [
    { key: "premium", title: "Premium Prize Bonds", icon: Landmark, summary: "Registered bonds — encashment, succession, transfer, and prize claims." },
    { key: "national", title: "National Prize Bonds", icon: BadgeCheck, summary: "Bearer bonds — purchase, encashment, and prize money claims." },
    { key: "forms", title: "Download Forms", icon: FileText, summary: "All prize bond service forms in one place." },
    { key: "guidance", title: "Office Guidance", icon: Building2, summary: "Field office locations, counters to visit, and what to carry." },
    { key: "tax", title: "Tax Calculator", icon: Calculator, summary: "Estimate the withholding tax on your prize money instantly." },
  ];

  return (
    <div>
      <section style={{ background: BRAND.deep }} className="text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300 mb-3">
              {t("Intelligent Customer Facilitation System")}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              {t("A digital front desk for SBP-BSC.")}
            </h1>
            <p className="text-emerald-50/90 leading-relaxed mb-6 max-w-md">
              {t(
                "ICFS guides you through the correct Prize Bond service journey — no need to understand the process yourself. Select a goal below and we'll walk you through a personalized readiness check, the exact counters to visit, and a visit pack to bring with you."
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => go("tax")}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors px-5 py-2.5 rounded-lg font-medium text-sm"
              >
                <Calculator className="w-4 h-4" /> {t("Calculate prize tax")}
              </button>
              <button
                onClick={() => go("guidance")}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors px-5 py-2.5 rounded-lg font-medium text-sm"
              >
                <Building2 className="w-4 h-4" /> {t("Find a field office")}
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-full max-w-sm bg-white/5 border border-white/15 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs tracking-widest uppercase text-emerald-300 font-semibold">
                  {t("Sample Bond")}
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <p className="text-sm text-emerald-100 mb-1">{t("National Prize Bond")}</p>
              <p className="text-2xl font-bold mb-4">Rs. 1,500</p>
              <div className="h-px bg-white/15 mb-4" />
              <div className="flex justify-between text-xs text-emerald-100">
                <span>{t("Serial No.")}</span>
                <span className="font-mono">0123456</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-100 mt-2">
                <span>{t("Issuing Authority")}</span>
                <span>SBP-BSC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <SectionHeading
          eyebrow="Choose a service"
          title="What would you like to do today?"
          subtitle="Select an option below for a step-by-step journey based on the official SBP-BSC counter workflow."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <OptionCard key={c.key} icon={c.icon} title={c.title} summary={c.summary} onClick={() => go(c.key)} />
          ))}
        </div>
      </section>

      <section className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-[#0b3b26]">2</p>
            <p className="text-sm text-slate-600 mt-1">{t("Bond categories serviced")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0b3b26]">6</p>
            <p className="text-sm text-slate-600 mt-1">{t("Denominations covered")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0b3b26]">Sec. 156</p>
            <p className="text-sm text-slate-600 mt-1">{t("Income Tax Ordinance basis")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LISTING + DETAIL (WORKFLOW) PAGES                                  */
/* ------------------------------------------------------------------ */

function ListingPage({ title, subtitle, items, onSelect, breadcrumb, go }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={breadcrumb} onNavigate={go} />
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it) => (
          <OptionCard key={it.key} icon={it.icon} title={it.title} summary={it.summary} onClick={() => onSelect(it.key)} />
        ))}
      </div>
    </div>
  );
}

function WorkflowStep({ step, index, isLast, done, onToggleDone }) {
  const t = useT();
  const Icon = step.icon || ScrollText;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-colors " +
            (done ? "bg-emerald-600 text-white" : "bg-[#0b5d3b] text-white")
          }
        >
          {done ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-emerald-200 my-1" />}
      </div>
      <div className={"pb-8 flex-1 " + (isLast ? "" : "")}>
        <div className="flex items-center gap-2 mb-1 flex-wrap justify-between">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Icon className="w-3.5 h-3.5" /> {t(step.counter)}
          </span>
          {onToggleDone && (
            <button
              onClick={onToggleDone}
              className={
                "text-xs font-medium px-2.5 py-1 rounded-full border transition-colors " +
                (done
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-700")
              }
            >
              {done ? t("Done") : t("Mark as done")}
            </button>
          )}
        </div>
        <h3 className="font-semibold text-[#0b3b26] mb-1.5">{t(step.title)}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-2">{t(step.desc)}</p>
        {step.bullets && (
          <ul className="space-y-1.5 mt-2">
            {step.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t(b)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DetailPage({ item, categoryLabel, breadcrumb, go }) {
  const t = useT();
  if (!item) return null;
  const Icon = item.icon;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={breadcrumb} onNavigate={go} />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#0b5d3b] text-white flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700">{t(categoryLabel)}</p>
          <h1 className="text-2xl font-bold text-[#0b3b26]">{t(item.title)}</h1>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-8 mt-4">{t(item.intro)}</p>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="flex items-center gap-2 font-semibold text-[#0b3b26] mb-6">
          <ScrollText className="w-4.5 h-4.5 text-emerald-700" /> {t("Your counter journey")}
        </h2>
        <div>
          {item.flow.map((s, i) => (
            <WorkflowStep key={i} step={s} index={i} isLast={i === item.flow.length - 1} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-[#0b3b26] mb-4">
            <FileText className="w-4.5 h-4.5 text-emerald-700" /> {t("Documents required")}
          </h2>
          <ul className="space-y-2.5">
            {item.documents.map((d, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t(d)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="flex items-center gap-2 font-semibold text-amber-900 mb-4">
            <Info className="w-4.5 h-4.5" /> {t("Good to know")}
          </h2>
          <ul className="space-y-2.5">
            {item.notes.map((n, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-amber-900 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t(n)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SMART CUSTOMER JOURNEY (interactive, guided)                       */
/* ------------------------------------------------------------------ */

// -- Reusable readiness questions --------------------------------------

const CNIC_QUESTION = {
  id: "cnic",
  label: "Do you have a valid, unexpired CNIC / NICOP?",
  type: "yesno",
  required: true,
  missingLabel: "Valid, unexpired CNIC / NICOP",
  missingNote:
    "Bring your original CNIC or NICOP. If a renewal is in progress, bring your NADRA token or acknowledgment receipt as interim proof.",
};

function yesNoQ(id, label, missingLabel, missingNote) {
  return { id, label, type: "yesno", required: true, missingLabel, missingNote };
}

function BANK_TYPE_QUESTION(blockingForPremium) {
  return {
    id: "bankType",
    label: "Is your receiving bank account with a conventional bank or an Islamic bank?",
    type: "choice",
    options: ["Conventional bank", "Islamic bank"],
    required: true,
    isBlocking: (a) => blockingForPremium && a === "Islamic bank",
    missingLabel: "Conventional (non-Islamic) bank account",
    missingNote:
      "Premium Prize Bond payouts require a conventional bank account. Open one, or route the payment through a family member's conventional account per branch policy.",
    infoNote: (a) =>
      a === "Islamic bank"
        ? "Your payment will be made via EasyPaisa or cash instead of a direct bank credit."
        : null,
  };
}

const PAYMENT_METHOD_QUESTION = {
  id: "paymentMethod",
  label: "How will you pay?",
  type: "choice",
  options: ["Cash", "Cheque", "Payment Order"],
  required: true,
  isBlocking: () => false,
  infoNote: (a) =>
    a === "Cheque"
      ? "Cheque payments need about 1 working day to clear; plan for a short wait before final issuance."
      : a === "Cash"
      ? "Cash payments are processed immediately."
      : null,
};

// -- Per-service readiness configuration --------------------------------

const JOURNEY_CONFIG = {
  "premium:encashment": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "holder",
        "Is the bond registered in your name as the holder?",
        "Registered holder / authorization",
        "Encashment can only be done by the registered holder or an authorized representative with valid documentation."
      ),
      yesNoQ(
        "original",
        "Do you have the original bond certificate, signed twice on the back?",
        "Original bond certificate (signed twice)",
        "Bring the original certificate(s) and sign twice on the back of each bond before your visit, if you haven't already."
      ),
      yesNoQ(
        "amc",
        "Do you have an Account Maintenance Certificate (AMC) from your bank?",
        "Account Maintenance Certificate (AMC)",
        "Request an AMC from your bank branch — it confirms your account title and IBAN."
      ),
      BANK_TYPE_QUESTION(true),
      PAYMENT_METHOD_QUESTION,
    ],
  },
  "premium:succession": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "heir",
        "Are you a legal heir with a Family Registration Certificate (FRC)?",
        "Family Registration Certificate (FRC)",
        "Obtain an FRC from NADRA listing all legal heirs."
      ),
      yesNoQ(
        "death",
        "Do you have the (attested) death certificate of the bondholder?",
        "Attested death certificate",
        "Get the death certificate attested before your visit."
      ),
      {
        id: "succCert",
        label: "Have you already obtained the Succession Certificate from NADRA?",
        type: "choice",
        options: ["Yes, I have it", "Not yet — I need the Certificate of Investment first"],
        required: true,
        isBlocking: (a) => a !== "Yes, I have it",
        missingLabel: "Succession Certificate from NADRA",
        missingNote:
          "First apply for a Certificate of Investment from SBP-BSC (Phase 1), then take it to NADRA to obtain the Succession Certificate. Only then come back to re-submit and register.",
      },
      yesNoQ(
        "amc",
        "Does the legal heir have an Account Maintenance Certificate for a conventional bank account?",
        "AMC for a conventional bank account",
        "Open or confirm a conventional (non-Islamic) bank account and request an AMC."
      ),
    ],
  },
  "premium:lost": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "fir",
        "Have you filed an FIR / police report for the lost or stolen bond?",
        "FIR / police report",
        "Visit your nearest police station and lodge an FIR describing the bond(s), then bring a copy with you."
      ),
      yesNoQ(
        "indemnity",
        "Do you have an Indemnity Bond on the requisite stamp paper (or can you arrange one)?",
        "Indemnity Bond on stamp paper",
        "Prepare an Indemnity Bond on the requisite stamp paper — a legal stationer or lawyer can help draft this."
      ),
      {
        id: "bondNumbers",
        label: "Do you know the bond number(s) or have your purchase receipt?",
        type: "choice",
        options: ["Yes", "No"],
        required: true,
        isBlocking: () => false,
        infoNote: (a) =>
          a === "No"
            ? "Not having your bond numbers can slow down verification — check any purchase records if possible before your visit."
            : null,
      },
    ],
  },
  "premium:claim": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "original",
        "Do you have the original winning bond, signed twice on the back?",
        "Original winning bond (signed twice)",
        "Bring the original certificate and sign twice on the back before your visit."
      ),
      yesNoQ(
        "holder",
        "Is the bond registered in your name as the holder?",
        "Registered holder / authorization",
        "Prize claims can only be paid to the registered holder or an authorized representative."
      ),
      yesNoQ(
        "amc",
        "Do you have an Account Maintenance Certificate (AMC) or registered IBAN details?",
        "AMC / registered IBAN details",
        "Request an AMC from your bank, or confirm your registered IBAN details, before your visit."
      ),
      BANK_TYPE_QUESTION(true),
    ],
  },
  "premium:transfer": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "bothCnic",
        "Do both the transferor and transferee have valid, unexpired CNICs ready?",
        "Both parties' valid CNIC copies",
        "Both parties need to bring their original, unexpired CNIC plus a photocopy."
      ),
      yesNoQ(
        "deed",
        "Do you have a completed Transfer Deed / Application, signed by both parties?",
        "Signed Transfer Deed / Application",
        "Collect the Transfer Deed from Counter 3 and have both parties complete and sign it."
      ),
      yesNoQ(
        "amc",
        "Does the transferee have an AMC from a conventional bank account?",
        "Transferee's AMC (conventional bank)",
        "The transferee should open or confirm a conventional bank account and request an AMC."
      ),
    ],
  },
  "premium:purchase": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "amc",
        "Do you have an Account Maintenance Certificate (AMC) from a conventional bank?",
        "AMC (conventional bank)",
        "Request an AMC from your bank branch before your visit."
      ),
      PAYMENT_METHOD_QUESTION,
    ],
  },
  "national:claim": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "original",
        "Do you have the original winning National Prize Bond with you?",
        "Original winning bond",
        "Bring the physical bond certificate with you — National Prize Bonds are bearer instruments, so keep it secure."
      ),
      {
        id: "payoutMethod",
        label: "How would you like to receive the prize money?",
        type: "choice",
        options: ["Cheque (bank credit)", "Cash", "EasyPaisa (Islamic bank account)"],
        required: true,
        isBlocking: () => false,
        infoNote: (a) =>
          a === "Cheque (bank credit)"
            ? "You'll need a registered IBAN and an ID card copy for a cheque-based bank credit."
            : a === "EasyPaisa (Islamic bank account)"
            ? "Islamic bank account holders are paid via EasyPaisa or cash instead of a direct bank credit."
            : "Cash payments are processed immediately at the counter.",
      },
    ],
  },
  "national:damaged": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "damaged",
        "Is the bond number and denomination still clearly identifiable on the damaged bond?",
        "Identifiable bond number / denomination",
        "If the number or denomination can't be read at all, exchange may not be possible — check with the counter staff first."
      ),
    ],
  },
  "national:encashment": {
    questions: [
      CNIC_QUESTION,
      yesNoQ(
        "original",
        "Do you have the original National Prize Bond certificate(s)?",
        "Original bond certificate(s)",
        "Bring the physical bond certificate(s) with you — they are bearer instruments, so keep them secure."
      ),
      {
        id: "payoutMethod",
        label: "How would you like to receive the encashment amount?",
        type: "choice",
        options: ["Cheque (bank credit)", "Cash", "EasyPaisa (Islamic bank account)"],
        required: true,
        isBlocking: () => false,
        infoNote: (a) =>
          a === "Cheque (bank credit)"
            ? "You'll need a registered IBAN and an ID card copy for a cheque-based bank credit."
            : a === "EasyPaisa (Islamic bank account)"
            ? "Islamic bank account holders are paid via EasyPaisa or cash instead of a direct bank credit."
            : "Cash payments are processed immediately at the counter.",
      },
    ],
  },
  "national:purchase": {
    questions: [
      {
        id: "cnic",
        label: "Do you have your CNIC with you (recommended for record-keeping)?",
        type: "yesno",
        required: false,
        missingLabel: "CNIC for record-keeping",
        missingNote: "Not strictly required for small purchases, but branches may ask for it on larger amounts.",
      },
      PAYMENT_METHOD_QUESTION,
    ],
  },
};

function computeReadiness(config, answers) {
  const missing = [];
  const infoNotes = [];
  let allAnswered = true;

  config.questions.forEach((q) => {
    const a = answers[q.id];
    if (a === undefined) {
      if (q.required) {
        allAnswered = false;
        missing.push({ label: q.label, note: "Please answer this question.", unanswered: true });
      }
      return;
    }
    if (q.type === "yesno") {
      if (q.required && a !== "yes") {
        missing.push({ label: q.missingLabel, note: q.missingNote });
      }
    } else if (q.type === "choice") {
      if (q.isBlocking && q.isBlocking(a)) {
        missing.push({ label: q.missingLabel, note: q.missingNote });
      } else if (q.infoNote) {
        const note = q.infoNote(a);
        if (note) infoNotes.push(note);
      }
    }
  });

  return { missing, infoNotes, allAnswered, isReady: missing.length === 0 && allAnswered };
}

// -- Journey progress bar -------------------------------------------

const JOURNEY_STAGES = ["Confirm", "Readiness Check", "Counter Journey", "Visit Pack"];

function JourneyProgressBar({ currentIndex }) {
  const t = useT();
  return (
    <div className="flex items-center mb-10">
      {JOURNEY_STAGES.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div
              className={
                "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-colors " +
                (i < currentIndex
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : i === currentIndex
                  ? "border-emerald-600 text-emerald-700 bg-white"
                  : "border-slate-300 text-slate-400 bg-white")
              }
            >
              {i < currentIndex ? <CheckCircle2 className="w-4.5 h-4.5" /> : i + 1}
            </div>
            <span
              className={
                "text-[11px] mt-1.5 text-center w-20 leading-tight " +
                (i <= currentIndex ? "text-emerald-800 font-medium" : "text-slate-400")
              }
            >
              {t(label)}
            </span>
          </div>
          {i < JOURNEY_STAGES.length - 1 && (
            <div className={"flex-1 h-0.5 mx-1 mb-5 rounded-full " + (i < currentIndex ? "bg-emerald-600" : "bg-slate-200")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// -- Stage 1: Confirm --------------------------------------------------

function JourneyConfirmStage({ item, categoryLabel, onStart, onViewStatic }) {
  const t = useT();
  const Icon = item.icon;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-lg bg-[#0b5d3b] text-white flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700">{t("You selected")}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0b3b26]">
            {t(categoryLabel)} <span className="text-slate-400 mx-1">→</span> {t(item.title)}
          </h1>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{t(item.intro)}</p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6">
        <p className="flex items-center gap-2 font-semibold text-emerald-900 text-sm mb-3">
          <ListChecks className="w-4.5 h-4.5" /> {t("Here's what this guided journey will do")}
        </p>
        <ul className="space-y-2 text-sm text-emerald-900">
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {t("Ask a few quick readiness questions about your documents")}</li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {t("Tell you exactly what's missing before you travel to a branch")}</li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {t("Walk you through the exact counters to visit, in order")}</li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {t("Generate a Visit Pack summary you can bring with you")}</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded-lg px-5 py-2.5 text-sm"
        >
          <PlayCircle className="w-4.5 h-4.5" /> {t("Start guided journey")}
        </button>
        <button
          onClick={onViewStatic}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0b5d3b] border border-slate-200 hover:border-emerald-300 rounded-lg px-5 py-2.5 transition-colors"
        >
          <FileText className="w-4 h-4" /> {t("View static reference page instead")}
        </button>
      </div>
    </div>
  );
}

// -- Stage 2: Readiness --------------------------------------------------

function ReadinessQuestion({ q, value, onChange }) {
  const t = useT();
  return (
    <div className="border border-slate-200 rounded-xl p-4 sm:p-5">
      <p className="text-sm font-medium text-[#0b3b26] mb-3">{t(q.label)}</p>
      {q.type === "yesno" ? (
        <div className="flex gap-3">
          {["yes", "no"].map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={
                "flex-1 text-sm font-medium rounded-lg py-2.5 border-2 transition-colors capitalize " +
                (value === opt
                  ? opt === "yes"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-amber-500 bg-amber-50 text-amber-800"
                  : "border-slate-200 text-slate-500 hover:border-slate-300")
              }
            >
              {t(opt)}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={
                "text-sm font-medium rounded-full px-4 py-2 border-2 transition-colors " +
                (value === opt ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-500 hover:border-slate-300")
              }
            >
              {t(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ReadinessSummaryCard({ readiness }) {
  const t = useT();
  const { missing, isReady, allAnswered } = readiness;

  if (!allAnswered) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <p className="flex items-center gap-2 font-semibold text-slate-600 text-sm">
          <Info className="w-4.5 h-4.5" /> {t("Answer all questions to see your readiness check")}
        </p>
      </div>
    );
  }

  if (isReady) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5">
        <p className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-1.5">
          <CheckCircle2 className="w-5 h-5" /> {t("You are ready")}
        </p>
        <p className="text-sm text-emerald-800 leading-relaxed">
          {t("Based on your answers, you have everything you need. Continue to see your exact counter journey.")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
      <p className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-3">
        <AlertCircle className="w-5 h-5" /> {t("Missing items")} ({missing.length})
      </p>
      <ul className="space-y-3">
        {missing.map((m, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-amber-900">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold">{t(m.label)}.</span> {!m.unanswered && <span className="text-amber-800/90">{t(m.note)}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JourneyReadinessStage({ config, answers, onAnswer, onBack, onContinue }) {
  const t = useT();
  const readiness = useMemo(() => computeReadiness(config, answers), [config, answers]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="flex items-center gap-2 font-semibold text-[#0b3b26] text-lg mb-1.5">
        <ListChecks className="w-5 h-5 text-emerald-700" /> {t("Readiness check")}
      </h2>
      <p className="text-sm text-slate-500 mb-6">{t("Answer a few quick questions so we can tell you exactly what to bring.")}</p>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {config.questions.map((q) => (
            <ReadinessQuestion key={q.id} q={q} value={answers[q.id]} onChange={(v) => onAnswer(q.id, v)} />
          ))}
        </div>
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <ReadinessSummaryCard readiness={readiness} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0b5d3b] transition-colors">
          <ChevronLeft className="w-4 h-4" /> {t("Back")}
        </button>
        <button
          onClick={() => onContinue(readiness)}
          disabled={!readiness.allAnswered}
          className={
            "inline-flex items-center gap-2 font-medium rounded-lg px-5 py-2.5 text-sm transition-colors " +
            (readiness.allAnswered
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-400 cursor-not-allowed")
          }
        >
          {t("Continue to counter journey")} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// -- Stage 3: Counter journey --------------------------------------------

function CounterJourneyStage({ item, doneSteps, onToggleStep, onBack, onContinue }) {
  const t = useT();
  const completedCount = item.flow.filter((_, i) => doneSteps[i]).length;
  const pct = Math.round((completedCount / item.flow.length) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
        <h2 className="flex items-center gap-2 font-semibold text-[#0b3b26] text-lg">
          <ScrollText className="w-5 h-5 text-emerald-700" /> {t("Your counter journey")}
        </h2>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
          {completedCount} / {item.flow.length} {t("counters")}
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        {t("Follow these counters in order. Tap \"Mark as done\" as you complete each one during your visit.")}
      </p>

      <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-emerald-600 transition-all duration-300 rounded-full" style={{ width: pct + "%" }} />
      </div>

      <div>
        {item.flow.map((s, i) => (
          <WorkflowStep
            key={i}
            step={s}
            index={i}
            isLast={i === item.flow.length - 1}
            done={!!doneSteps[i]}
            onToggleDone={() => onToggleStep(i)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-6 border-t border-slate-100">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0b5d3b] transition-colors">
          <ChevronLeft className="w-4 h-4" /> {t("Back to readiness check")}
        </button>
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded-lg px-5 py-2.5 text-sm"
        >
          {t("Continue to visit pack")} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// -- Stage 4: Visit pack summary -----------------------------------------

function VisitPackStage({ item, categoryLabel, readiness, onRestart, onViewStatic, onHome }) {
  const t = useT();
  const warnings = [...item.notes, ...readiness.infoNotes];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-lg bg-[#0b5d3b] text-white flex items-center justify-center shrink-0">
          <PackageCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-700">{t("Your visit pack")}</p>
          <h2 className="text-xl font-bold text-[#0b3b26]">
            {t(categoryLabel)} — {t(item.title)}
          </h2>
        </div>
      </div>

      <div
        className={
          "flex items-center gap-2.5 rounded-xl p-4 my-6 border-2 " +
          (readiness.isReady ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-amber-50 border-amber-300 text-amber-900")
        }
      >
        {readiness.isReady ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
        <p className="text-sm font-medium">
          {readiness.isReady
            ? t("Readiness check passed — you're set to visit an SBP-BSC field office.")
            : `${readiness.missing.length} ${t("item(s) still need attention before your visit — see below.")}`}
        </p>
      </div>

      {!readiness.isReady && (
        <div className="mb-6">
          <h3 className="font-semibold text-[#0b3b26] text-sm mb-3">{t("Still needed")}</h3>
          <ul className="space-y-2">
            {readiness.missing.map((m, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><span className="font-semibold">{t(m.label)}.</span> {!m.unanswered && t(m.note)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-[#0b3b26] text-sm mb-3">
            <FileText className="w-4 h-4 text-emerald-700" /> {t("Documents to bring")}
          </h3>
          <ul className="space-y-2">
            {item.documents.map((d, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{t(d)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-semibold text-[#0b3b26] text-sm mb-3">
            <ScrollText className="w-4 h-4 text-emerald-700" /> {t("Counter sequence")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {item.flow.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full px-3 py-1.5">
                {t(s.counter)}
                {i < item.flow.length - 1 && <ChevronRight className="w-3 h-3 text-emerald-400" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h3 className="flex items-center gap-2 font-semibold text-amber-900 text-sm mb-3">
            <Info className="w-4.5 h-4.5" /> {t("Good to know")}
          </h3>
          <ul className="space-y-2">
            {warnings.map((w, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-amber-900">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t(w)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded-lg px-5 py-2.5 text-sm"
        >
          <RotateCcw className="w-4 h-4" /> {t("Start another journey")}
        </button>
        <button
          onClick={onViewStatic}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0b5d3b] border border-slate-200 hover:border-emerald-300 rounded-lg px-5 py-2.5 transition-colors"
        >
          <FileText className="w-4 h-4" /> {t("View full details page")}
        </button>
        <button
          onClick={onHome}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0b5d3b] px-5 py-2.5 transition-colors"
        >
          {t("Back to home")}
        </button>
      </div>
    </div>
  );
}

// -- Orchestrator ---------------------------------------------------------

function CustomerJourney({ category, item, breadcrumb, go, onRestart }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [doneSteps, setDoneSteps] = useState({});
  const [finalReadiness, setFinalReadiness] = useState(null);

  if (!item) return null;

  const categoryLabel = category === "premium" ? "Premium Prize Bond" : "National Prize Bond";
  const configKey = category + ":" + item.key;
  const config = JOURNEY_CONFIG[configKey] || { questions: [] };

  const staticPage = category === "premium" ? "premium-detail" : "national-detail";

  const handleAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleToggleStep = (i) => setDoneSteps((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={breadcrumb} onNavigate={go} />
      <JourneyProgressBar currentIndex={stageIndex} />

      {stageIndex === 0 && (
        <JourneyConfirmStage
          item={item}
          categoryLabel={categoryLabel}
          onStart={() => setStageIndex(1)}
          onViewStatic={() => go(staticPage, item.key)}
        />
      )}

      {stageIndex === 1 && (
        <JourneyReadinessStage
          config={config}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={() => setStageIndex(0)}
          onContinue={(readiness) => {
            setFinalReadiness(readiness);
            setStageIndex(2);
          }}
        />
      )}

      {stageIndex === 2 && (
        <CounterJourneyStage
          item={item}
          doneSteps={doneSteps}
          onToggleStep={handleToggleStep}
          onBack={() => setStageIndex(1)}
          onContinue={() => setStageIndex(3)}
        />
      )}

      {stageIndex === 3 && (
        <VisitPackStage
          item={item}
          categoryLabel={categoryLabel}
          readiness={finalReadiness || computeReadiness(config, answers)}
          onRestart={onRestart}
          onViewStatic={() => go(staticPage, item.key)}
          onHome={() => go("home")}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FORMS PAGE                                                          */
/* ------------------------------------------------------------------ */

function FormsPage({ breadcrumb, go }) {
  const t = useT();
  const [notice, setNotice] = useState(null);
  const timerRef = useRef(null);

  const handleDownload = (form) => {
    // Trigger a real browser download of the PDF served from /public/forms.
    const a = document.createElement("a");
    a.href = form.file;
    a.download = form.file.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setNotice(form.code);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={breadcrumb} onNavigate={go} />
      <SectionHeading title="Download Forms" subtitle="Standard forms used across Premium and National Prize Bond services." />

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
        {FORMS.map((f) => {
          const Icon = f.icon || FileText;
          return (
            <div key={f.code} className="flex items-center justify-between gap-4 p-4 sm:p-5">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0b5d3b] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#0b3b26] text-sm truncate">{t(f.title)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t("Form")} {f.code} · {t(f.tag)}</p>
                </div>
              </div>
              <a
                href={f.file}
                download
                onClick={() => handleDownload(f)}
                className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50 rounded-lg px-3.5 py-2 transition-colors"
              >
                <FileText className="w-4 h-4" /> {t("Download")}
              </a>
            </div>
          );
        })}
      </div>

      {notice && (
        <div className="mt-5 flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm rounded-lg p-4">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{t("Your download has started. If it doesn't, check your browser's download settings.")}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GUIDANCE PAGE                                                       */
/* ------------------------------------------------------------------ */

function GuidancePage({ breadcrumb, go }) {
  const t = useT();
  const counters = [
    { c: "Token", t: "Take a number to start your visit." },
    { c: "Counter 3", t: "Collect and fill your service form." },
    { c: "Counter 18 / 19", t: "KYC — CNIC and form verification." },
    { c: "Counter 20 / 21", t: "Registration (Premium bonds only)." },
    { c: "Counter 22 / 23", t: "Cheque submission & receipt." },
    { c: "Counter 26 / 27", t: "Premium Bond services — input & authorization." },
    { c: "Counter 30 / 31", t: "National Bond services." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={breadcrumb} onNavigate={go} />
      <SectionHeading
        title="Office Guidance"
        subtitle="What to expect and what to bring when visiting an SBP-BSC field office for prize bond services."
      />

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-10">
        <h2 className="flex items-center gap-2 font-semibold text-[#0b3b26] mb-5">
          <Building2 className="w-4.5 h-4.5 text-emerald-700" /> {t("The counter flow, end to end")}
        </h2>
        <div className="flex flex-wrap gap-3">
          {counters.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5">
                <p className="text-xs font-bold text-[#0b5d3b]">{t(c.c)}</p>
                <p className="text-xs text-slate-600 mt-0.5 max-w-[9rem]">{t(c.t)}</p>
              </div>
              {i < counters.length - 1 && <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          {t("Note: National Prize Bonds are bearer instruments and skip the Registration counter entirely.")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-[#0b3b26] mb-4">
            <Clock className="w-4.5 h-4.5 text-emerald-700" /> {t("Before you visit")}
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("Visit between 9:00 AM – 1:30 PM, Monday to Friday, for counter services.")}</li>
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("Carry your original CNIC / NICOP — it must not be expired, and photocopies alone are not accepted.")}</li>
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("If your CNIC renewal is in progress, bring the NADRA token/acknowledgment receipt as proof.")}</li>
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("Bring original bond certificates, signed twice on the back if they're Premium bonds.")}</li>
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("Have your Account Maintenance Certificate and IBAN ready for any fund transfer.")}</li>
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-[#0b3b26] mb-4">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" /> {t("Good to know")}
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("A separate application form is required for each individual bond denomination.")}</li>
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("Premium Prize Bond accounts must be held with a conventional (non-Islamic) bank.")}</li>
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("If your account is with an Islamic bank, cheque credits are instead paid via EasyPaisa or cash.")}</li>
            <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{t("Cheque payments need 1 working day to clear; cash payments are processed immediately.")}</li>
          </ul>
        </div>
      </div>

      <h2 className="font-semibold text-[#0b3b26] text-lg mb-4">{t("Field offices")}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {FIELD_OFFICES.map((o) => (
          <div key={o.city} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <p className="font-semibold text-[#0b3b26] text-sm">{o.city}</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">{o.address}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> {o.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAX CALCULATOR                                                      */
/* ------------------------------------------------------------------ */

function StepDots({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={"h-1.5 rounded-full transition-all " + (i + 1 <= step ? "bg-emerald-600 w-8" : "bg-slate-200 w-8")} />
      ))}
    </div>
  );
}

function ChoiceButton({ selected, onClick, children, sub }) {
  const t = useT();
  return (
    <button
      onClick={onClick}
      className={
        "w-full text-left rounded-xl border-2 p-5 transition-all " +
        (selected ? "border-emerald-600 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40")
      }
    >
      <p className="font-semibold text-[#0b3b26]">{children}</p>
      {sub && <p className="text-sm text-slate-500 mt-1">{t(sub)}</p>}
    </button>
  );
}

function TaxCalculator({ breadcrumb, go }) {
  const t = useT();
  const [step, setStep] = useState(1);
  const [bondType, setBondType] = useState(null);
  const [denom, setDenom] = useState(null);
  const [filer, setFiler] = useState(null);
  const [tier, setTier] = useState(null);

  const prizeTable = bondType === "national" ? NATIONAL_PRIZES : PREMIUM_PRIZES;
  const denomOptions = bondType === "national" ? [100, 200, 750, 1500] : [25000, 40000];
  const tiers = denom ? prizeTable[denom] : null;

  const result = useMemo(() => {
    if (!bondType || !denom || !filer || !tier || !tiers) return null;
    const gross = tiers[tier].amount;
    const rate = filer === "filer" ? 0.15 : 0.3;
    const tax = Math.round(gross * rate);
    const net = gross - tax;
    return { gross, rate, tax, net };
  }, [bondType, denom, filer, tier, tiers]);

  const reset = useCallback(() => {
    setStep(1);
    setBondType(null);
    setDenom(null);
    setFiler(null);
    setTier(null);
  }, []);

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={breadcrumb} onNavigate={go} />
      <SectionHeading eyebrow="Interactive tool" title="Prize Bond Tax Calculator" subtitle="Estimate the withholding tax on your prize money in a few quick steps." />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <StepDots step={Math.min(step, 5)} total={5} />

        {step === 1 && (
          <div>
            <h2 className="font-semibold text-[#0b3b26] mb-1">{t("Which bond did you win?")}</h2>
            <p className="text-sm text-slate-500 mb-5">{t("Select the category of your prize bond.")}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <ChoiceButton selected={bondType === "national"} onClick={() => { setBondType("national"); setDenom(null); setStep(2); }} sub="Bearer bonds · Rs. 100 to Rs. 1,500">
                {t("National Prize Bond")}
              </ChoiceButton>
              <ChoiceButton selected={bondType === "premium"} onClick={() => { setBondType("premium"); setDenom(null); setStep(2); }} sub="Registered bonds · Rs. 25,000 or Rs. 40,000">
                {t("Premium Prize Bond")}
              </ChoiceButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold text-[#0b3b26] mb-1">{t("Select the denomination")}</h2>
            <p className="text-sm text-slate-500 mb-5">{t("Face value printed on your bond.")}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {denomOptions.map((d) => (
                <ChoiceButton key={d} selected={denom === d} onClick={() => { setDenom(d); setStep(3); }}>
                  {pkr(d)}
                </ChoiceButton>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-semibold text-[#0b3b26] mb-1">{t("Are you a Filer or Non-Filer?")}</h2>
            <p className="text-sm text-slate-500 mb-5">{t("This determines the withholding tax rate under Section 156 of the Income Tax Ordinance.")}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <ChoiceButton selected={filer === "filer"} onClick={() => { setFiler("filer"); setStep(4); }} sub="Tax rate: 15%">{t("Filer")}</ChoiceButton>
              <ChoiceButton selected={filer === "nonfiler"} onClick={() => { setFiler("nonfiler"); setStep(4); }} sub="Tax rate: 30%">{t("Non-Filer")}</ChoiceButton>
            </div>
          </div>
        )}

        {step === 4 && tiers && (
          <div>
            <h2 className="font-semibold text-[#0b3b26] mb-1">{t("Which prize did you win?")}</h2>
            <p className="text-sm text-slate-500 mb-5">
              {t("Prize tiers")}: {t(bondType === "national" ? "National Prize Bond" : "Premium Prize Bond")} · {pkr(denom)}
            </p>
            <div className="grid gap-4">
              {["first", "second", "third"].map((tk) => (
                <ChoiceButton
                  key={tk}
                  selected={tier === tk}
                  onClick={() => { setTier(tk); setStep(5); }}
                  sub={`${tiers[tk].count.toLocaleString("en-US")} ${t("winner(s) per draw")}`}
                >
                  {t(TIER_LABEL[tk])} — {pkr(tiers[tk].amount)}
                </ChoiceButton>
              ))}
            </div>
          </div>
        )}

        {step === 5 && result && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <BadgeCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-[#0b3b26]">{t("Your estimated payout")}</h2>
            </div>

            <div style={{ background: BRAND.deep }} className="text-white rounded-xl p-6 mb-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-1">
                    {t(bondType === "national" ? "National Prize Bond" : "Premium Prize Bond")}
                  </p>
                  <p className="text-lg font-semibold">{pkr(denom)} · {t(TIER_LABEL[tier])}</p>
                </div>
                <Wallet className="w-6 h-6 text-emerald-300 shrink-0" />
              </div>

              <div className="h-px bg-white/15 mb-5" />

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-emerald-100">{t("Gross prize amount")}</dt>
                  <dd className="font-medium">{pkr(result.gross)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-emerald-100 flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> {t("Tax rate")} ({t(filer === "filer" ? "Filer" : "Non-Filer")})</dt>
                  <dd className="font-medium">{Math.round(result.rate * 100)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-emerald-100 flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> {t("Tax deducted")}</dt>
                  <dd className="font-medium text-red-300">− {pkr(result.tax)}</dd>
                </div>
              </dl>

              <div className="h-px bg-white/15 my-5" />

              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wide">{t("Net amount payable")}</span>
                <span className="text-2xl font-bold">{pkr(result.net)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg p-4 mb-6">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t("Tax is deducted at source under Section 156 of the Income Tax Ordinance, 2001, before payment of prize money on winning prize bonds.")}</span>
            </div>

            <button onClick={reset} className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded-lg py-3 text-sm">
              <RefreshCw className="w-4 h-4" /> {t("Calculate another prize")}
            </button>
          </div>
        )}

        {step > 1 && step <= 4 && (
          <button onClick={goBack} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0b5d3b] transition-colors">
            <ChevronLeft className="w-4 h-4" /> {t("Back")}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
        {t("This calculator is for informational purposes only. Actual tax deduction is done by the State Bank / National Savings according to current FBR rules.")}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MINI CHARTS (no external chart library required)                   */
/* ------------------------------------------------------------------ */

function LineChartMini({ data }) {
  const w = 560, h = 220, pad = 30;
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const stepX = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.value / max) * (h - pad * 2);
    return { x, y, ...d };
  });
  const linePath = points.map((p, i) => (i === 0 ? "M" : "L") + p.x + " " + p.y).join(" ");
  const areaPath = linePath + ` L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={h - pad - f * (h - pad * 2)} y2={h - pad - f * (h - pad * 2)} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      <path d={areaPath} fill="#0f8a52" opacity="0.1" />
      <path d={linePath} fill="none" stroke="#0f8a52" strokeWidth="2.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0f8a52" stroke="white" strokeWidth="1.5" />
      ))}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={h - 8} textAnchor="middle" fontSize="11" fill="#64748b">{p.label}</text>
      ))}
    </svg>
  );
}

function BarChartMini({ data }) {
  const w = 560, h = 220, pad = 30;
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const bw = (w - pad * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={h - pad - f * (h - pad * 2)} y2={h - pad - f * (h - pad * 2)} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const barH = (d.value / max) * (h - pad * 2);
        const x = pad + i * bw + bw * 0.2;
        const y = h - pad - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw * 0.6} height={barH} fill="#0f8a52" rx="3" />
            <text x={x + bw * 0.3} y={h - 8} textAnchor="middle" fontSize="11" fill="#64748b">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  STAFF: LOGIN + DASHBOARD                                            */
/* ------------------------------------------------------------------ */

function StaffLogin({ onLogin, breadcrumb, go }) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === "staff@sbp.pk" && password === "123456") {
      setError("");
      onLogin();
    } else {
      setError("Invalid email or password. Try staff@sbp.pk / 123456 for this demo.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <Breadcrumb items={breadcrumb} onNavigate={go} />
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="w-12 h-12 rounded-xl bg-[#0b5d3b] text-white flex items-center justify-center mb-5">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-[#0b3b26] mb-1">{t("Staff Login")}</h1>
        <p className="text-sm text-slate-500 mb-6">{t("Sign in to view the complaints & feedback dashboard.")}</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("Email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@sbp.pk"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("Password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t(error)}</span>
            </div>
          )}

          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded-lg py-2.5 text-sm">
            <LogIn className="w-4 h-4" /> {t("Login")}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-5">{t("Demo credentials: staff@sbp.pk / 123456")}</p>
      </div>
    </div>
  );
}

function DashboardStatCard({ s }) {
  const t = useT();
  const Icon = s.icon;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-slate-500">{t(s.label)}</p>
        {Icon && (
          <span className={"w-7 h-7 rounded-lg flex items-center justify-center shrink-0 " + (s.chip || "bg-slate-100 text-slate-500")}>
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
      <p className={"text-2xl font-bold flex items-center gap-1.5 " + s.tone}>
        {s.value}
        {s.star && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
      </p>
    </div>
  );
}

const COMPLAINT_STATUSES = ["All", "Pending", "In Progress", "Resolved"];

function AdminDashboard({ onLogout, breadcrumb, go }) {
  const t = useT();
  const [complaintSearch, setComplaintSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredComplaints = SEED_COMPLAINTS.filter((c) => {
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesSearch = (c.id + c.name + c.email + c.phone + c.complaint)
      .toLowerCase()
      .includes(complaintSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const filteredReviews = SEED_REVIEWS.filter((r) =>
    (r.id + r.name + r.email + r.comment).toLowerCase().includes(reviewSearch.toLowerCase())
  );

  const statusStyle = {
    Pending: "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Resolved: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={breadcrumb} onNavigate={go} />
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[#0b5d3b] text-white flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-[#0b3b26]">{t("Admin Dashboard")}</h1>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-lg px-3.5 py-2 transition-colors"
        >
          <LogOut className="w-4 h-4" /> {t("Log out")}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {DASHBOARD_STATS.map((s) => <DashboardStatCard key={s.label} s={s} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-[#0b3b26] mb-4">{t("Complaints Over Time")}</h2>
          <LineChartMini data={COMPLAINTS_OVER_TIME} />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-[#0b3b26] mb-4">{t("Rating Distribution")}</h2>
          <BarChartMini data={RATING_DISTRIBUTION} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center justify-between gap-3 flex-wrap p-5 pb-0">
          <h2 className="font-semibold text-[#0b3b26]">
            {t("Recent Complaints")}{" "}
            <span className="text-xs font-normal text-slate-400">({filteredComplaints.length} {t("results")})</span>
          </h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={complaintSearch}
              onChange={(e) => setComplaintSearch(e.target.value)}
              placeholder={t("Search complaints...")}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-5 pt-3">
          {COMPLAINT_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={
                "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors " +
                (statusFilter === s
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-700")
              }
            >
              {t(s)}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-2 pr-4 font-medium">{t("ID")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Name")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Email")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Phone")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Complaint")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Status")}</th>
                <th className="pb-2 font-medium">{t("Date")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs text-emerald-700 whitespace-nowrap">{c.id}</td>
                  <td className="py-2.5 pr-4 font-medium text-[#0b3b26] whitespace-nowrap">{c.name}</td>
                  <td className="py-2.5 pr-4 text-slate-600 whitespace-nowrap">{c.email}</td>
                  <td className="py-2.5 pr-4 text-slate-600 whitespace-nowrap">{c.phone}</td>
                  <td className="py-2.5 pr-4 text-slate-600 min-w-[14rem]">{c.complaint}</td>
                  <td className="py-2.5 pr-4">
                    <span className={"text-xs font-medium px-2 py-1 rounded-full " + statusStyle[c.status]}>{t(c.status)}</span>
                  </td>
                  <td className="py-2.5 text-slate-500 whitespace-nowrap">{c.date}</td>
                </tr>
              ))}
              {filteredComplaints.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-slate-400">{t("No complaints match your search.")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 flex-wrap p-5 pb-0">
          <h2 className="font-semibold text-[#0b3b26]">
            {t("Recent Reviews")}{" "}
            <span className="text-xs font-normal text-slate-400">({filteredReviews.length} {t("results")})</span>
          </h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              placeholder={t("Search reviews...")}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
            />
          </div>
        </div>
        <div className="overflow-x-auto p-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="pb-2 pr-4 font-medium">{t("ID")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Name")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Email")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Rating")}</th>
                <th className="pb-2 pr-4 font-medium">{t("Comment")}</th>
                <th className="pb-2 font-medium">{t("Date")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs text-emerald-700 whitespace-nowrap">{r.id}</td>
                  <td className="py-2.5 pr-4 font-medium text-[#0b3b26] whitespace-nowrap">{r.name}</td>
                  <td className="py-2.5 pr-4 text-slate-600 whitespace-nowrap">{r.email}</td>
                  <td className="py-2.5 pr-4"><Stars value={r.rating} /></td>
                  <td className="py-2.5 pr-4 text-slate-600 min-w-[14rem]">{r.comment}</td>
                  <td className="py-2.5 text-slate-500 whitespace-nowrap">{r.date}</td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-slate-400">{t("No reviews match your search.")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StaffPage({ go, breadcrumb, isStaffLoggedIn, setIsStaffLoggedIn }) {
  if (isStaffLoggedIn) {
    return <AdminDashboard onLogout={() => setIsStaffLoggedIn(false)} breadcrumb={breadcrumb} go={go} />;
  }
  return <StaffLogin onLogin={() => setIsStaffLoggedIn(true)} breadcrumb={breadcrumb} go={go} />;
}

/* ------------------------------------------------------------------ */
/*  COMPLAIN & FEEDBACK                                                 */
/* ------------------------------------------------------------------ */

function TextField({ label, type = "text", value, onChange, placeholder, textarea, rows = 4 }) {
  const t = useT();
  const common = "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t(label)}</label>
      {textarea ? (
        <textarea value={value} onChange={onChange} placeholder={t(placeholder)} rows={rows} className={common + " resize-y"} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={t(placeholder)} className={common} />
      )}
    </div>
  );
}

function StarInput({ label, value, onChange }) {
  const t = useT();
  const [hover, setHover] = useState(0);
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t(label)}</label>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5"
            aria-label={`${i} star`}
          >
            <Star className={"w-6 h-6 transition-colors " + ((hover || value) >= i ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ComplaintForm() {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", phone: "", complaint: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#0b3b26] mb-1">{t("Complaint submitted")}</h2>
        <p className="text-sm text-slate-500 mb-5">
          {t("Thanks")}{form.name ? ", " + form.name : ""} — {t("our team will follow up by email or phone.")}
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", complaint: "" }); }}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          {t("Submit another complaint")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-lg font-bold text-emerald-700 mb-6">{t("Submit a Complaint")}</h2>
      <form onSubmit={submit} className="space-y-5">
        <TextField label="Full Name" placeholder="e.g. Ahmed Khan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField label="Phone Number" placeholder="03xx-xxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <TextField label="Complaint" textarea placeholder="Describe your issue in detail" value={form.complaint} onChange={(e) => setForm({ ...form, complaint: e.target.value })} />
        <button type="submit" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded-lg px-5 py-2.5 text-sm">
          {t("Submit Complaint")}
        </button>
      </form>
    </div>
  );
}

function ReviewForm() {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", service: 0, response: 0, overall: 0, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#0b3b26] mb-1">{t("Review submitted")}</h2>
        <p className="text-sm text-slate-500 mb-5">{t("Thanks for your feedback")}{form.name ? ", " + form.name : ""}!</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", service: 0, response: 0, overall: 0, comment: "" }); }}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          {t("Leave another review")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-lg font-bold text-emerald-700 mb-6">{t("Leave a Review")}</h2>
      <form onSubmit={submit} className="space-y-5">
        <TextField label="Full Name" placeholder="e.g. Ahmed Khan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <StarInput label="Service Quality" value={form.service} onChange={(v) => setForm({ ...form, service: v })} />
        <StarInput label="Response Time" value={form.response} onChange={(v) => setForm({ ...form, response: v })} />
        <StarInput label="Overall Experience" value={form.overall} onChange={(v) => setForm({ ...form, overall: v })} />
        <TextField label="Comment (optional)" textarea rows={3} placeholder="Tell us more about your experience" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <button type="submit" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-medium rounded-lg px-5 py-2.5 text-sm">
          {t("Submit Review")}
        </button>
      </form>
    </div>
  );
}

function FeedbackPage({ breadcrumb, go }) {
  const t = useT();
  const [mode, setMode] = useState(null); // null | 'complaint' | 'review'

  if (mode === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <Breadcrumb items={breadcrumb} onNavigate={go} />
        <SectionHeading title="Complain & Feedback" subtitle="Tell us what happened, or share how your visit went." />
        <div className="grid sm:grid-cols-2 gap-5">
          <OptionCard icon={AlertCircle} title="Submit a Complaint" summary="Report an issue with a service, request, or counter visit." onClick={() => setMode("complaint")} />
          <OptionCard icon={Star} title="Leave a Review / Feedback" summary="Rate your experience and help us improve." onClick={() => setMode("review")} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-14">
      <Breadcrumb items={[...breadcrumb, { label: mode === "complaint" ? "Submit a Complaint" : "Leave a Review" }]} onNavigate={go} />
      <button onClick={() => setMode(null)} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0b5d3b] hover:text-emerald-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("Back to options")}
      </button>
      {mode === "complaint" ? <ComplaintForm /> : <ReviewForm />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CHATBOT (floating placeholder)                                     */
/* ------------------------------------------------------------------ */

// Suggested starter questions shown on the empty chat state.
const CHAT_SUGGESTIONS = [
  "How do I encash a National Prize Bond?",
  "What tax applies to prize money?",
  "Which documents are needed to claim prize money?",
];

function ChatMessage({ msg, t }) {
  const isUser = msg.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#0b5d3b] text-white text-sm px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap">
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="w-4 h-4" />
      </div>
      <div className="max-w-[85%]">
        <div
          className={
            "rounded-2xl rounded-tl-sm text-sm px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap " +
            (msg.error ? "bg-red-50 text-red-700 border border-red-200" : "bg-slate-100 text-slate-800")
          }
        >
          {msg.content}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <FileText className="w-3 h-3" /> {t("Sources")}:
            </span>
            {msg.sources.map((s, i) => (
              <span key={i} className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-2 py-0.5">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatbotWidget() {
  const t = useT();
  const { dir } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

  // Auto-scroll to the newest message.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = useCallback(
    async (text) => {
      const question = (text ?? input).trim();
      if (!question || loading) return;
      setInput("");
      setMessages((m) => [...m, { role: "user", content: question }]);
      setLoading(true);
      try {
        const res = await fetch(chatApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
        });
        if (!res.ok) throw new Error("bad status " + res.status);
        const data = await res.json();
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.answer || "…", sources: data.sources || [] },
        ]);
      } catch (e) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            error: true,
            content: t("The assistant is offline right now. Please make sure the bot server is running, then try again."),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, t]
  );

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label={t("Open chatbot")}
        className={
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 " +
          (open ? "opacity-0 pointer-events-none scale-90" : "opacity-100")
        }
        style={{ background: BRAND.accent }}
      >
        <MessageCircleMore className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      />

      {/* Slide-in chat side panel */}
      <aside
        dir={dir}
        className={
          "fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out " +
          (open ? "translate-x-0" : "translate-x-full")
        }
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 text-white shrink-0" style={{ background: BRAND.deep }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-sm">{t("ICFS Assistant")}</p>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                {t("Ask me anything about Prize Bonds")}
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label={t("Close")} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
          {/* Welcome / empty state */}
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 text-slate-800 text-sm px-3.5 py-2.5 leading-relaxed">
                  {t("Assalam-o-Alaikum! I'm the ICFS Prize Bond Assistant. Ask me about purchase, encashment, claims, tax, or counter procedures.")}
                </div>
              </div>
              <div className="pl-9 space-y-2">
                <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {t("Try asking")}
                </p>
                {CHAT_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="block text-left text-sm text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-lg px-3 py-2 w-full transition-colors"
                  >
                    {t(q)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <ChatMessage key={i} msg={m} t={t} />
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-3 shrink-0 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={t("Ask about prize bonds…")}
              className="flex-1 resize-none max-h-28 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label={t("Send")}
              className={
                "w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-colors " +
                (loading || !input.trim() ? "bg-slate-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500")
              }
            >
              {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            {t("Answers are based on official SBP-BSC Prize Bond documents.")}
          </p>
        </div>
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER / FOOTER                                                     */
/* ------------------------------------------------------------------ */

function LanguageSwitcher({ compact }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={
        "inline-flex items-center rounded-lg bg-white/10 border border-white/20 p-0.5 " + (compact ? "w-full" : "")
      }
      role="group"
      aria-label="Language"
    >
      <Globe className="w-3.5 h-3.5 text-emerald-100 mx-1.5 shrink-0" />
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={
            "px-2.5 py-1 rounded-md text-xs font-semibold transition-colors " +
            (compact ? "flex-1 " : "") +
            (lang === l.code ? "bg-white text-[#0b5d3b]" : "text-emerald-50/80 hover:text-white")
          }
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

function Header({ go, current }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const nav = [
    { key: "home", label: "Home" },
    { key: "staff", label: "Staff" },
    { key: "feedback", label: "Complain & Feedback" },
  ];
  const isActive = (key) => key === current || (key !== "home" && current.startsWith(key));

  return (
    <header className="sticky top-0 z-40" style={{ background: BRAND.deep }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          <button onClick={() => go("home")} className="flex items-center">
            <Logo light />
          </button>

          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {nav.map((n) => (
                <button
                  key={n.key}
                  onClick={() => go(n.key)}
                  className={
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors " +
                    (isActive(n.key) ? "bg-white/15 text-white" : "text-emerald-50/80 hover:text-white hover:bg-white/10")
                  }
                >
                  {t(n.label)}
                </button>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10" style={{ background: BRAND.deepDark }}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => { go(n.key); setOpen(false); }}
                className={
                  "text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors " +
                  (isActive(n.key) ? "bg-white/15 text-white" : "text-emerald-50/80 hover:bg-white/10")
                }
              >
                {t(n.label)}
              </button>
            ))}
            <div className="pt-2 mt-1 border-t border-white/10">
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ go }) {
  const t = useT();
  return (
    <footer style={{ background: BRAND.deep }} className="text-emerald-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="mb-4"><Logo light /></div>
          <p className="text-sm leading-relaxed text-emerald-100/80">
            {t("A reference resource for Premium and National Prize Bond services offered through SBP-BSC field offices nationwide.")}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">{t("Quick links")}</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ["premium", "Premium Prize Bonds"],
              ["national", "National Prize Bonds"],
              ["forms", "Download Forms"],
              ["guidance", "Office Guidance"],
              ["tax", "Tax Calculator"],
            ].map(([key, label]) => (
              <li key={key}>
                <button onClick={() => go(key)} className="hover:text-white transition-colors">{t(label)}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">{t("Contact")}</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5"><Phone className="w-4 h-4 shrink-0" /> 021-111-727-273</li>
            <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 shrink-0" /> info@sbpbsc.org.pk</li>
            <li className="flex items-start gap-2.5"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {t("Field offices in major cities across Pakistan")}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">{t("Disclaimer")}</h4>
          <p className="text-sm text-emerald-100/80 leading-relaxed">
            {t("This website is an informational reference and is not an official SBP-BSC portal. Procedures, forms, and tax rates are subject to change; please confirm current requirements with your nearest SBP-BSC field office or the FBR before acting.")}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-xs text-emerald-100/70 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} State Bank of Pakistan Banking Services Corporation.</p>
          <p>{t("For informational purposes only.")}</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  APP ROOT                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [page, setPage] = useState("home");
  const [detailKey, setDetailKey] = useState(null);
  const [journeyCategory, setJourneyCategory] = useState(null);
  const [journeyNonce, setJourneyNonce] = useState(0); // forces a fresh journey (resets its internal state)
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);

  const go = useCallback((target, payload) => {
    if (payload) setDetailKey(payload);
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Opens the static, non-interactive reference page for a service.
  const openDetail = (category, key) => {
    setDetailKey(key);
    setPage(category === "premium" ? "premium-detail" : "national-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Opens the guided, interactive Smart Customer Journey for a service.
  const openJourney = (category, key) => {
    setDetailKey(key);
    setJourneyCategory(category);
    setJourneyNonce((n) => n + 1);
    setPage("journey");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const premiumItem = PREMIUM_SUB.find((i) => i.key === detailKey);
  const nationalItem = NATIONAL_SUB.find((i) => i.key === detailKey);
  const journeyItem = journeyCategory === "premium" ? premiumItem : nationalItem;

  let content;
  switch (page) {
    case "home":
      content = <HomePage go={go} />;
      break;

    case "premium":
      content = (
        <ListingPage
          title="Premium Prize Bonds"
          subtitle="Registered bonds available in Rs. 25,000 and Rs. 40,000 denominations. Choose a service below to start a guided journey."
          items={PREMIUM_SUB}
          onSelect={(key) => openJourney("premium", key)}
          breadcrumb={[{ label: "Home", page: "home" }, { label: "Premium Prize Bonds" }]}
          go={go}
        />
      );
      break;

    case "premium-detail":
      content = (
        <DetailPage
          item={premiumItem}
          categoryLabel="Premium Prize Bond"
          breadcrumb={[
            { label: "Home", page: "home" },
            { label: "Premium Prize Bonds", page: "premium" },
            { label: premiumItem ? premiumItem.title : "" },
          ]}
          go={go}
        />
      );
      break;

    case "national":
      content = (
        <ListingPage
          title="National Prize Bonds"
          subtitle="Bearer bonds available in Rs. 100, 200, 750, and 1,500 denominations. Choose a service below to start a guided journey."
          items={NATIONAL_SUB}
          onSelect={(key) => openJourney("national", key)}
          breadcrumb={[{ label: "Home", page: "home" }, { label: "National Prize Bonds" }]}
          go={go}
        />
      );
      break;

    case "national-detail":
      content = (
        <DetailPage
          item={nationalItem}
          categoryLabel="National Prize Bond"
          breadcrumb={[
            { label: "Home", page: "home" },
            { label: "National Prize Bonds", page: "national" },
            { label: nationalItem ? nationalItem.title : "" },
          ]}
          go={go}
        />
      );
      break;

    case "journey":
      content = (
        <CustomerJourney
          key={journeyNonce}
          category={journeyCategory}
          item={journeyItem}
          breadcrumb={[
            { label: "Home", page: "home" },
            { label: journeyCategory === "premium" ? "Premium Prize Bonds" : "National Prize Bonds", page: journeyCategory || "home" },
            { label: journeyItem ? journeyItem.title : "" },
          ]}
          go={go}
          onRestart={() => setJourneyNonce((n) => n + 1)}
        />
      );
      break;

    case "forms":
      content = <FormsPage breadcrumb={[{ label: "Home", page: "home" }, { label: "Download Forms" }]} go={go} />;
      break;

    case "guidance":
      content = <GuidancePage breadcrumb={[{ label: "Home", page: "home" }, { label: "Office Guidance" }]} go={go} />;
      break;

    case "tax":
      content = <TaxCalculator breadcrumb={[{ label: "Home", page: "home" }, { label: "Tax Calculator" }]} go={go} />;
      break;

    case "staff":
      content = (
        <StaffPage
          go={go}
          breadcrumb={[{ label: "Home", page: "home" }, { label: "Staff" }]}
          isStaffLoggedIn={isStaffLoggedIn}
          setIsStaffLoggedIn={setIsStaffLoggedIn}
        />
      );
      break;

    case "feedback":
      content = <FeedbackPage breadcrumb={[{ label: "Home", page: "home" }]} go={go} />;
      break;

    default:
      content = <HomePage go={go} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header go={go} current={page} />
      <main className="flex-1">{content}</main>
      <Footer go={go} />
      <ChatbotWidget />
    </div>
  );
}
