import React, { useEffect, useState } from "react";

// import media
import LOGO from "../../asset/logo.png";

// import hook
import { useSelector } from "react-redux";
import { useAppContext } from "../../context/useContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

// import library and package
import axios from "axios";
import { logout } from "../../redux/userSlice";
import moment from "moment";
import useDebounce from "./../../middleware/useDebounce";
import { APIURI } from "../../config";

// import icons
import {
  AiFillCreditCard,
  AiFillHeart,
  AiFillHome,
  AiFillSetting,
  AiOutlineSetting,
} from "react-icons/ai";
import { BsFillSunFill, BsMoon } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiNotification2Line, RiSpaceShipFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import {
  FaComment,
  FaEyeSlash,
  FaFacebookMessenger,
  FaUserPlus,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const Nav = () => {
  const { dark, setOneState, dispatch } = useAppContext();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.value);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [notify, setNotify] = useState(null);
  const { pathname } = useLocation();
  const textDebounce = useDebounce(text, 500);
  const [openUserList, setOpenUserList] = useState(false);

  const [loading, setLoading] = useState(false);
  const [listSearchResult, setListSearchResult] = useState(null);
  const [openNotify, setOpenNotify] = useState(false);
  // console.log(isLogin);

  const Dropdown = () => {
    return (
      <>
        <div
          className={`absolute z-20 bg-gray-50 top-[130%] w-max shadow-xl ${
            isOpen ? " visible" : " invisible"
          } dark:bg-[#3A3A3A] right-[0%] md:right-[-50%]`}
        >
          <div className="border-y-[1px] px-2 dark:border-gray-700   ">
            <p
              className="flex items-center gap-2 text-gray-600 dark:text-white hover:cursor-pointer "
              onClick={() => navigate(`/profile/${isLogin.user._id}`)}
            >
              <span>
                <CgProfile />
              </span>
              <span className="false group flex rounded-md items-center w-full  py-2 text-sm font-semibold tracking-wide  ">
                Profile
              </span>
            </p>
          </div>
          <div className="border-y-[1px] px-2 dark:border-gray-700   ">
            <p
              className="flex items-center gap-2 text-gray-600 dark:text-white hover:cursor-pointer "
              onClick={() => navigate(`/update-profile`)}
            >
              <span>
                <AiOutlineSetting />
              </span>
              <span className="false group flex rounded-md items-center w-full  py-2 text-sm font-semibold tracking-wide  ">
                Update profile
              </span>
            </p>
          </div>
          <div className="border-y-[1px] px-2 dark:border-gray-700   ">
            <p
              className="flex items-center gap-2 text-gray-600 dark:text-white hover:cursor-pointer "
              onClick={() => {
                // removeFromLocalStorage();
                dispatch(logout());
                navigate("/login");
              }}
            >
              <span>
                <FiLogOut />
              </span>
              <span className="false group flex rounded-md items-center w-full  py-2 text-sm font-semibold tracking-wide  ">
                Logout
              </span>
            </p>
          </div>
        </div>
        <div
          className={`${
            isOpen ? " visible" : " invisible"
          } overlay_dropdown fixed top-0 left-0 bottom-0 right-0 opacity-0 z-10`}
          onClick={() => setIsOpen(false)}
        ></div>
      </>
    );
  };

  const user = (user) => {
    return (
      <>
        <div className="flex items-center py-2 gap-2 bg-white">
          <div>
            <Link
              to={`/profile/${user._id}`}
              className="font-semibold text-sm flex items-center gap-x-0.5 "
            >
              <img
                className="w-9 h-9 object-cover rounded-full"
                src={user.image}
                alt="avt"
              />
            </Link>
          </div>
          <div className="flex-1 ">
            <Link
              to={`/profile/${user._id}`}
              className="font-semibold text-sm flex items-center gap-x-0.5 "
            >
              {user.name}
            </Link>
            <span className="font-light text-sm">{user.email}</span>
          </div>
        </div>
      </>
    );
  };
  useEffect(() => {
    if (textDebounce) {
      searchPeople();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDebounce]);

  const searchPeople = async () => {
    setLoading(true);
    if (!text) {
      return;
    }
    try {
      const { data } = await axios.get(`${APIURI}/users/search-user/${text}`);
      setListSearchResult(data.search);
      setOpenUserList(true);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isLogin?.user) return;
    const getNotify = async () => {
      const { data } = await axios.get(
        `${APIURI}/users/notify/${isLogin?.user?._id}`
      );
      setNotify(data?.user?.notify);
    };
    getNotify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div className="duration-300 nav-container flex w-full 	justify-between  md:px-5 fixed top-0 z-10 bg-white dark:bg-[#242526]">
        <div className="nav__left flex items-center min-w-[20%] md:w-[30%]	">
          <div className="nav__left_logo w-[65px]">
            <Link to="/">
              <img src={LOGO} alt="logo" />
            </Link>
          </div>
          {isLogin?.user && (
            <div className="nav__left_search  items-center border border-black/20 dark:bg-[#4E4F50] dark:text-[#b9bbbe] w-[180px] md:w-[220px] h-auto md:h-[40px] rounded-full px-2 ml-2 md:flex hidden  ">
              <BiSearchAlt className="text-16px md:text-[20px] mx-1 " />
              <div>
                <input
                  type="text"
                  className="text-[15px] border-none bg-inherit w-[80%] focus:ring-0 focus:border-0 pl-0 font-medium dark:placeholder:text-[#b1b2b5] dark:text-[#cecfd2] "
                  placeholder="Search user..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="scroll-bar absolute max-h-[300px] rounded-[7px] w-[250px] overflow-y-auto overflow-x-hidden top-[60px] translate-x-[-10px] "></div>
              </div>
              <div
                className={`scroll-bar absolute max-h-[300px] rounded-[7px] w-[250px] overflow-y-auto overflow-x-hidden top-[60px] translate-x-[-10px] z-50 ${
                  openUserList ? " visible" : " invisible"
                }`}
              >
                {listSearchResult?.length > 0 ? (
                  <div className=" box-shadow border-gray-300 border-[1px] p-2 bg-white overflow-hidden rounded-md ">
                    {listSearchResult?.length > 0 &&
                      listSearchResult?.map((u) => user(u))}
                  </div>
                ) : (
                  <div className="w-full bg-white text-center border dark:border-white/20 box-shadow dark:bg-[#2E2F30] rounded-[7px] py-6 ">
                    No user found!
                  </div>
                )}
              </div>
              <div
                className={`overlay fixed top-0 left-0 right-0 bottom-0 z-40 ${
                  openUserList ? " visible" : "invisible"
                }`}
                onClick={() => setOpenUserList(false)}
              ></div>
            </div>
          )}
        </div>
        <div
          className="nav__mid flex items-center justify-center  	"
          style={{ flex: 1 }}
        >
          <NavLink
            end
            to="/"
            className={`relative bg-inherit text-[#c96c88] py-2 md:py-2.5 my-1 mx-1 shrink-1 w-full flex justify-center hover:text-[#c24269] hover:bg-[#EBEDF0] rounded-[10px] text-[23px] transition-20 after:content-[''] after:absolute after:h-[3px] after:w-[70%] after:left-[15%] after:bg-[#c24269] after:opacity-0 after:bottom-0 -['Home']  before:rounded-lg dark:bg-inherit before:opacity-0 dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] `}
            role="button"
          >
            <AiFillHome />
          </NavLink>
          {isLogin?.user ? (
            <>
              <NavLink
                to="/messenger"
                className={`relative bg-inherit text-[#26A69A] py-2 md:py-2.5 my-1 mx-1 shrink-1 w-full flex justify-center hover:text-[#00897B] hover:bg-[#EBEDF0] rounded-[10px] text-[23px] transition-20 after:content-[''] after:absolute after:h-[3px] after:w-[70%] after:left-[15%] after:bg-[#26A69A] after:opacity-0 after:bottom-0 -['Home']  before:rounded-lg dark:bg-inherit before:opacity-0 dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] 	 `}
                role="button"
              >
                <FaFacebookMessenger />
              </NavLink>
              {isLogin?.user?.role === "Admin" && (
                <NavLink
                  to="/admin"
                  className={`relative bg-inherit text-[#607D8B] py-2 md:py-2.5 my-1 mx-1 shrink-1 w-full flex justify-center hover:text-[#00897B] hover:bg-[#EBEDF0] rounded-[10px] text-[23px] transition-20 after:content-[''] after:absolute after:h-[3px] after:w-[70%] after:left-[15%] after:bg-[#607D8B] after:opacity-0 after:bottom-0 -['Home']  before:rounded-lg dark:bg-inherit before:opacity-0 dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] 	 `}
                  role="button"
                >
                  <MdAdminPanelSettings />
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={`relative bg-inherit text-[#26A69A] py-2 md:py-2.5 my-1 mx-1 shrink-1 w-full flex justify-center hover:text-[#00897B] hover:bg-[#EBEDF0] rounded-[10px] text-[23px] transition-20 after:content-[''] after:absolute after:h-[3px] after:w-[70%] after:left-[15%] after:bg-[#26A69A] after:opacity-0 after:bottom-0 -['Home']  before:rounded-lg dark:bg-inherit before:opacity-0 dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] `}
                role="button"
              >
                <RiSpaceShipFill />
              </NavLink>
              <NavLink
                to="/register"
                className={`relative bg-inherit text-[#607D8B] py-2 md:py-2.5 my-1 mx-1 shrink-1 w-full flex justify-center hover:text-[#455A64] hover:bg-[#EBEDF0] rounded-[10px] text-[23px] transition-20 after:content-[''] after:absolute after:h-[3px] after:w-[70%] after:left-[15%] after:bg-[#607D8B] after:opacity-0 after:bottom-0 -['Home']  before:rounded-lg dark:bg-inherit before:opacity-0 dark:text-[#B8BBBF] dark:hover:bg-[#3A3B3C] dark:hover:text-[#d2d5d7] `}
                role="button"
              >
                <RiSpaceShipFill className="rotate-180" />
              </NavLink>
            </>
          )}
        </div>

        <div className="nav__right flex items-center justify-end min-w-[15%] md:w-[30%] gap-3 md:mr-0 mr-1">
          {isLogin?.user && (
            <>
              <div
                className="bg-gray-200 p-2 rounded-full md:mr-[-10px] cursor-pointer relative dark:bg-[#3A3B3C] dark:text-[#e4e6eb]"
                onClick={() => setOpenNotify(!openNotify)}
              >
                <span className="text-gray-600 dark:text-[#e4e6eb]">
                  <RiNotification2Line size="18px" />
                </span>
                <div className="absolute bg-blue-600 top-[-20%] rounded-full text-white font-semibold m-0  right-[-20%] flex justify-center items-center h-5 w-5 ">
                  {" "}
                  {notify?.length}
                </div>
                <div
                  className={`${
                    openNotify ? "visible " : "invisible "
                  } fixed md:absolute top-[10%] md:top-[160%] right-[5%] left-[5%] md:left-auto md:right-[-100%]  md:w-[400px] max-h-[70vh] bg-white shadow-xl  border-[1px] dark:border-0 rounded-md z-50 overflow-y-scroll scrollbar dark:bg-[#3A3B3C] `}
                >
                  <div className=" py-2 px-3">
                    <span className="font-semibold text-gray-600 text-xl dark:text-[#e4e6eb]">
                      Notification
                    </span>
                  </div>
                  <div className="p-2">
                    {notify?.length > 0 && notify ? (
                      notify
                        .sort((a, b) => b.created.localeCompare(a.created))
                        .map((n) => (
                          <div
                            key={n._id}
                            className=" border-[1px] border-gray-50 hover:bg-gray-100  flex  p-2 gap-2 items-center mb-3 rounded-xl text-gray-700 dark:border-0 dark:text-[#b0b3b8] dark:hover:bg-[#18191a40]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-50px">
                                <div className="relative">
                                  <img
                                    className=" image-photo  h-[50px] object-cover rounded-full "
                                    src={n?.affectedBy?.image}
                                    alt="avt"
                                  />
                                  {n.type === "like" ? (
                                    <div className="absolute  p-1 rounded-full flex justify-center items-center bottom-[-10%]  right-[-10%] bg-red-400">
                                      <span className=" text-xl m-0 text-white">
                                        <AiFillHeart />
                                      </span>
                                    </div>
                                  ) : n.type === "comment" ? (
                                    <div className="absolute  p-1 rounded-full flex justify-center items-center bottom-[-10%]  right-[-10%] bg-green-400">
                                      <span className=" text-xl m-0 text-white">
                                        <FaComment />
                                      </span>
                                    </div>
                                  ) : n.type === "follow" ? (
                                    <div className="absolute  p-1 rounded-full flex justify-center items-center bottom-[-10%]  right-[-10%] bg-cyan-400">
                                      <span className=" text-xl m-0 text-white">
                                        <FaUserPlus />
                                      </span>
                                    </div>
                                  ) : n.type === "post" ? (
                                    <div className="absolute  p-1 rounded-full flex justify-center items-center bottom-[-10%]  right-[-10%] bg-blue-800">
                                      <span className=" text-xl m-0 text-white">
                                        <AiFillCreditCard />
                                      </span>
                                    </div>
                                  ) : n.type === "hidden" ? (
                                    <div className="absolute  p-1 rounded-full flex justify-center items-center bottom-[-10%]  right-[-10%] bg-red-800">
                                      <span className=" text-xl m-0 text-white">
                                        <FaEyeSlash />
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="absolute  p-1 rounded-full flex justify-center items-center bottom-[-10%]  right-[-10%] bg-yellow-400">
                                      <AiFillSetting />
                                    </div>
                                  )}
                                </div>{" "}
                              </div>
                              <div className="flex-1">
                                <p>
                                  <Link
                                    className="text-cyan-500 font-semibold"
                                    to={`/profile/${n?.affectedBy?._id}`}
                                  >
                                    {n?.affectedBy?.name}
                                  </Link>{" "}
                                  {n?.content}{" "}
                                  {n?.affectedPost && (
                                    <Link
                                      className="text-cyan-500"
                                      to={`/post/${n?.affectedPost}`}
                                    >
                                      View now
                                    </Link>
                                  )}
                                </p>
                                <p>
                                  <span className=" text-xs">
                                    {moment(n?.created).fromNow()}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="flex justify-center items-center pb-1">
                        <span> You don't have any notifications yet</span>{" "}
                      </div>
                    )}
                    <div></div>
                  </div>
                </div>
                <div
                  className={`${
                    openNotify ? "visible " : "invisible "
                  } fixed z-40 top-0 right-0 bottom-0 left-0  `}
                  onClick={() => setOpenNotify(false)}
                ></div>
              </div>
              <div
                className="nav__user flex items-center justify-center relative"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="text-sm md:text-md font-semibold border md:pl-3 pl-0 md:pr-5 py-[5px] rounded-l-full md:translate-x-[16px] bg-[#3F51B5] text-white dark:bg-[#3A3A3A] dark:border-white/30 hidden  md:flex ">
                  {isLogin?.user.name}
                </div>
                <div className="w-10 h-10 relative flex items-center  ">
                  <img
                    src={isLogin?.user.image}
                    alt="avt"
                    className="rounded-full w-full h-full object-cover bg-[#3F51B5] pl-[3px] pt- p-[2px] dark:bg-slate-300 shrink-0 "
                  />
                </div>
                <Dropdown />
              </div>
            </>
          )}
          <div
            className="p-1  w-[50px] h-[30px] rounded-full border-2 border-black/30 dark:bg-[#3A3B3C] bg-[#333]/10 dark:border-[#929292] relative md:block hidden"
            onClick={() => {
              setOneState("dark", !dark);
              localStorage.setItem("dark", String(!dark));
            }}
            role="button"
            style={{ transition: "1s" }}
          >
            <BsMoon className="absolute right-1 top-[5px] transition-50  text-white dark:translate-x-0 translate-x-[-15px] opacity-0 dark:opacity-[1]  " />
            <BsFillSunFill
              className={`text-[20px] font-extrabold transition-50 dark:opacity-0 dark:translate-x-5`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
