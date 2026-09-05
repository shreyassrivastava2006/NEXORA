import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X, Camera, Upload, Sparkles } from "lucide-react";

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("camera");
  const [errorMessage, setErrorMessage] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const getCleanCertId = (rawText) => {
    let text = decodeURIComponent(rawText.trim());
    if (text.includes("id=")) {
      const parts = text.split("id=");
      if (parts[1]) {
        return parts[1].split("&")[0];
      }
    }
    return text;
  };

  const handleScanDone = (scannedText) => {
    const certId = getCleanCertId(scannedText);
    if (onScanSuccess) {
      onScanSuccess(certId);
    } else {
      navigate(`/verify?id=${encodeURIComponent(certId)}`);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen || activeTab !== "camera") return;

    const qrScanner = new Html5Qrcode("live-qr-box");
    scannerRef.current = qrScanner;

    qrScanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          qrScanner.stop().catch(() => {});
          handleScanDone(decodedText);
        },
        () => {}
      )
      .catch((err) => {
        console.log("Camera error:", err);
        setErrorMessage("Could not start camera. Please upload an image or use demo buttons.");
      });

    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
        scannerRef.current.clear();
      }
    };
  }, [isOpen, activeTab]);

  const handleFileScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileScanner = new Html5Qrcode("photo-scan-hidden");
    fileScanner
      .scanFile(file, true)
      .then((decodedText) => {
        fileScanner.clear();
        handleScanDone(decodedText);
      })
      .catch(() => {
        alert("Could not detect a QR code in this image. Try another photo.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-sm bg-card rounded-2xl overflow-hidden shadow-2xl border-2">
        
        <CardHeader className="bg-muted/50 flex flex-row items-center justify-between p-3.5 border-b">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-primary" /> Scan Metrology Seal
          </CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </CardHeader>

        <div className="flex border-b bg-muted/20 text-xs">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 py-2.5 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === "camera"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Live Camera
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2.5 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === "upload"
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload Photo
          </button>
        </div>

        <CardContent className="p-4 space-y-4">
          {activeTab === "camera" ? (
            <div className="space-y-2">
              <div id="live-qr-box" className="w-full aspect-square rounded-xl overflow-hidden bg-black relative border" />
              {errorMessage ? (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px]">
                  {errorMessage}
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-[11px]">
                  Point camera directly at the QR sticker on the scale.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl p-6 cursor-pointer bg-muted/20 hover:bg-muted/40 transition flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs font-bold">Choose QR Screenshot or Photo</p>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG, or WebP</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileScan}
                className="hidden"
              />
              <div id="photo-scan-hidden" className="hidden" />
            </div>
          )}

          <div className="border-t pt-3 space-y-1.5 text-left">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
              <Sparkles className="w-3 h-3 text-primary" /> 1-Click Quick Demo Seals:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleScanDone("CERT-2026-8812")}
                className="text-[10px] font-mono bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 p-1.5 rounded-lg text-left truncate hover:bg-emerald-500/20 transition"
              >
                🟢 CERT-2026-8812 (Valid)
              </button>
              <button
                type="button"
                onClick={() => handleScanDone("CERT-2024-1109")}
                className="text-[10px] font-mono bg-rose-500/10 text-rose-700 border border-rose-500/30 p-1.5 rounded-lg text-left truncate hover:bg-rose-500/20 transition"
              >
                🔴 CERT-2024-1109 (Expired)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}