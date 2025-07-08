import React, { useEffect } from "react";
import languages from "../../../../../context/languages";
import LanguageTile from "./components/LanguageTile";

const LanguagesSession = () => {
  return (
    <div>
      <h1 className="home-page-sub-heading">Languages</h1>
      <div className="home-page-languages-div">
        {languages.map((language, index) => {
          return <LanguageTile language={language} key={index} />;
        })}
      </div>
    </div>
  );
};

export default LanguagesSession;
