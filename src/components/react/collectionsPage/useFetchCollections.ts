import { useState, useEffect } from 'react';
import { type Collection } from "../UI/types";

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

const useFetchCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCollections = async (retry = true) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/categories`);
        if (!response.ok) throw new Error("Failed to fetch collections");

        const data: Collection[] = await response.json();

        // Retry if backend is sleeping and returns empty
        if ((!data || data.length === 0) && retry) {
          console.warn("Empty result, retrying...");
          setTimeout(() => fetchCollections(false), 1000); // retry once after 1s
          return;
        }

        setCollections(data);
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