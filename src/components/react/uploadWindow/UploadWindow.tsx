import { useState } from "react";
import UploadComponent from "./UploadComponent";
import Modal from "../UI/Modal";
import useLogin from "../login/useLogin";
 
 


export default function UploadWindow() {
  const [showModal, setShowModal] = useState(false);
    const {isLoggedIn} = useLogin();
    if(!isLoggedIn) return 
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
  className="px-4 py-2 bg-gray-800 text-[var(--text)] rounded hover:bg-gray-900"
      >
        Upload Image
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <UploadComponent onUpload={() =>setShowModal(false)} />
      </Modal>
    </>
  );
}