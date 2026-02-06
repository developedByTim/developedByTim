import { useState, useEffect } from "react";
import AdminLoginForm from "./LoginForm";
import Modal from "../UI/Modal";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("https://localhost:7115/api/auth/me", {
          credentials: "include", // send cookie
        });
        console.log(res,'CHECKING LOGIN')
        setIsLoggedIn(res.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://localhost:7115/api/auth/logout", {
        method: "POST",
        credentials: "include", // send cookie
      });
      setIsLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Admin
          </button>

          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <AdminLoginForm onLogin={() => { setIsLoggedIn(true); setIsOpen(false); }} />
          </Modal>
        </>
      )}
    </>
  );
}