import React from "react";
import { useNavigate } from "react-router-dom";

const LanguageTile = ({ language }) => {
  const navigate = useNavigate();

  const gotoLanguage = () => {
    navigate("/home/language", { state: { language } });
  };
  return (
    <div className="language-tile" onClick={gotoLanguage}>
      <h2 className="language-tile-text">{language}</h2>
    </div>
  );
};

export default LanguageTile;
