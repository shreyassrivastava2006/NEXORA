import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const loggedUser = login(email, password);

    if (loggedUser) {
      if (loggedUser.role === "MERCHANT") {
        navigate("/dashboard");
      } else if (loggedUser.role === "LMO" || loggedUser.role === "GAT") {
        navigate("/inspector");
      } else if (loggedUser.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-sm shadow-md border overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-xs">
            Access your Legal Metrology portal workspace
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLoginSubmit}>
          <CardContent className="flex flex-col gap-4 text-xs">
            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-2">
            <Button type="submit" className="w-full text-xs font-bold">
              Sign In
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs"
              onClick={() => navigate("/register")}
            >
              Don't have an account? Register
            </Button>
          </CardFooter>
        </form>

        <div className="p-3 bg-muted/40 border-t rounded-b-xl space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
            1-Click Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setDemoCredentials("merchant@example.com", "password123")}
              className="p-1.5 border rounded-lg bg-background hover:bg-muted text-left font-medium text-slate-700 transition"
            >
              🏪 <strong>Merchant</strong>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("inspector@example.com", "password123")}
              className="p-1.5 border rounded-lg bg-background hover:bg-muted text-left font-medium text-slate-700 transition"
            >
              ⚖️ <strong>LMO Officer</strong>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("gat@example.com", "password123")}
              className="p-1.5 border rounded-lg bg-background hover:bg-muted text-left font-medium text-slate-700 transition"
            >
              🏢 <strong>GAT Lab</strong>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@example.com", "password123")}
              className="p-1.5 border rounded-lg bg-background hover:bg-muted text-left font-medium text-slate-700 transition"
            >
              🏛️ <strong>Authority</strong>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}