import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Search, 
  Award, 
  QrCode, 
  Store, 
  PlusCircle, 
  ShieldCheck, 
  Printer, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import QRScannerModal from "./qrscanner";

export default function Home() {
  const navigate = useNavigate();
  const [certQuery, setCertQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (certQuery.trim()) {
      navigate(`/verify?id=${encodeURIComponent(certQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-6 font-sans">
      
      <section className="text-center space-y-6 pt-4">

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          <span className="text-primary bg-clip-text">Nexora</span>
          <span className="mt-3 block text-sm font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-2 delay-300 duration-1000 ease-out fill-mode-both sm:text-base md:text-lg">
            <span className="motto-underline italic tracking-wide text-red-500">
              &ldquo;Building what matters&rdquo;
            </span>
          </span>
        </h1>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A simple way to register, inspect, and verify weighing scales.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center bg-card p-2 rounded-2xl shadow-lg border gap-2">
          <Search className="h-5 w-5 text-muted-foreground ml-2 shrink-0" />
          <Input
            type="text"
            placeholder="Enter a certificate or serial number"
            value={certQuery}
            onChange={(e) => setCertQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-xs bg-transparent"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <Button type="submit" className="font-bold text-xs px-4">
              Verify
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsScannerOpen(true)} className="font-bold text-xs gap-1.5 px-3">
              <QrCode className="h-3.5 w-3.5" /> Scan
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-medium">Try an example:</span>
          <button
            type="button"
            onClick={() => navigate("/verify?id=CERT-2026-8812")}
            className="text-[11px] font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 rounded-md hover:bg-emerald-500/20 transition font-medium"
          >
            🟢 CERT-2026-8812 (Valid Seal)
          </button>
          <button
            type="button"
            onClick={() => navigate("/verify?id=CERT-2024-1109")}
            className="text-[11px] font-mono bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2.5 py-1 rounded-md hover:bg-rose-500/20 transition font-medium"
          >
            🔴 CERT-2024-1109 (Expired Seal)
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Registered Traders</CardDescription>
            <CardTitle className="text-2xl font-black">14,000+</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Active commercial establishments
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Verified Instruments</CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600">98.4%</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Within statutory error limits
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Public Verification</CardDescription>
            <CardTitle className="text-2xl font-black text-blue-600">&lt; Instant</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Real-time QR camera scanning
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Stamping Cycle</CardDescription>
            <CardTitle className="text-2xl font-black text-amber-600">1 Year</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Mandatory annual re-certification
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs font-bold text-primary bg-primary/10 border-primary/20">
            The simple workflow
          </Badge>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            From scale to certificate in 4 simple steps
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
            One clear process for shop owners, inspectors, and customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border hover:border-primary/50 transition shadow-sm relative">
            <CardHeader className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-base">
                1
              </div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Store className="h-4 w-4 text-primary" /> Register your business
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Create an account and add your shop details.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border hover:border-primary/50 transition shadow-sm relative">
            <CardHeader className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-base">
                2
              </div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <PlusCircle className="h-4 w-4 text-amber-600" /> Add your scale
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Enter the serial number and choose the scale type.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border hover:border-primary/50 transition shadow-sm relative">
            <CardHeader className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-base">
                3
              </div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" /> Inspector checks it
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                An inspector tests the scale and records the result.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border hover:border-primary/50 transition shadow-sm relative">
            <CardHeader className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-base">
                4
              </div>
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Printer className="h-4 w-4 text-emerald-600" /> Share the certificate
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Customers scan the QR code to confirm the scale is approved.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <FileText className="h-3.5 w-3.5" /> For shop owners
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Ready to add a scale?</h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Register your business, follow the inspection, and keep your certificate in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button size="lg" asChild className="font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/register">
              Register your business <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" asChild className="font-bold text-xs text-black border-slate-700 hover:bg-slate-800 hover:text-white">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(value) => {
          setIsScannerOpen(false);
          navigate(`/verify?id=${encodeURIComponent(value)}`);
        }}
      />

    </div>
  );
}