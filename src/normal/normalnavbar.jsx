import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function GuestNav({ isMobile = false }) {
  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "Verify Scale", href: "/verify" },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        {publicLinks.map((item) => (
          <Link key={item.href} to={item.href} className="text-sm font-semibold hover:text-primary">
            {item.label}
          </Link>
        ))}
        <div className="flex flex-col gap-2 pt-4 border-t">
          <Button variant="outline" asChild className="w-full text-xs">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild className="w-full text-xs font-bold">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:flex items-center gap-6 text-xs font-semibold">
        {publicLinks.map((item) => (
          <Link key={item.href} to={item.href} className="text-muted-foreground hover:text-foreground transition">
            {item.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" asChild className="text-xs">
          <Link to="/login">Sign In</Link>
        </Button>
        <Button asChild className="text-xs font-bold">
          <Link to="/register">Register</Link>
        </Button>
      </div>
    </>
  );
}