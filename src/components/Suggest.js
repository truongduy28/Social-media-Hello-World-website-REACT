import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURI } from "../config";
import { useAppContext } from "../context/useContext";
import LoadingSuggestion from "./loading/Loading.Suggestion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { update } from "../redux/userSlice";
import { BsThreeDots } from "react-icons/bs";
import { TiTick } from "react-icons/ti";

const Suggest = () => {
  const { isLogin } = useAppContext();
  const [suggestUser, setSuggestUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const getDataSuggestUser = async () => {
      setIsLoading(true);
      const { data } = await axios.get(
        `${APIURI}/users/suggest-user/${isLogin.user._id}`
      );
      data?.people?.filter((u) => {
        isLogin?.user?._id?.includes(u._id);
      });
      setSuggestUser(data?.people);
      setIsLoading(false);
    };
    getDataSuggestUser();
  }, []);

  const handleFollower = async (user) => {
    setIsLoadingFollow(true);
    try {
      const { data } = await axios.put(`${APIURI}/users/follow`, {
        followed: user?._id,
        follower: isLogin?.user?._id,
      });

      // const resNotify = await axios.put(`${APIURI}/users/notify`, {
      //   type: "follow",
      //   userId: user?._id,
      //   affectedBy: isLogin?.user?._id,
      //   content: "just followed you!",
      // });
      // console.log(resNotify);
      dispatch(update(data.userFollower));
      toast(`Follow ${data?.userFollowed?.name} success`);
      const reSetSuggestUser = suggestUser.filter(
        (user) => user._id !== data.userFollowed?._id
      );
      setSuggestUser(reSetSuggestUser);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingFollow(false);
  };

  const User = ({ user }) => {
    return (
      <>
        <div className="flex items-center py-2 gap-2 ">
          <div>
            <Link
              to={`profile/${user._id}`}
              className="font-semibold text-sm flex items-center gap-x-0.5 "
            >
              <img
                className="w-9 h-9 object-cover rounded-full  "
                src={user.image}
                alt="avt"
              />
            </Link>
          </div>
          <div className="flex-1 ">
            <Link
              to={`profile/${user._id}`}
              className="font-semibold text-sm flex items-center gap-x-1 "
            >
              {user.name}
              {user.role === "Admin" && (
                <TiTick className="text-[17px] text-white rounded-full bg-sky-500 " />
              )}
            </Link>
            <span className="font-light text-sm dark:text-[#8e8e8e]">
              {user.email}
            </span>
          </div>
          <div onClick={() => handleFollower(user)}>
            {isLoadingFollow ? (
              <span className="text-[#0284c7]">
                <BsThreeDots />
              </span>
            ) : (
              <span className="font-semibold text-sm text-cyan-500 cursor-pointer">
                Follow
              </span>
            )}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="suggest-container bg-white  shadow-post dark:bg-[#242526] rounded-lg py-4 px-5 md:fixed w-full md:w-[24%]  mb-4 md:mb-0 dark:text-[#e4e6eb]">
        <div className="suggest__top">
          <span className="font-semibold text-gray-500">Suggestion to you</span>
        </div>
        <div className="suggest__body">
          {isLoading ? (
            <LoadingSuggestion />
          ) : suggestUser ? (
            suggestUser?.map((u) => <User user={u} key={u._id} />)
          ) : (
            <p>k co</p>
          )}
          {/* <User />
          <User />
          <User />
          <User />
          <User />
          <User />
          <User /> */}
        </div>
      </div>
    </>
  );
};

export default Suggest;
