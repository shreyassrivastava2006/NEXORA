import React, { useState } from "react";
import { CalendarClock, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReinspectionModal({ scale, onClose, onSubmit }) {
  const today = new Date().toISOString().split("T")[0];
  const [requestedDate, setRequestedDate] = useState(today);

  if (!scale) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(requestedDate);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card rounded-2xl shadow-2xl border">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
          <div>
            <CardTitle className="text-base font-bold">Request re-inspection</CardTitle>
            <CardDescription className="text-xs">Choose a preferred date for scale {scale.serialNumber}.</CardDescription>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"><X className="h-4 w-4 text-muted-foreground" /></button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="grid gap-1.5">
              <Label htmlFor="reinspection-date">Preferred inspection date *</Label>
              <Input id="reinspection-date" type="date" required min={today} value={requestedDate} onChange={(event) => setRequestedDate(event.target.value)} />
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-900">
              <CalendarClock className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[11px]">Admin may assign an earlier or later date and route this to an LMO or GAT.</p>
            </div>
          </CardContent>
          <div className="p-4 border-t flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">Cancel</Button>
            <Button type="submit" className="text-xs font-bold gap-1.5"><Send className="h-3.5 w-3.5" /> Request inspection</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}