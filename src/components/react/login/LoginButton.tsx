// LoginButton.tsx
import { useState } from "react";
 
import AdminLoginForm from "./LoginForm";
import Modal from "../UI/Modal";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
 

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        Admin
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <AdminLoginForm/>
      </Modal>
    </>
  );
}