import React, { useState, useEffect } from 'react';
import Dropdown from "../UI/Dropdown"; // Assuming your Dropdown is imported
import { filmSpeedOptions, filmStockOptions, filmFormatOptions, filmOrientationOptions } from '../uploadWindow/UploadWindow'; // Update the import paths based on your project structure
import SearchInput from "../UI/SearchInput"; // Update if necessary
import { FilmSpeedType, FilmStockType, FilmFormatType, FilmOrientationType } from "../UI/types"; // Assuming you have the necessary types
import Loading from '../UI/Loading';
import useFetchCollections from './useFetchCollections';

// Assuming Image type is defined somewhere


export default function ImageGallery() {
  
    const [sortBy, setSortBy] = useState<string>('');
    const {collections, loading:loadingData} = useFetchCollections()
    const [loading, setLoading] = useState<boolean>(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const imagesPerPage = 3;
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
 
    const [loadedImagesCount, setLoadedImagesCount] = useState<number>(0);
    // State to store fetched images
 

    const handleUpdate = () => {

    };
 


    return (
        <div>
          
            {/* Loading Indicator */}
            {(loadingData ||loading ) &&  <Loading />} 
            {/* Collections Display Section */}
       
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {}</span>
                <button
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1))}
                    disabled={!currentPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
