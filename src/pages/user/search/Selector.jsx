import React from "react";
import { FaPlus } from "react-icons/fa";
import "./selector.css";

const Selector = ({ value, selected, onAdd }) => {
  return (
    <div
      className={
        selected
          ? "selector-button selected-selector-button"
          : "selector-button"
      }
      onClick={onAdd}
    >
      <FaPlus />
      <h5 className="selector-text">{value}</h5>
    </div>
  );
};

export default Selector;
