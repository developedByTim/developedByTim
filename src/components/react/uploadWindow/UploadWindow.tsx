import { useState } from "react";
import UploadComponent from "./UploadComponent";
import Modal from "../UI/Modal";
 
 


export default function UploadWindow() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        Upload Image
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <UploadComponent onUpload={() =>setShowModal(false)} />
      </Modal>
    </>
  );
}