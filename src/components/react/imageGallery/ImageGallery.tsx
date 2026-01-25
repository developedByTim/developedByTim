import React, { useState, useEffect } from 'react';
import Dropdown from "../UI/Dropdown"; // Assuming your Dropdown is imported
import { filmSpeedOptions, filmStockOptions, filmFormatOptions, filmOrientationOptions } from '../uploadWindow/UploadWindow'; // Update the import paths based on your project structure
import SearchInput from "../UI/SearchInput"; // Update if necessary
import { FilmSpeedType, FilmStockType, FilmFormatType, FilmOrientationType } from "../UI/types"; // Assuming you have the necessary types
import Loading from '../UI/Loading';
import useFetchImages from './useFetchImages';
import{ type Image } from "../UI/types";
import ImageDialog from './ImageDialog';
// Assuming Image type is defined somewhere


export default function ImageGallery() {
    // States for dropdown values
    const [filmSpeed, setFilmSpeed] = useState<FilmSpeedType | string>('');
    const [filmStock, setFilmStock] = useState<FilmStockType | string>('');
    const [filmFormat, setFilmFormat] = useState<FilmFormatType | string>('');
    const [filmOrientation, setFilmOrientation] = useState<FilmOrientationType | string>('');
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [sortBy, setSortBy] = useState<string>('');
    const {images, loading:loadingData} = useFetchImages(filmSpeed,filmStock, filmFormat, filmOrientation, sortBy)
    const [loading, setLoading] = useState<boolean>(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const imagesPerPage = 10;
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const displayedImages = images.slice(startIndex, endIndex);
    const totalPages = Math.ceil(images.length / imagesPerPage);
    const [loadedImagesCount, setLoadedImagesCount] = useState<number>(0);
    // State to store fetched images
    
    const handleDeleteImage = async(id:string) => {
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
        if (loadedImagesCount === images.length) {
            setLoading(false);
        }
    }, [loadedImagesCount, images.length]) 
    const renderPaginationControls = () => {	
        console.log(totalPages, images, currentPage);
        const controls = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                controls.push(
                    <span key={i} className="px-4 py-2 bg-gray-400 text-white rounded">{i}</span>
                );
            } else {
                controls.push(
                    <button
                        key={i}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>
                );
            }
        }
        return controls;
    }

    return (
        <div>
            {/* Search and Filter Section */}
            <div className="flex items-center gap-6 justify-between">
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
            {(loadingData ||loading ) &&  <Loading />} 
            {/* Images Display Section */}
            <div className="grid grid-cols-4 gap-4 mt-8">
                {displayedImages.map((image) => (
                    <div onClick={()=>setSelectedImage(image)} key={image.id} className="border p-4">
                        <img onLoad={() => setLoadedImagesCount((count) => count + 1)} src={image.url} alt={image.fileName} className="w-full h-auto" />
                        <div className="text-center mt-2">
                            <h3>{image.fileName}</h3>
                            <p>{`ISO: ${image.filmSpeed}, Stock: ${image.filmStock}, Format: ${image.filmFormat}`}</p>
                            <p>{image.bw ? 'Black and White' : 'Color'}</p>
                            <button onClick={()=>handleDeleteImage(image.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
                {renderPaginationControls()}
            </div>
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
