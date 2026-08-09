// Route: not routed - full-page loading state shown across the app
import React from "react";
import "./landing.css";

const Loading: React.FC = () => {
  return (
    <div className="sl">
      <div className="sl-noise" aria-hidden="true" />
      <div className="sl-loading-screen">
        <div className="sl-grid-overlay" aria-hidden="true" />
        <div
          className="sl-orb sl-orb--green"
          style={{
            width: 380,
            height: 380,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        />

        <div className="sl-loading-content">
          <div className="sl-loading-logo-wrap">
            <span className="sl-loading-glow" aria-hidden="true" />
            <span className="sl-loading-ring" aria-hidden="true" />
            <img src="/Scissors_logo.png" alt="Scissors" />
          </div>
          <p className="sl-loading-text" role="status" aria-live="polite">
            Loading
            <span className="sl-loading-dot">.</span>
            <span className="sl-loading-dot">.</span>
            <span className="sl-loading-dot">.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;