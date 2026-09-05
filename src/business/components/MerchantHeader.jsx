import React from "react";
import { Store, Building2, PlusCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MerchantHeader({ currentUser, onOpenAddModal }) {
  return (
    <div className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-bold gap-1 border-primary/30 bg-primary/5 text-primary">
            <Store className="h-3 w-3" /> My business
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            LMRN: {currentUser?.lmrn || "LM-001"}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          {currentUser?.businessName || "Commercial Trader"}
        </h1>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" /> {currentUser?.location || "Hazratganj, Lucknow, UP"} • GSTIN: <span className="font-mono font-semibold text-foreground">{currentUser?.gstin || "GST-001"}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onOpenAddModal} className="font-bold text-xs gap-1.5 shadow-md">
          <PlusCircle className="h-4 w-4" /> Add a scale
        </Button>
        <Button variant="outline" onClick={() => window.print()} className="text-xs gap-1.5">
          <Printer className="h-4 w-4" /> Print certificates
        </Button>
      </div>
    </div>
  );
}