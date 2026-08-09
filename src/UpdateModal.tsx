// Route: not routed - modal used inside /edit-link/:id
import React from "react";
import "./landing.css";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type updateProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

const UpdateModal: React.FC<updateProps> = ({ isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="sl">
      <div className="sl-modal-overlay" role="dialog" aria-modal="true">
        <div className="sl-modal-card">
          <div className="sl-danger-zone-title" style={{ marginBottom: 4 }}>
            <ExclamationTriangleIcon aria-hidden="true" />
            <span className="sl-modal-title" style={{ marginBottom: 0 }}>
              Confirm Link Update
            </span>
          </div>
          <p className="sl-modal-text">
            Updating this link means you are changing the original version of
            the link. Consequently, the former data associated with this link
            will no longer be valid, and only the new data will work.
          </p>
          <p className="sl-modal-text">Do you still want to continue?</p>
          <div className="sl-modal-actions">
            <button onClick={onClose} className="sl-btn sl-btn--ghost sl-btn--sm">
              Cancel
            </button>
            <button onClick={onUpdate} className="sl-btn sl-btn--primary sl-btn--sm">
              Yes, update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;