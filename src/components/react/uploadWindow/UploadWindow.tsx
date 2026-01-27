import { useState } from "react";
import UploadComponent from "./UploadComponent";
import Modal from "../UI/Modal";


export default function UploadWindow() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1 mt-2 bg-gray-800 text-white"
      >
        Upload Image
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <UploadComponent onUpload={() =>setShowModal(false)} />
      </Modal>
    </>
  );
}