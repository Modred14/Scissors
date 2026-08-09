// File: src/Confirm.tsx
import React from "react";
import "./landing.css";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type ConfirmProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (password: string) => void;
  isLoggedIn: boolean;
  id?: string;
  setMessage: (message: string) => void;
  userPassword?: string;
};

const Confirm: React.FC<ConfirmProps> = ({
  isLoggedIn,
  isOpen,
  onClose,
  onDelete,
  id,
  setMessage,
  userPassword,
}) => {
  const [password, setPassword] = React.useState("");
  if (isOpen && userPassword === "") {
    setMessage(
      `You will need to add a password to your account before deleting the link.`
    );
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="sl">
      <div className="sl-modal-overlay" role="dialog" aria-modal="true">
        <div className="sl-modal-card">
          <div className="sl-danger-zone-title" style={{ marginBottom: 4 }}>
            <ExclamationTriangleIcon aria-hidden="true" />
            <span className="sl-modal-title" style={{ marginBottom: 0 }}>
              Confirm Link Deletion
            </span>
          </div>
          {isLoggedIn ? (
            <div>
              <p className="sl-modal-text">
                Please enter your password to confirm link deletion:
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sl-input"
                style={{ width: "100%" }}
              />
              <div className="sl-modal-actions">
                <button onClick={onClose} className="sl-btn sl-btn--ghost sl-btn--sm">
                  Cancel
                </button>
                <button
                  onClick={() => onDelete(password)}
                  className="sl-btn sl-btn--danger sl-btn--sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="sl-modal-text">
                Are you sure you want to delete this link? This action cannot
                be undone.
              </p>
              <div className="sl-modal-actions">
                <button onClick={onClose} className="sl-btn sl-btn--ghost sl-btn--sm">
                  Cancel
                </button>
                <button
                  onClick={() => id && onDelete(id)}
                  className="sl-btn sl-btn--danger sl-btn--sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirm;