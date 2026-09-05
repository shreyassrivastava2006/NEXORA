import React, { useState } from "react";
import { X, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitInstrumentApplication } from "@/data/mockdata";

const ACCURACY_OPTIONS = [
  { value: "Class I Precision Analytical Balance", label: "Class I - Analytical Balance", cap: "200 g", tol: "± 0.001 g" },
  { value: "Class II High Precision Scale (Jewelry)", label: "Class II - High Accuracy (Jewelry/Gold)", cap: "500 g", tol: "± 0.05 g" },
  { value: "Class III Counter Scale (Retail Grocery)", label: "Class III - Counter Scale (Grocery/Retail)", cap: "30 kg", tol: "± 5.0 g" },
  { value: "Class III Heavy Platform Weighing Machine", label: "Class III - Heavy Platform (Mandi)", cap: "300 kg", tol: "± 50 g" },
  { value: "Class IV Industrial Weighbridge (50 Ton)", label: "Class IV - Industrial Weighbridge", cap: "50,000 kg", tol: "± 20 kg" }
];

export default function AddScaleModal({ isOpen, onClose, onScaleCreated, currentUser }) {
  const [serialNumber, setSerialNumber] = useState("");
  const [locationTag, setLocationTag] = useState("Counter 1 (Main Billing)");
  const [category, setCategory] = useState(ACCURACY_OPTIONS[1].value);
  const [capacity, setCapacity] = useState(ACCURACY_OPTIONS[1].cap);
  const [tolerance, setTolerance] = useState(ACCURACY_OPTIONS[1].tol);
  const [requestedInspectionDate, setRequestedInspectionDate] = useState("");

  if (!isOpen) return null;

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    const matched = ACCURACY_OPTIONS.find((item) => item.value === selectedCategory);
    if (matched) {
      setCapacity(matched.cap);
      setTolerance(matched.tol);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newScale = submitInstrumentApplication({
      serialNumber: serialNumber.trim().toUpperCase(),
      businessName: currentUser?.businessName || "Commercial Trader",
      location: currentUser?.location || "Lucknow, UP",
      locationTag: locationTag.trim(),
      category: category,
      capacity: capacity.trim(),
      mpeTolerance: tolerance.trim(),
      requestedInspectionDate,
    });

    if (!newScale) {
      alert("A scale with this serial number already exists.");
      return;
    }

    onScaleCreated();
    onClose();
    alert("Application submitted! Your scale is now waiting for inspector assignment.");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
          <div>
            <CardTitle className="text-base font-bold">Register Weighing Instrument</CardTitle>
            <CardDescription className="text-xs">
              Add a scale so an inspector can check it.
            </CardDescription>
          </div>
          <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
        </CardHeader>

        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="grid gap-1.5">
              <Label>Scale serial number *</Label>
              <Input
                required
                placeholder="e.g. IND-WT-99421"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="uppercase font-mono"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Where is the scale used? *</Label>
              <Input
                required
                placeholder="e.g. Counter 2 - Cashier Desk"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>What kind of scale is it?</Label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border rounded-md p-2 bg-background text-xs"
              >
                {ACCURACY_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Capacity</Label>
                <Input required value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>MPE Tolerance</Label>
                <Input required value={tolerance} onChange={(e) => setTolerance(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="requestedInspectionDate">Preferred inspection date *</Label>
              <Input
                id="requestedInspectionDate"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={requestedInspectionDate}
                onChange={(e) => setRequestedInspectionDate(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">The authority may schedule an earlier or later date.</p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-900">
              <Clock className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[11px]">
                After you submit, an authority assigns an inspector. You can follow the progress from My Scales.
              </p>
            </div>
          </CardContent>

          <div className="p-4 border-t flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-bold gap-1.5">
              <Send className="h-3.5 w-3.5" /> Add scale
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}