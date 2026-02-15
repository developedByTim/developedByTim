import { useState } from "react";
import type { Image } from "../UI/types";
import useFetchCollection from "./useFetchCollectionImages";
import IconButton from "../UI/IconButton";
import Modal from "../UI/Modal";
import useFetchImages from "../imageGallery/useFetchImages";
import ImageMasonry from "../imageGallery/ImageMasonry";
import Loading from "../UI/Loading";
import useLogin from "../login/useLogin";
const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;
export default function CollectionGallery({ collectionId }: { collectionId: string }) {
  const { category, images, loading, error } = useFetchCollection({ categoryId: collectionId, sortBy: "date" });
  const { images: allImages, loading: loadingAllImages, } = useFetchImages();
    const {isLoggedIn} = useLogin();
  const [editMode, setEditMode] = useState(false);
    const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
    const toggleImage = (id: string) => {
    setSelectedImageIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
const handleSubmit = async () => {
  try {
    await fetch(`${API_BASE}/api/categories/add-images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        categoryId: collectionId,
        imageIds: selectedImageIds,
      }),
    });

    setEditMode(false);
    setSelectedImageIds([]);

    // optionally refetch collection images
    // refetchCollection?.()
  } catch (err) {
    console.error("Failed to add images", err);
  }
};
  return <div>
    {loading && <Loading />}
    {error && <div className="text-red-500">Error: {error}</div>}
    {!loading && !error && category && (
      <>
        <h1 className="text-4xl mb-6 text-center">{category.name}{isLoggedIn?<IconButton className='ml-4' onClick={() => setEditMode(true)} onRenderIcon={() => <span >✏️</span>} />:undefined}</h1>
        <div className="flex justify-start gap-10">
          <Modal isOpen={editMode} onClose={() => setEditMode(false)}>
          <h2 className="text-2xl mb-4">Add images to collection</h2>

        <div className="grid grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
          {allImages.map(image => (
            <SelectableImage
              key={image.id}
              image={image}
              selected={selectedImageIds.includes(image.id)}
              onToggle={() => toggleImage(image.id)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={() => setEditMode(false)} className="px-4 py-2">
            Cancel
          </button>
          <button
            disabled={!selectedImageIds.length || saving}
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {saving ? "Saving…" : `Add ${selectedImageIds.length} images`}
          </button>
        </div>
          </Modal>
         <ImageMasonry displayedImages={images} />
        </div>
      </>
    )}
  </div>
}
interface ImageItemProps {
  image: Image;
}
const SelectableImage = ({
  image,
  selected,
  onToggle,
}: {
  image: Image;
  selected: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      onClick={onToggle}
      className={`relative aspect-square cursor-pointer overflow-hidden rounded
        ${selected ? "ring-4 ring-black" : "hover:opacity-80"}`}
    >
      <img
        src={image.url}
        alt={image.fileName}
        className="w-full h-full object-cover"
      />

      {selected && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <span className="text-white text-4xl">✓</span>
        </div>
      )}
    </div>
  );
};