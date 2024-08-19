import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { FaEnvelope } from "react-icons/fa";
import { auth } from "./firebaseConfig";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

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
        await sendPasswordResetEmail(auth, email);
        setStep(2);
      } else {
        setMessage(
          "Email does not exist. Please check your email and try again, or enter another email."
        );
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

      <div className="flex items-center justify-center min-h-screen -mt-16 bg-gray-100">
        {step == 1 ? (
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
            <p className="mt-5">
              Go back to <a href="/login">Sign in</a> page
            </p>
          </div>
        ) : (
          <div className="flex  flex-col items-center">
            <FaEnvelope className="text-green-800 text-7xl mb-2" />
            <h2 className="text-2xl font-semibold mb-2">Check Your Email</h2>
            <p className="text-gray-600 text-center max-w-xl mx-2">
              We have sent a password reset link to your email address{" "}
              <b>&quot;{email}&quot;</b>. Please check your inbox and follow the
              instructions to reset your password.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
