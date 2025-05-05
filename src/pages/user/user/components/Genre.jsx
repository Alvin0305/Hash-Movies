import React from "react";
import { FaPlus } from "react-icons/fa";

const Genre = ({ genre, selected, onAdd }) => {
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
      <h5 className="language-text">{genre}</h5>
    </div>
  );
};

export default Genre;
