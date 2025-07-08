import React, { useEffect, useState } from "react";
import * as api from "../../../api";
import LoadingPage from "../loading/LoadingPage";
import "./userpage.css";
import languages from "../../../context/languages";
import Language from "./components/Language";
import Genre from "./components/Genre";
import { useLocation, useNavigate } from "react-router-dom";
import ScrollPane from "../home/utils/ScrollPane";
import { useUser } from "../../../context/UserContext";

const UserPage = () => {
  const { user } = useUser();

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);

  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredLanguages, setPreferredLanguages] = useState({});
  const [preferredGenres, setPreferredGenres] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.fetchUser(user._id);
        const genreResponse = await api.fetchGenres();

        setGenres(genreResponse.data);
        setUserData(response.data);
        setEmail(response.data.email);
        setGender(response.data.gender);

        console.log("userdata:", response.data);
        console.log("genres", genreResponse.data);
        console.log("preferred genres: ", response.data.interestedGenres);

        const langObj = {};
        languages.forEach((lang) => {
          langObj[lang] = response.data.languages?.includes(lang) || false;
        });
        setPreferredLanguages(langObj);

        const genreIds = [];
        response.data.interestedGenres.forEach((genre, i) => {
          genreIds[i] = genre._id;
        });
        const genreObj = {};
        genreResponse.data.forEach((genre) => {
          console.log(
            genreIds,
            genre._id,
            genreIds?.includes(genre._id),
            genreIds?.includes(genre._id) || false
          );
          genreObj[genre.name] = genreIds?.includes(genre._id) || false;
        });
        console.log("genreObj: ", genreObj);

        setPreferredGenres(genreObj);

        setLoading(false);
      } catch (err) {
        console.log("error: ", err.message);
      }
    };
    fetchUser();
  }, [user._id]);

  const handleToggleLanguage = (language) => {
    setPreferredLanguages((prev) => ({
      ...prev,
      [language]: !prev[language],
    }));
    console.log(preferredLanguages);
  };

  const handleToggleGenres = (genre) => {
    setPreferredGenres((prev) => ({
      ...prev,
      [genre]: !prev[genre],
    }));
    console.log(preferredGenres);
  };

  const getFormattedDate = (date) => {
    return date.split("T")[0] + " : " + date.substring(11, 16);
  };

  const handleSave = () => {
    const prefLang = [];

    for (const lang in preferredLanguages) {
      if (preferredLanguages[lang]) {
        prefLang.push(lang);
      }
    }

    const prefGenres = [];
    for (const genre in preferredGenres) {
      if (preferredGenres[genre]) {
        for (const gen in genres) {
          if (genres[gen].name == genre) {
            prefGenres.push(genres[gen]._id);
          }
        }
      }
    }
    const user = {
      username: userData.username,
      email: email,
      gender: gender,
      password:
        password === "" || password !== confirmPassword
          ? userData.password
          : password,
      languages: prefLang,
      interestedGenres: prefGenres,
      viewed: userData.viewed,
      liked: userData.liked,
      watchList: userData.watchList,
    };

    const updateUser = async () => {
      try {
        const response = await api.updateUser(userData._id, user);
        console.log(response);
      } catch (err) {
        console.log("error:", err.message);
      }
    };
    updateUser();

    navigate(-1);
  };

  return (
    <div className="user-page">
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="user-page-wrapper">
          <div className="user-page-top">
            <div className="user-page-image-and-username">
              <img
                src={userData.gender == "M" ? "boy.png" : "girl.png"}
                alt="No internet"
                className="user-page-avatar"
              />
              <h1 className="user-page-username">
                {userData.username.toUpperCase()}
              </h1>
            </div>

            <div className="user-page-details">
              <div className="user-page-detail">
                <h4 className="user-page-detail-value"> Liked</h4>
                <h2 className="user-page-detail-value">
                  {userData.liked.length}
                </h2>
              </div>
              <div className="user-page-detail">
                <h4 className="user-page-detail-value">Viewed</h4>
                <h2 className="user-page-detail-value">
                  {userData.viewed.length}
                </h2>
              </div>
              <div className="user-page-detail">
                <h4 className="user-page-detail-value"> Watch List</h4>
                <h2 className="user-page-detail-value">
                  {userData.watchList.length}
                </h2>
              </div>
            </div>
          </div>
          <div className="user-page-save-wrapper">
            <button className="user-page-save-button" onClick={handleSave}>
              Save
            </button>
          </div>
          <form action="">
            <div className="user-page-content">
              <div className="user-page-left-div">
                <label htmlFor="Email">EMAIL</label>
                <input
                  type="text"
                  placeholder={email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="user-page-field"
                />
                <label htmlFor="Password">NEW PASSWORD</label>
                <input
                  type="password"
                  placeholder={password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="user-page-field"
                />
                <h4 className="user-page-text">
                  Account Created On: {getFormattedDate(userData.createdAt)}
                </h4>
              </div>
              <div className="user-page-right-div">
                <label htmlFor="gender-select">GENDER</label>
                <select
                  id="gender-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="user-page-field"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <label htmlFor="Confirm Password">CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  placeholder={confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="user-page-field"
                />
                <h4 className="user-page-text">
                  Last Updated On: {getFormattedDate(userData.updatedAt)}
                </h4>
              </div>
            </div>
          </form>
          <div className="user-page-bottom">
            <h2 className="user-page-bottom-heading">Preferred Languages</h2>
            <div className="user-page-languages">
              {languages.map((language, index) => (
                <Language
                  language={language}
                  onAdd={() => handleToggleLanguage(language)}
                  key={index}
                  selected={preferredLanguages[language] || false}
                />
              ))}
            </div>
            <h2 className="user-page-bottom-heading">Preferred Genres</h2>
            <div className="user-page-genres">
              {genres.map((genre, index) => {
                return (
                  <Genre
                    genre={genre.name}
                    onAdd={() => handleToggleGenres(genre.name)}
                    key={index}
                    selected={preferredGenres[genre.name] || false}
                  />
                );
              })}
            </div>
          </div>
          <div className="user-page-movies-div">
            {userData.liked.length === 0 ? (
              ""
            ) : (
              <div>
                <h2 className="user-page-movie-heading">Liked Movies</h2>
                <ScrollPane movies={userData.liked} />
              </div>
            )}
            {userData.viewed.length === 0 ? (
              ""
            ) : (
              <div>
                <h2 className="user-page-movie-heading">Viewed Movies</h2>
                <ScrollPane movies={userData.viewed} />
              </div>
            )}
            {userData.watchList.length === 0 ? (
              ""
            ) : (
              <div>
                <h2 className="user-page-movie-heading">
                  Movies in Watch List
                </h2>
                <ScrollPane movies={userData.watchList} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
