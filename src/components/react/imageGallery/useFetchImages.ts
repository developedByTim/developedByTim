import { useState, useEffect } from "react";
import {
  FilmSpeedType,
  FilmStockType,
  FilmFormatType,
  FilmOrientationType,
  type Image,
} from "../UI/types";

const useFetchImages = (
  filmSpeed?: FilmSpeedType,
  filmStock?: FilmStockType,
  filmFormat?: FilmFormatType,
  filmOrientation?: FilmOrientationType,
  sortBy?: string,
  ascending?: boolean,
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
        }).toString();

        const response = await fetch(
          `https://localhost:7115/api/Image?${queryParams}`,
        );
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImages(data); // Assuming the response is an array of image objects
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [filmSpeed, filmStock, filmFormat]);

  useEffect(() => {
    let filtered = [...images];

    if (filmOrientation) {
      const SQUARE_TOLERANCE = 0.05; // 5%
      const ORIENTATION_TOLERANCE = 0.1; // 10%

      filtered = filtered.filter((image) => {
        const img = new Image();
        img.src = image.url;

        const width = img.width;
        const height = img.height;

        if (!width || !height) return true; // fallback if image not loaded yet

        if (filmOrientation === FilmOrientationType.Landscape) {
          return width >= height * (1 + ORIENTATION_TOLERANCE);
        } else if (filmOrientation === FilmOrientationType.Portrait) {
          return height >= width * (1 + ORIENTATION_TOLERANCE);
        } else if (filmOrientation === FilmOrientationType.Square) {
          const diff = Math.abs(width - height);
          const avg = (width + height) / 2;
          return diff / avg <= SQUARE_TOLERANCE;
        }

        return true;
      });
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
    console.log("Filtered Images:", filtered);
    setFilteredImages(filtered);
  }, [filmOrientation, sortBy, images, ascending]);

  return { images: filteredImages, loading };
};

export default useFetchImages;
