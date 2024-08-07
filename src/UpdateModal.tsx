import React from "react";

type updateProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

const UpdateModal: React.FC<updateProps> = ({ isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-5 max-w-xl">
        <div className="bg-white p-5 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Confirm Link Update</h2>
          <p className="mb-4 text-base">
            Updating this link means you are changing the original version of the link. Consequently, the former data associated with this link will no longer be valid, and only the new data will work.
          </p>
          <p className="mb-4 text-base">
            Do you still want to continue?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
            >
              Yes, Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
