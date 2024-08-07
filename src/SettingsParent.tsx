import React, { useState, useEffect } from "react";
import Settings from "./Settings";
import Loading from "./Loading"; // Assuming you have a Loading component

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

const SettingsParent: React.FC = () => {
  const [email, setEmail] = useState(""); // Assume email state can be set somewhere
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedUserData = localStorage.getItem("user");

        if (storedUserData) {
          // Parse the user data from local storage and use it
          const user = JSON.parse(storedUserData);
          setUser(user);
          setEmail(user.email); // Set email state with the user's email
        } else {
          console.error("Failed to fetch user data or no user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (updatedUser: User) => {
    setLoading(true);
    try {
      const response = await fetch("https://users-api-scissors.onrender.com/users");
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
            `https://users-api-scissors.onrender.com/users/${updatedUser.id}`,
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
            setMessage("Opps, an error occured. Please try again later. If the error persist, try inputting another data.");
          }
        } catch (error) {
          console.error("Error updating user data:", error);
          setMessage("Opps, an error occured. Please try again later. If the error persist, check if you have access to internet connection.");
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
      <Settings user={user} onUpdate={handleUpdate} />
     
    </div>
  );
};

export default SettingsParent;
