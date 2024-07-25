import React from 'react';

interface ToggleButtonProps {
  toggleState: boolean;
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ toggleState, onToggle }) => {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle(event);
      }}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${
        toggleState ? 'bg-green-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`${
          toggleState ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
      />
    </button>
  );
};

export default ToggleButton;

