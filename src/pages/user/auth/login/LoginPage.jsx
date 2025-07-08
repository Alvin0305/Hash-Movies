import React from "react";
import "../auth.css";
import * as api from "../../../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../../../../context/UserContext";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        usernameOrEmail: emailOrUsername,
        password: password,
      };
      const responce = await api.login(credentials);
      if (responce.status == 200) {
        toast.info("Login successful", responce.data.user);
        console.log("role: ", responce.data.user.role);
        setUser(responce.data.user);
        if (responce.data.user.role === "admin") {
          navigate("/admin/home");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      if (err.status == 401) {
        toast.error("Invalid Email or Username");
      } else if (err.status == 403) {
        toast.error("Incorrect password");
      }
      console.log("login error", err);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-heading">Sign In #Movies</h1>
      <div className="auth-container">
        <form onSubmit={onSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username / Email"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="auth-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-field"
          />
          <button className="auth-button">LOGIN</button>
        </form>
      </div>
      <p className="auth-text">
        Don't have an account ?{" "}
        <a href="/">
          <span className="auth-link">Sign Up</span>
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
