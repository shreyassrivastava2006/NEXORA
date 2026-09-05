import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/auth"; 
import ProtectedRoute from "./auth/protectroute";

import Navbar from "./component/navbar";

import Home from "./pages/home";
import Verify from "./pages/verify";
import Login from "./auth/login";
import Register from "./auth/register";
import Dashboard from "./business/dashboard";
import InspectorDashboard from "./LMO/lmodash";
import AdminDashboard from "./admin/admindashboard";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute allowedRoles={["MERCHANT"]}><Dashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/inspector" 
              element={<ProtectedRoute allowedRoles={["LMO", "GAT"]}><InspectorDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/admin" 
              element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}