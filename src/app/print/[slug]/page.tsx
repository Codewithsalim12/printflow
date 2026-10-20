"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Lock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface ShopInfo {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  counterCode: string;
  pricingRules: {
    paperSize: string;
    isColor: boolean;
    isDuplex: boolean;
    perPagePrice: number;
  }[];
}

function CustomerPrintPortalContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [loadingShop, setLoadingShop] = useState(true);

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [copies, setCopies] = useState<number>(1);
  const [isColor, setIsColor] = useState<boolean>(false);
  const [isDuplex, setIsDuplex] = useState<boolean>(false);
  const [paperSize, setPaperSize] = useState<string>("A4");
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [pdfPassword, setPdfPassword] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"PAY_AT_COUNTER" | "UPI">("PAY_AT_COUNTER");
  const [customerPhone, setCustomerPhone] = useState<string>("");

  // Stepper & Status
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedJob, setSubmittedJob] = useState<any | null>(null);
  const [liveStatus, setLiveStatus] = useState<string>("");
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch(`/api/shops/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setShop(data.shop);
        }
      } catch (err) {
        console.error("Failed to load shop:", err);
      } finally {
        setLoadingShop(false);
      }
    }
    loadShop();
  }, [slug]);

  // Price Calculation
  const calculateTotal = () => {
    let rate = isColor ? (isDuplex ? 18.0 : 10.0) : (isDuplex ? 3.0 : 2.0);
    if (paperSize === "Legal") {
      rate = isDuplex ? 5.0 : 3.0;
    }
    const units = isDuplex ? Math.ceil(totalPages / 2) : totalPages;
    return Math.max(2.0, units * rate * copies);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSelectedFile(f);
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("shopSlug", slug);
      formData.append("shopId", shop?.id || "shop_sharma_001");
      formData.append("copies", copies.toString());
      formData.append("totalPages", totalPages.toString());
      formData.append("paperSize", paperSize);
      formData.append("isColor", isColor.toString());
      formData.append("isDuplex", isDuplex.toString());
      formData.append("paymentMethod", paymentMethod);
      formData.append("customerPhone", customerPhone);
      if (pdfPassword) {
        formData.append("pdfPassword", pdfPassword);
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.job) {
        setSubmittedJob(data.job);
        setLiveStatus(data.job.printStatus);
      } else {
        alert(data.error || "Failed to submit print job");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Error submitting print job. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Poll status for live tracker
  useEffect(() => {
    if (!submittedJob?.id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${submittedJob.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.job) {
            setLiveStatus(data.job.printStatus);
          }
        }
      } catch (err) {
        console.error("Status polling error:", err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [submittedJob?.id]);

  const copyToken = () => {
    if (!submittedJob?.id) return;
    navigator.clipboard.writeText(submittedJob.id);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  if (loadingShop) {
    return (
      <div className="min-h-screen bg-[#fffdf8] flex flex-col items-center justify-center p-4 text-slate-600">
        <RefreshCw className="w-8 h-8 text-[#ff2e63] animate-spin mb-3" />
        <p className="text-sm font-bold">Connecting to print counter...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#111114] flex flex-col items-center justify-start p-2 sm:p-6 selection:bg-[#ffd22e]">
      {/* Smartphone Simulation Container */}
      <div className="w-full max-w-[430px] bg-white border border-[#ece3d2] rounded-[28px] overflow-hidden shadow-2xl shadow-slate-900/10">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#ff2e63] via-[#ff5722] to-[#ff6b35] text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-black text-xl shadow-inner">
                🖨️
              </div>
              <div>
                <h1 className="font-black text-base leading-tight">
                  {shop?.name || "Sharma Cyber Cafe"}
                </h1>
                <p className="text-[11px] text-white/90 mt-0.5 font-medium">
                  {shop?.address || "Counter #1 • Self-Service Portal"}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/25 border border-white/30 text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Live
            </span>
          </div>

          {/* Stepper Navigation */}
          {!submittedJob && (
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center text-[11px] font-bold">
              <div
                className={`py-1 rounded-lg transition ${
                  currentStep === 1 ? "bg-white text-[#ff2e63] shadow-sm" : "text-white/80"
                }`}
              >
                1. Upload
              </div>
              <div
                className={`py-1 rounded-lg transition ${
                  currentStep === 2 ? "bg-white text-[#ff2e63] shadow-sm" : "text-white/80"
                }`}
              >
                2. Settings
              </div>
              <div
                className={`py-1 rounded-lg transition ${
                  currentStep === 3 ? "bg-white text-[#ff2e63] shadow-sm" : "text-white/80"
                }`}
              >
                3. Print
              </div>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5">
          {submittedJob ? (
            /* Live Print Status & Success Screen */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#ecfdf5] border-2 border-[#10b981] flex items-center justify-center mx-auto text-[#10b981]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Aapka Print Token Code
                </div>
                <div className="inline-flex items-center gap-2 mt-1 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-2xl">
                  <span className="text-2xl font-black text-[#111114] tracking-tight">
                    {submittedJob.id}
                  </span>
                  <button
                    onClick={copyToken}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                    title="Copy Token"
                  >
                    {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 px-2">
                  {submittedJob.paymentMethod === "PAY_AT_COUNTER"
                    ? "Ye Token Code counter par dikhayein aur printout le lein."
                    : "Payment mil gaya hai! Aapka printout printer se nikal raha hai."}
                </p>
              </div>

              {/* Live Animated Printer Spooler Box */}
              <div className="bg-[#fff9ec] border border-[#f0e2ba] rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Live Status:</span>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-black ${
                      liveStatus === "PRINTED"
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : liveStatus === "PRINTING"
                        ? "bg-[#fef3c7] text-[#b45309] animate-pulse"
                        : liveStatus === "QUEUED"
                        ? "bg-[#eff6ff] text-[#1d4ed8]"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {liveStatus === "AWAITING_PAYMENT"
                      ? "⏳ Awaiting Counter Cash"
                      : liveStatus === "QUEUED"
                      ? "✓ Queued for Printer"
                      : liveStatus === "PRINTING"
                      ? "🖨️ Printing Now..."
                      : "✓ Print Complete"}
                  </span>
                </div>

                {/* Animated Printing Visual */}
                <div className="text-center py-2">
                  <div className="text-4xl anim-bob">🖨️</div>
                  <div className="mt-2 space-y-1.5 max-w-[180px] mx-auto">
                    <div className="h-1.5 rounded-full anim-slide" />
                    <div className="h-1.5 rounded-full anim-slide w-3/4 mx-auto" />
                    <div className="h-1.5 rounded-full anim-slide w-1/2 mx-auto" />
                  </div>
                </div>

                {/* Step List */}
                <div className="border-t border-[#f0e2ba] pt-2 space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Document Uploaded ✓</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      liveStatus === "QUEUED" || liveStatus === "PRINTING" || liveStatus === "PRINTED"
                        ? "text-emerald-600 font-bold"
                        : "text-amber-600 font-bold"
                    }`}
                  >
                    {liveStatus === "AWAITING_PAYMENT" ? (
                      <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {liveStatus === "AWAITING_PAYMENT"
                        ? "Counter Payment Pending (Show Token)"
                        : "Payment Approved ✓"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      liveStatus === "PRINTED"
                        ? "text-emerald-600 font-bold"
                        : liveStatus === "PRINTING"
                        ? "text-[#ff2e63] font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>
                      {liveStatus === "PRINTED" ? "Printed & Auto-Deleted ✓" : "Printing via Shop Agent"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer privacy: File will auto-delete permanently.</span>
              </div>

              <button
                onClick={() => {
                  setSubmittedJob(null);
                  setSelectedFile(null);
                  setCurrentStep(1);
                }}
                className="w-full py-3 rounded-2xl bg-[#111114] text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Print Another Document
              </button>
            </div>
          ) : (
            /* Upload & Settings Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: File Upload Dropzone */}
              <div>
                <label className="block text-xs font-black uppercase text-[#111114] mb-1.5">
                  1. Select PDF or Photo
                </label>
                <div className="relative border-2 border-dashed border-[#d1d5db] hover:border-[#ff2e63] rounded-2xl p-5 text-center transition cursor-pointer bg-[#fffdf8] hover:bg-[#fff2f5] group">
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#fff2f5] text-[#ff2e63] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    {selectedFile ? (
                      <div>
                        <p className="text-xs font-black text-[#111114] truncate max-w-[240px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-[#ff2e63] font-bold mt-0.5">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Selected ✓
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-[#111114]">
                          Yahan click karke file upload karein
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          PDF, Aadhaar, marksheet, ticket, photo
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Interactive Print Settings */}
              <div className="space-y-3 pt-1">
                {/* Color Mode Radio Cards */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Color Mode (रंग)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsColor(false)}
                      className={`p-2.5 rounded-xl text-center border-2 transition ${
                        !isColor
                          ? "border-[#ff2e63] bg-[#fff2f5] text-[#ff2e63] font-black"
                          : "border-[#ece3d2] bg-white text-slate-600 font-bold"
                      }`}
                    >
                      <div className="text-xs">Black &amp; White</div>
                      <div className="text-[10px] opacity-80 mt-0.5">₹2 per page</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsColor(true)}
                      className={`p-2.5 rounded-xl text-center border-2 transition ${
                        isColor
                          ? "border-[#ff2e63] bg-[#fff2f5] text-[#ff2e63] font-black"
                          : "border-[#ece3d2] bg-white text-slate-600 font-bold"
                      }`}
                    >
                      <div className="text-xs">Full Colour</div>
                      <div className="text-[10px] opacity-80 mt-0.5">₹10 per page</div>
                    </button>
                  </div>
                </div>

                {/* Duplex (Single vs Both Sides) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sides (एक तरफ / दोनों तरफ)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDuplex(false)}
                      className={`p-2.5 rounded-xl text-center border-2 transition ${
                        !isDuplex
                          ? "border-[#ff2e63] bg-[#fff2f5] text-[#ff2e63] font-black"
                          : "border-[#ece3d2] bg-white text-slate-600 font-bold"
                      }`}
                    >
                      <div className="text-xs">Single Side</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Ek taraf print</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDuplex(true)}
                      className={`p-2.5 rounded-xl text-center border-2 transition ${
                        isDuplex
                          ? "border-[#ff2e63] bg-[#fff2f5] text-[#ff2e63] font-black"
                          : "border-[#ece3d2] bg-white text-slate-600 font-bold"
                      }`}
                    >
                      <div className="text-xs">Both Sides (Duplex)</div>
                      <div className="text-[10px] opacity-80 mt-0.5">₹3 back-to-back</div>
                    </button>
                  </div>
                </div>

                {/* Pages & Copies Steppers */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Pages (पेज)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={totalPages}
                      onChange={(e) => setTotalPages(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-white border border-[#d1d5db] rounded-xl px-3 py-2 text-xs font-bold text-[#111114] focus:outline-none focus:border-[#ff2e63]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Copies (प्रतियां)
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setCopies(Math.max(1, copies - 1))}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#111114] rounded-l-xl text-xs font-bold border border-slate-300"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center bg-white border-y border-slate-300 py-2 text-xs font-black">
                        {copies}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCopies(copies + 1)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#111114] rounded-r-xl text-xs font-bold border border-slate-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Aadhaar / Password Prompt Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                    className="text-xs font-bold text-[#7c3aed] hover:text-[#ff2e63] flex items-center gap-1 mt-1"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>e-Aadhaar ya password protected PDF hai?</span>
                  </button>
                  {isPasswordProtected && (
                    <div className="mt-2 bg-[#fffbeb] border border-[#fde68a] p-2.5 rounded-xl">
                      <input
                        type="text"
                        placeholder="PDF password daalein (e.g. RAKE1992)"
                        value={pdfPassword}
                        onChange={(e) => setPdfPassword(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-[#111114] focus:outline-none focus:border-[#ff2e63]"
                      />
                      <p className="text-[10px] text-amber-800 mt-1">
                        Zaroori: Iske bina silent printing dialog me ruk jayegi.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Box / Price Summary */}
              <div className="bg-[#fff9ec] border border-[#f0e2ba] rounded-2xl p-3.5 text-xs space-y-1">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Printing Rate:</span>
                  <span>
                    {totalPages} pgs × {copies} {copies > 1 ? "copies" : "copy"} (
                    {isColor ? "Colour" : "B&W"})
                  </span>
                </div>
                {isDuplex && (
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Duplex Discount:</span>
                    <span className="text-emerald-700 font-bold">Both sides rate applied</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-[#111114] pt-2 border-t border-[#f0e2ba]">
                  <span>Total Amount (कुल):</span>
                  <span className="text-[#ff2e63] text-base">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Step 3: Payment Method Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-[#111114] mb-1.5">
                  Payment Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("PAY_AT_COUNTER")}
                    className={`p-2.5 rounded-xl text-left border-2 transition ${
                      paymentMethod === "PAY_AT_COUNTER"
                        ? "border-[#ff2e63] bg-[#fff2f5] text-[#111114]"
                        : "border-[#ece3d2] bg-white text-slate-600"
                    }`}
                  >
                    <div className="text-xs font-bold">Pay at Counter</div>
                    <div className="text-[10px] text-slate-500">Cash ya Dukaan QR</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-2.5 rounded-xl text-left border-2 transition ${
                      paymentMethod === "UPI"
                        ? "border-[#ff2e63] bg-[#fff2f5] text-[#111114]"
                        : "border-[#ece3d2] bg-white text-slate-600"
                    }`}
                  >
                    <div className="text-xs font-bold text-[#ff2e63]">Instant UPI</div>
                    <div className="text-[10px] text-slate-500">Auto-Print Directly</div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedFile || isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff2e63] to-[#ff5722] hover:opacity-95 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-[#ff2e63]/30 transition flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dukaan ko bhej rahe hain...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === "PAY_AT_COUNTER"
                        ? "Token Le Aur Printout Payein"
                        : "Pay ₹" + calculateTotal().toFixed(2) + " & Auto-Print"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerPrintPortal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#fffdf8] flex flex-col items-center justify-center p-4 text-slate-600">
          <div className="w-8 h-8 rounded-full border-4 border-[#ff2e63] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-bold">Loading print portal...</p>
        </div>
      }
    >
      <CustomerPrintPortalContent params={params} />
    </React.Suspense>
  );
}
