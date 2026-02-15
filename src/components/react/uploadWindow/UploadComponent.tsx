import Dropdown, { type DropdownOptions } from "../UI/Dropdown";
import SubmitButton from "../UI/SubmitButton";
import Checkbox from "../UI/Checkbox";
import { FilmColorType, FilmFormatType, FilmOrientationType, FilmSpeedType, FilmStockType } from "../UI/types";
import { useState } from "react";
import Input from "../UI/Input";
import ReactDOM from "react-dom";

export const filmOrientationOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.entries(FilmOrientationType).map(([key, text]) => ({
  key,
  text,
}))]
// Film Stock Options
export const filmStockOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.entries(FilmStockType).map(([key, text]) => ({
  key,
  text: text ?? 'All',
}))]

// Film Speed (ISO) Options
export const filmSpeedOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.values(FilmSpeedType)
  .filter((v) => typeof v === "number") // Ensures we only get numeric values
  .map((iso) => ({
    key: iso,
    text: iso ? `ISO ${iso}` : 'All',
  }))]

// Film Format Options
export const filmFormatOptions: DropdownOptions<any>[] = [{ key: '', text: 'All' }, ...Object.keys(FilmFormatType)
  .filter((key) => isNaN(Number(key))) // Filters out numeric index keys
  .map((format) => ({
    key: format,
    text: format.replace("Format", "").replace(/([A-Z])/g, " $1").trim(),
  }))]

// Film Color Options
export const filmColorOptions: DropdownOptions<any>[] = Object.entries(FilmColorType).map(([key, text]) => ({
  key,
  text,
}));

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL;
export default function UploadComponent({onUpload}: {onUpload?: () => void}) {
  const [file, setFile] = useState<File | null>(null);
  const [isBW, setIsBW] = useState(false);
  const [filmStock, setFilmStock] = useState<FilmStockType>(FilmStockType.KodakGold);
  const [filmSpeed, setFilmSpeed] = useState<FilmSpeedType>(FilmSpeedType.ISO200);
  const [filmFormat, setFilmFormat] = useState<FilmFormatType>(FilmFormatType.Format35mm);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const getCloudinarySignature = async (folder: string) => {
    const res = await fetch(`${API_BASE}/api/image/cloudinary/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    if (!res.ok) throw new Error("Failed to get Cloudinary signature");
    return res.json();
  };

  const uploadToCloudinary = async (file: File) => {
    const folder = isBW ? "bw" : "color";
    const { timestamp, signature, apiKey, cloudName } = await getCloudinarySignature(folder);

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp.toString());
    form.append("signature", signature);
    form.append("folder", folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");
    return res.json();
  };


  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);

      // Upload to Cloudinary
      const cloudResult = await uploadToCloudinary(file);

      // Send metadata to your API
      const uploadData = {
        FileName: title || file.name,
        PublicId: cloudResult.public_id,
        Url: cloudResult.secure_url,
        BW: isBW,
        FilmStock: filmStock,
        FilmSpeed: filmSpeed,
        FilmFormat: filmFormat,
        Metadata: JSON.stringify({ filmStock, filmSpeed, filmFormat, isBW }),
      };

      const res = await fetch(`${API_BASE}/api/image/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      });

      if (!res.ok) throw new Error("Metadata save failed");

      alert("Image uploaded successfully!");
      setFile(null);
      onUpload?.();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
 
  return (
        <div className="flex flex-col gap-6">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Input placeholder="Photo Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Checkbox placeholder="Black and White" checked={isBW} onChange={(e) => setIsBW(e.target.checked)} />
          <Dropdown value={filmStock} label="STOCK" options={filmStockOptions} onChange={setFilmStock} />
          <Dropdown value={filmSpeed} label="ISO" options={filmSpeedOptions} onChange={setFilmSpeed} />
          <Dropdown value={filmFormat} label="FORMAT" options={filmFormatOptions} onChange={setFilmFormat} />
          <SubmitButton disabled={!file || uploading} onClick={handleUpload}>Upload</SubmitButton>
        </div>
  );
}