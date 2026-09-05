import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const INITIAL_USERS = [
  {
    id: "usr_1",
    email: "merchant@example.com",
    password: "password123",
    role: "MERCHANT",
    businessName: "Demo Store",
    location: "Shop 14, Hazratganj, Lucknow, UP",
    lmrn: "LM-001",
    gstin: "GST-001",
  },
  {
    id: "usr_2",
    email: "inspector@example.com",
    password: "password123",
    role: "LMO",
    officerName: "Srajal",
    badgeId: "LMO-1",
    district: "Lucknow",
    phone: "0000000000",
  },
  {
    id: "usr_3",
    email: "gat@example.com",
    password: "password123",
    role: "GAT",
    officerName: "Test Centre",
    badgeId: "GAT-1",
    district: "Transport Nagar Hub, Lucknow",
    phone: "0000000000",
  },
  {
    id: "usr_4",
    email: "admin@example.com",
    password: "password123",
    role: "ADMIN",
    officerName: "Admin User",
    badgeId: "ADMIN-1",
    district: "State Metrology HQ, Lucknow",
  },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("current_user");
    if (!saved) return null;

    return JSON.parse(saved);
  });

  const getAllUsers = () => {
    const saved = localStorage.getItem("all_users");
    if (!saved) {
      localStorage.setItem("all_users", JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(saved);
  };

  const login = (email, password) => {
    const users = getAllUsers();
    const newmail = email.trim().toLowerCase();

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === newmail && u.password === password
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      localStorage.setItem("current_user", JSON.stringify(matchedUser));
      return matchedUser;
    }
    return null;
  };

  const register = (newUserData) => {
    const users = getAllUsers();
    const newmail = newUserData.email.trim().toLowerCase();

    const alreadyExists = users.some((u) => u.email.toLowerCase() === newmail);
    if (alreadyExists) {
      alert("An account with this email already exists!");
      return false;
    }

    const newUser = {
      ...newUserData,
      id: "usr_" + Date.now(),
    };

    const updatedUsers = [newUser, ...users];
    localStorage.setItem("all_users", JSON.stringify(updatedUsers));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("current_user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}