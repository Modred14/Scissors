import React, { useState, useEffect, useRef, useCallback } from "react";

const LinkOptions: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    localStorage.removeItem("links");
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node) &&
      optionsRef.current &&
      !optionsRef.current.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative inline-block">
      <div className="flex gap-2">
        <button className="px-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded">
          <span className="material-icons pt-2 text-sm font-extrabold">
            content_copy
          </span>
          <p className="pt-2 px-1">Copy</p>
        </button>
        <button className="px-2 py-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded">
          <span className="material-icons text-sm">edit</span>
        </button>
        <button
          className="px-2 py-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded"
          onClick={toggleOptions}
          ref={buttonRef}
        >
          <span className="material-icons text-sm">more_vert</span>
        </button>
      </div>
      {showOptions && (
        <div
          ref={optionsRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10"
        >
          <button
            onClick={handleDelete}
            className="w-full text-left px-2 py-2 font-bold grid grid-flow-col  text-sm hover:bg-gray-100"
          >
            <div className="flex gap-3">
              <span className="material-icons ">delete</span>{" "}
              <p className="pt-1">Delete</p>
            </div>
          </button>
          <button className="w-full text-left px-2 py-2 font-bold grid grid-flow-col  text-sm hover:bg-gray-100">
            <div className="flex gap-3">
              {" "}
              <span className="material-icons" >link</span> View link analystics
            </div>{" "}
          </button>
          <button className="w-full text-left px-2 py-2 font-bold grid grid-flow-col  text-sm hover:bg-gray-100">
            <div className="flex gap-3">
              <span className="material-icons" >qr_code</span> View QR Code
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkOptions;
