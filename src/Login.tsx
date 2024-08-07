import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import "./login.css";
import "./style.css";
import Loading from "./Loading";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const navigate = useNavigate();
  const clientId = "YOUR_GOOGLE_CLIENT_ID";

  const hasAt = email.includes("@");
  const hasEmailSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(email);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    } else {
      setLoading(false);
    }
  }, [navigate]);

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

  const handleLogin = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ("profileObj" in response) {
      const profile = response.profileObj;
      console.log("ID: " + profile.googleId);
      console.log("Name: " + profile.name);
      console.log("Image URL: " + profile.imageUrl);
      console.log("Email: " + profile.email);

      const id_token = response.tokenId;
      console.log("ID Token: " + id_token);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://users-api-scissors.onrender.com/users");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        console.log("Signed in as: " + xhr.responseText);
      };
      xhr.send("idtoken=" + id_token);
    } else {
      console.error("Login failed: ", response);
    }
  };

  const handleFailure = (error: any) => {
    console.error("Google Login failed:", error);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

setLoading(true)
    try {
      const response = await fetch("https://users-api-scissors.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful");
        navigate("/dashboard");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage(
        "An error occurred during login. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-coln body">
      <div
        className="max-w-screen-md w-full min-w-fit form-size"
        style={{ maxWidth: "100%" }}
      >
        <form onSubmit={handleEmailLogin} className="">
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
            Sign in
          </p>
          <GoogleLogin
            clientId={clientId}
            onSuccess={handleLogin}
            onFailure={handleFailure}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <div
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <button className="mt-4 shadow h-12 w-full  text-center my-7 font-medium active:bg-green-700 hover:bg-green-700 text-green hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 outline outline-1 focus:outline-none focus:text-white focus:bg-green-700 active:ring-green-600 text-xl">
                  Continue with Google
                </button>
              </div>
            )}
          />
          <div className="m-space">
            <div className="inline">
              <div className="line"></div>
              <div className="line correct-line"></div>
              <div className="text-center">or</div>
            </div>
          </div>
        </form>
        <form onSubmit={handleEmailLogin}>
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
          )}{" "}
          {/* Display login message */}
          <label className="block">
            <span className="block text-base font-bold text-slate-700">
              Email address
            </span>
            <input
              type="email"
              placeholder="email"
              value={email}
              required
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
          </label>
          <label className="block mt-4">
            <span className="block text-base font-bold text-slate-700">
              Password
            </span>
            <input
              type="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
              disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
             "
            />
          </label>
          <a
            className="block mt-2 text-right text-sky-500 hover:underline"
            href="#"
          >
            Forgot password?
          </a>
          <button
            type="submit"
            className="mt-4 h-12 w-full text-center my-7 font-medium bg-green-700 hover:bg-green-800 text-white hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 focus:outline-none focus:ring-2 focus:ring-green-600 active:ring-green-600 text-xl"
          >
            Sign in
          </button>
          <div className="center">
            <div className="mt-5 justify-center items-center text-center place-content-center">
              <p className="place-content-center">
                Don't have an account?{" "}
                <Link to="/signup">
                  <a>Sign up</a>
                </Link>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center animate-pulse">
            <img
              src="/Scissors_logo.png"
              alt="Scissors"
              className="h-32 my-8"
            />
          </div>
          <p className="mb-10 text-center">© 2024 Scissors</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
