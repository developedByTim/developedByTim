import { useState } from "react";
import Masonry from "react-masonry-css";
import { type Image } from "../UI/types";
import ImageDialog from "./ImageDialog";
import useLogin from "../login/useLogin";
const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

export default function ImageMasonry({ displayedImages, collectionId }: { displayedImages: any[], collection?: boolean, collectionId?: string }) {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const { isLoggedIn } = useLogin();

    const handleDeleteImage = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE}/api/Image/${id}`, { method: 'DELETE' });
            if (response.ok) console.log('Image deleted successfully');
            else console.error('Failed to delete image');
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }

    const handleSetThumbnail = async (imageId: string) => {
        if (!collectionId) return;

        try {
            const response = await fetch(`${API_BASE}/api/categories/${collectionId}/thumbnail/${imageId}`, {
                method: 'POST',
            });

            if (response.ok) {
                console.log('Thumbnail updated!');
                // Optionally: refresh your collection list / images
            } else {
                console.error('Failed to set thumbnail');
            }
        } catch (error) {
            console.error('Error setting thumbnail:', error);
        }
    }

    return <>
        <Masonry
            breakpointCols={{ default: 3, 768: 2, 480: 1 }}
            className="flex gap-10"
            columnClassName="space-y-4"
        >
            {displayedImages.map((image) => (
                <div
                    key={image.id}
                    onClick={() => setCurrentIndex(displayedImages.indexOf(image))}
                    className="mb-4 break-inside-avoid border cursor-pointer relative"
                >
                    <div className="relative overflow-hidden group">
                        {/* Image */}
                        <img
                            src={image.url}
                            alt={image.fileName}
                            className="w-full h-auto transition-transform duration-100 group-hover:scale-[1.01]"
                        />

                        {/* Darken overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-100" />

                        {/* Lower third */}
                        <div className="absolute bottom-0 left-0 right-0 p-4
                          translate-y-full group-hover:translate-y-0
                          transition-transform duration-100
                          bg-gradient-to-t from-black/70 to-black/0
                          text-white">
                            <h3 className="text-sm font-semibold tracking-wide">
                                {image.fileName}
                            </h3>
                            <p className="text-xs opacity-90">
                                {image.filmSpeed} · {image.filmStock} · {image.filmFormat.toString().replace('Format', '')}
                            </p>
                                   {isLoggedIn && collectionId && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleSetThumbnail(image.id); }}
                                className="absolute top-2 right-2 bg-[var(--panel)] text-white text-xs px-2 py-1 shadow hover:bg-[var(--panel-hover)] transition-colors opacity-80 hover:opacity-100"
                            >
                                📌
                            </button>
                        )}
                        </div>

                        {/* Thumbnail button */}
                 
                    </div>
                </div>
            ))}
        </Masonry>

        {currentIndex !== null && (
            <ImageDialog
                images={displayedImages}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                handleDeleteImage={handleDeleteImage}
            />
        )}
    </>
}