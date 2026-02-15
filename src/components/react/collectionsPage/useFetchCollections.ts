import { useState, useEffect } from 'react';
import { FilmSpeedType, FilmStockType, FilmFormatType, FilmOrientationType,  type Collection } from "../UI/types";

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;
const useFetchCollections = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
 
    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE}/api/categories`);
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