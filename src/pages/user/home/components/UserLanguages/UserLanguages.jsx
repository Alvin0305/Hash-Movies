import React from "react";
import UserLanguage from "./UserLanguage";

const UserLanguages = ({ languages, user }) => {
  return (
    <div>
      {languages.map((language, index) => (
        <UserLanguage language={language} key={index} user={user}/>
      ))}
    </div>
  );
};

export default UserLanguages;
