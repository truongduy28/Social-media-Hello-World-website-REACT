import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { APIURI } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // const user = JSON.parse(localStorage.getItem("userState")) || null;
  const dark = JSON.parse(localStorage.getItem("dark")) || null;

  const isLogin = useSelector((state) => state?.user?.value);
  const user = useSelector((state) => state.auth);

  const initState = {
    // user: user || "",
    dark: dark || false,
    isQrCode: false,
  };

  const [state, setStateContext] = useState(initState);
  const dispatch = useDispatch();

  if (state.dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const setOneState = (name, value) => {
    setStateContext({ ...state, [name]: value });
  };

  const loginFunc = async ({ email, password }) => {
    try {
      const req = await axios.post(APIURI + "/users/login", {
        email,
        password,
      });
      return req;
    } catch (error) {
      return error;
    }
  };

  const registerFunc = async ({
    name,
    email,
    password,
    rePassword,
    secret,
  }) => {
    try {
      const req = await axios.post(APIURI + "/users/register", {
        name,
        email,
        password,
        rePassword,
        secret,
      });
      return req;
    } catch (error) {
      return error;
    }
  };

  const addToLocalStorage = (user) => {
    localStorage.setItem("userState", JSON.stringify(user));
  };

  const removeFromLocalStorage = () => {
    localStorage.removeItem("userState");
  };

  const loginRequired = (user, navigate) => {
    if (!user) {
      // alert("Please enter");
      navigate("/home");
    }
  };

  return (
    <>
      <AppContext.Provider
        value={{
          ...state,
          setOneState,
          registerFunc,
          loginFunc,
          addToLocalStorage,
          removeFromLocalStorage,
          loginRequired,
          dispatch,
          user,
          isLogin,
          axios,
        }}
      >
        {children}{" "}
      </AppContext.Provider>{" "}
    </>
  );
};
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContextProvider, useAppContext };
