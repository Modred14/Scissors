import React, { useState, useEffect } from "react";
import Settings from "./Settings";
import Loading from "./Loading";
import {
  getAuth,
  updateEmail,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profileImg: string;
  links: Link[];
}
interface Link {
  id: string;
  title: string;
  mainLink: string;
  shortenedLink: string;
  qrcode: string;
  customLink: string;
  clicks: number;
  visits: string[];
  createdAt: string;
}

const SettingsParent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const userPassword = user?.password || "";
  const handleEmailChange = async (newEmail: string) => {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is signed in.");
      return;
    }

    if (userPassword === "") {
      setMessage("Password is required to update your email.");
      return;
    }

    try {
      console.log(
        `Re-authenticating user: ${user.email} with provided password. ${userPassword}`
      );

      const credential = EmailAuthProvider.credential(
        user.email!,
        userPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updateEmail(user, newEmail);
      await sendEmailVerification(user);
      console.log("Email updated and verification email sent.");
      setMessage("Verification email sent. Please verify your new email.");
      return true;
    } catch (error: any) {
      console.error("Error updating email:", error);

      if (error.code === "auth/wrong-password") {
        setMessage("The password provided is incorrect. Please try again.");
      } else if (error.code === "auth/invalid-credential") {
        setMessage(
          "The credentials are invalid. Please check your email and password."
        );
      } else {
        setMessage(
          "Failed to update email. Kindly verify your old email before changing it."
        );
      }

      return false; 
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedUserData = localStorage.getItem("user");

        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setUser(user);
          setEmail(user.email);
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

  const handleUpdate = async (updatedUser: User): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://app-scissors-api.onrender.com/users"
      );
      const data = await response.json();
      console.log("Fetched users:", data);
      const userExists = data.some(
        (user: User) => user.email === updatedUser.email && user.email !== email
      );

      if (userExists) {
        setMessage("Email already exists, kindly input another email.");
        setLoading(false);
        return;
      } else {
        setMessage("");
        try {
          if (updatedUser.email !== email) {
            const emailUpdated = await handleEmailChange(updatedUser.email);
            if (!emailUpdated) {
              setLoading(false);
              return;
            }
          }
          const response = await fetch(
            `https://app-scissors-api.onrender.com/users/${updatedUser.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            }
          );
          const auth = getAuth();
          const userUpdate = auth.currentUser;
          const newPassword = updatedUser.password || user?.password || "";
          
          if (userUpdate) {
            updatePassword(userUpdate, newPassword)
              .then(() => {
                console.log("Password updated successfully!");
              })
              .catch((error) => {
                console.error("Error updating password:", error);
              });
          }
          if (response.ok) {
            const data = await response.json();
            console.log("Updated user:", data);
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            setMessage(
              "Your data has been sucessfully updated in the database."
            );
          } else {
            console.error("Failed to update user data");
            setMessage(
              "Oops, an error occured. Please try again later. If the error persist, try inputting another data."
            );
          }
        } catch (error) {
          console.error("Error updating user data:", error);
          setMessage(
            "Oops, an error occured. Please try again later. If the error persist, check if you have access to internet connection."
          );
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
    if (message) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setMessage(""), 500);
      }, 4500);
      return () => {
        clearTimeout(timer);
        setIsFadingOut(false);
      };
    }
  }, [message]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {message && (
        <div
          className={`flex justify-center transition-opacity duration-500 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="fixed animate-message bg-black p-4 mx-4 rounded"
            style={{ top: "10%" }}
          >
            <p className=" text-red-100">{message}</p>
          </div>{" "}
        </div>
      )}
      <Settings user={user} onUpdate={handleUpdate} />
    </div>
  );
};

export default SettingsParent;
