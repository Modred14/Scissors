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
    <footer className="sl sl-footer">
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
            <p className="sl-footer-col-title">Solutions</p>
            <div className="sl-footer-links">
              <a href="#">Healthcare</a>
              <a href="#">Insurance</a>
              <a href="#dashboard">Financial Services</a>
              <a href="#">Education</a>
              <a href="#">Professional Services</a>
              <a href="#">Retail</a>
              <a href="#">Consumer Packaged Goods</a>
              <a href="#">Tech Software &amp; Hardware</a>
              <a href="#">Media &amp; Entertainment</a>
            </div>
          </div>

          <div>
            <p className="sl-footer-col-title">Products</p>
            <div className="sl-footer-links">
              <a href="/create-link">Url Shortner</a>
              <a href="/create-link">Qr Code</a>
              <a href="/create-link">Custom Domain</a>
              <a href="/create-link">Analytics</a>
            </div>
          </div>

          <div>
            <p className="sl-footer-col-title">Scissors</p>
            <div className="sl-footer-links">
              <a href="/">Home</a>
              <a href="/">About Us</a>
              <a href="/dashboard">Services</a>
              <a href="#">Contact</a>
            </div>
          </div>

          <div>
            <p className="sl-footer-col-title">Resources</p>
            <div className="sl-footer-links">
              <a href="#">Blog</a>
              <a href="#">Resource Library</a>
              <a href="#">Help Center</a>
              <a href="#">Apps and Integrations</a>
              <a href="#">Mobile App</a>
              <a href="#">Developers</a>
            </div>
          </div>

          <div>
            <p className="sl-footer-col-title">Legal</p>
            <div className="sl-footer-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="#">Cookie Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
              <a href="#">Transparency Report</a>
              <a href="#">Code of Conduct</a>
              <a href="#">Developers</a>
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