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
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [printers, setPrinters] = useState<{ id: string; name: string; isColor: boolean; status: string }[]>([]);

  const shopSlug = "sharma-cyber-cafe";
  const agentToken = "agent_sharma_cyber_live_token_99x";
  const counterCode = "7890";

  const fetchShopData = async () => {
    try {
      const res = await fetch(`/api/shops/${shopSlug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.shop?.printers) {
          setPrinters(data.shop.printers);
        }
      }
    } catch {}
  };

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
    fetchShopData();
    const interval = setInterval(() => {
      fetchJobs();
      fetchShopData();
    }, 3000);
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
            <div className="space-y-1.5 text-[11px]">
              {printers.length === 0 ? (
                <div className="text-slate-500 text-[10px] py-1">Connecting to print agent...</div>
              ) : (
                printers.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-white font-medium">
                    <span className="truncate max-w-[130px]" title={p.name}>
                      {p.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        p.isColor ? "bg-amber-950 text-amber-400" : "bg-emerald-950 text-emerald-400"
                      }`}
                    >
                      {p.isColor ? "Colour" : "B&W"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Agent Status Strip */}
        <div className="bg-[#1f1f25] border border-[#2e2e38] rounded-2xl p-3 text-xs space-y-2.5 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className={`w-2.5 h-2.5 rounded-full ${printers.length > 0 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-400 animate-pulse"}`} />
              <span>{printers.length > 0 ? "Agent Online" : "Agent Offline"}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {printers.length} printer{printers.length === 1 ? "" : "s"}
            </span>
          </div>

          <button
            onClick={() => setShowAgentModal(true)}
            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#ff2e63] to-[#ff5722] hover:opacity-90 text-white text-[11px] font-black flex items-center justify-center gap-1.5 transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Agent (.zip)</span>
          </button>

          <button
            onClick={copyToken}
            className="w-full py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1 transition"
          >
            {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedToken ? "Token Copied!" : "Copy Pairing Token"}</span>
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
              onClick={() => setShowAgentModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4 text-[#ffd22e]" />
              <span>Connect Printer</span>
            </button>
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
              {printers.length > 0 ? `${printers.length} Printers Online` : "Ready & Polling"}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5 truncate">
              {printers.length > 0
                ? `${printers[0].name}${printers.length > 1 ? ` (+${printers.length - 1} more)` : ""}`
                : "SumatraPDF CLI Spooler"}
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
                        ) : job.printStatus === "FAILED" ? (
                          <button
                            onClick={() => handleApprove(job.id)}
                            disabled={approvingId === job.id}
                            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-xs shadow transition inline-flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry</span>
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
      {/* 4. AGENT SETUP & PAIRING MODAL */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#262630] text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAgentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff2e63] to-[#ff5722] flex items-center justify-center text-white shadow-lg">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Connect Shop PC &amp; Printers
                </h3>
                <p className="text-xs text-slate-400">
                  Zero setup • Silent physical printing • Works with all USB / Wi-Fi printers
                </p>
              </div>
            </div>

            {/* Live Hardware Status */}
            <div className="mb-6 p-4 rounded-2xl bg-[#191920] border border-[#2a2a36]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">Live Hardware Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1.5 ${
                    printers.length > 0
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      printers.length > 0 ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  {printers.length > 0 ? `${printers.length} Printers Detected Online` : "Waiting for Agent..."}
                </span>
              </div>

              {printers.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {printers.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-slate-200 truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-1 italic">
                  Run the downloaded agent on your shop computer to connect your Brother, HP, or Epson printer automatically.
                </p>
              )}
            </div>

            {/* 3 Step Setup Guide */}
            <div className="space-y-3 mb-6">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-[#ff2e63] text-white flex items-center justify-center text-xs font-black shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-white">Download PrintFlow Agent</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Pre-configured for Sharma Cyber Cafe with your security token embedded.
                  </div>
                  <a
                    href="/api/agent/download"
                    download="PrintFlow-Agent-v2.zip"
                    className="inline-flex items-center gap-2 mt-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff2e63] to-[#ff5722] hover:opacity-95 text-white font-black text-xs shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PrintFlow-Agent-v2.zip (6.6 MB)</span>
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center text-xs font-black shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-white">Extract &amp; Auto-Start</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Right-click the zip &rarr; <b>Extract All</b>. Double-click <b>install-autostart.bat</b>.
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold mt-1">
                    ✓ Automatically runs on Windows boot every morning in the background.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center text-xs font-black shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-white">Pairing Token (Pre-filled)</div>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      readOnly
                      value={agentToken}
                      className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-300 w-full"
                    />
                    <button
                      onClick={copyToken}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold shrink-0 transition"
                    >
                      {copiedToken ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/10">
              <span>Supports Windows 7, 8, 10, 11 (32-bit &amp; 64-bit)</span>
              <span>Lightweight (&lt; 25MB RAM)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
