import React, { useState, useEffect } from "react";
import { 
  Landmark, 
  Layers, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Building2, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  X, 
  ImageIcon,
  Flag
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/auth"; 
import { getAllScales, getGrievances, resolveGrievance, assignInspectionTask, getAssignableOfficers } from "@/data/mockdata";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [scales, setScales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [auditDetailScale, setAuditDetailScale] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [grievances, setGrievances] = useState([]);

  const loadAllData = () => {
    setScales(getAllScales());
    setOfficers(getAssignableOfficers());
    setGrievances(getGrievances());
  };

  useEffect(() => {
    loadAllData();
    const refreshFromStorage = () => loadAllData();
    window.addEventListener("storage", refreshFromStorage);
    return () => window.removeEventListener("storage", refreshFromStorage);
  }, []);

  const handleAssignOfficer = (appId, officerId, scheduledInspectionDate) => {
    if (!officerId || !scheduledInspectionDate) return;
    const updated = assignInspectionTask(appId, officerId, scheduledInspectionDate);
    setScales(updated);
  };

  const handleResolveGrievance = (grievanceId) => {
    setGrievances(resolveGrievance(grievanceId));
  };

  const totalCount = scales.length;
  const unassignedCount = scales.filter((s) => !s.assignedTo && s.status !== "VERIFIED").length;
  const assignedCount = scales.filter((s) => Boolean(s.assignedTo) && s.status !== "VERIFIED").length;
  const verifiedCount = scales.filter((s) => s.status === "VERIFIED").length;
  const expiredCount = scales.filter((s) => s.status === "EXPIRED").length;
  const complianceRate = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 100;
  const workload = officers.map((officer) => ({
    ...officer,
    count: scales.filter((scale) => scale.assignedTo === officer.id && scale.status !== "VERIFIED").length,
  }));

  const filteredScales = scales.filter((item) => {
    const matchesSearch = 
      item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "UNASSIGNED") return matchesSearch && !item.assignedTo && item.status !== "VERIFIED";
    if (statusFilter === "ASSIGNED") return matchesSearch && Boolean(item.assignedTo) && item.status !== "VERIFIED";
    if (statusFilter === "VERIFIED") return matchesSearch && item.status === "VERIFIED";
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-4 px-4 font-sans">
      
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Landmark className="h-3 w-3" /> Admin
            </span>
            <span className="text-xs text-slate-400 font-mono">
              District: {currentUser?.district || "Lucknow (UP)"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            {currentUser?.officerName || "Admin User"}
          </h1>
          <p className="text-xs text-slate-400">
            Badge: <span className="font-mono text-slate-200 font-semibold">{currentUser?.badgeId || "ADMIN-1"}</span> • Jurisdiction: <span className="text-slate-200">Urban</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAllData} 
            className="text-xs gap-1.5 bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={() => window.print()} 
            className="text-xs font-bold gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md"
          >
            <Download className="h-3.5 w-3.5" /> Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Pending Allocation <Clock className="h-3.5 w-3.5 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black text-amber-600">{unassignedCount} Units</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">Waiting for an inspector</CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Verified & Sealed <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600">{verifiedCount} Units</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">{complianceRate}% District Compliance</CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Overdue Stamping <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black text-rose-600">{expiredCount} Units</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">Renewal needed</CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              Active Field Audits <Users className="h-3.5 w-3.5 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black text-blue-600">{assignedCount} Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">Assigned to an inspector</CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border">
        <CardHeader className="p-4 pb-3 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Inspector and GAT workload</CardTitle>
          <CardDescription className="text-xs">Open assignments for every registered field officer or test centre.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workload.length === 0 ? <p className="text-xs text-muted-foreground">No inspectors or GAT centres registered yet.</p> : workload.map((officer) => (
            <div key={officer.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div><p className="text-sm font-bold">{officer.name}</p><p className="text-[10px] text-muted-foreground font-mono">{officer.type} • {officer.district}</p></div>
              <span className="text-lg font-black text-primary">{officer.count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader className="p-3 pb-2 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2"><Flag className="h-4 w-4 text-rose-600" /> Public grievances</CardTitle>
            <CardDescription className="text-[11px]">Reports submitted from certificate verification.</CardDescription>
          </div>
          <span className="text-xs font-mono font-bold text-rose-600">{grievances.length} Open</span>
        </CardHeader>
        <CardContent className="p-3">
          {grievances.length === 0 ? <p className="text-xs text-muted-foreground">No grievances reported.</p> : (
            <div className="grid gap-2">
              {grievances.slice(0, 4).map((grievance) => (
                <div key={grievance.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2 text-xs">
                  <div><p className="font-bold text-rose-900">{grievance.id} • {grievance.scaleId}</p><p className="text-rose-800">{grievance.businessName} • {grievance.serialNumber} • {grievance.location}</p><span className="text-[10px] text-rose-700 font-mono">{new Date(grievance.reportedAt).toLocaleString()}</span></div>
                  <Button size="sm" variant="outline" onClick={() => handleResolveGrievance(grievance.id)} className="text-[11px] h-7 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-3.5 w-3.5" /> Resolved</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by business, serial number, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-muted/60 p-1 rounded-xl border">
          {["ALL", "UNASSIGNED", "ASSIGNED", "VERIFIED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <Card className="shadow-sm border overflow-hidden">
        <CardHeader className="bg-muted/30 border-b p-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Scales to review
            </CardTitle>
            <CardDescription className="text-xs">
              Assign an inspector to new applications and review completed inspections.
            </CardDescription>
          </div>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {filteredScales.length} Records
          </span>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/20 border-b text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
              <tr>
                <th className="p-3.5">ID / Date</th>
                <th className="p-3.5">Commercial Establishment</th>
                <th className="p-3.5">Hardware Details</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Assign Authority / Evidence</th>
              </tr>
            </thead>

            <tbody className="text-xs divide-y divide-border">
              {filteredScales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    <p className="font-semibold text-sm">No records found matching criteria</p>
                  </td>
                </tr>
              ) : (
                filteredScales.map((item) => {
                  const isVerified = item.status === "VERIFIED";
                  const isRejected = item.status === "REJECTED";

                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition">
                      <td className="p-3.5 align-middle">
                        <span className="font-mono font-bold text-primary block">{item.id}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {item.stampedDate || item.appliedDate}
                        </span>
                        {item.requestedInspectionDate && <span className="text-[10px] text-amber-700 block">Merchant requested: {item.requestedInspectionDate}</span>}
                      </td>

                      <td className="p-3.5 align-middle">
                        <p className="font-bold text-foreground text-sm">{item.businessName}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3 w-3 shrink-0" /> {item.locationTag || item.location}
                        </p>
                      </td>

                      <td className="p-3.5 align-middle">
                        <div className="font-mono font-semibold text-foreground flex items-center gap-2">
                          <span>{item.serialNumber}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-muted rounded border font-mono">
                            Cap: {item.capacity}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{item.category}</p>
                      </td>

                      <td className="p-3.5 align-middle">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            <CheckCircle2 className="h-2.5 w-2.5" /> VERIFIED & SEALED
                          </span>
                        ) : isRejected ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-700 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                              <X className="h-2.5 w-2.5" /> REJECTED
                            </span>
                            <span className="text-[10px] text-rose-700 block max-w-48">{item.rejectionReason || "Reason not recorded"}</span>
                          </div>
                        ) : item.assignedTo ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-700 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                              <ShieldCheck className="h-2.5 w-2.5" /> Assigned: {item.officerName || item.assignedTo}
                            </span>
                            <span className="text-[10px] font-mono text-blue-700 block">Planned: {item.scheduledInspectionDate || "Date pending"}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            <Clock className="h-2.5 w-2.5" /> Awaiting Routing
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 align-middle text-right">
                        {isVerified || isRejected ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setAuditDetailScale(item)}
                            className="text-xs h-7 font-bold gap-1 text-primary border-primary/30 hover:bg-primary/5"
                          >
                            <ImageIcon className="h-3.5 w-3.5" /> View Inspection Details
                          </Button>
                        ) : (
                          <div className="flex flex-col items-end gap-1.5">
                            <select
                            value={item.assignedTo || ""}
                            onChange={(e) => handleAssignOfficer(item.id, e.target.value, item.scheduledInspectionDate || item.requestedInspectionDate || item.appliedDate)}
                            className="border rounded-lg p-1.5 bg-background text-xs font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer min-w-50"
                          >
                            <option value="" disabled>Choose an inspector...</option>
                            {officers.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.name} ({o.district})
                              </option>
                            ))}
                            </select>
                            <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              Inspection date
                              <input
                                type="date"
                                min={item.appliedDate}
                                defaultValue={item.scheduledInspectionDate || item.requestedInspectionDate || item.appliedDate}
                                onChange={(e) => handleAssignOfficer(item.id, item.assignedTo, e.target.value)}
                                className="border rounded-md p-1 bg-background text-foreground font-mono"
                              />
                            </label>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {auditDetailScale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <div>
                  <CardTitle className="text-sm font-bold">Inspection & Seal Evidence</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400 font-mono">
                    ID: {auditDetailScale.id}
                  </CardDescription>
                </div>
              </div>
              <button onClick={() => setAuditDetailScale(null)}><X className="h-4 w-4 text-slate-400 hover:text-white" /></button>
            </CardHeader>

            <CardContent className="p-6 space-y-4 text-xs">
              
              <div className="border rounded-2xl p-2 bg-slate-950 text-center">
                {auditDetailScale.sealPhotoUrl ? (
                  <img 
                    src={auditDetailScale.sealPhotoUrl} 
                    alt="Physical Wire Seal" 
                    className="max-h-56 mx-auto rounded-xl object-contain"
                  />
                ) : (
                  <div className="py-10 text-slate-500 space-y-1">
                    <ImageIcon className="h-8 w-8 mx-auto" />
                    <p>Standard lead wire seal recorded on file.</p>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                  Hardware Serial: {auditDetailScale.serialNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/60 border rounded-xl">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Certified By</span>
                  <p className="font-bold text-foreground">{auditDetailScale.officerName || auditDetailScale.officerCode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Applied Test Mass</span>
                  <p className="font-mono font-bold text-foreground">{auditDetailScale.testMassUsed || auditDetailScale.capacity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Observed Error</span>
                  <p className="font-mono font-bold text-emerald-600">{auditDetailScale.errorRecorded || "0.00 g"}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Valid Until</span>
                  <p className="font-mono font-bold text-foreground">{auditDetailScale.validUntil}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Inspection GPS location</span>
                  {auditDetailScale.inspectionLocation ? (
                    <a
                      href={`https://www.google.com/maps?q=${auditDetailScale.inspectionLocation.latitude},${auditDetailScale.inspectionLocation.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-bold text-blue-700 hover:underline"
                    >
                      {auditDetailScale.inspectionLocation.latitude.toFixed(6)}, {auditDetailScale.inspectionLocation.longitude.toFixed(6)}
                      <span className="font-normal text-muted-foreground"> • ±{auditDetailScale.inspectionLocation.accuracy}m • {new Date(auditDetailScale.inspectionLocation.capturedAt).toLocaleString()}</span>
                    </a>
                  ) : <p className="text-muted-foreground">Location not captured for this record.</p>}
                </div>
                {auditDetailScale.status === "REJECTED" && (
                  <div className="col-span-2 border border-rose-200 bg-rose-50 rounded-xl p-3">
                    <span className="text-[10px] text-rose-700 block font-semibold uppercase">Rejection reason</span>
                    <p className="font-semibold text-rose-800">{auditDetailScale.rejectionReason || "Reason not recorded"}</p>
                    <p className="text-[10px] text-rose-700 mt-1">Rejected on {auditDetailScale.rejectionDate || auditDetailScale.inspectionDate || "date not recorded"}</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => setAuditDetailScale(null)} 
                className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800"
              >
                Close Audit Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}