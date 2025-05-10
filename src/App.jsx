import LoginPage from "./pages/user/auth/login/LoginPage";
import RegisterPage from "./pages/user/auth/register/RegisterPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/user/home/HomePage";
import MoviePage from "./pages/user/movie/MoviePage";
import GenrePage from "./pages/user/genre/GenrePage";
import { AuthProvider } from "./context/AuthContext";
import UserPage from "./pages/user/user/UserPage";
import LoadingPage from "./pages/user/loading/LoadingPage";
import LanguagePage from "./pages/user/language/LanguagePage";
import AdminHomePage from "./pages/admin/home/AdminHomePage";
import LikedPage from "./pages/user/liked/LikedPage";
import ViewedPage from "./pages/user/viewed/ViewedPage";
import WatchListPage from "./pages/user/watchlist/WatchListPage";
import SearchPage from "./pages/user/search/SearchPage";
import UpdateMovie from "./pages/admin/movie/update/UpdateMovie";
import AddMovies from "./pages/admin/movie/add/AddMovies";
import AddGenre from "./pages/admin/genres/add/AddGenre";
import UpdateGenre from "./pages/admin/genres/update/UpdateGenre";
import AddPlatform from "./pages/admin/platforms/add/AddPlatform";
import UpdatePlatform from "./pages/admin/platforms/update/UpdatePlatform";
import AddActor from "./pages/admin/actors/add/AddActor";
import UpdateActor from "./pages/admin/actors/update/UpdateActor";
import ActorPage from "./pages/user/actor/ActorPage";
import ForbiddenPage from "./pages/admin/forbidden/ForbiddenPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/movie" element={<MoviePage />} />
          <Route path="/home/genre" element={<GenrePage />} />
          <Route path="/home/actor" element={<ActorPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/home/language" element={<LanguagePage />} />
          <Route path="/admin/home" element={<AdminHomePage />} />
          <Route path="/home/liked" element={<LikedPage />} />
          <Route path="/home/viewed" element={<ViewedPage />} />
          <Route path="/home/watchList" element={<WatchListPage />} />
          <Route path="/home/search" element={<SearchPage />} />
          <Route path="/admin/movie/update" element={<UpdateMovie />} />
          <Route path="/admin/movie/add" element={<AddMovies />} />
          <Route path="/admin/genre/add" element={<AddGenre />} />
          <Route path="/admin/genre/update" element={<UpdateGenre />} />
          <Route path="/admin/platform/add" element={<AddPlatform />} />
          <Route path="/admin/platform/update" element={<UpdatePlatform />} />
          <Route path="/admin/actor/add" element={<AddActor />} />
          <Route path="/admin/actor/update" element={<UpdateActor />} />
          <Route path="/forbidden" element={<ForbiddenPage />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
