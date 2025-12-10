import { useState, useEffect } from 'react';
import { FilmSpeedType, FilmStockType, FilmFormatType, FilmOrientationType,  type Image } from "../UI/types";


const useFetchCollections = () => {
    const [collections, setCollections] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
 
    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://localhost:7115/api/Collection`);
                if (!response.ok) throw new Error("Failed to fetch collections");
                const data = await response.json();
                setCollections(data); // Assuming the response is an array of image objects
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);

  

    return { collections, loading };
};

export default useFetchCollections;