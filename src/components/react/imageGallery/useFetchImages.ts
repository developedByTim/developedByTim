import { useState, useEffect } from "react";
import {
  FilmSpeedType,
  FilmStockType,
  FilmFormatType,
  FilmOrientationType,
  type Image,
} from "../UI/types";

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;

const useFetchImages = (
  filmSpeed?: FilmSpeedType,
  filmStock?: FilmStockType,
  filmFormat?: FilmFormatType,
  filmOrientation?: FilmOrientationType,
  sortBy?: string,
  ascending?: boolean,
  limit?: number
) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);

 
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          filmSpeed: filmSpeed?.toString() ?? "",
          filmStock: filmStock?.toString() ?? "",
          filmFormat: filmFormat?.toString() ?? "",
          filmOrientation: filmOrientation?.toString() ?? "",
          sortBy: sortBy ?? "",
          limit: limit?.toString() ?? "",
        }).toString();
 
        const response = await fetch(`${API_BASE}/api/Image?${queryParams}`);
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImages(data);
 
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [filmSpeed, filmStock, filmFormat, filmOrientation, sortBy, limit]);
  // filtering and sorting logic stays the same
  useEffect(() => {
    let filtered = [...images];

    if (filmOrientation) {
      filtered = filtered.filter((image) => image.filmOrientation === filmOrientation);
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        if (sortBy === "iso")
          return (
            (ascending ? 1 : -1) *
            ((FilmSpeedType[a.filmSpeed] as unknown as number) -
              (FilmSpeedType[b.filmSpeed] as unknown as number))
          );
        else if (sortBy === "date")
          return (
            (ascending ? 1 : -1) *
            (new Date(a.uploadedAt).getTime() -
              new Date(b.uploadedAt).getTime())
          );
        return 0;
      });
    }

    setFilteredImages(filtered);
  }, [filmOrientation, sortBy, images, ascending]);

  return { images: filteredImages, loading };
};

export default useFetchImages;