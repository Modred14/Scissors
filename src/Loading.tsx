import React from "react";

const Loading: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col m-0 p-0">
        <div className="loading-animation">
          <img src="src/Scissors_logo.png" alt="Scissors" />
        </div>
        <p className="text-xl">Loading...</p>
      </div>
    </>
  );
};
export default Loading;
