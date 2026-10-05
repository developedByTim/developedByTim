import { LoadingSpinner } from "../../navigation/assets";
import "./Loading.css";
import { useEffect } from "react";

export default function Loading() {
    useEffect(() => {
      const { body } = document;
      const currentCount = Number(body.dataset.loadingCount ?? "0");
      const nextCount = currentCount + 1;

      body.dataset.loadingCount = String(nextCount);
      body.classList.add("app-loading");
      body.classList.remove("app-loaded");

      return () => {
        const updatedCount = Math.max(0, Number(body.dataset.loadingCount ?? "1") - 1);

        if (updatedCount === 0) {
          delete body.dataset.loadingCount;
          body.classList.remove("app-loading");
          body.classList.add("app-loaded");
          return;
        }

        body.dataset.loadingCount = String(updatedCount);
      };
    }, []);

    return (
        <div className="flex justify-center items-center mt-8 ">
          <ApertureLoader  />
        </div>
    );
}
 


const ApertureLoader: React.FC = () => {
  
  return        <div className="loader">
      <div className="morph"></div>
    </div>
};