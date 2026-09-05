import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Camera, 
  Building2, 
  Scale, 
  X, 
  FileCheck,
  CheckCircle2,
  MapPin,
  LoaderCircle,
  XCircle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/auth"; 
import { getAllScales, certifyScale, rejectScale } from "@/data/mockdata";

export default function InspectorDashboard() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [testMass, setTestMass] = useState("");
  const [recordedError, setRecordedError] = useState("0.00 g");
  const [notes, setNotes] = useState("Physical wire seal affixed; Zero-load and Full-load tested.");
  const [photoBase64, setPhotoBase64] = useState(null);
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionLocation, setInspectionLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const loadAssignedTasks = () => {
    const all = getAllScales();
    const assigned = all.filter(
      (s) => s.status === "ASSIGNED_TO_LMO" && s.assignedTo === currentUser?.badgeId
    );
    setTasks(assigned);
  };

  useEffect(() => {
    loadAssignedTasks();
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAuditModal = (task) => {
    setActiveTask(task);
    setTestMass(task.capacity || "500 g");
    setRecordedError("0.00 g");
    setPhotoBase64(null);
    setInspectionLocation(null);
    setLocationError("");
    setRejectionReason("");
    setInspectionDate(task.scheduledInspectionDate || task.requestedInspectionDate || new Date().toISOString().split("T")[0]);
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("This browser does not support GPS location.");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setInspectionLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: Math.round(coords.accuracy),
          capturedAt: new Date().toISOString(),
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError("Location permission was denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleAuditSubmit = (e) => {
    e.preventDefault();
    if (!photoBase64) {
      alert("Please upload a photo of the applied seal to complete the audit.");
      return;
    }

    if (!inspectionLocation) {
      alert("Please capture your current GPS location before completing the inspection.");
      return;
    }

    if (inspectionDate < activeTask.appliedDate) {
      alert("Inspection date cannot be before the application date.");
      return;
    }

    certifyScale(activeTask.id, currentUser?.badgeId || "LMO-1", {
      photoUrl: photoBase64,
      errorRecorded: recordedError,
      testMassUsed: testMass || activeTask.capacity,
      notes: notes,
      inspectionDate,
      inspectionLocation,
    });

    setActiveTask(null);
    loadAssignedTasks();
    alert(`Scale #${activeTask.serialNumber} has been verified and certified.`);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }

    if (!inspectionLocation) {
      alert("Please capture your current GPS location before rejecting the inspection.");
      return;
    }

    rejectScale(activeTask.id, currentUser?.badgeId || "LMO-1", {
      reason: rejectionReason.trim(),
      notes,
      photoUrl: photoBase64,
      inspectionDate,
      inspectionLocation,
    });
    setActiveTask(null);
    loadAssignedTasks();
    alert(`Scale #${activeTask.serialNumber} was rejected and sent to the admin record.`);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 font-sans">
      
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] font-bold">
            <ShieldCheck className="h-3 w-3 mr-1" /> Inspector workspace
          </Badge>
          <h1 className="text-2xl font-black">{currentUser?.officerName || "Srajal"}</h1>
          <p className="text-xs text-slate-400 font-mono">
            Badge: {currentUser?.badgeId || "LMO-1"} • Jurisdiction: Lucknow
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Queue</span>
            <span className="text-xl font-black text-amber-400 font-mono">{tasks.length} to inspect</span>
        </div>
      </div>

      <Card className="shadow-sm border">
        <CardHeader className="bg-muted/30 border-b p-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" /> Scales waiting for inspection
          </CardTitle>
          <CardDescription className="text-xs">
            Check the scale, add a photo, and approve it.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
              <p className="font-bold text-sm text-foreground">No Audits Pending</p>
              <p className="text-xs">All assigned scales have been verified.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className="p-4 border rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card hover:bg-muted/30 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary text-sm">{task.id}</span>
                    <Badge variant="outline" className="text-[10px] text-blue-700 border-blue-300 bg-blue-50">
                      Assigned to You
                    </Badge>
                  </div>
                  <p className="font-bold text-sm text-foreground">{task.businessName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {task.locationTag || task.location}
                  </p>
                  <div className="flex gap-2 text-[11px] text-slate-600 font-mono pt-1">
                    <span>Serial: {task.serialNumber}</span> • 
                    <span>Class: {task.category}</span> • 
                    <span className="font-bold">Max: {task.capacity}</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-700 pt-1">
                    Planned inspection: {task.scheduledInspectionDate || task.requestedInspectionDate || "Date to be confirmed"}
                  </p>
                </div>

                <Button 
                  onClick={() => openAuditModal(task)} 
                  className="text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-sm shrink-0"
                >
                  <Camera className="h-3.5 w-3.5" /> Inspect this scale
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {activeTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-3 sticky top-0 bg-card z-10">
              <div>
                  <CardTitle className="text-base font-bold">Complete inspection</CardTitle>
                <CardDescription className="text-xs">
                  Record the test result and upload a photo of the seal.
                </CardDescription>
              </div>
              <button onClick={() => setActiveTask(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </CardHeader>

            <form onSubmit={handleAuditSubmit}>
              <CardContent className="space-y-4 pt-4 text-xs">
                
                <div className="p-3 bg-muted/60 border rounded-xl space-y-1">
                  <p className="font-bold text-foreground text-sm">{activeTask.businessName}</p>
                  <p className="text-muted-foreground font-mono text-[11px]">
                    Serial: {activeTask.serialNumber} • Capacity: {activeTask.capacity}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Test weight used</Label>
                    <Input required value={testMass} onChange={(e) => setTestMass(e.target.value)} />
                  </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="inspectionDate">Inspection performed on *</Label>
                  <Input id="inspectionDate" type="date" required min={activeTask.appliedDate} value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />
                  <p className="text-[10px] text-muted-foreground">You may record an early or late inspection date.</p>
                </div>

                <div className="grid gap-2 border rounded-xl p-3 bg-blue-500/5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Label>Inspection location *</Label>
                      <p className="text-[10px] text-muted-foreground mt-1">Capture your real GPS location at the inspection site.</p>
                    </div>
                    <Button type="button" variant="outline" onClick={captureLocation} disabled={isLocating} className="text-xs gap-1.5 shrink-0">
                      {isLocating ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
                      {isLocating ? "Locating..." : inspectionLocation ? "Recapture GPS" : "Capture GPS"}
                    </Button>
                  </div>
                  {inspectionLocation && <p className="text-[10px] text-emerald-700 font-mono">Captured: {inspectionLocation.latitude.toFixed(6)}, {inspectionLocation.longitude.toFixed(6)} (accuracy {inspectionLocation.accuracy}m)</p>}
                  {locationError && <p className="text-[10px] text-rose-600">{locationError}</p>}
                </div>
                  <div className="grid gap-1.5">
                    <Label>Observed error</Label>
                    <Input required value={recordedError} onChange={(e) => setRecordedError(e.target.value)} placeholder="e.g. +0.01 g" />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="rejectionReason">Rejection reason</Label>
                  <Input id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Required only when rejecting" />
                </div>

                <div className="grid gap-2">
                  <Label className="font-bold text-foreground">Photo of the seal *</Label>
                  <div className="border-2 border-dashed rounded-2xl p-4 text-center hover:bg-muted/30 transition relative cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      required 
                      onChange={handleImageChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    {photoBase64 ? (
                      <div className="space-y-2">
                        <img src={photoBase64} alt="Seal Preview" className="h-36 mx-auto rounded-lg object-cover border" />
                        <p className="text-[10px] text-emerald-600 font-bold">✓ Photo loaded. Click to change.</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 py-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Camera className="h-5 w-5" />
                        </div>
                        <p className="font-bold text-foreground">Click to take or upload a photo</p>
                        <p className="text-[10px] text-muted-foreground">Show the seal attached to the scale.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label>Notes</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </CardContent>

              <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-card">
                <Button type="button" variant="outline" onClick={() => setActiveTask(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                  <FileCheck className="h-3.5 w-3.5" /> Approve scale
                </Button>
                <Button type="button" variant="destructive" onClick={handleReject} className="text-xs font-bold gap-1.5">
                  <XCircle className="h-3.5 w-3.5" /> Reject scale
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}