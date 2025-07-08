import React, { useState } from "react";
import "../auth.css";
import * as api from "../../../../api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../context/UserContext";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { setUser } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        email: email,
        username: username,
        password: password,
      };
      const responce = await api.register(credentials);
      console.log(responce);
      console.log("Registration successful", responce.data.user);
      setUser(responce.data.user);
      navigate("/home");
    } catch (err) {
      console.log("register error", err);
      toast.error("failed to register");
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-heading">Sign Up #Movies</h1>
      <div className="auth-container">
        <form onSubmit={onSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-field"
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-field"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-field"
          />
          <button className="auth-button">REGISTER</button>
        </form>
      </div>
      <p className="auth-text">
        Already have an account ?{" "}
        <a href="/login">
          <span className="auth-link">Sign In</span>
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
