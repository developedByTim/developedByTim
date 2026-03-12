import { useState, useEffect } from "react";
import { type Collection } from "../UI/types";

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

const useFetchCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
 const fetchCollections = async (retries = 3) => {
  try {
    setLoading(true)
    const response = await fetch(`${API_BASE}/api/categories`);

    if (!response.ok) {
      if (retries > 0) {
        console.warn("Retrying fetch...");
        setTimeout(() => fetchCollections(retries - 1), 2000);
        return;
      }

      throw new Error("Failed to fetch collections");
    }

    const data = await response.json();
    setCollections(data);
    setLoading(false)
  } catch (error) {
    console.error(error);
  }
};

    fetchCollections();
  }, []);

  return { collections, loading };
};

export default useFetchCollections;
