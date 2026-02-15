import { useState, useEffect } from "react";
import AdminLoginForm from "./LoginForm";
import Modal from "../UI/Modal";
import useLogin from "./useLogin";
 
 const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;
export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useLogin();
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
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