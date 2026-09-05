import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  ExternalLink, 
  Clock, 
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ScaleTable({ scales, onSelectQR, onReverify }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredScales = scales.filter((scale) => {
    if (activeFilter === "VERIFIED") return scale.status === "VERIFIED";
    if (activeFilter === "PENDING") {
      return scale.status === "PENDING_ASSIGNMENT" || scale.status === "ASSIGNED_TO_LMO";
    }
    if (activeFilter === "EXPIRED") return scale.status === "EXPIRED";
    return true;
  });

  return (
    <Card className="shadow-sm border overflow-hidden">
      <CardHeader className="border-b bg-muted/20 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
            <CardTitle className="text-base font-bold">My scales</CardTitle>
          <CardDescription className="text-xs">
            Track each scale from application to approved certificate.
          </CardDescription>
        </div>

        <div className="flex gap-1.5 text-xs">
          {["ALL", "VERIFIED", "PENDING", "EXPIRED"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                activeFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
                <TableHead className="text-xs font-bold">Application / Certificate</TableHead>
              <TableHead className="text-xs font-bold">Serial number</TableHead>
              <TableHead className="text-xs font-bold">Type</TableHead>
              <TableHead className="text-xs font-bold">Capacity</TableHead>
                  <TableHead className="text-xs font-bold">Valid until</TableHead>
                  <TableHead className="text-xs font-bold">What happens next</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {filteredScales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <p className="font-semibold text-sm text-foreground">No Weighing Instruments Found</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                    Click <strong>"Add a scale"</strong> above to start.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredScales.map((scale) => (
                <TableRow key={scale.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-primary">{scale.id}</TableCell>
                  <TableCell>
                    <p className="font-mono font-semibold">{scale.serialNumber}</p>
                    <p className="text-[10px] text-muted-foreground">{scale.locationTag || "Checkout Register"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{scale.category}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">Tolerance: {scale.mpeTolerance}</p>
                  </TableCell>
                  <TableCell className="font-semibold">{scale.capacity}</TableCell>
                  <TableCell className="font-mono">
                    <p>{scale.validUntil}</p>
                    {scale.inspectionDate ? (
                      <p className="text-[10px] text-emerald-700">Inspected {scale.inspectionDate}</p>
                    ) : scale.scheduledInspectionDate ? (
                      <p className="text-[10px] text-blue-700">Scheduled {scale.scheduledInspectionDate}</p>
                    ) : scale.requestedInspectionDate ? (
                      <p className="text-[10px] text-amber-700">Requested {scale.requestedInspectionDate}</p>
                    ) : null}
                  </TableCell>
                  
                  <TableCell>
                    {scale.status === "VERIFIED" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 gap-1 text-[10px]">
                        <CheckCircle2 className="h-3 w-3" /> APPROVED
                      </Badge>
                    ) : scale.status === "ASSIGNED_TO_LMO" ? (
                      <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/30 gap-1 text-[10px]">
                        <ShieldCheck className="h-3 w-3" /> INSPECTION SCHEDULED
                      </Badge>
                    ) : scale.status === "PENDING_ASSIGNMENT" ? (
                      <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 gap-1 text-[10px]">
                        <Clock className="h-3 w-3" /> WAITING FOR INSPECTOR
                      </Badge>
                    ) : scale.status === "REJECTED" ? (
                      <Badge variant="destructive" className="bg-rose-500/10 text-rose-700 border-rose-500/30 gap-1 text-[10px]">
                        <AlertTriangle className="h-3 w-3" /> INSPECTION REJECTED
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-rose-500/10 text-rose-700 border-rose-500/30 gap-1 text-[10px]">
                        <AlertTriangle className="h-3 w-3" /> EXPIRED
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right space-x-1.5">
                    {scale.status === "VERIFIED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectQR(scale)}
                        className="text-xs h-7 gap-1 font-semibold"
                      >
                        <QrCode className="h-3 w-3" /> QR Seal
                      </Button>
                    )}

                    {scale.status === "EXPIRED" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onReverify(scale)}
                        className="text-xs h-7 gap-1 font-bold shadow-sm"
                      >
                        <RotateCcw className="h-3 w-3" /> Renew certificate
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/verify?id=${scale.id}`)}
                      className="text-xs h-7 font-bold text-primary hover:underline"
                    >
                        View <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}