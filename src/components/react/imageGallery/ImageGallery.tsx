import React, { useState, useEffect } from 'react';
import Dropdown from "../UI/Dropdown"; // Assuming your Dropdown is imported
import { filmSpeedOptions, filmStockOptions, filmFormatOptions, filmOrientationOptions } from '../uploadWindow/UploadWindow'; // Update the import paths based on your project structure
import SearchInput from "../UI/SearchInput"; // Update if necessary
import { FilmSpeedType, FilmStockType, FilmFormatType, FilmOrientationType } from "../UI/types"; // Assuming you have the necessary types
import Loading from '../UI/Loading';
import useFetchImages from './useFetchImages';
import { type Image } from "../UI/types";
import ImageDialog from './ImageDialog';
import Masonry from 'react-masonry-css';
// Assuming Image type is defined somewhere


export default function ImageGallery() {
    // States for dropdown values
    const [filmSpeed, setFilmSpeed] = useState<FilmSpeedType | string>('');
    const [filmStock, setFilmStock] = useState<FilmStockType | string>('');
    const [filmFormat, setFilmFormat] = useState<FilmFormatType | string>('');
    const [filmOrientation, setFilmOrientation] = useState<FilmOrientationType | string>('');
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [sortBy, setSortBy] = useState<string>('');
    const { images, loading: loadingData } = useFetchImages(filmSpeed, filmStock, filmFormat, filmOrientation, sortBy)
    // Pagination state
    const IMAGES_PER_BATCH = 3;
    const [visibleCount, setVisibleCount] = useState(IMAGES_PER_BATCH);
    const displayedImages = images.slice(0, visibleCount);
    const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
    // State to store fetched images

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

    const handleUpdate = () => {

        console.log('Filters Updated', {
            filmSpeed,
            filmStock,
            filmFormat,
            filmOrientation,
            sortBy
        });

    };

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    visibleCount < images.length
                ) {
                    setVisibleCount(prev =>
                        Math.min(prev + IMAGES_PER_BATCH, images.length)
                    );
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [images.length, visibleCount]);

    return (
        <div>
            {/* Search and Filter Section */}
            <div className="flex items-center gap-6 justify-between mb-10">
                {/* <SearchInput onUpdate={handleUpdate} /> */}
                <div className="flex items-center gap-6 ">
                    <Dropdown
                        label="ISO"
                        value={filmSpeed}
                        onChange={(value) => setFilmSpeed(value)}
                        options={filmSpeedOptions}
                    />

                    <Dropdown
                        label="STOCK"
                        value={filmStock}
                        onChange={(value) => setFilmStock(value)}
                        options={filmStockOptions}
                    />

                    <Dropdown
                        label="FORMAT"
                        value={filmFormat}
                        onChange={(value) => setFilmFormat(value)}
                        options={filmFormatOptions}
                    />
                    <Dropdown
                        label="Orientation"
                        value={filmOrientation}
                        onChange={(value) => setFilmOrientation(value)}
                        options={filmOrientationOptions}
                    />
                    <Dropdown
                        label="Sort"
                        value={sortBy}
                        onChange={(value) => setSortBy(value)}
                        options={[{ key: 'iso', text: 'ISO' }, { key: 'date', text: 'DATE' }]}
                    />
                </div>
            </div>
            {/* Loading Indicator */}
            {(loadingData) && <Loading />}
            {/* Images Display Section */}
            {/* TO DO: Clean up the alert */}
            {displayedImages.length === 0 && !loadingData && <div className='text-center text-gray-500'>No images found.</div>}
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

            <div ref={loadMoreRef} className="h-10" />
            {/* Modal */}
            {selectedImage && (
                <ImageDialog
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    handleDeleteImage={handleDeleteImage}
                />
            )}
        </div>
    );
}
