"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Printer,
  Upload,
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Smartphone,
  ChevronDown,
  ArrowRight,
  Lock,
  Scissors,
  FileText,
  Camera,
  Layers,
  Copy,
  Check,
  IndianRupee,
  Phone,
  HelpCircle,
  ExternalLink
} from "lucide-react";

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Demo form state
  const [demoShop, setDemoShop] = useState("");
  const [demoMobile, setDemoMobile] = useState("");
  const [demoPrinter, setDemoPrinter] = useState("HP");
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Inquiry form state
  const [inqName, setInqName] = useState("");
  const [inqMobile, setInqMobile] = useState("");
  const [inqMsg, setInqMsg] = useState("");
  const [inqSuccess, setInqSuccess] = useState(false);

  const copyPromo = () => {
    navigator.clipboard.writeText("PRINT50");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSuccess(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSuccess(false);
      setDemoShop("");
      setDemoMobile("");
    }, 2200);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInqSuccess(true);
    setTimeout(() => {
      setShowInquiryModal(false);
      setInqSuccess(false);
      setInqName("");
      setInqMobile("");
      setInqMsg("");
    }, 2200);
  };

  const faqs = [
    {
      q: "QR Se Print kya hai?",
      a: "QR Se Print ek smart cyber café aur print shop automation software hai. Customer aapki dukaan ka QR code phone se scan karta hai, file upload karta hai, payment karta hai — aur aapke Windows printer se bina computer ko chhue print nikal jata hai. Na WhatsApp mangna, na pendrive virus ka khatra.",
    },
    {
      q: "Customer ko koi app download karni padegi kya?",
      a: "Bilkul nahi! Customer sirf phone ke camera ya Google Lens se scan karega aur direct chrome/safari browser me khul jayega. Zero download, zero login.",
    },
    {
      q: "Kaun-kaun se printer chalenge? Kya Wi-Fi printer zaroori hai?",
      a: "Wi-Fi printer ki koi zaroorat nahi hai. Agar aapka printer normal USB cable se aapke Windows PC par print karta hai (HP 1020, Epson L3210, Canon, Brother, etc.), to 100% chalega.",
    },
    {
      q: "Single-sided aur Duplex (Dono taraf) print ka hisaab kaise hoga?",
      a: "Software me automatic duplex support hai. Agar customer dono side print select karega, to aapke set kiye huye rate (jaise ₹3 dono taraf) ke hisaab se payment banega.",
    },
    {
      q: "Customer ka payment kis account me aayega?",
      a: "Paisa seedha aapke account me aayega. 0% platform commission hai. Customer counter par cash bhi de sakta hai, shopkeeper screen par bas 1-click 'Approve & Print' dabana hai.",
    },
    {
      q: "Agar internet slow ya band ho gaya to?",
      a: "Print jobs queue me safe rehti hain. Jaise hi internet connect hoga, Windows agent jobs ko automatically spool karke print kar dega.",
    },
  ];

  return (
    <div className="min-h-screen text-[#111114] selection:bg-[#ffd22e] selection:text-[#111114]">
      {/* 1. TOP PROMO BANNER (Controlled Promo Bar) */}
      <div className="bg-gradient-to-r from-[#e11d48] via-[#ff2e63] to-[#ea580c] text-white py-2 px-3 sm:px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold flex-wrap justify-center sm:justify-start">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-black">
              🔥 SPECIAL LAUNCH OFFER
            </span>
            <span>Get 50% Flat OFF on 1-Year & Lifetime Setup!</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-black/30 px-2.5 py-1 rounded-lg font-mono text-[11px] text-[#fef08a] font-bold">
              ⏳ Ends in: 03:45:18
            </div>
            <button
              onClick={copyPromo}
              className="bg-white text-[#be123c] font-black px-2.5 py-1 rounded-lg text-[11px] hover:bg-slate-100 transition shadow-sm flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? "COPIED!" : "Code: PRINT50"}</span>
            </button>
            <a
              href="#pricing"
              className="bg-[#0f172a] text-white font-bold px-3 py-1 rounded-lg text-[11px] hover:bg-slate-800 transition"
            >
              Claim Offer ➔
            </a>
          </div>
        </div>
      </div>

      {/* 2. STICKY FROSTED NAVBAR */}
      <header className="sticky top-[37px] z-40 bg-[#fffdf8]/90 backdrop-blur-md border-b border-[#ece3d2] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff2e63] to-[#ff6b35] flex items-center justify-center text-white shadow-md shadow-[#ff2e63]/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-[#111114]">
                  PrintFlow
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#ff2e63]/10 text-[#ff2e63]">
                  QR Se Print
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-wider text-[#6b7280] hidden sm:block uppercase">
                SCAN • UPLOAD • PAY • PRINT
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-[#3a3f47]">
            <a href="#how-it-works" className="px-3 py-1.5 rounded-xl hover:text-[#ff2e63] hover:bg-[#ffd22e]/20 transition">
              How it works
            </a>
            <a href="#features" className="px-3 py-1.5 rounded-xl hover:text-[#ff2e63] hover:bg-[#ffd22e]/20 transition">
              Features
            </a>
            <a href="#comparison" className="px-3 py-1.5 rounded-xl hover:text-[#ff2e63] hover:bg-[#ffd22e]/20 transition">
              Pehle vs Ab
            </a>
            <a href="#pricing" className="px-3 py-1.5 rounded-xl hover:text-[#ff2e63] hover:bg-[#ffd22e]/20 transition">
              Pricing
            </a>
            <a href="#faq" className="px-3 py-1.5 rounded-xl hover:text-[#ff2e63] hover:bg-[#ffd22e]/20 transition">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-xs font-bold px-3 py-2 rounded-xl bg-white text-[#111114] border border-[#111114] hover:bg-[#111114] hover:text-white transition shadow-sm"
            >
              Shop Login
            </Link>
            <button
              onClick={() => setShowDemoModal(true)}
              className="text-xs font-black px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff2e63] to-[#ff6b35] text-white shadow-md shadow-[#ff2e63]/30 hover:opacity-95 transition flex items-center gap-1.5"
            >
              <span>🎯 Free Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (EXACT 2-COLUMN SPLIT WITH 3D PHONE + LASER SWEEP + 3D PRINTER) */}
      <section className="relative pt-8 pb-14 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Badge */}
              <div className="inline-flex flex-col items-start">
                <div className="flex items-center gap-2 bg-[#fff2f5] border border-[#fed7e2] px-3 py-1.5 rounded-full text-xs font-black text-[#ff2e63]">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff2e63]" />
                  <span>SMART AUTOMATIC PRINTING PLATFORM</span>
                </div>
                <div className="text-[11px] font-black tracking-widest text-[#6b7280] mt-1.5 uppercase">
                  — SCAN <span className="text-[#ff2e63]">•</span> UPLOAD <span className="text-[#ea580c]">•</span> PAY <span className="text-[#7c3aed]">•</span> PRINT —
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.18] text-[#16162e]">
                Customer QR scan karega,<br />
                <span className="bg-gradient-to-r from-[#ff2e63] to-[#7c3aed] bg-clip-text text-transparent">
                  print seedha niklega
                </span>
              </h1>

              {/* Bullet row */}
              <div className="flex items-center gap-3 text-sm sm:text-base font-bold text-[#2c2c3a] flex-wrap">
                <span className="flex items-center gap-1 text-[#059669]">
                  <CheckCircle2 className="w-4 h-4" /> No WhatsApp
                </span>
                <span className="text-[#ff2e63]">•</span>
                <span className="flex items-center gap-1 text-[#059669]">
                  <CheckCircle2 className="w-4 h-4" /> No Pendrive Virus
                </span>
                <span className="text-[#ff2e63]">•</span>
                <span className="flex items-center gap-1 text-[#059669]">
                  <CheckCircle2 className="w-4 h-4" /> No File Transfer
                </span>
              </div>

              {/* 4 Interactive Micro Step Circles */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md pt-2">
                <div className="text-center group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white border border-[#e8e2f2] shadow-sm flex items-center justify-center mx-auto mb-1.5 group-hover:-translate-y-1 group-hover:border-[#ff2e63] group-hover:shadow-lg group-hover:shadow-[#ff2e63]/20 transition-all">
                    <QrCode className="w-6 h-6 text-[#ff2e63]" />
                  </div>
                  <div className="text-[11px] font-black uppercase text-[#111114]">SCAN</div>
                  <div className="text-[10px] text-[#717182] font-semibold">QR Code</div>
                </div>

                <div className="text-center group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white border border-[#e8e2f2] shadow-sm flex items-center justify-center mx-auto mb-1.5 group-hover:-translate-y-1 group-hover:border-[#7c3aed] group-hover:shadow-lg group-hover:shadow-[#7c3aed]/20 transition-all">
                    <Upload className="w-6 h-6 text-[#7c3aed]" />
                  </div>
                  <div className="text-[11px] font-black uppercase text-[#111114]">UPLOAD</div>
                  <div className="text-[10px] text-[#717182] font-semibold">Document</div>
                </div>

                <div className="text-center group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white border border-[#e8e2f2] shadow-sm flex items-center justify-center mx-auto mb-1.5 group-hover:-translate-y-1 group-hover:border-[#ff2e63] group-hover:shadow-lg group-hover:shadow-[#ff2e63]/20 transition-all">
                    <CreditCard className="w-6 h-6 text-[#ff2e63]" />
                  </div>
                  <div className="text-[11px] font-black uppercase text-[#111114]">PAY</div>
                  <div className="text-[10px] text-[#717182] font-semibold">Online/Cash</div>
                </div>

                <div className="text-center group cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white border border-[#e8e2f2] shadow-sm flex items-center justify-center mx-auto mb-1.5 group-hover:-translate-y-1 group-hover:border-[#7c3aed] group-hover:shadow-lg group-hover:shadow-[#7c3aed]/20 transition-all">
                    <Printer className="w-6 h-6 text-[#7c3aed]" />
                  </div>
                  <div className="text-[11px] font-black uppercase text-[#111114]">AUTO PRINT</div>
                  <div className="text-[10px] text-[#717182] font-semibold">Instantly</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 pt-3 flex-wrap">
                <a
                  href="#pricing"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#ff5722] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#ff2e63]/30 hover:-translate-y-0.5 hover:shadow-[#ff2e63]/45 transition flex items-center gap-2"
                >
                  <span>💰 See Setup Price ↓</span>
                </a>

                <button
                  onClick={() => setShowDemoModal(true)}
                  className="px-6 py-3.5 rounded-full bg-white border-2 border-[#ff1a60] text-[#ff1a60] font-extrabold text-sm sm:text-base shadow-sm hover:bg-[#fff5f8] hover:-translate-y-0.5 transition flex items-center gap-2"
                >
                  <span>🎯 Register Demo</span>
                </button>

                <Link
                  href="/print/sharma-cyber-cafe"
                  className="text-xs font-bold text-[#64748b] hover:text-[#ff2e63] underline flex items-center gap-1 ml-1"
                >
                  <span>Try Customer Mobile Scan</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right Artwork Column (3D Phone + Laser Sweep + 3D Printer Animation) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-4 lg:mt-0">
              {/* Floating Auto-Print Badge */}
              <div className="absolute top-2 right-4 sm:right-10 bg-gradient-to-r from-[#ffd22e] to-[#ffc000] text-[#111114] text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg shadow-[#ffd22e]/40 z-20 anim-float flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>⚡ Auto Print</span>
              </div>

              {/* 3D Smartphone Card */}
              <div className="w-[220px] sm:w-[240px] bg-white border-[5px] border-[#efe9f6] rounded-[28px] shadow-2xl p-3 relative -rotate-3 -translate-y-2 z-10">
                <div className="flex items-center justify-between mb-2 px-1 text-[11px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff2e63]" />
                    <span>PrintFlow Scan</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Sharma Cyber</span>
                </div>

                <div className="bg-[#fffdf8] border border-[#fef3c7] rounded-2xl p-3 text-center relative overflow-hidden">
                  {/* Live Laser Sweep Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff2e63] to-transparent shadow-[0_0_12px_#ff2e63] anim-laser z-10" />

                  {/* QR Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/api/qr/sharma-cyber-cafe"
                    alt="Demo QR"
                    className="w-36 h-36 mx-auto object-contain"
                  />

                  <div className="text-[11px] font-extrabold text-emerald-600 mt-2 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Document Sent ✓</span>
                  </div>
                </div>
              </div>

              {/* 3D Modern Printer Unit */}
              <div className="w-[280px] sm:w-[310px] relative z-0 -mt-8">
                {/* Feeder stacked sheets */}
                <div className="flex justify-center gap-1.5 -mb-2 relative z-0">
                  <div className="w-12 h-8 bg-white border border-slate-200 rounded-t shadow-sm -rotate-6 translate-y-1" />
                  <div className="w-14 h-10 bg-white border border-slate-200 rounded-t shadow-sm" />
                  <div className="w-12 h-8 bg-white border border-slate-200 rounded-t shadow-sm rotate-6 translate-y-1" />
                </div>

                {/* Printer Body */}
                <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-2xl p-4 shadow-2xl relative z-10 text-white">
                  {/* Paper Exit Slot */}
                  <div className="h-2 bg-[#020617] rounded-full mb-3" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-[#ff2e63] anim-led shadow-[0_0_8px_#ff2e63]" />
                      <span>PRINTING...</span>
                    </div>

                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffd22e]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Printed paper sliding out */}
                <div className="w-[200px] bg-white border border-slate-200 rounded-b-xl p-3 mx-auto -mt-1 shadow-lg relative z-20 anim-paper">
                  <div className="text-[10px] font-black text-slate-900 flex items-center gap-1 mb-1.5">
                    <Printer className="w-3 h-3 text-[#ff2e63]" />
                    <span>Sharma Cyber Cafe • Token #TK-492</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 bg-slate-200 rounded-full" />
                    <div className="h-1 bg-slate-200 rounded-full" />
                    <div className="h-1 bg-slate-200 rounded-full w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. FLOATING 5-FEATURE BAR */}
          <div className="mt-12 bg-white border border-[#efe9f6] rounded-2xl shadow-xl shadow-[#5a328c]/10 p-4 sm:p-5 grid grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] text-[#db2777] flex items-center justify-center text-lg shrink-0">
                📱
              </div>
              <div className="text-xs font-bold leading-tight">
                Smart Solution for <span className="text-[#ff2e63]">Print Shops & CSC Centers</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center text-lg shrink-0">
                🖨️
              </div>
              <div className="text-xs font-bold leading-tight">
                <b>All Printers</b> Supported (HP, Epson, Canon)
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center text-lg shrink-0">
                📶
              </div>
              <div className="text-xs font-bold leading-tight">
                <b>No Wi-Fi Printer</b> Required
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#faf5ff] text-[#9333ea] flex items-center justify-center text-lg shrink-0">
                🎨
              </div>
              <div className="text-xs font-bold leading-tight">
                <b>Black &amp; White</b> &amp; Color Print
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center text-lg shrink-0">
                ⏱️
              </div>
              <div className="text-xs font-bold leading-tight">
                <b>Setup in</b> 2 Minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DARK PURPLE STATS STRIP (Exact Reference Match) */}
      <section className="bg-gradient-to-r from-[#1a1336] via-[#3a1a5f] to-[#5a1d6e] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black">376+</div>
            <div className="text-xs font-semibold text-[#cbb9e0] mt-1">Active Print Shops</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black">9K+</div>
            <div className="text-xs font-semibold text-[#cbb9e0] mt-1">Daily Pages Printed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black">98%+</div>
            <div className="text-xs font-semibold text-[#cbb9e0] mt-1">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black">🇮🇳</div>
            <div className="text-xs font-semibold text-[#cbb9e0] mt-1">Made in India for Bharat</div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (4 Steps, Zero Jhanjhat) */}
      <section id="how-it-works" className="py-16 px-4 bg-[#fff9ec]/60 border-b border-[#ece3d2]">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <span className="text-[#ff2e63] font-black text-xs uppercase tracking-widest">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111114]">
            4 Steps, Zero Jhanjhat
          </h2>
          <p className="text-sm text-[#54595f] max-w-xl mx-auto">
            Aapki dukaan par sirf ek kaam bacha hai — counter par QR code chipkana. Baaki sab automatic.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 text-center">
            {/* Step 1 */}
            <div className="bg-white border-2 border-[#ece3d2] hover:border-[#ffd22e] rounded-2xl p-6 relative transition hover:-translate-y-1 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#ff6b35] text-white font-black text-sm flex items-center justify-center absolute -top-4 left-1/2 -translate-x-1/2 shadow-md">
                1
              </span>
              <div className="text-4xl my-3">📱</div>
              <h3 className="font-extrabold text-base text-[#111114]">Customer QR Scan Kare</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Dukaan ke display par laga QR code customer apne phone camera se scan karta hai.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-[#ece3d2] hover:border-[#ffd22e] rounded-2xl p-6 relative transition hover:-translate-y-1 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#ff6b35] text-white font-black text-sm flex items-center justify-center absolute -top-4 left-1/2 -translate-x-1/2 shadow-md">
                2
              </span>
              <div className="text-4xl my-3">📤</div>
              <h3 className="font-extrabold text-base text-[#111114]">Document Upload Kare</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                PDF, JPG ya photo browser me upload karta hai — koi app download karne ki zaroorat nahi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-[#ece3d2] hover:border-[#ffd22e] rounded-2xl p-6 relative transition hover:-translate-y-1 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#ff6b35] text-white font-black text-sm flex items-center justify-center absolute -top-4 left-1/2 -translate-x-1/2 shadow-md">
                3
              </span>
              <div className="text-4xl my-3">💳</div>
              <h3 className="font-extrabold text-base text-[#111114]">Payment Kare</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Online UPI/Card ya counter par cash — aapka roz ka hisaab dashboard par khud ban jata hai.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border-2 border-[#ece3d2] hover:border-[#ffd22e] rounded-2xl p-6 relative transition hover:-translate-y-1 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#ff6b35] text-white font-black text-sm flex items-center justify-center absolute -top-4 left-1/2 -translate-x-1/2 shadow-md">
                4
              </span>
              <div className="text-4xl my-3">🖨️</div>
              <h3 className="font-extrabold text-base text-[#111114]">Print Auto Nikal Jata Hai</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Shop ka PC print agent job uthata hai aur printer se paper print hokar nikal jata hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURES (Poore Dukaan Ka System) */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-4 text-center">
          <span className="text-[#ff2e63] font-black text-xs uppercase tracking-widest">
            SIRF PRINT NAHI
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111114]">
            Poori Dukaan Ka Complete System
          </h2>
          <p className="text-sm text-[#54595f] max-w-xl mx-auto">
            Jo-jo features Indian Xerox shops ko chahiye, sab ek jagah built-in hai.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
            <div className="bg-white border border-[#ece3d2] p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#fff2f5] text-[#ff2e63] flex items-center justify-center text-2xl mb-4">
                📄
              </div>
              <h3 className="font-bold text-base text-[#111114]">Multi-File Printing</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Customer ek saath 5–10 files bheje (PDF + photo mix) — ek single payment me sahi sequence me print.
              </p>
            </div>

            <div className="bg-white border border-[#ece3d2] p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center text-2xl mb-4">
                🔒
              </div>
              <h3 className="font-bold text-base text-[#111114]">Aadhaar / Locked PDF Support</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Password protected e-Aadhaar ya bank statement aate hi mobile screen par password mangega. Zero silent hangup.
              </p>
            </div>

            <div className="bg-white border border-[#ece3d2] p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center text-2xl mb-4">
                📐
              </div>
              <h3 className="font-bold text-base text-[#111114]">Duplex (Both Sides) &amp; Legal</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Single side (₹2) vs back-to-back duplex (₹3) aur Legal size ke alag pricing rules automatically calculate hote hain.
              </p>
            </div>

            <div className="bg-white border border-[#ece3d2] p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center text-2xl mb-4">
                💳
              </div>
              <h3 className="font-bold text-base text-[#111114]">Paisa Seedha Aapke Account</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                UPI aur online payment seedha aapke account me. 0% platform commission, unlimited print jobs.
              </p>
            </div>

            <div className="bg-white border border-[#ece3d2] p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center text-2xl mb-4">
                🛡️
              </div>
              <h3 className="font-bold text-base text-[#111114]">Customer Privacy Auto-Purge</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Print complete hote hi customer ki file server aur PC se turant permanently delete ho jati hai.
              </p>
            </div>

            <div className="bg-white border border-[#ece3d2] p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#fffbeb] text-[#d97706] flex items-center justify-center text-2xl mb-4">
                📶
              </div>
              <h3 className="font-bold text-base text-[#111114]">Internet Disconnect Safe</h3>
              <p className="text-xs text-[#54595f] mt-1.5">
                Internet chala jaye to bhi jobs queue me safe rehti hain. Net wapas aate hi sab bari-bari print ho jata hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPARISON TABLE (WhatsApp vs PrintFlow) */}
      <section id="comparison" className="py-16 px-4 bg-[#fff9ec]/60 border-y border-[#ece3d2]">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <span className="text-[#ff2e63] font-black text-xs uppercase tracking-widest">
            PEHLE VS AB
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111114]">
            WhatsApp aur Pendrive Ka Jamana Gaya
          </h2>

          <div className="mt-8 bg-white border border-[#ece3d2] rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#111114] text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Features</th>
                  <th className="py-3.5 px-4 sm:px-6 text-[#ef4444]">📱 WhatsApp / Pendrive</th>
                  <th className="py-3.5 px-4 sm:px-6 text-[#10b981]">⚡ PrintFlow QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece3d2]">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 sm:px-6 font-bold">File Lena</td>
                  <td className="py-3 px-4 sm:px-6 text-[#6b7280]">Apna number do, chat dhundo</td>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#15803d]">QR scan — zero number share</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 sm:px-6 font-bold">Payment lena</td>
                  <td className="py-3 px-4 sm:px-6 text-[#6b7280]">Yaad rakho kaun baaki hai</td>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#15803d]">Hisaab &amp; Record khud banta hai</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 sm:px-6 font-bold">Shopkeeper ka time</td>
                  <td className="py-3 px-4 sm:px-6 text-[#6b7280]">Har print me manual download</td>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#15803d]">Print khud printer se nikalta hai</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 sm:px-6 font-bold">Virus risk</td>
                  <td className="py-3 px-4 sm:px-6 text-[#ef4444] font-medium">Pendrive = Bada khatra</td>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#15803d]">Zero — safe phone cloud scan</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 sm:px-6 font-bold">Platform Commission</td>
                  <td className="py-3 px-4 sm:px-6 text-[#6b7280]">—</td>
                  <td className="py-3 px-4 sm:px-6 font-bold text-[#15803d]">0% — Saara paisa aapka</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 9. TRANSPARENT PRICING GRID (Exact 5 Plans from Reference) */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-4 text-center">
          <span className="text-[#ff2e63] font-black text-xs uppercase tracking-widest">
            PRICING PLANS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111114]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-[#54595f] max-w-xl mx-auto">
            All plans include unlimited print jobs, QR customer portal, desktop sync, and zero commission.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-8 text-left items-stretch">
            {/* 1. Free Trial */}
            <div className="bg-white border-1.5 border-[#ece3d2] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative hover:-translate-y-1 transition">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                🎉 LAUNCH OFFER
              </span>
              <div>
                <h3 className="font-extrabold text-base text-[#111114]">Free Trial</h3>
                <div className="text-3xl font-black text-[#ff2e63] my-2">Free</div>
                <div className="text-xs font-bold text-slate-800">2 Hours access</div>
                <div className="text-[11px] text-slate-500 mb-4">No card needed, test immediately</div>
                <ul className="text-xs space-y-2 border-t border-slate-100 pt-3 text-slate-700 font-medium">
                  <li>✓ Unlimited print jobs</li>
                  <li>✓ QR customer portal</li>
                  <li>✓ Desktop auto-print</li>
                </ul>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full mt-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs hover:border-[#ff2e63] hover:text-[#ff2e63] transition"
              >
                Get Started
              </button>
            </div>

            {/* 2. Monthly */}
            <div className="bg-white border-1.5 border-[#ece3d2] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition">
              <div>
                <h3 className="font-extrabold text-base text-[#111114]">Monthly</h3>
                <div className="text-3xl font-black text-[#ff2e63] my-2">₹49</div>
                <div className="text-xs font-bold text-slate-800">30 days access</div>
                <div className="text-[11px] text-slate-500 mb-4">Try it out for a full month</div>
                <ul className="text-xs space-y-2 border-t border-slate-100 pt-3 text-slate-700 font-medium">
                  <li>✓ Unlimited print jobs</li>
                  <li>✓ QR customer portal</li>
                  <li>✓ Desktop auto-print</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full mt-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs hover:border-[#ff2e63] hover:text-[#ff2e63] transition"
              >
                Get Started
              </button>
            </div>

            {/* 3. 6 Months (MOST POPULAR) */}
            <div className="bg-white border-2 border-[#ff2e63] rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-[#ff2e63]/15 relative scale-105 z-10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff2e63] to-[#ff6b35] text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                🔥 MOST POPULAR
              </span>
              <div>
                <h3 className="font-extrabold text-base text-[#111114]">6 Months</h3>
                <div className="text-3xl font-black text-[#ff2e63] my-2">₹249</div>
                <div className="text-xs font-bold text-slate-800">180 days access</div>
                <div className="text-[11px] text-slate-500 mb-4">Half-year top value saver</div>
                <ul className="text-xs space-y-2 border-t border-slate-100 pt-3 text-slate-700 font-medium">
                  <li>✓ Unlimited print jobs</li>
                  <li>✓ QR customer portal</li>
                  <li>✓ Desktop auto-print</li>
                  <li>✓ Priority WhatsApp support</li>
                </ul>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full mt-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2e63] to-[#e11d48] text-white font-extrabold text-xs shadow-md shadow-[#ff2e63]/30 hover:opacity-95 transition"
              >
                Get Started
              </button>
            </div>

            {/* 4. 1 Year */}
            <div className="bg-white border-1.5 border-[#ece3d2] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition">
              <div>
                <h3 className="font-extrabold text-base text-[#111114]">1 Year</h3>
                <div className="text-3xl font-black text-[#ff2e63] my-2">₹499</div>
                <div className="text-xs font-bold text-slate-800">365 days access</div>
                <div className="text-[11px] text-slate-500 mb-4">Best value for regular shops</div>
                <ul className="text-xs space-y-2 border-t border-slate-100 pt-3 text-slate-700 font-medium">
                  <li>✓ Unlimited print jobs</li>
                  <li>✓ QR customer portal</li>
                  <li>✓ Desktop auto-print</li>
                  <li>✓ Dedicated phone support</li>
                </ul>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full mt-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs hover:border-[#ff2e63] hover:text-[#ff2e63] transition"
              >
                Get Started
              </button>
            </div>

            {/* 5. Lifetime */}
            <div className="bg-white border-1.5 border-[#ece3d2] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative hover:-translate-y-1 transition">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9333ea] to-[#7e22ce] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                👑 VIP LIFETIME
              </span>
              <div>
                <h3 className="font-extrabold text-base text-[#111114]">Lifetime</h3>
                <div className="text-3xl font-black text-[#ff2e63] my-2">₹1499</div>
                <div className="text-xs font-bold text-slate-800">Never expires</div>
                <div className="text-[11px] text-slate-500 mb-4">Pay once, use forever</div>
                <ul className="text-xs space-y-2 border-t border-slate-100 pt-3 text-slate-700 font-medium">
                  <li>✓ Unlimited print jobs</li>
                  <li>✓ Free future upgrades</li>
                  <li>✓ Desktop auto-print</li>
                  <li>✓ VIP priority support</li>
                </ul>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full mt-5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs hover:border-[#9333ea] hover:text-[#9333ea] transition"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* 100% SECURE PAYMENTS TRUST CARD */}
          <div className="max-w-2xl mx-auto bg-white border border-[#e2e8f0] rounded-3xl p-6 text-center shadow-sm mt-10">
            <div className="inline-flex items-center gap-2 text-[#047857] font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>100% Secure Payments via Razorpay &amp; Cashfree</span>
            </div>
            <p className="text-xs text-[#64748b] mt-1 mb-4">
              Direct UPI, Google Pay, PhonePe, Paytm, Debit Card &amp; Net Banking support.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-extrabold text-slate-400">
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700">RAZORPAY</span>
              <span>•</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700">CASHFREE</span>
              <span>•</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700">BHIM UPI</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-3 max-w-lg mx-auto">
              Card aur UPI detail seedha secure banking page par jaati hai. PrintFlow kabhi koi credential store nahi karta.
            </p>
          </div>
        </div>
      </section>

      {/* 10. RECOUP CALCULATOR (Kitne din me wasool?) */}
      <section className="py-14 px-4 bg-[#fff9ec]/60 border-t border-[#ece3d2]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-[#ff2e63] font-black text-xs uppercase tracking-widest">
            HISAAB LAGAO
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111114]">
            Kitne Din Me Setup Wasool?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
            <div className="bg-white border border-[#ece3d2] p-4 rounded-2xl">
              <div className="text-3xl font-black text-[#ff2e63]">15</div>
              <div className="text-xs text-[#54595f] mt-1 font-semibold">Roz ke print (min.)</div>
            </div>
            <div className="bg-white border border-[#ece3d2] p-4 rounded-2xl">
              <div className="text-3xl font-black text-[#ff2e63]">₹75</div>
              <div className="text-xs text-[#54595f] mt-1 font-semibold">Roz ki kamai (15 × ₹5)</div>
            </div>
            <div className="bg-white border border-[#ece3d2] p-4 rounded-2xl">
              <div className="text-3xl font-black text-[#ff2e63]">₹2,250</div>
              <div className="text-xs text-[#54595f] mt-1 font-semibold">Mahine ki kamai</div>
            </div>
            <div className="bg-white border border-[#ece3d2] p-4 rounded-2xl">
              <div className="text-3xl font-black text-[#16a34a]">2 Hafte</div>
              <div className="text-xs text-[#54595f] mt-1 font-semibold">Pura software wasool ✅</div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. PARTNER CTA BANNER */}
      <section className="py-14 px-4 bg-gradient-to-r from-[#17171b] via-[#2e1065] to-[#17171b] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[#ffd22e] font-black text-xs uppercase tracking-widest">
            SAATH MILKAR KAMAO
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            Become an Agent / Partner — Earn Lifetime
          </h2>
          <p className="text-sm text-[#cbd5e1] max-w-xl mx-auto">
            Har dukaan onboard karne par ₹200 instant commission + apna installation margin. Koi investment nahi.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#ff6b35] text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition"
            >
              Agent Program Join Karein
            </button>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              White Label Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* 12. FAQ ACCORDION */}
      <section id="faq" className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-2">
            <span className="text-[#ff2e63] font-black text-xs uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111114]">
              Aksar Pooche Jaane Wale Sawaal
            </h2>
          </div>

          <div className="pt-6 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#ece3d2] rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 text-[#111114]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#ff2e63] transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#54595f] leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. BOTTOM FINAL CTA */}
      <section className="py-16 px-4 bg-[#fff9ec] border-t border-[#ece3d2] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-[#111114]">
            2 Minute Me Apni Dukaan Ko Smart Banao
          </h2>
          <p className="text-sm text-[#54595f]">
            Free demo ke saath shuru karo — apne hi printer par 2 ghante test karo, phir decide karo.
          </p>
          <div className="pt-3 flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff2e63] to-[#ff5722] text-white font-extrabold text-sm shadow-xl shadow-[#ff2e63]/30 hover:opacity-95 transition"
            >
              Start Free Demo
            </button>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="px-6 py-3.5 rounded-full bg-white border border-[#111114] text-[#111114] font-bold text-sm hover:bg-[#111114] hover:text-white transition"
            >
              💼 Business Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer className="bg-[#17171b] text-slate-400 py-10 px-4 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <div className="w-6 h-6 rounded-lg bg-[#ff2e63] flex items-center justify-center text-white">
              <Printer className="w-3.5 h-3.5" />
            </div>
            <span>PrintFlow SaaS — Made in India</span>
          </div>
          <div>© 2026 PrintFlow. All rights reserved. Zero Commission Print Platform.</div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-white transition">Shop Admin</Link>
            <Link href="/print/sharma-cyber-cafe" className="hover:text-white transition">Customer Scan</Link>
          </div>
        </div>
      </footer>

      {/* DEMO REQUEST MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative border border-[#ece3d2]">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#fff2f5] text-[#ff2e63] flex items-center justify-center font-bold">
                🎯
              </div>
              <h3 className="text-lg font-black text-[#111114]">Request 24-Hour Free Demo</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Apni shop details bharo — demo activate hote hi Shop Token aapke WhatsApp par aayega.
            </p>

            {demoSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center text-xs font-bold space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>Demo Request Received!</p>
                <p className="text-slate-500 font-normal">Aapka demo pairing code WhatsApp par bhej diya gaya hai.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dukaan Ka Naam</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma Cyber & Xerox"
                    value={demoShop}
                    onChange={(e) => setDemoShop(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#ff2e63] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={demoMobile}
                    onChange={(e) => setDemoMobile(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#ff2e63] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aapka Printer Model</label>
                  <select
                    value={demoPrinter}
                    onChange={(e) => setDemoPrinter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#ff2e63] focus:outline-none bg-white"
                  >
                    <option value="HP">HP (e.g. 1020 Plus, Laser)</option>
                    <option value="Epson">Epson (e.g. L3150 / L3210 EcoTank)</option>
                    <option value="Canon">Canon (G2010, imageRUNNER)</option>
                    <option value="Brother">Brother (L2321D Duplex)</option>
                    <option value="Other">Other Windows Printer</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff2e63] to-[#ff5722] text-white font-black text-xs shadow-md shadow-[#ff2e63]/30 hover:opacity-95 transition mt-2"
                >
                  Activate Free Demo Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* BUSINESS INQUIRY MODAL */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative border border-[#ece3d2]">
            <button
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#fff2f5] text-[#ff2e63] flex items-center justify-center font-bold">
                💼
              </div>
              <h3 className="text-lg font-black text-[#111114]">Partner / White-Label Inquiry</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Apna message chhoriye — hamari team aapse turant connect karegi.
            </p>

            {inqSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center text-xs font-bold space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>Inquiry Sent Successfully!</p>
                <p className="text-slate-500 font-normal">Hum aapse WhatsApp par sampark karenge.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aapka Naam</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#ff2e63] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={inqMobile}
                    onChange={(e) => setInqMobile(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#ff2e63] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Aap kis city me kaam karte hain ya white-label chahiye..."
                    value={inqMsg}
                    onChange={(e) => setInqMsg(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#ff2e63] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#111114] text-white font-black text-xs hover:bg-slate-800 transition mt-2"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
