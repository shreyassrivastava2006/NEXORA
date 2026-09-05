import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../auth/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import GuestNav from "@/normal/normalnavbar";
import RoleNav from "./rolenav";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  const renderNavLinks = (isMobile = false) => {
    if (!currentUser) {
      return <GuestNav isMobile={isMobile} />;
    }

    if (["MERCHANT", "LMO", "GAT", "ADMIN"].includes(currentUser.role)) {
      return <RoleNav user={currentUser} onLogout={logout} isMobile={isMobile} />;
    }

    return <GuestNav isMobile={isMobile} />;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        
        <Link to="/" className="font-black text-xl tracking-tight">
          <span>Nexora</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {renderNavLinks(false)}
        </div>

        <div className="flex md:hidden items-center gap-2">
          {!currentUser && (
            <>
              <Button variant="ghost" size="sm" asChild className="h-9 px-2 text-[11px] font-semibold">
                <Link to="/verify">Verify</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="h-9 px-2 text-[11px] font-semibold">
                <Link to="/login">Sign in</Link>
              </Button>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left font-bold">Nexora</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {renderNavLinks(true)}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}