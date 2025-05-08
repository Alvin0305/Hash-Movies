import React from "react";
import { useNavigate } from "react-router-dom";

const LanguageTile = ({ language, user }) => {
  const navigate = useNavigate();

  const gotoLanguage = () => {
    navigate("/home/language", { state: { language: language, user: user } });
  };
  return (
    <div className="language-tile" onClick={gotoLanguage}>
      <h2 className="language-tile-text">{language}</h2>
    </div>
  );
};

export default LanguageTile;
