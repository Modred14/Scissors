import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import "./style.css";
import Loading from "./Loading";
import { auth } from "./firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { IoEyeOff, IoEye } from "react-icons/io5";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: string[];
}

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const hasAt = email.includes("@");
  const hasEmailSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(email);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const googleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const displayName = user.displayName || "";
        const [firstName, lastName] = displayName.split(" ");

        const emailCheckResponse = await fetch(
          `https://app-scissors-api.onrender.com/users?email=${user.email}`
        );
        const emailCheckData = await emailCheckResponse.json();

        if (emailCheckData.exists) {
          setMessage("Email already exists. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://app-scissors-api.onrender.com/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user.uid,
              firstName,
              lastName,
              email: user.email,
              profileImg: user.photoURL,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setLoading(true);
          console.log("Sign Up successful:", data);
          localStorage.setItem("user", JSON.stringify(data));
          setMessage("You have successfully created an account!");
          await sendEmailVerification(user);
          setMessage("Verification email sent. Please check your inbox.");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
          setLoading(false);
        } else {
          setLoading(false);
          setMessage("Error during Google Sign-Up");
        }
      }
    } catch (error) {
      console.error("Error during Google Sign-Up:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    } else {
      setLoading(false);
    }
  }, [navigate]);

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

  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    return (
      password.length > minLength &&
      hasSymbol &&
      hasNumber &&
      hasLowerCase &&
      hasUpperCase
    );
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://app-scissors-api.onrender.com/users`
      );
      const data = await response.json();
      const userExists = data.some((user: User) => user.email === email);

      if (userExists) {
        setMessage("Email already exists, Please log in.");
      } else {
        setMessage("");
        setStep(2);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!validatePassword(password)) {
      setMessage(
        "Password must be greater than six characters, and contain a symbol, one number, one lowercase, and one uppercase letter."
      );
      return;
    }
    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match. Password and confirm password must be the same."
      );
      return;
    }

    const response = await fetch(
      "https://app-scissors-api.onrender.com/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      }
    );
    const data = await response.json();

    if (response.ok) {
      console.log("Sign Up successful:", data);
      localStorage.setItem("user", JSON.stringify(data));
      setLoading(false);
      const user = auth.currentUser;
      setMessage("You have successfully created an account!");
      if (user) {
        const combinedUser = {
          ...data,
          firebaseUser: user,
        };

        localStorage.setItem("user", JSON.stringify(combinedUser));

        sendEmailVerification(user);
        setMessage("Verification email sent. Please check your inbox.");

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setMessage("Oops, an error occur during signup. Couldn't sign up.");
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="grid grid-coln body">
      <div className=" form-size" style={{ maxWidth: "100%" }}>
        <div className="mt-32 grid grid-flow-col w-40">
          <Link to="/">
            <img
              alt="Scissors"
              src="/Scissors_logo.png"
              className="h-8 w-auto"
            />
          </Link>
          <p className="font-black text-2xl rotate-0 mb-10 spacious">
            Scissors
          </p>
        </div>
        <p className="text-4xl mb-5 font-extrabold text-green-700 text-center">
          Sign up
        </p>
        <div className="max-w-screen-md w-full min-w-fit">
          {step === 1 && (
            <div>
              <button
                className="mt-4 shadow h-12 w-full  text-center my-7 font-medium active:bg-green-700 hover:bg-green-700 text-green hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 outline outline-1 focus:outline-none focus:text-white focus:bg-green-700 active:ring-green-600 text-xl"
                onClick={googleSignUp}
              >
                Continue with Google
              </button>
            </div>
          )}
          <form onSubmit={step === 1 ? handleEmailSubmit : handleDetailsSubmit}>
            {step === 1 && (
              <>
                <div className="m-space">
                  <div className="inline">
                    <div className="line"></div>
                    <div className="line correct-line"></div>
                    <div className="text-center">OR</div>
                  </div>
                </div>
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
                <label className="block">
                  <span className="block text-base font-bold text-slate-700">
                    Email address
                  </span>
                  <input
                    type="email"
                    placeholder="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`peer h-12 mt-1 block w-full px-3 mb-2 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                  ${
                    email && !hasAt && hasEmailSymbol
                      ? "border-pink-500 text-pink-600"
                      : "border-slate-300"
                  } rounded-sm text-m shadow-sm placeholder-slate-400
                    focus:outline-none  focus:ring-gray-400 focus:ring-1 
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    ${
                      email && !hasAt && hasEmailSymbol
                        ? "focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        : ""
                    }`}
                  />
                  {email && !hasAt && hasEmailSymbol && (
                    <p className="mt-1 -mb-2 peer-invalid:visible text-pink-600 text-sm">
                      Please provide a valid email address.
                    </p>
                  )}
                  <p className="mt-3 text-center" style={{ maxWidth: "570px" }}>
                    By signing up for Scissors you acknowledge that you agree to
                    Scissors&apos;{" "}
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </label>

                <button
                  type="submit"
                  className="mt-4 h-12 w-full text-center  my-7 font-medium bg-green-700 hover:bg-green-800 text-white hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 focus:outline-none focus:ring-2 focus:ring-green-600 active:ring-green-600 text-xl"
                >
                  Sign up
                </button>
              </>
            )}
            {step === 2 && (
              <>
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
                <label className="block">
                  <span className="block  text-base font-bold text-slate-700">
                    First Name
                  </span>
                  <input
                    required
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                  />
                </label>
                <label className="block">
                  <span className="block text-base font-bold text-slate-700">
                    Last Name
                  </span>
                  <input
                    required
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              "
                  />
                </label>
                <label className="block">
                  <div className="grid grid-flow-col">
                    <span className="block text-base font-bold text-slate-700">
                      Password
                    </span>
                    <div
                      className="cursor-pointer flex flex-end mt-1 mr-4 justify-end"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <div className="grid grid-flow-col gap-1">
                          <IoEyeOff size={17} />{" "}
                          <p className="font-bold -mt-1 text-green-700">hide</p>
                        </div>
                      ) : (
                        <div className="grid grid-flow-col gap-1">
                          <IoEye size={18} />{" "}
                          <p className="font-bold -mt-1 text-green-700">show</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              "
                  />
                </label>
                <label className="block">
                  <span className="block text-base font-bold text-slate-700">
                    Confirm Password
                  </span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
              "
                  />
                </label>
                <button
                  type="submit"
                  className="mt-4 h-12 w-full text-center my-7 font-medium bg-green-700 hover:bg-green-800 text-white hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 focus:outline-none focus:ring-2 focus:ring-green-600 active:ring-green-600 text-xl"
                >
                  Sign up
                </button>
              </>
            )}
          </form>
        </div>
        <div className="center">
          <div className="mt-5 justify-center items-center text-center place-content-center">
            <p className="place-content-center">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/Scissors_logo.png"
            alt="Scissors"
            className="h-32 my-8 animate-pulse"
          />
        </div>
        <p className="mb-10  pb-20 text-center">© 2024 Scissors</p>
      </div>
      <div className="scissors-background"></div>
    </div>
  );
};

export default Signup;
