import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/useContext";
import Nav from "./../components/common/Nav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  // call variables and function
  const { dark, registerFunc } = useAppContext();

  // variables innit
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(false);

  // function of components
  const handleChangeInput = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await registerFunc(query);
    res?.status == 200
      ? toast.success(res?.data?.msg || "Register success!")
      : toast.error(res?.response?.data?.msg || "Fail!");
    setLoading(false);
  };

  return (
    <div>
      <Nav />
      <div
        className={`bg-[#5c7bd1] dark:bg-[#4E4F50] h-screen w-screen flex items-center relative transition-50 overflow-hidden md:grid-cols-3 content `}
        style={{
          backgroundImage: !dark ? "none" : "url(/image/bg.png)",
          height: "calc(100vh )",
          paddingTop: "30px",
        }}
      >
        {/* image background */}
        <div className="hidden md:flex h-full items-center justify-center relative md:col-span-1  w-[40%]">
          <img
            src="/image/cloud.png"
            alt="cloud"
            className="absolute bottom-0 left-0 opacity-70 w-full h-full "
          />
          {/* <img
            src="/image/heart.png"
            alt="cloud"
            className="absolute left-[10%] top-[20%] opacity-70 cursor-pointer rotate-90 "
          />
          <img
            src="/image/heart.png"
            alt="cloud"
            className="absolute left-[30%] bottom-[5%] opacity-70 cursor-pointer rotate-[36 deg] "
          />
          <img
            src="/image/heart.png"
            alt="cloud"
            className="absolute left-[10%] opacity-70 cursor-pointer "
          />
          <img
            src="/image/heart.png"
            alt="cloud"
            className="absolute top-[10%] left-[20%] opacity-70 cursor-pointer "
          /> */}

          <img
            src={`/image/3d-rgt-02.png`}
            alt="chicken"
            className="w-[100%] h-auto object-contain z-10 scale-[170%]"
          />
        </div>
        {/* form */}
        <div className="flex md:col-span-2 w-full items-center justify-center z-10">
          <div className="bg-[#ffffff]/80 mx-[5%] md:mx-0 w-full mt-9 dark:bg-[#3a3a3a]/80 dark:text-white/70 md:w-auto px-[20px] md:px-[80px] py-[15px] sm:py-[30px] md:py-[40px] rounded-3xl transition-50 ">
            <div className=" mb-[18px] text-xl sm:text-2xl md:text-[30px] text-[#5b38bc] dark:text-[#9b7cee] font-extrabold ">
              Register
            </div>
            <form
              onSubmit={(e) => handleRegister(e)}
              className="mt-[13px] sm:mt-[15px] md:mt-[20px] font-bold "
            >
              {/* name and email */}
              <div className="grid grid-cols-2 gap-x-2 md:gap-x-3 ">
                <div className="col-span-1">
                  <div className="text-sm md:text-[16px] mb-1 md:mb-2">
                    Name
                  </div>
                  <input
                    type="text"
                    className="input-register "
                    placeholder="Jack Frost"
                    name="name"
                    onChange={(e) => {
                      handleChangeInput(e);
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="col-span-1">
                  <div className="text-sm md:text-[16px] mb-1 md:mb-2">
                    Email
                  </div>
                  <input
                    type="email"
                    className=" input-register"
                    placeholder="User@gmail.com"
                    name="email"
                    onChange={(e) => {
                      handleChangeInput(e);
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
              {/* password and confirm password */}
              <div className="mt-4 md:mt-[25px] grid grid-cols-2 gap-x-2 md:gap-x-3">
                {/* Password */}
                <div className="col-span-1">
                  <div className="text-sm md:text-[16px] mb-1 md:mb-2">
                    Password
                  </div>
                  <div className="flex items-center relative">
                    <input
                      //   type={eye ? "text" : "password"}
                      className=" input-register "
                      placeholder="Password"
                      name="password"
                      onChange={(e) => {
                        handleChangeInput(e);
                      }}
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
                {/* Confirm password */}
                <div className="col-span-1">
                  <div className="text-sm md:text-[16px] mb-1 md:mb-2">
                    Confirm password
                  </div>
                  <div className="flex items-center relative">
                    <input
                      //   type={reEye ? "text" : "password"}
                      className=" input-register "
                      placeholder="Password"
                      name="rePassword"
                      onChange={(e) => {
                        handleChangeInput(e);
                      }}
                      disabled={loading}
                    />
                    {/* {reEye ? (
                      <AiOutlineEye
                        className="text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40"
                        onClick={() => setReEye(!reEye)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40"
                        onClick={() => setReEye(!reEye)}
                      />
                    )} */}
                  </div>
                </div>
              </div>
              {/* Question and answer */}
              <div className="mt-4 md:mt-[25px] sm:grid grid-cols-2 gap-x-2 md:gap-x-3">
                {/* Question */}
                <div className="col-span-1">
                  <div className="text-sm md:text-[16px] mb-1 md:mb-2">
                    Question
                    <span className="font-normal text-[14.5px] ">
                      (use when reset password)
                    </span>
                  </div>
                  <select
                    className="appearance-none
                                                md:h-[50px]
                                                w-full
                                                px-[20px]
                                                py-[8px]
                                                text-sm
                                                font-bold
                                                border
                                                rounded
                                                focus:text-gray-700 focus:bg-white focus:border-[#472899] focus:outline-none
                                                dark:bg-[#242526]
                                                dark:focus:border-white/40
                                                dark:text-white/70
                                                "
                    aria-label="Default select example"
                  >
                    <option value={1}>What is ur favorite color?</option>
                    <option value={2}>Where are u born?</option>
                    <option value={3}>When was the last time you cried?</option>
                  </select>
                </div>
                {/* Answer */}
                <div className="col-span-1 mt-4 sm:mt-5 md:mt-0">
                  <div className="text-sm md:text-[16px] mb-1 md:mb-2">
                    Answer
                  </div>
                  <input
                    type="text"
                    className=" input-register "
                    placeholder="Something..."
                    name="secret"
                    onChange={(e) => {
                      handleChangeInput(e);
                    }}
                    disabled={loading}

                    // onChange={(e) => handleChangeInput(e)}
                  />
                </div>
              </div>
              <div className="mt-[12px] md:mt-[17px] text-[13px] font-normal flex justify-between items-center ">
                <NavLink to="/forget-password">Forget password?</NavLink>
              </div>
              <button
                className={`mt-[30px] md:mt-[35px] w-full font-extrabold text-[20px] md:text-2xl bg-[#46289A]/80 hover:bg-[#46289A] border text-white py-[8px] md:py-[13px] rounded-[5px] transition-50
                
                `}
                type="submit"
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </form>

            <div className="mt-[8px] md:mt-[16px] text-[13px] md:text-[15px] text-center ">
              <span className="block md:inline ">If u have an account, </span>
              <NavLink to="/login" className="font-bold text-[17px]  ">
                let's login
              </NavLink>
            </div>
          </div>
        </div>
        {!dark && (
          <>
            <div className="fixed bottom-0 right-0">
              <img
                src={`/image/dark-cloud-2.png`}
                alt="cloud-2"
                className="object-contain translate-y-2"
              />
            </div>
            <div className="fixed top-0 right-0">
              <img
                src={`/image/dark-cloud-3.png`}
                alt="cloud-2"
                className="object-contain translate-y-2"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
