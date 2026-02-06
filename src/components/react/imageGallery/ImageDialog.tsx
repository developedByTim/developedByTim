import type React from "react";
import type { Image } from "../UI/types";
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

  return (
    <div
      onClick={() => setCurrentIndex(null)}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
                  <button
            className="absolute top-2 right-10 text-white text-[5rem]"
            onClick={() => setCurrentIndex(null)}
          >
            &times;
          </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded w-[80vw] h-[90vh] relative flex justify-between gap-6"
      >
        {/* PREV */}
        <button
          onClick={prev}
          className="text-[5rem] px-2 text-gray-600 hover:text-black"
        >
          ‹
        </button>

        {/* IMAGE */}
        <div className="text-center flex items-center justify-center flex-col gap-4">


          <img
            src={image.url}
            alt={image.fileName}
            className="w-auto h-auto max-h-[70vh] mb-4"
          />

          <h3 className="text-lg font-bold">{image.fileName}</h3>
          <p>{`ISO: ${image.filmSpeed}, Stock: ${image.filmStock}, Format: ${image.filmFormat}`}</p>
          <p>{image.bw ? "Black and White" : "Color"}</p>
        </div>

        {/* NEXT */}
        <button
          onClick={next}
          className="text-[5rem] px-2 text-gray-600 hover:text-black"
        >
          ›
        </button>
      </div>
    </div>
  );
}