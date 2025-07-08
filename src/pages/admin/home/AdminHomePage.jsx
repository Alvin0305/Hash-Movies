import React, { useRef, useState } from "react";
import Users from "../user/Users";
import Movies from "../movie/Movies";
import Genres from "../genres/Genres";
import Platforms from "../platforms/Platforms";
import "./home.css";
import Actors from "../actors/Actors";
import Dashboard from "../dashboard/Dashboard";
import { useLocation } from "react-router-dom";
import LoadingPage from "../../user/loading/LoadingPage";
import ForbiddenPage from "../forbidden/ForbiddenPage";
import { useUser } from "../../../context/UserContext";

const AdminHomePage = () => {
  const userRef = useRef(null);
  const movieRef = useRef(null);
  const genreRef = useRef(null);
  const platformRef = useRef(null);
  const actorRef = useRef(null);

  const location = useLocation();

  const scrollToUsers = () => {
    userRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToMovies = () => {
    movieRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToGenres = () => {
    genreRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToPlatforms = () => {
    platformRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToActors = () => {
    actorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { user } = useUser();

  if (!user) return <ForbiddenPage />;
  if (user.role !== "admin") return <ForbiddenPage />;

  return (
    <div className="admin-home-page">
      <Dashboard
        scrollToUsers={scrollToUsers}
        scrollToGenres={scrollToGenres}
        scrollToMovies={scrollToMovies}
        scrollToPlatforms={scrollToPlatforms}
        scrollToActors={scrollToActors}
      />
      <div className="admin-home-content">
        <div ref={userRef}>
          <Users />
        </div>
        <div ref={movieRef}>
          <Movies />
        </div>
        <div ref={genreRef}>
          <Genres />
        </div>
        <div ref={platformRef}>
          <Platforms />
        </div>
        <div ref={actorRef}>
          <Actors />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
