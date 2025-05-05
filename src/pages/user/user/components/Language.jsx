import React from "react";
import { FaPlus } from "react-icons/fa";

const Language = ({ language, onAdd, selected }) => {
  return (
    <div
      className={
        selected
          ? "language-button selected-language-button"
          : "language-button"
      }
      onClick={onAdd}
    >
      <FaPlus />
      <h5 className="language-text">{language}</h5>
    </div>
  );
};

export default Language;
