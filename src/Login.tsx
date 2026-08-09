// Route: /login
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./landing.css";
import Loading from "./Loading";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [alreadyLoggedIn] = useState<boolean>(() => !!localStorage.getItem("user"));

  const hasAt = email.includes("@");
  const hasEmailSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(email);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    if (alreadyLoggedIn) {
      navigate("/dashboard");
    }
  }, [alreadyLoggedIn, navigate]);

  const googleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const response = await fetch(
          "https://app-scissors-api.onrender.com/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Sign In successful:", data);
          setMessage("You have successfully signed into your account!");
          setLoading(false);
          navigate("/dashboard");
        } else {
          setLoading(false);
          setMessage(data.message);
        }
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    } finally {
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Firebase login successful:", userCredential.user);

      const response = await fetch(
        "https://app-scissors-api.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("API login successful:", data);

        const combinedUser = {
          ...data.user,
          firebaseUser: userCredential.user,
        };
        localStorage.setItem("user", JSON.stringify(combinedUser));

        setMessage("Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage(`An error occurred during login. Invalid credentials.`);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyLoggedIn) {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="sl">
      <div className="sl-noise" aria-hidden="true" />

      <section className="sl-auth-shell">
        <div className="sl-grid-overlay" aria-hidden="true" />
        <div
          className="sl-orb sl-orb--green"
          style={{ width: 420, height: 420, top: "-14%", left: "-12%" }}
          aria-hidden="true"
        />

        <div className="sl-auth-card">
          <Link to="/" className="sl-auth-logo">
            <img alt="Scissors" src="/Scissors_logo.png" />
            Scissors
          </Link>

          <h1 className="sl-auth-title">Sign in</h1>
          <p className="sl-auth-subtitle">Welcome back, let&apos;s get you in.</p>

          <button
            type="button"
            className="sl-google-btn"
            onClick={googleSignIn}
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
              <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5c-2 1.5-4.6 2.5-7.6 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.2 5.7l6.5 5.5C41.9 35.7 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z" />
            </svg>
            Continue with Google
          </button>

          <div className="sl-divider">or</div>

          {message && (
            <div
              className="sl-alert"
              style={{
                marginBottom: 16,
                opacity: isFadingOut ? 0 : 1,
                transition: "opacity 0.5s var(--sl-ease)",
              }}
            >
              <ExclamationTriangleIcon aria-hidden="true" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="sl-auth-form">
            <div className="sl-field">
              <label className="sl-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className={`sl-input${
                  email && !hasAt && hasEmailSymbol ? " sl-input--error" : ""
                }`}
              />
              {email && !hasAt && hasEmailSymbol && (
                <p className="sl-field-error">
                  Please provide a valid email address.
                </p>
              )}
            </div>

            <div className="sl-field">
              <div className="sl-field-row-head">
                <label className="sl-label" htmlFor="password">
                  Password
                </label>
                <Link to="/forget-password" className="sl-forgot-link" style={{ marginTop: 0 }}>
                  Forgot password?
                </Link>
              </div>
              <div className="sl-input-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sl-input"
                />
                <button
                  type="button"
                  className="sl-eye-btn"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="sl-btn sl-btn--primary sl-btn--block">
              Sign in
            </button>
          </form>

          <p className="sl-auth-switch">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;