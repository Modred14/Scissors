import React from "react";
import "./smallloading.css";
import scissorsLogo from "../public/Scissors_logo.png";


const SmallLoading: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="loader">
            
        </div>
        <img src={scissorsLogo} alt="scissors" className="scissors" />
      </div>
    </div>
  );
};
export default SmallLoading;
