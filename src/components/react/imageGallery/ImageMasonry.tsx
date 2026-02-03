import { useState } from "react";
import Masonry from "react-masonry-css";
import { type Image } from "../UI/types";
import ImageDialog from "./ImageDialog";

export default function ImageMasonry({ displayedImages }: { displayedImages: any[] }) {
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
      const handleDeleteImage = async (id: string) => {
            try {
                const response = await fetch(`https://localhost:7115/api/Image/${id}`, {
                    method: 'DELETE'
                });
    
                if (response.ok) {
                    console.log('Image deleted successfully');
                    // maybe update your UI here, e.g. refresh image list
                } else if (response.status === 404) {
                    console.error('Image not found');
                } else {
                    console.error('Failed to delete image');
                }
            } catch (error) {
                console.error('Error deleting image:', error);
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
                            onClick={() => setSelectedImage(image)}
                            className="mb-4 break-inside-avoid border cursor-pointer"
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
                                </div>
                            </div>
    
                            {/* Actions (optional: keep outside hover overlay) */}
                            {/* <div className="p-4 text-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteImage(image.id);
                                    }}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div> */}
                        </div>
                    ))}
                </Masonry>
     {selectedImage && (
                <ImageDialog
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    handleDeleteImage={handleDeleteImage}
                />
            )}
    </>
}