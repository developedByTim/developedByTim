
import ReactDOM from "react-dom";



export default function Modal({isOpen, onClose, children}: {isOpen: boolean, onClose: () => void, children?: React.ReactNode}) {

 const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 font-bold text-2xl hover:text-gray-900"
        >
          &times;
        </button>

       {children}
      </div>
    </div>
  );

  return (
    <>
      {isOpen && typeof document !== "undefined"
        ? ReactDOM.createPortal(modalContent, document.body)
        : null}
    </>
  );
}