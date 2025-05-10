import React from "react";
import "./forbidden.css";

const ForbiddenPage = () => {
  return (
    <div className="forbidden-page">
      <div className="forbidden-page-wrapper">
        <h1 className="forbidden-status">403</h1>
        <h2 className="forbidden-text">FORBIDDEN PAGE</h2>
      </div>
    </div>
  );
};

export default ForbiddenPage;
