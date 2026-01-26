import { useState, useEffect } from "react";
import type { Image, Collection } from "../UI/types";

interface UseCollectionProps {
  categoryId: number | string; // ID of the collection/category
  sortBy?: "iso" | "date";     // optional sorting for images
}

interface CollectionData {
  category?: Collection;
  images: Image[];
  loading: boolean;
  error?: string;
}

const useFetchCollection = ({ categoryId, sortBy }: UseCollectionProps): CollectionData => {
  const [category, setCategory] = useState<Collection | undefined>(undefined);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(undefined);

      try {
        // Fetch category metadata
        const categoryRes = await fetch(`https://localhost:7115/api/categories/${categoryId}`);
        if (!categoryRes.ok) throw new Error("Failed to fetch category");
        const categoryData: Collection = await categoryRes.json();
        setCategory(categoryData);

        // Fetch images in this category
        const queryParams = new URLSearchParams({
          sortBy: sortBy || ""
        }).toString();

        const imagesRes = await fetch(
          `https://localhost:7115/api/categories/${categoryId}/images?${queryParams}`
        );
        if (!imagesRes.ok) throw new Error("Failed to fetch collection images");
        const imagesData: Image[] = await imagesRes.json();
        setImages(imagesData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, sortBy]);

  return { category, images, loading, error };
};

export default useFetchCollection;