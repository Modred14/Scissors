import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Confirm from "./Confirm";

type Link = {
  id: string;
  userId: string;
  isLoggedIn: boolean;
  setMessage: (message: string) => void;
  userPassword: string;
};

const LinkOptions: React.FC<Link> = ({
  id,
  userId,
  isLoggedIn,
  setMessage,
  userPassword,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = async (enteredPassword: string) => {
    if (isLoggedIn) {
      if (enteredPassword === userPassword) {
        try {
          const response = await fetch(
            `http://localhost:5000/users/${userId}/links/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          console.log(`Removed link with ID ${id} from the server`);
          setIsModalOpen(false);
          window.location.reload();
          setMessage(`You have successfully deleted the link with ID ${id}`);
        } catch (error) {
          console.error("Error deleting link from the server:", error);
          setIsModalOpen(false);
        }
      } else {
        setIsModalOpen(false);
        setMessage("Incorrect password. Please try again.");
      }
    } else {
      const links = localStorage.getItem("links");
      if (links) {
        
          const linksArray = JSON.parse(links);
          const updatedLinks = linksArray.filter((link: any) => link.id !== id);
          localStorage.setItem("links", JSON.stringify(updatedLinks));
          setIsModalOpen(false);
          console.log(`Removed link with ID ${id} from localStorage`);
          window.location.reload();
          setMessage(`You have successfully deleted the link with ID ${id}`);
      } else {
        console.log("No links found in localStorage");
      }
    }
    setShowOptions(false); // Close options after deletion
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
    <div>
      <Confirm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
        isLoggedIn={isLoggedIn}
        id={Link?.id}
      />
      <button
        className="px-2 py-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded"
        onClick={toggleOptions}
        ref={buttonRef}
      >
        <span className="material-icons text-sm">more_vert</span>
      </button>
      {showOptions && (
        <div
          ref={optionsRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10"
        >
            <button
              className="w-full text-left px-2 py-2 font-bold grid grid-flow-col  text-sm hover:bg-gray-100"
              onClick={() => {
                setIsModalOpen(true); // Open modal to confirm deletion
                setShowOptions(false); // Close options
              }}
            >
              <div className="flex gap-3">
                <span className="material-icons ">delete</span>{" "}
                <p className="pt-1">Delete</p>
              </div>
            </button>
          
        
          <Link to={`/link/${id}`}>
            <button className="w-full text-left px-2 text-black hover:text-black py-2 font-bold grid grid-flow-col  text-sm hover:bg-gray-100">
              {" "}
              <div className="flex gap-3">
                {" "}
                <span className="material-icons">link</span> View link
                analystics
              </div>{" "}
            </button>
          </Link>
          <Link to={`/link/${id}`}>
            {" "}
            <button className="w-full text-left px-2 text-black hover:text-black py-2 font-bold grid grid-flow-col  text-sm hover:bg-gray-100">
              <div className="flex gap-3">
                <span className="material-icons">qr_code</span> View QR Code
              </div>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LinkOptions;
