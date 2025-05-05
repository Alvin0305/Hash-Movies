import React from "react";
import UserLanguage from "./UserLanguage";

const UserLanguages = ({ languages }) => {
  return (
    <div>
      {languages.map((language, index) => (
        <UserLanguage language={language} key={index}/>
      ))}
    </div>
  );
};

export default UserLanguages;
