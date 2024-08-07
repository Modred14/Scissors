import React from "react";

type ConfirmProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (password: string) => void;
};

const Confirm: React.FC<ConfirmProps> = ({ isOpen, onClose, onDelete }) => {
  const [password, setPassword] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" mx-5">
        <div className="bg-white p-5 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Confirm Account Deletion</h2>
          <p className="mb-4">
            Please enter your password to confirm account deletion:
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(password)}
              className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
