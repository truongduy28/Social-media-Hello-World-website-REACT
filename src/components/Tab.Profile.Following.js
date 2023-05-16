import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIURI } from "../config";
import { useAppContext } from "../context/useContext";
import LoadingCard from "./loading/LoadingCard";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { update } from "../redux/userSlice";
import ReactLoading from "react-loading";

const TabProfileFollowing = () => {
  const { id } = useParams();
  const { isLogin } = useAppContext();
  const [usersFollowing, setUsersFollowing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUnFollow, setIsLoadingUnFollow] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async (user) => {
      setIsLoading(true);
      const { data } = await axios.get(`${APIURI}/users/user-following/${id}`);
      setIsLoading(false);
      setUsersFollowing(data.following);
    };
    getUser();
  }, []);

  const handleUnFollow = async (user) => {
    setIsLoadingUnFollow(true);
    try {
      const { data } = await axios.put(`${APIURI}/users/un-follow`, {
        followed: user?._id,
        follower: id,
      });
      const reNewUserFollowing = await usersFollowing.filter(
        (user) => user._id != data.userFollowed?._id
      );

      setUsersFollowing(reNewUserFollowing);

      dispatch(update(data.userFollower));
      // console.log(reNewUserFollowing);
      toast.error(`U have unfollowed ${data?.userFollowed?.name}!`);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingUnFollow(false);
  };

  return isLoading ? (
    <LoadingCard />
  ) : usersFollowing ? (
    <div>
      <div className="bg-white w-full dark:bg-[#242526] p-4 rounded-lg shadow-post  ">
        <div className="text-2xl font-extrabold dark:text-[#e4e6eb] ">
          Following
        </div>
        <div className="md:grid grid-cols-2 my-4 gap-1 ">
          {usersFollowing.map((u) => (
            <div
              key={u._id}
              className="col-span-1 flex items-center gap-x-3 px-4 py-5 "
            >
              <Link to={`/profile/${u._id}`}>
                <img
                  src={u.image}
                  alt=""
                  className="w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 rounded-md object-cover cursor-pointer "
                />
              </Link>
              <div>
                <div className="text-[14px] sm:text-[17px]  font-semibold cursor-pointer ">
                  <Link to={`/profile/${u._id}`}>{u.name}</Link>
                </div>
                <div className="text-[12px] sm:text-[14px] dark:text-[#b0b3b8]  ">
                  {u.email}
                </div>
              </div>

              {isLogin.user._id == id &&
                (isLoadingUnFollow ? (
                  <div className="w-16 sm:w-20 h-8 sm:h-10 flex items-center justify-center pb-2 ml-auto bg-[#3C4D63]/50 transition-20 text-white rounded-md">
                    <ReactLoading
                      type="spin"
                      width="20%"
                      height="20%"
                      color="white"
                    />
                  </div>
                ) : (
                  <button
                    className="px-3 sm:px-4 py-1 md:py-2 ml-auto hover:bg-[#3C4D63] bg-[#3C4D63]/50 transition-20 text-white rounded-md text-[14px] sm:text-base  "
                    onClick={() => handleUnFollow(u)}
                  >
                    Unfollow
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <>k có</>
  );
};

export default TabProfileFollowing;
