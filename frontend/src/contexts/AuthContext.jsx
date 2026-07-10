import axios from "axios";

import {
  createContext,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { HttpStatusCode } from "axios";

// ================= CREATE CONTEXT =================

export const AuthContext = createContext({});

// ================= AXIOS CLIENT =================

const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

// ================= PROVIDER =================

export const AuthProvider = ({ children }) => {

  const [userData, setUserData] =
    useState(null);

  const navigate = useNavigate();

  // ================= REGISTER =================

  const handleRegister = async (
    name,
    username,
    password
  ) => {

    try {

      let request = await client.post(
        "/register",
        {
          name: name,
          username: username,
          password: password,
        }
      );

      if (
        request.status ===
        HttpStatusCode.Created
      ) {

        return request.data.message;
      }

    } catch (err) {

      throw err;
    }
  };

  // ================= LOGIN =================

  const handleLogin = async (
    username,
    password
  ) => {

    try {

      let request = await client.post(
        "/login",
        {
          username: username,
          password: password,
        }
      );

      if (
        request.status ===
        HttpStatusCode.Ok
      ) {

        // Store token
        localStorage.setItem(
          "token",
          request.data.token
        );

        // Store user globally
        setUserData(request.data.user);
        // Navigate to homepage
        navigate("/");

        return request.data.message;
      }

    } catch (err) {

      throw err;
    }
  };

  // ================= CONTEXT DATA =================

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
  };

  // ================= PROVIDER RETURN =================

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};