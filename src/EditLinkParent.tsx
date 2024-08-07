import React, { useState, useEffect } from "react";
import EditLink from "./EditLink";
import Loading from "./Loading"; 

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: {
    id: string;
    title: string;
    mainLink: string;
    shortenedLink: string;
    qrcode: string;
    customLink: string;
    clicks: number;
    visits: string[];
    createdAt: string;
  }[];
}

const EditLinkParent: React.FC = () => {// Assume email state can be set somewhere
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const handleUpdate = async (updatedUser: User) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      console.log("Fetched users:", data); // Debug log
      const userExists = data.some((user: any) => user.email === updatedUser.email && user.email !== email);
      if (userExists) {
        setMessage("Email already exists, kindly input another email.");
        setLoading(false);
        return;
      } else {
        setMessage("");
        try {
          const response = await fetch(
            `http://localhost:5000/users/${updatedUser.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            }
          );
          if (response.ok) {
            const data = await response.json();
            console.log("Updated user:", data); // Debug log
            setUser(data); // Update local state with the updated user data from the server
            localStorage.setItem("user", JSON.stringify(data));
            setMessage("Your data has been sucessfully updated in the database.");
          } else {
            console.error("Failed to update user data");
          }
        } catch (error) {
          console.error("Error updating user data:", error);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("An error occurred. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {
    // Clear the message after 5 seconds with a fade-out effect
    if (message) {
      const timer = setTimeout(() => {
        setIsFadingOut(true); // Trigger the fade-out effect
        setTimeout(() => setMessage(""), 500); // Match the duration with CSS transition
      }, 4500); // Start fade-out before 5 seconds

      // Clear timeout if component unmounts or message changes
      return () => {
        clearTimeout(timer);
        setIsFadingOut(false); // Reset the fade-out state
      };
    }
  }, [message]);

  if (loading) {
    return <Loading />; // Render a loading indicator while fetching data
  }

  return (
    <div>
       {message && (
        <div className={`flex justify-center transition-opacity duration-500 ${isFadingOut ? "opacity-0" : "opacity-100"}`}>
            <div className="fixed animate-message bg-black p-4 mx-4 rounded" style={{ top:"10%"}}>
                <p className=" text-red-100">{message}</p>
                </div> </div>)}
      <EditLink user={user} onUpdate={handleUpdate} />
     
    </div>
  );
};

export default EditLinkParent;
