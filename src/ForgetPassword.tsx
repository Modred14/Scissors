// Route: /forget-password
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./landing.css";
import { EnvelopeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: string[];
}

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

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

  const sendEmail = async () => {
    await sendPasswordResetEmail(auth, email);
    setMessage(
      "Another password reset email has been sent to your email. Kindly check your email."
    );
  };

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

          {message && (
            <div
              className={`sl-alert${
                step === 2 ? " sl-alert--success" : ""
              }`}
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

          {step === 1 ? (
            <>
              <h1 className="sl-auth-title">Forgot password</h1>
              <p className="sl-auth-subtitle">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleEmailSubmit} className="sl-auth-form">
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
                    className="sl-input"
                  />
                </div>

                <button type="submit" className="sl-btn sl-btn--primary sl-btn--block">
                  Send reset link
                </button>
              </form>

              <p className="sl-auth-switch">
                Remember your password? <Link to="/login">Sign in</Link>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div className="sl-auth-icon-circle">
                <EnvelopeIcon aria-hidden="true" />
              </div>
              <h1 className="sl-auth-title">Check your email</h1>
              <p className="sl-auth-subtitle" style={{ marginBottom: 4 }}>
                We&apos;ve sent a password reset link to
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  wordBreak: "break-all",
                  marginBottom: 22,
                }}
              >
                {email}
              </p>
              <p className="sl-legal-text" style={{ marginBottom: 0 }}>
                Please check your inbox and follow the instructions to reset
                your password.
              </p>

              <p className="sl-auth-resend-text">
                Didn&apos;t receive the email?{" "}
                <button type="button" onClick={sendEmail}>
                  Click here to resend
                </button>
              </p>

              <p className="sl-auth-switch">
                <Link to="/login">Back to sign in</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ForgetPassword;