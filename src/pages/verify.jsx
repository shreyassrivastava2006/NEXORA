import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  Printer,
  QrCode,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { findScale, reportGrievance } from "@/data/mockdata";
import QRScannerModal from "./qrscanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();
  const certificateId = searchParams.get("id");
  const [searchQuery, setSearchQuery] = useState(certificateId || "CERT-2026-8812");
  const [record, setRecord] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [reported, setReported] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [grievanceId, setGrievanceId] = useState(null);

  const findCertificate = (value = searchQuery) => {
    if (!value.trim()) return;

    setRecord(findScale(value));
    setHasSearched(true);
    setReported(false);
    setGrievanceId(null);
  };

  const handleReport = () => {
    const grievance = reportGrievance(record.id);
    if (grievance) {
      setGrievanceId(grievance.id);
      setReported(true);
    }
  };

  useEffect(() => {
    if (certificateId) {
      setSearchQuery(certificateId);
      findCertificate(certificateId);
    } else {
      findCertificate();
    }
  }, [certificateId]);

  const handleScanComplete = (scannedId) => {
    setSearchQuery(scannedId);
    setSearchParams({ id: scannedId });
    findCertificate(scannedId);
  };

  const isVerified = record?.status === "VERIFIED";
  const isExpired = record?.status === "EXPIRED";
  const isRejected = record?.status === "REJECTED";
  const isPending = record && !isVerified && !isExpired && !isRejected;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 font-sans">
      <div>
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
          Check a scale certificate
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter the certificate number or scan the QR code to see whether a scale is approved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            findCertificate();
          }}
          className="flex-1 flex gap-2 bg-card p-2 rounded-2xl border shadow-sm"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter certificate or serial number"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9 border-0 shadow-none text-xs bg-transparent focus-visible:ring-0"
            />
          </div>
          <Button type="submit" className="text-xs font-bold shrink-0">
            Verify
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsScannerOpen(true)}
          className="rounded-2xl gap-1.5 text-xs font-bold shrink-0 h-12 sm:h-auto border-primary/40 hover:bg-primary/5"
        >
          <QrCode className="h-4 w-4 text-primary" /> Scan QR code
        </Button>
      </div>

      {record ? (
        <Card className="overflow-hidden border-2 shadow-lg">
          {isVerified && (
            <div className="p-4 text-white text-center flex flex-col items-center justify-center gap-1 bg-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
              <h2 className="text-sm font-black uppercase tracking-wider">Approved and certified</h2>
              <p className="text-[11px] text-emerald-100">This scale has passed inspection and has a valid certificate.</p>
            </div>
          )}

          {isExpired && (
            <div className="p-4 text-white text-center flex flex-col items-center justify-center gap-1 bg-rose-600">
              <ShieldAlert className="h-8 w-8" />
              <h2 className="text-sm font-black uppercase tracking-wider">Certificate expired</h2>
              <p className="text-[11px] text-rose-100">This scale needs a new inspection before it can be used.</p>
            </div>
          )}

          {isPending && (
            <div className="p-4 text-white text-center flex flex-col items-center justify-center gap-1 bg-amber-600">
              <Clock className="h-8 w-8" />
              <h2 className="text-sm font-black uppercase tracking-wider">Pending inspection</h2>
              <p className="text-[11px] text-amber-100">This scale is waiting for an inspector.</p>
            </div>
          )}

          {isRejected && (
            <div className="p-4 text-white text-center flex flex-col items-center justify-center gap-1 bg-rose-700">
              <ShieldAlert className="h-8 w-8" />
              <h2 className="text-sm font-black uppercase tracking-wider">Inspection rejected</h2>
              <p className="text-[11px] text-rose-100">This instrument was not approved during inspection. No certificate or QR seal was issued.</p>
            </div>
          )}

          <CardContent className="p-6 space-y-6 text-xs">
            <div className="flex flex-wrap justify-between items-center border-b pb-4 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  {isVerified ? "Digital Certificate ID" : "Application Reference ID"}
                </span>
                <p className="text-lg font-mono font-black text-primary">{record.id}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Hardware Serial Number</span>
                <p className="text-sm font-mono font-bold text-foreground">{record.serialNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-muted/40 rounded-xl space-y-1 border">
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> Commercial Establishment
                </div>
                <p className="font-bold text-sm text-foreground">{record.businessName}</p>
                <p className="text-muted-foreground text-[11px]">{record.location}</p>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl space-y-1 border">
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                  <Scale className="h-3.5 w-3.5 text-primary" /> Instrument Category & Specs
                </div>
                <p className="font-bold text-sm text-foreground">{record.category}</p>
                <p className="text-muted-foreground text-[11px]">Max Capacity: <span className="font-semibold text-foreground">{record.capacity}</span></p>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl space-y-1 border">
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Verification Cycle
                </div>
                <p className="text-muted-foreground text-[11px]">Stamped Date: <span className="font-bold text-foreground">{record.stampedDate || "Pending"}</span></p>
                <p className={`text-xs font-black ${isVerified ? "text-emerald-600" : isExpired || isRejected ? "text-rose-600" : "text-amber-600"}`}>
                  Valid Until: {record.validUntil}
                </p>
              </div>

              <div className="p-3.5 bg-muted/40 rounded-xl space-y-1 border">
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Accuracy Standards
                </div>
                <p className="text-muted-foreground text-[11px]">Permissible Tolerance: <span className="font-mono font-bold text-foreground">{record.mpeTolerance}</span></p>
                <p className="text-muted-foreground text-[11px]">Inspector Code: <span className="font-mono font-bold text-foreground">{record.officerCode || record.assignedTo || "Unassigned"}</span></p>
                {isRejected && <p className="text-rose-700 text-[11px] font-semibold">Rejection reason: {record.rejectionReason || "Not provided"}</p>}
              </div>
            </div>

            <div className="pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
              {isVerified && <Button variant="outline" size="sm" onClick={() => window.print()} className="w-full sm:w-auto text-xs gap-1.5">
                <Printer className="h-3.5 w-3.5" /> Print Certificate
              </Button>}

              {reported ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 py-1.5 px-3">
                  Grievance Logged: {grievanceId}
                </Badge>
              ) : (
                <Button variant="destructive" size="sm" onClick={handleReport} className="w-full sm:w-auto text-xs gap-1.5 bg-rose-600 hover:bg-rose-700 text-white">
                  <Flag className="h-3.5 w-3.5" /> Report Weight Discrepancy
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : hasSearched ? (
        <Card className="p-8 text-center border-dashed">
          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <CardTitle className="text-sm font-bold">No Certificate Found</CardTitle>
          <CardDescription className="text-xs mt-1">No record matching "{searchQuery}" was found.</CardDescription>
        </Card>
      ) : null}

      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={handleScanComplete} />
    </div>
  );
}
