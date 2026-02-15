// src/hooks/useLogin.ts
import { useState, useEffect } from "react";
const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;
export default function useLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
        });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  return { isLoggedIn,setIsLoggedIn };
}