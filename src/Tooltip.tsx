import React, { useState } from 'react';
import './Tooltip.css'; // Make sure to create a CSS file for styling

const Tooltip: React.FC<{ info: string }> = ({ info }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="tooltip-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="question-mark">?</span>
      {isHovered && <div className="tooltip">{info}</div>}
    </span>
  );
};

export default Tooltip;
