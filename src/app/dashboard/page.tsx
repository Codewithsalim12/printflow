"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  IndianRupee,
  Layers,
  CheckCircle2,
  Clock,
  QrCode,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Download,
  Key,
  ShieldCheck,
  Check,
  Smartphone,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

interface PrintJob {
  id: string;
  originalFileName: string;
  totalPages: number;
  copies: number;
  paperSize: string;
  isColor: boolean;
  isDuplex: boolean;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  printStatus: string;
  customerPhone?: string;
  createdAt: string;
}

export default function ShopkeeperDashboard() {
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [showStandee, setShowStandee] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const shopSlug = "sharma-cyber-cafe";
  const agentToken = "agent_sharma_cyber_live_token_99x";
  const counterCode = "7890";

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs?shopId=shop_sharma_001`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (jobId: string) => {
    setApprovingId(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}/counter-approve`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchJobs();
      }
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setApprovingId(null);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(agentToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const pendingCount = jobs.filter((j) => j.printStatus === "AWAITING_PAYMENT").length;
  const printedJobs = jobs.filter((j) => j.printStatus === "PRINTED" || j.paymentStatus === "PAID");
  const todayRevenue = printedJobs.reduce((sum, j) => sum + j.totalAmount, 0);
  const totalPagesPrinted = printedJobs.reduce((sum, j) => sum + j.totalPages * j.copies, 0);

  return (
    <div className="min-h-screen bg-[#fff9ec] text-[#111114] flex flex-col md:flex-row selection:bg-[#ffd22e]">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#17171b] text-slate-300 p-5 flex flex-col justify-between shrink-0 border-r border-[#26262e]">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#26262e]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff2e63] to-[#ff6b35] flex items-center justify-center text-white shadow-md">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-white text-base">PrintFlow</div>
              <div className="text-[10px] text-slate-400 font-bold">Sharma Cyber Cafe</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs font-bold">
            <a
              href="#queue"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#ff2e63]/20 text-[#ff2e63] border-l-4 border-[#ff2e63]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Live Print Queue</span>
            </a>

            <button
              onClick={() => setShowStandee(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition text-left"
            >
              <QrCode className="w-4 h-4 text-[#ffd22e]" />
              <span>Counter QR Standee</span>
            </button>

            <Link
              href={`/print/${shopSlug}`}
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <Smartphone className="w-4 h-4 text-[#10b981]" />
              <span>Customer Mobile Scan</span>
            </Link>
          </nav>

          {/* Connected Printers Box */}
          <div className="bg-[#1f1f25] border border-[#2e2e38] rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
              <span>Connected Printers</span>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between items-center text-white font-medium">
                <span>HP LaserJet 1020</span>
                <span className="text-[10px] text-emerald-400 font-bold">B&W Default</span>
              </div>
              <div className="flex justify-between items-center text-white font-medium">
                <span>Epson EcoTank L3210</span>
                <span className="text-[10px] text-amber-400 font-bold">Color Default</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Status Strip */}
        <div className="bg-[#1f1f25] border border-[#2e2e38] rounded-2xl p-3 text-xs space-y-2 mt-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span>Windows Agent: Online</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            Token: {agentToken}
          </div>
          <button
            onClick={copyToken}
            className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition"
          >
            {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedToken ? "Copied!" : "Copy Agent Token"}</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ece3d2] rounded-2xl p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#111114]">
                Sharma Cyber Cafe &amp; Xerox
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#047857] border border-[#10b981]/30 text-xs font-black">
                Counter Code: {counterCode}
              </span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">
              Live automated Xerox counter • Zero WhatsApp downloads
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStandee(true)}
              className="px-3.5 py-2 rounded-xl bg-[#ffd22e] hover:bg-[#ffc000] text-[#111114] font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <QrCode className="w-4 h-4" />
              <span>Print Standee QR</span>
            </button>
            <button
              onClick={fetchJobs}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Refresh Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Stat Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#ece3d2] rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center text-xs text-[#64748b] font-bold">
              <span>Today&apos;s Income</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#ff2e63] mt-2">
              ₹{todayRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] text-[#059669] font-bold mt-1">
              ✓ Direct to shopkeeper
            </div>
          </div>

          <div className="bg-white border-2 border-[#ff6b35] rounded-2xl p-4 shadow-md shadow-[#ff6b35]/10">
            <div className="flex justify-between items-center text-xs text-[#64748b] font-bold">
              <span>Counter Approval Pending</span>
              <Clock className="w-4 h-4 text-[#ea580c]" />
            </div>
            <div className="text-3xl font-black text-[#ea580c] mt-2">
              {pendingCount}
            </div>
            <div className="text-[11px] text-[#ea580c] font-bold mt-1">
              Needs 1-click &quot;Approve&quot;
            </div>
          </div>

          <div className="bg-white border border-[#ece3d2] rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center text-xs text-[#64748b] font-bold">
              <span>Pages Printed</span>
              <Layers className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div className="text-3xl font-black text-[#111114] mt-2">
              {totalPagesPrinted}
            </div>
            <div className="text-[11px] text-slate-500 font-bold mt-1">
              Single &amp; Duplex sheets
            </div>
          </div>

          <div className="bg-white border border-[#ece3d2] rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center text-xs text-[#64748b] font-bold">
              <span>Active Agent Status</span>
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            </div>
            <div className="text-base font-black text-[#111114] mt-3">
              Ready &amp; Polling
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
              SumatraPDF CLI Spooler
            </div>
          </div>
        </div>

        {/* Live Incoming Print Queue Table */}
        <div id="queue" className="bg-white border border-[#ece3d2] rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-[#ece3d2] flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#111114]">
                Live Counter Print Queue
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                New customer uploads appear here in real-time
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ff2e63]/10 text-[#ff2e63]">
              {jobs.length} Total Jobs
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm font-bold">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff2e63] mb-2" />
              Loading print queue...
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm font-medium">
              <Printer className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="font-bold text-[#111114]">No print jobs in queue right now.</p>
              <p className="text-xs text-slate-400 mt-1">
                Scan the counter QR on your phone to send a test document!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#17171b] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Document</th>
                    <th className="py-3 px-4">Settings</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Print Status</th>
                    <th className="py-3 px-4 text-right">Counter Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece3d2]">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#fffdf8] transition">
                      <td className="py-3.5 px-4 font-mono font-black text-[#ff2e63] text-sm">
                        {job.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#111114] max-w-[200px] truncate">
                        {job.originalFileName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">
                        <span>{job.totalPages} pgs</span> × {job.copies}{" "}
                        {job.isDuplex && (
                          <span className="text-[#ff2e63] bg-[#fff2f5] px-1.5 py-0.5 rounded text-[10px] ml-1 font-bold">
                            Duplex
                          </span>
                        )}
                        {job.isColor ? (
                          <span className="text-[#ea580c] bg-[#fff7ed] px-1.5 py-0.5 rounded text-[10px] ml-1 font-bold">
                            Colour
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px] ml-1 font-medium">B&amp;W</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-black text-sm text-[#111114]">
                        ₹{job.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            job.paymentStatus === "PAID"
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : "bg-[#fef3c7] text-[#b45309]"
                          }`}
                        >
                          {job.paymentStatus} ({job.paymentMethod})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            job.printStatus === "PRINTED"
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : job.printStatus === "PRINTING"
                              ? "bg-[#fef3c7] text-[#b45309] animate-pulse"
                              : job.printStatus === "QUEUED"
                              ? "bg-[#eff6ff] text-[#1d4ed8]"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {job.printStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {job.printStatus === "AWAITING_PAYMENT" ? (
                          <button
                            onClick={() => handleApprove(job.id)}
                            disabled={approvingId === job.id}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:opacity-95 disabled:opacity-50 text-white font-black text-xs shadow-md transition inline-flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {approvingId === job.id ? "Approving..." : "Approve & Print"}
                            </span>
                          </button>
                        ) : job.printStatus === "QUEUED" ? (
                          <span className="text-[#1d4ed8] font-bold text-xs italic">
                            Queued for Agent
                          </span>
                        ) : job.printStatus === "PRINTED" ? (
                          <span className="text-[#15803d] font-bold text-xs">
                            ✓ Printed
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 3. PRINTABLE COUNTER STANDEE MODAL */}
      {showStandee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-[#111114] rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border-4 border-[#ff2e63]">
            <button
              onClick={() => setShowStandee(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-sm font-black"
            >
              ✕
            </button>

            <div className="inline-block px-3 py-1 rounded-full bg-[#fff2f5] text-[#ff2e63] text-xs font-black mb-2">
              SELF-SERVICE XEROX COUNTER
            </div>

            <h3 className="text-xl font-black text-[#111114]">
              Sharma Cyber Cafe &amp; Xerox
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Scan with your Phone Camera or Google Lens
            </p>

            <div className="my-4 p-4 bg-[#fffdf8] rounded-2xl border-2 border-dashed border-[#ff2e63] inline-block shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/qr/${shopSlug}`}
                alt="Counter Print QR"
                className="w-52 h-52 mx-auto object-contain"
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 font-bold text-left bg-[#fff9ec] p-3 rounded-xl border border-[#ece3d2]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ff2e63] text-white flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>QR scan karein aur file upload karein</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ff2e63] text-white flex items-center justify-center text-[10px] font-black">
                  2
                </span>
                <span>Single / Duplex &amp; B&amp;W / Colour chunein</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#ff2e63] text-white flex items-center justify-center text-[10px] font-black">
                  3
                </span>
                <span>Online ya counter par pay karein aur print lein</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#ff2e63] to-[#ff5722] text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Print This Standee for Counter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
