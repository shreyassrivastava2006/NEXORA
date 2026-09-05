import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Landmark, LogOut, ShieldCheck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_NAV = {
  MERCHANT: {
    path: "/dashboard", active: "My Scales", secondary: "Verify a Scale", icon: Store,
    color: "text-primary", panel: "bg-emerald-500/10 border-emerald-500/30", iconColor: "text-emerald-600", label: "Trader Account",
  },
  LMO: {
    path: "/inspector", active: "Inspection Queue", secondary: "Verify Seal", icon: ShieldCheck,
    color: "text-blue-600", panel: "bg-blue-500/10 border-blue-500/30", iconColor: "text-blue-600", label: "LMO Officer",
  },
  GAT: {
    path: "/inspector", active: "Lab Hub", secondary: "Verify Scales", icon: Building2,
    color: "text-purple-600", panel: "bg-purple-500/10 border-purple-500/30", iconColor: "text-purple-600", label: "GAT Centre",
  },
  ADMIN: {
    path: "/admin", active: "Assign Inspections", secondary: "Overview", icon: Landmark,
    color: "text-amber-600", panel: "bg-amber-500/10 border-amber-500/30", iconColor: "text-amber-600", label: "State Authority",
  },
};

export default function RoleNav({ user, onLogout, isMobile = false }) {
  const navigate = useNavigate();
  const config = ROLE_NAV[user.role];
  const Icon = config.icon;
  const displayName = user.role === "MERCHANT" ? user.businessName : user.officerName;
  const identifier = user.role === "MERCHANT" ? `LMRN: ${user.lmrn || "LM-001"}` : (user.badgeId || `${user.role}-1`);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const links = (
    <div className="flex flex-col gap-3">
      <Link to={config.path} className={`text-sm font-bold ${config.color}`}>{config.active}</Link>
      <Link to="/verify" className="text-sm font-semibold">{user.role === "ADMIN" ? "Verify a Scale" : config.secondary}</Link>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        {links}
        <div className="p-3 bg-muted rounded-xl border text-xs space-y-2">
          <p className="font-bold">{displayName || "Portal User"}</p>
          <p className={`text-[10px] ${config.color} font-mono font-bold`}>{identifier}</p>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full text-xs gap-1.5"><LogOut className="h-3.5 w-3.5" /> Logout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4 text-xs font-semibold">
        <Link to={config.path} className={`${config.color} font-bold hover:underline`}>{config.active}</Link>
        <Link to="/verify" className="text-muted-foreground hover:text-foreground">{user.role === "ADMIN" ? "Verify a Scale" : config.secondary}</Link>
      </div>
      <div className={`flex items-center gap-2 ${config.panel} border px-3 py-1.5 rounded-xl text-xs`}>
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
        <div className="leading-tight">
          <span className="font-bold text-foreground block max-w-32 truncate">{displayName || "Portal User"}</span>
          <span className={`text-[9px] ${config.iconColor} font-mono font-bold`}>{user.role === "MERCHANT" ? "Trader Account" : identifier}</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs hover:bg-rose-50 hover:text-rose-600" aria-label="Logout"><LogOut className="h-3.5 w-3.5" /></Button>
    </div>
  );
}