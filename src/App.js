// import logo from "./logo.svg";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { useAppContext } from "./context/useContext";
import ForgetPassword from "./page/ForgetPassword";
import Home from "./page/Home";
import Login from "./page/Login";
import Main from "./page/Main";
import Register from "./page/Register";
import { ToastContainer } from "react-toastify";
import ProtectedLayout from "./middleware/ProtectedLayout";
import Profile from "./page/Profile";
import UpdateProfile from "./page/UpdateProfile";
import Messenger from "./page/Messenger";
import DetailPost from "./page/Detail.Post";
import { useRef } from "react";
import useScrollOutTop from "./middleware/useScrollOutTop";
import { BiChevronUp } from "react-icons/bi";
import Admin from "./page/Admin";

function App() {
  const top = useRef();
  const scrolling = useScrollOutTop();
  // console.log(scrolling);
  const { dark, setOneState } = useAppContext();
  return (
    <div
      className="bg-[#f0f0f1] dark:bg-[#121212] dark:text-[#e4e6eb] overflow-x-hidden"
      ref={top}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Outlet />
              </ProtectedLayout>
            }
          >
            <Route path="/" element={<Main />}></Route>
            <Route path="/profile/:id" element={<Profile />}></Route>
            <Route path="/update-profile" element={<UpdateProfile />}></Route>
            <Route path="/messenger/" element={<Messenger />}></Route>
            <Route path="/post/:id" element={<DetailPost />}></Route>
            <Route path="/admin/" element={<Admin />}></Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/forget-password" element={<ForgetPassword />}></Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={1500} theme={dark ? "dark" : "light"} />
      <div
        className={`bg-blue-500 w-[50px] h-[50px] fixed bottom-3 right-2 z-20 flex justify-center items-center text-white text-5xl rounded-full shadow-lg cursor-pointer duration-300 ${
          scrolling
            ? " visible opacity-100 scale-100"
            : "invisible opacity-0 scale-50"
        } 	`}
        onClick={() => top?.current?.scrollIntoView({ behavior: "smooth" })}
      >
        <BiChevronUp />
      </div>
      <div
        className={`bg-blue-300 w-[50px] h-[50px] fixed ${
          scrolling ? " bottom-[70px] " : " bottom-3 "
        }   right-2 z-20 flex justify-center items-center text-white text-2xl rounded-full shadow-2xl cursor-pointer duration-300 opacity-80 md:hidden `}
        onClick={() => {
          setOneState("dark", !dark);
          localStorage.setItem("dark", String(!dark));
        }}
      >
        {/* <span className="duration-150"> */}{" "}
        {/* {!dark ? <FaSun /> : <RiMoonClearFill />}{" "} */}
        <img
          className="w-full h-full object-cover"
          src={`./image/${!dark ? "mochi-sun.gif" : "mochi-night.gif"}`}
          alt=""
        />
        {/* </span> */}
      </div>
    </div>
  );
}

export default App;
