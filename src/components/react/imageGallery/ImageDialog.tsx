import type React from "react";
import type { Image } from "../UI/types";
import { useRef } from "react";
type Props = {
  images: Image[]
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number | null>>
  handleDeleteImage: (id: string) => Promise<void>
}
export default function ImageDialog({
  images,
  currentIndex,
  setCurrentIndex,
  handleDeleteImage,
}: Props) {
  const image = images[currentIndex];

  const prev = () => {
    setCurrentIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0));
  };
const touchStartX = useRef(0);
const touchStartY = useRef(0);
 
const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
  touchStartY.current = e.touches[0].clientY;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX.current;
  const deltaY = e.changedTouches[0].clientY - touchStartY.current;

  // Only trigger if horizontal swipe is stronger than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 60) {
      prev(); // swipe right
    } else if (deltaX < -60) {
      next(); // swipe left
    }
  }
};
 return (
  <div
    onClick={() => setCurrentIndex(null)}
    className="fixed inset-0 bg-black z-50 flex flex-col"
  >
    {/* IMAGE AREA */}
    <div
      onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
      className="relative flex items-center justify-center flex-1 overflow-hidden"
    >
      {/* CLOSE */}
      <button
        onClick={() => setCurrentIndex(null)}
        className="absolute top-4 right-4 text-white text-4xl z-10"
      >
        &times;
      </button>

      {/* PREV */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl z-10"
      >
        ‹
      </button>

      {/* NEXT */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl z-10"
      >
        ›
      </button>

      {/* IMAGE */}
      <img
        src={image.url}
        alt={image.fileName}
className="max-h-[80vh] max-w-full object-contain"
      />
    </div>

    {/* INFO BAR */}
    <div className="bg-black text-white text-center p-6">
      <h3 className="font-bold text-lg">{image.fileName}</h3>
      <p>
        ISO: {image.filmSpeed} • {image.filmStock} • {image.filmFormat}
      </p>
      <p>{image.bw ? "Black and White" : "Color"}</p>
    </div>
  </div>
);
}