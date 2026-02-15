import { LoadingSpinner } from "../../navigation/assets";
import "./Loading.css";

export default function Loading() {
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