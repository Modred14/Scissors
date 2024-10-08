import React, { useState } from "react";
import "./Tooltip.css";

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
