import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QRStickerModal({ scale, onClose }) {
  if (!scale) return null;

  const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(scale.id)}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white text-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Official Compliance e-Seal</span>
          </div>
          <button onClick={onClose}><X className="h-4 w-4 text-slate-400 hover:text-white" /></button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="p-3 border-2 border-dashed border-slate-300 rounded-2xl inline-block bg-slate-50">
            <QRCodeSVG value={verifyUrl} size={160} level="H" includeMargin={true} />
          </div>

          <div className="space-y-1">
            <p className="font-mono font-black text-lg text-primary">{scale.id}</p>
            <p className="font-mono text-xs text-slate-600">Serial: {scale.serialNumber}</p>
            <p className="font-bold text-sm text-slate-900">{scale.businessName}</p>
            <p className="text-[11px] text-slate-500">{scale.locationTag || scale.location}</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-1.5 px-3 rounded-full font-bold inline-block">
            ✓ Officially Verified & Sealed
          </div>

          <Button 
            onClick={() => window.print()} 
            className="w-full text-xs font-bold gap-2 bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Printer className="h-3.5 w-3.5" /> Print Point-of-Sale Sticker
          </Button>
        </div>

      </div>
    </div>
  );
}