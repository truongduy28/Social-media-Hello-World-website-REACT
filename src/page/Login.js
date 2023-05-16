import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useContext";
import { Nav } from "./../components";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { login } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  // call variables and function
  const { dark, loginFunc } = useAppContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // variables innit
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(false);

  // function of components
  const handleChangeInput = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await loginFunc(query);
    if (res?.status === 200) {
      toast.success(res?.data?.msg || "Login success!");
      // addToLocalStorage(res?.data);
      dispatch(login(res.data));
      navigate("/");
    } else {
      toast.error(res?.response?.data?.msg || "Fail!");
    }
    setLoading(false);
  };
  return (
    <>
      <Nav />
      <div className="content">
        <div
          className=" bg-[#FEDCC5] dark:bg-[#4E4F50]  h-screen w-screen flex items-center relative transition-50 overflow-hidden"
          style={{ height: "calc(100vh - 65px)" }}
        >
          {/* image chicken */}
          <div className="fixed z-0 bottom-[-10%] left-[-25%] opacity-50">
            <img
              src="/image/3d-lg-02.png"
              alt="bg"
              className="h-[100vh] w-auto object-cover "
            />
          </div>
          {/* form */}
          <div className="w-full md:w-[80%] mx-auto flex items-center justify-center  md:justify-between z-[1] md:mt-4 ">
            <div className="bg-[#FEE7D6] dark:bg-[#3a3a3a] dark:text-white/70 w-[90%] md:w-auto px-[20px] md:px-[80px] py-[30px] md:py-[40px] rounded-3xl ">
              <div className=" mb-[18px] ">
                <img
                  src={`/image/${dark ? "login-dark.png" : "login.png"}`}
                  alt="login"
                  className="h-[40px] w-auto md:h-[50px] "
                />
              </div>
              <form
                className="md:mt-[20px] "
                onSubmit={(e) => {
                  handleLogin(e);
                }}
              >
                <div className="">
                  <div className="text-sm md:text-[16px] mb-2">Email</div>
                  <input
                    type="email"
                    className="input-login "
                    placeholder="User@gmail.com"
                    name="email"
                    onChange={(e) => handleChangeInput(e)}
                    disabled={loading}
                  />
                </div>
                <div className="mt-[25px]">
                  <div className="text-sm md:text-[16px] mb-2">Password</div>
                  <div className="flex items-center relative">
                    <input
                      // type={eye ? "text" : "password"}
                      className=" input-login"
                      placeholder="Password"
                      name="password"
                      onChange={(e) => handleChangeInput(e)}
                      disabled={loading}
                    />
                    {/* {eye ? (
                    <AiOutlineEye
                      className="text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40"
                      onClick={() => setEye(!eye)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40"
                      onClick={() => setEye(!eye)}
                    />
                  )} */}
                  </div>
                </div>
                <div className="mt-[12px] md:mt-[17px] text-[13px] cursor-pointer font-normal flex justify-between items-center ">
                  <NavLink to="/forget-password">Forget password</NavLink>
                  <span>
                    Remember{" "}
                    <input
                      type="checkbox"
                      className="rounded-[4px] ring-[#F25019] checked:bg-[#F25019]"
                    />
                  </span>
                </div>
                <button
                  className={`mt-[35px] md:mt-[35px] w-full font-extrabold text-[20px] md:text-2xl bg-[#F25019] text-white py-[8px] md:py-[13px] rounded-[5px] ${
                    null ? "loading" : ""
                  } flex items-center justify-center `}
                  type="submit"
                  // disabled={loading}
                >
                  {loading ? (
                    <ReactLoading
                      type="bubbles"
                      width={32}
                      height={32}
                      color="white"
                    />
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
              <div className="mt-[15px] md:mt-[30px] font-normal text-[13px] text-center ">
                or continue with
              </div>
              <div className="mt-[8px] md:mt-[16px] flex items-center justify-between  gap-x-[11px] shrink-1 ">
                <div className="icon-login " role="button">
                  <img
                    src="/image/icon-gg.png"
                    alt="icon-gg"
                    className=" w-[19px] md:w-[24px] h-auto rounded-full"
                  />
                </div>
                <div className="icon-login " role="button">
                  <img
                    src="/image/icon-github.png"
                    alt="icon-gg"
                    className=" w-[19px] md:w-[24px] h-auto bg-white rounded-full"
                  />
                </div>
                <div className="icon-login " role="button">
                  <img
                    src="/image/icon-fb.png"
                    alt="icon-gg"
                    className=" w-[19px] md:w-[24px] h-auto bg-white rounded-full"
                  />
                </div>
              </div>
              <div className="mt-[8px] md:mt-[16px] text-[13px] md:text-[15px] text-center ">
                <span className="block md:inline ">
                  Don't have an account yet?{" "}
                </span>
                <NavLink
                  to={"/register"}
                  role="button"
                  className="hover:scale-110 text-[18px] font-bold "
                >
                  Register for free
                </NavLink>
              </div>
            </div>
            {/* <img
              src={`/image/${dark ? "chicken.png" : "chicken-dark.png"}`}
              alt="chicken"
              className="w-[50%] h-auto object-cover hidden md:inline "
            /> */}
            <img
              src={`/image/3d-bg-01.png`}
              alt="chicken"
              className="w-[80%] h-auto object-cover hidden md:inline translate-x-[-10%] "
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
