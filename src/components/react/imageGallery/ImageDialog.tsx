import type React from "react";
import type { Image } from "../UI/types";
import { useEffect, useRef, useState } from "react";
type Props = {
  images: Image[]
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number | null>>
  handleDeleteImage: (id: string) => Promise<boolean>
  handleRenameImage: (id: string, newFileName: string) => Promise<Image>
  canDelete?: boolean
  canRename?: boolean
}
export default function ImageDialog({
  images,
  currentIndex,
  setCurrentIndex,
  handleDeleteImage,
  handleRenameImage,
  canDelete = false,
  canRename = false,
}: Props) {
  const image = images[currentIndex];
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenameEditorOpen, setIsRenameEditorOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

  useEffect(() => {
    setDeleteError(null);
    setRenameError(null);
    setIsRenameEditorOpen(false);
    setRenameValue(image?.fileName ?? "");
  }, [image?.id, image?.fileName]);

  if (!image) {
    return null;
  }

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

const onDelete = async () => {
  const confirmed = window.confirm(
    `Delete ${image.fileName}? This cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  setIsDeleting(true);
  setDeleteError(null);

  try {
    const deleted = await handleDeleteImage(image.id);

    if (!deleted) {
      setDeleteError("Failed to delete image.");
    }
  } catch (error) {
    setDeleteError(
      error instanceof Error ? error.message : "Failed to delete image."
    );
  } finally {
    setIsDeleting(false);
  }
};

const onRename = async () => {
  const trimmedName = renameValue.trim();

  if (!trimmedName) {
    setRenameError("New file name is required.");
    return;
  }

  if (trimmedName === image.fileName) {
    setIsRenameEditorOpen(false);
    setRenameError(null);
    return;
  }

  setIsRenaming(true);
  setRenameError(null);

  try {
    await handleRenameImage(image.id, trimmedName);
    setIsRenameEditorOpen(false);
  } catch (error) {
    setRenameError(
      error instanceof Error ? error.message : "Failed to rename image."
    );
  } finally {
    setIsRenaming(false);
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

      {canDelete && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="absolute top-4 left-4 z-10 rounded border border-red-500 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      )}

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
    <div
      onClick={(event) => event.stopPropagation()}
      className="bg-black text-white text-center p-6"
    >
      <div className="flex items-center justify-center gap-3">
        {isRenameEditorOpen ? (
          <>
            <input
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void onRename();
                }

                if (event.key === "Escape") {
                  setIsRenameEditorOpen(false);
                  setRenameValue(image.fileName);
                  setRenameError(null);
                }
              }}
              className="w-full max-w-md rounded border border-white/30 bg-white/10 px-3 py-2 text-center text-lg text-white outline-none"
            />
            <button
              onClick={() => void onRename()}
              disabled={isRenaming}
              className="rounded border border-white/30 px-3 py-2 text-lg leading-none transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={`Save new name for ${image.fileName}`}
            >
              {isRenaming ? "..." : "✓"}
            </button>
            <button
              onClick={() => {
                setIsRenameEditorOpen(false);
                setRenameValue(image.fileName);
                setRenameError(null);
              }}
              disabled={isRenaming}
              className="rounded border border-white/30 px-3 py-2 text-lg leading-none transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={`Cancel renaming ${image.fileName}`}
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <h3 className="font-bold text-lg">{image.fileName}</h3>
            {canRename && (
              <button
                onClick={() => {
                  setRenameValue(image.fileName);
                  setRenameError(null);
                  setIsRenameEditorOpen(true);
                }}
                className="rounded border border-white/30 px-2 py-1 text-sm transition hover:bg-white/10"
                aria-label={`Rename ${image.fileName}`}
              >
                ✏️
              </button>
            )}
          </>
        )}
      </div>
      <p>
        ISO: {image.filmSpeed} • {image.filmStock} • {image.filmFormat}
      </p>
      <p>{image.bw ? "Black and White" : "Color"}</p>
      {renameError && <p className="mt-3 text-sm text-red-400">{renameError}</p>}
      {deleteError && <p className="mt-3 text-sm text-red-400">{deleteError}</p>}
    </div>
  </div>
);
}