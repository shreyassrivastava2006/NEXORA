import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("MERCHANT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [badgeId, setBadgeId] = useState("");

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const newUserData = {
      email: email.trim(),
      password: password,
      role: role,
      ...(role === "MERCHANT"
        ? {
            businessName: businessName.trim() || "Commercial Trader",
            location: location.trim() || "Lucknow, UP",
            lmrn: `LM-${Math.floor(1000 + Math.random() * 9000)}`,
            gstin: "GST-001",
          }
        : {
            officerName: officerName.trim() || "Officer",
            badgeId: badgeId.trim().toUpperCase() || `${role}-1`,
            district: location.trim() || "Lucknow",
          }),
    };

    const isSuccess = register(newUserData);
    if (isSuccess) {
      alert("Registration successful! Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Portal Registration</CardTitle>
          <CardDescription className="text-xs">
            Create an account under the Legal Metrology Compliance Network
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleRegisterSubmit}>
          <CardContent className="flex flex-col gap-4 text-xs">
            
            <div className="grid gap-1.5">
              <Label htmlFor="role" className="font-bold">Select Role *</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-lg p-2.5 bg-background text-foreground text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="MERCHANT">🏪 Commercial Trader / Store Owner</option>
                <option value="LMO">⚖️ Legal Metrology Officer (LMO)</option>
                <option value="GAT">🏢 Govt Approved Test Centre (GAT)</option>
                <option value="ADMIN">🏛️ State / District Authority</option>
              </select>
            </div>

            {role === "MERCHANT" ? (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="businessName">Registered Business Name *</Label>
                  <Input
                    id="businessName"
                    type="text"
                    required
                    placeholder="e.g. Verma Grocers"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="location">Premises Address *</Label>
                  <Input
                    id="location"
                    type="text"
                    required
                    placeholder="e.g. Shop 14, Hazratganj, Lucknow"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="officerName">Official Full Name *</Label>
                  <Input
                    id="officerName"
                    type="text"
                    required
                      placeholder="e.g. Shreyas Srivastava"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="badgeId">Badge / Centre Code *</Label>
                    <Input
                      id="badgeId"
                      type="text"
                      required
                      placeholder={role === "GAT" ? "GAT-1" : "LMO-1"}
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      className="font-mono uppercase"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="district">Assigned District *</Label>
                    <Input
                      id="district"
                      type="text"
                      required
                      placeholder="e.g. Lucknow"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="email">Official Email *</Label>
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
              <Label htmlFor="password">Password *</Label>
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
              Register Account
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs"
              onClick={() => navigate("/login")}
            >
              Already registered? Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}