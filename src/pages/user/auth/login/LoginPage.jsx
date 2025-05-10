import React from "react";
import "../auth.css";
import * as api from "../../../../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        usernameOrEmail: emailOrUsername,
        password: password,
      };
      const responce = await api.login(credentials);
      if (responce.status == 401) {
        console.log("Invalid Email or username");
      } else if (responce.status == 200) {
        console.log("Login successful", responce.data.user);
        console.log("role: ", responce.data.user.role);
        if (responce.data.user.role === "admin") {
          navigate("/admin/home", { state: { user: responce.data.user } });
        } else {
          navigate("/home", { state: { user: responce.data.user } });
        }
      }
    } catch (err) {
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
