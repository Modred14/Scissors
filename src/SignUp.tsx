// Route: /signup
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./landing.css";
import Loading from "./Loading";
import { auth } from "./firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [alreadyLoggedIn] = useState<boolean>(() => !!localStorage.getItem("user"));

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
    if (alreadyLoggedIn) {
      navigate("/dashboard");
    }
  }, [alreadyLoggedIn, navigate]);

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
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage(
        "Passwords do not match. Password and confirm password must be the same."
      );
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      console.log("User signed up:", firebaseUser);

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

        const combinedUser = {
          ...data,
          firebaseUser,
        };

        localStorage.setItem("user", JSON.stringify(combinedUser));

        await sendEmailVerification(firebaseUser);
        setMessage("Verification email sent. Please check your inbox.");

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setMessage("Oops, an error occurred during signup. Couldn't sign up.");
      }
    } catch (err: any) {
      setMessage(err.message);
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
          style={{ width: 420, height: 420, top: "-14%", right: "-12%" }}
          aria-hidden="true"
        />

        <div className="sl-auth-card">
          <Link to="/" className="sl-auth-logo">
            <img alt="Scissors" src="/Scissors_logo.png" />
            Scissors
          </Link>

          <h1 className="sl-auth-title">Create your account</h1>
          <p className="sl-auth-subtitle">
            {step === 1
              ? "Start shortening, tracking, and sharing links."
              : "Almost done — just a few more details."}
          </p>

          <div className="sl-auth-steps" aria-hidden="true">
            <span
              className={`sl-auth-step-dot${step === 1 ? " sl-auth-step-dot--active" : ""}`}
            />
            <span
              className={`sl-auth-step-dot${step === 2 ? " sl-auth-step-dot--active" : ""}`}
            />
          </div>

          {step === 1 && (
            <>
              <button
                type="button"
                className="sl-google-btn"
                onClick={googleSignUp}
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
            </>
          )}

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

          <form
            onSubmit={step === 1 ? handleEmailSubmit : handleDetailsSubmit}
            className="sl-auth-form"
          >
            {step === 1 && (
              <>
                <div className="sl-field">
                  <label className="sl-label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
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

                <p className="sl-legal-text">
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

                <button type="submit" className="sl-btn sl-btn--primary sl-btn--block">
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="sl-field">
                  <label className="sl-label" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    required
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="sl-input"
                  />
                </div>

                <div className="sl-field">
                  <label className="sl-label" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    required
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="sl-input"
                  />
                </div>

                <div className="sl-field">
                  <label className="sl-label" htmlFor="password">
                    Password
                  </label>
                  <div className="sl-input-wrap">
                    <input
                      id="password"
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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

                <div className="sl-field">
                  <label className="sl-label" htmlFor="confirmPassword">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="sl-input"
                  />
                </div>

                <button type="submit" className="sl-btn sl-btn--primary sl-btn--block">
                  Sign up
                </button>
              </>
            )}
          </form>

          <p className="sl-auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Signup;