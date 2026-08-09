// Route: not routed - modal used inside /settings
import React from "react";
import "./landing.css";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type ConfirmProps = {
  isOpen: boolean;
  onClose: () => void;
  setMessage: (message: string) => void;
  userPassword?: string;
  isLoggedIn: boolean;
  onDelete: (password: string) => void;
  isSubmitting?: boolean;
};

const ConfirmationModal: React.FC<ConfirmProps> = ({
  isOpen,
  setMessage,
  isLoggedIn,
  userPassword,
  onClose,
  onDelete,
  isSubmitting = false,
}) => {
  const [password, setPassword] = React.useState("");
  if (isLoggedIn && isOpen && userPassword === "") {
    setMessage(
      `You will need to add a password to your account before deleting the account.`
    );
    onClose();
  } else if (isOpen && userPassword === "") {
    return;
  }

  if (!isOpen) return null;

  return (
    <div className="sl">
      <div className="sl-modal-overlay" role="dialog" aria-modal="true">
        <div className="sl-modal-card">
          <div className="sl-danger-zone-title" style={{ marginBottom: 4 }}>
            <ExclamationTriangleIcon aria-hidden="true" />
            <span className="sl-modal-title" style={{ marginBottom: 0 }}>
              Confirm Account Deletion
            </span>
          </div>
          <p className="sl-modal-text">
            Please enter your password to confirm account deletion:
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sl-input"
            style={{ width: "100%" }}
          />
          <div className="sl-modal-actions">
            <button
              onClick={onClose}
              className="sl-btn sl-btn--ghost sl-btn--sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(password)}
              className="sl-btn sl-btn--danger sl-btn--sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;