import { useState, useEffect } from "react";
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

        let data: Collection[] = [];

        if (response.ok) {
          data = await response.json();
        } else {
          console.warn("Fetch failed, status:", response.status);
          // optionally retry on failure
          if (retry) {
            setTimeout(() => fetchCollections(false), 1000);
            return;
          }
        }

        // Retry if backend is sleeping and returns empty array
        if ((!data || data.length === 0) && retry) {
          console.warn("Empty result, retrying...");
          setTimeout(() => fetchCollections(false), 1000);
          return;
        }

        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);

        if (retry) {
          console.warn("Retrying fetchCollections after error...");
          setTimeout(() => fetchCollections(false), 1000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return { collections, loading };
};

export default useFetchCollections;
