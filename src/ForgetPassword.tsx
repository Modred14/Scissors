import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileImg: string;
    links: string[];
  }

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://app-scissors-api.onrender.com/users`
      );
      const data = await response.json();
      const userExists = data.some((user: User) => user.email === email);

      if (userExists) {
        setMessage("The email exists, loading user credentials.");
        sendPasswordResetEmail(auth, email);
      } else {
        setMessage("Email does not exist, please check the email again.");
        return;
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 m-2 bg-white rounded-lg shadow-lg">
          <form onSubmit={handleEmailSubmit}>
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
              Forgot Password
            </h2>
            <label
              htmlFor="email"
              className="block mb-2 text-base font-medium text-gray-600"
            >
              Enter your email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mb-4 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
