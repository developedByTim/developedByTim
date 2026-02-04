import React, { useState, useEffect } from 'react';
import Dropdown from "../UI/Dropdown"; // Assuming your Dropdown is imported
import { filmSpeedOptions, filmStockOptions, filmFormatOptions, filmOrientationOptions } from '../UI/types'; // Update the import paths based on your project structure
import SearchInput from "../UI/SearchInput"; // Update if necessary
import { FilmSpeedType, FilmStockType, FilmFormatType, FilmOrientationType } from "../UI/types"; // Assuming you have the necessary types
import Loading from '../UI/Loading';
import useFetchImages from './useFetchImages';
import ImageMasonry from './ImageMasonry';


export default function ImageGallery() {
    // States for dropdown values
    const [filmSpeed, setFilmSpeed] = useState<FilmSpeedType>();
    const [filmStock, setFilmStock] = useState<FilmStockType>();
    const [filmFormat, setFilmFormat] = useState<FilmFormatType>();
    const [filmOrientation, setFilmOrientation] = useState<FilmOrientationType>();
    const [sortBy, setSortBy] = useState<string>('date');
    const [ascending, setAscending] = useState<boolean>(true);
    const { images, loading: loadingData } = useFetchImages(filmSpeed, filmStock, filmFormat, filmOrientation, sortBy, ascending)
    // Pagination state
    const IMAGES_PER_BATCH = 3;
    const [visibleCount, setVisibleCount] = useState(IMAGES_PER_BATCH);
    const displayedImages = images.slice(0, visibleCount);
    const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

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
                        onLabelClick={()=>setAscending(!ascending)}
                        onRenderIcon={() => <span>{ascending ? '↑' : '↓'}</span>}
                        onChange={(value) => setSortBy(value)}
                        options={[{ key: 'date', text: 'DATE' },{ key: 'iso', text: 'ISO' }]}
                    />
                </div>
            </div>
            {/* Loading Indicator */}
            {(loadingData) && <Loading />}
            {/* Images Display Section */}
            {/* TO DO: Clean up the alert */}
            {displayedImages.length === 0 && !loadingData && <div className='text-center text-gray-500'>No images found.</div>}
           <ImageMasonry displayedImages={displayedImages} />
            <div ref={loadMoreRef} className="h-10" />
        </div>
    );
}
