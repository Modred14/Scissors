// File: src/Footer.tsx
import React from "react";
import {
  FaFacebook,
  FaGoogle,
  FaTwitter,
  FaEnvelope,
  FaSlack,
} from "react-icons/fa";
import "./landing.css";

const Footer: React.FC = () => {
  return (
    <footer className="sl-footer">
      <div className="sl-container">
        <div className="sl-footer-top">
          <div className="sl-footer-brand-col">
            <div className="sl-footer-brand">
              <img src="/Scissors_logo.png" alt="Scissors" />
              Scissors
            </div>
            <p className="sl-footer-blurb">
              The fast, focused way to shorten links, generate QR codes, and
              track every connection to your content.
            </p>
          </div>

          <div>
            <p className="sl-footer-col-title">Product</p>
            <div className="sl-footer-links">
              <a href="/create-link">Shorten a link</a>
              <a href="/links">Your links</a>
              <a href="/dashboard">Dashboard</a>
            </div>
          </div>

          <div>
            <p className="sl-footer-col-title">Account</p>
            <div className="sl-footer-links">
              <a href="/">Home</a>
              <a href="/login">Sign in</a>
              <a href="/signup">Sign up</a>
              <a href="/settings">Settings</a>
            </div>
          </div>

          <div>
            <p className="sl-footer-col-title">Legal</p>
            <div className="sl-footer-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="sl-footer-bottom">
          <p className="sl-footer-copy">© 2024 Scissors. Handmade in Nigeria.</p>
          <div className="sl-footer-social">
            <a href="https://facebook.com" aria-label="Scissors on Facebook">
              <FaFacebook />
            </a>
            <a href="https://google.com" aria-label="Scissors on Google">
              <FaGoogle />
            </a>
            <a href="https://twitter.com" aria-label="Scissors on Twitter">
              <FaTwitter />
            </a>
            <a href="mailto:favourdomirin@gmail.com" aria-label="Email Scissors">
              <FaEnvelope />
            </a>
            <a href="https://slack.com" aria-label="Scissors on Slack">
              <FaSlack />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;