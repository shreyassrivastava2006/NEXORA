import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function StatCards({ scales }) {
  const totalCount = scales.length;
  const verifiedCount = scales.filter((s) => s.status === "VERIFIED").length;
  const expiredCount = scales.filter((s) => s.status === "EXPIRED").length;
  const complianceScore = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">My scales</CardDescription>
            <CardTitle className="text-2xl font-black">{totalCount}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Added to this business
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Approved</CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600">{verifiedCount}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Ready for customers
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Progress</CardDescription>
            <CardTitle className="text-2xl font-black text-primary">{complianceScore}%</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Scales approved
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-semibold">Needs attention</CardDescription>
            <CardTitle className={`text-2xl font-black ${expiredCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {expiredCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {expiredCount > 0 ? "Renew certificate" : "Nothing overdue"}
          </CardContent>
        </Card>
      </div>

      {expiredCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold text-sm">Certificate renewal needed</p>
            <p className="text-rose-700 leading-relaxed">
              You have <strong>{expiredCount} scale(s)</strong> with an expired certificate. Apply for a new inspection before using them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}