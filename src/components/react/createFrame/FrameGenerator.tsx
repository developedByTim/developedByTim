

import Dropdown from "../UI/Dropdown";
import Slider from "../UI/Slider";
import SubmitButton from "../UI/SubmitButton";
import { filmSpeedOptions, filmStockOptions } from "../uploadWindow/UploadWindow";
import Preview from "./components/Preview";
import { frameTypeOptions, type FrameType } from "./FrameGenerator.constaints";
import { useLogic } from "./useLogic";

 

export default function FrameGenerator() {
    const logic = useLogic()
    const handleUpload = async () => {

    try {
      const response = await fetch("https://localhost:7115/api/Image/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(uploadData),
      });

      if (!response.ok) throw new Error("Upload failed!");

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to upload image.");
    }
  };
  const renderFrameSettings = () => {
    switch (logic.frameType) {
        case "classic":
            return <div className="flex flex-col gap-4">
                <input type="color" onChange={(v)=>logic.setFrameColor(v.target.value)} value={logic.frameColor}   />
                <Slider value={logic.frameWidth} onChange={(v)=>logic.setFrameWidth(Number(v.target.value))} min={10} max={300} step={10} />
            </div>;
        case "35":
        case "120":
            return <div className="flex flex-col gap-4">
                  <Dropdown value={logic.filmStock} label="STOCK" options={filmStockOptions} onChange={(value) => logic.setFilmStock(value)} />
          <Dropdown value={logic.filmSpeed} label="ISO" options={filmSpeedOptions} onChange={(value) => logic.setFilmSpeed(value)} />
            </div>;
      }
    }
    return <div className="flex gap-6 items-start">
        <Preview className='w-[40%]' logic={logic}/>
        <div className="flex items-center gap-6 justify-between p-4 ">
            <div className="flex flex-col gap-6 ">
              <h2>Frame Properties:</h2>
            <Dropdown onChange={(v)=>logic.setFrameType(v as FrameType)} label='Frame Type' value={logic.frameType}  options={frameTypeOptions}/>
             {renderFrameSettings()}
          <SubmitButton  onClick={handleUpload}>Generate</SubmitButton>
            </div>

        </div>
    </div>
}