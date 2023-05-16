import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { APIURI } from "../config";
import { useAppContext } from "../context/useContext";
import Nav from "./../components/common/Nav";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const { dark } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    email: "",
    newPassword: "",
    rePassword: "",
    secret: "",
  });

  const handleChangeInput = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleForgetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await axios.put(`${APIURI}/users/forget-password`, query);
      res?.status === 200 &&
        toast.success(res?.data?.msg || "Register success!");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Fail!");
    }
    setLoading(false);
  };

  return (
    <div>
      <Nav />

      <div
        className={`bg-[#cdcfd4] dark:bg-[#4E4F50] h-screen w-screen flex items-center relative transition-50 overflow-hidden content`}
        style={{
          backgroundImage: !dark ? "none" : "url(/image/bg.png)",
          height: "calc(100vh )",
          paddingTop: "40px",
        }}
      >
        <div className="flex px-3 md:px-0 w-full items-center justify-center z-10 relative">
          <div className="bg-[#569894]/80 mx-[10%0] md:ml-auto w-full mt-4 dark:bg-[#3a3a3a]/80 dark:text-white/70 md:w-auto px-[20px] md:px-[80px] py-[30px] md:py-[40px] rounded-3xl transition-50 z-[11] ">
            <div className=" mb-[18px] text-[30px] text-[#004053] dark:text-[#5B9D99] font-extrabold ">
              Forget Password
            </div>
            <form
              className="md:mt-[20px] font-bold "
              onSubmit={(e) => {
                handleForgetPassword(e);
              }}
            >
              <div className="md:flex ">
                <div className="">
                  <div className="text-sm md:text-[16px] mb-2">Email</div>
                  <input
                    disabled={loading}
                    type="email"
                    className=" input-login"
                    placeholder="User@gmail.com"
                    name="email"
                    onChange={(e) => handleChangeInput(e)}
                  />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm md:text-[16px] mb-2">Answer</div>
                <input
                  disabled={loading}
                  type="text"
                  className=" input-login "
                  placeholder="Something..."
                  name="secret"
                  onChange={(e) => handleChangeInput(e)}
                />
              </div>
              <div className="mt-3">
                <div className="text-sm md:text-[16px] mb-2">New password</div>
                <div className="flex items-center relative">
                  <input
                    disabled={loading}
                    // type={eye ? "text" : "password"}
                    className=" input-login "
                    placeholder="Password"
                    name="newPassword"
                    onChange={(e) => handleChangeInput(e)}
                  />
                  {/* {eye ? (
                                        <AiOutlineEye
                                            className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                            onClick={() => setEye(!eye)}
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                            onClick={() => setEye(!eye)}
                                        />
                                    )} */}
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm md:text-[16px] mb-2">
                  Confirm new password
                </div>
                <div className="flex items-center relative">
                  <input
                    // disabled={loading}
                    // type={reEye ? "text" : "password"}
                    className=" input-login "
                    placeholder="Password"
                    name="rePassword"
                    onChange={(e) => handleChangeInput(e)}
                  />
                  {/* {reEye ? (
                                        <AiOutlineEye
                                            className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                            onClick={() => setReEye(!reEye)}
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                            onClick={() => setReEye(!reEye)}
                                        />
                                    )} */}
                </div>
              </div>

              <button
                className={`mt-[35px] md:mt-[35px] w-full bg-[#004053]/60 hover:bg-[#004053]/80 font-extrabold text-[20px] md:text-2xl dark:bg-[#5B9D99]/80 dark:hover:bg-[#5B9D99] border text-white py-[8px] md:py-[13px] rounded-[5px] transition-50  `}
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Reset password"}
              </button>
            </form>

            <div className="mt-[8px] md:mt-[16px] text-[13px] md:text-[15px] text-center ">
              <span className="block md:inline ">
                If u remember password ,{" "}
              </span>
              <NavLink to="/login" className="font-bold text-[17px]  ">
                let's login
              </NavLink>
            </div>
          </div>
          <div className="fixed">
            <img src="/image/Line.png" alt="line" className="" />
          </div>
          <div className="fixed">
            <img
              src="/image/Line2.png"
              alt="line"
              className="translate-x-[10%] translate-y-[10%] "
            />
          </div>
        </div>
        <div className="hidden md:flex w-full h-full items-center relative">
          {/* <img
            src={`/image/${
              dark ? "dark-forget-pw-left" : "forget-pw-left"
            }.png`}
            alt="forget-pw-left.png"
            className="w-auto h-full object-contain absolute right-0 "
          /> */}
          <img
            src={`/image/3d-fgp-02.png`}
            alt="forget-pw-left.png"
            className="w-auto h-full object-contain absolute right-0 scale-125 "
          />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
