import axios from "axios";
import React, { useEffect, useState } from "react";
import { GrLocation } from "react-icons/gr";
import { APIURI } from "../config";
import { useAppContext } from "../context/useContext";
import CreatePost from "./CreatePost";
import Post from "./Post";
import LoadingPost from "./loading/Loading.Post";
import { Link, useNavigate, useParams } from "react-router-dom";

const TabProfilePost = ({ currentUser }) => {
  const { isLogin } = useAppContext();
  const { id } = useParams();
  const [postsOfUser, setPostsOfUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetAllPosts = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      `${APIURI}/posts/get-all-posts-with-user/${id}`
    );
    const res = data?.posts?.filter((post) => post.isDelete === false);
    if (res.length > 0) {
      setPostsOfUser(res);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetAllPosts();
  }, [id]);

  console.log(postsOfUser);

  return (
    <div className="tab-profile w-full sm:grid grid-cols-5 gap-x-4">
      <div className="col-span-2">
        <div className="mb-4">
          <div className="bg-white dark:bg-[#242526] p-4 rounded-lg shadow-post ">
            <div className="text-2xl font-extrabold dark:text-[#e4e6eb] ">
              Intro
            </div>
            <div className="text-center mt-4 px-[20%] text-[15px] flex items-center justify-center gap-x-1 false ">
              {currentUser?.about
                ? currentUser?.about
                : "This user is very nice but don't leave any trace!"}
            </div>
            {isLogin?.user?._id === id && (
              <button
                className="mt-3 py-2 w-full bg-[#afb1b5]/30 hover:bg-[#afb1b5]/50 dark:bg-[#4E4F50]/50 dark:hover:bg-[#4E4F50] transition-20 rounded-md font-semibold "
                onClick={() => navigate("/update-profile")}
              >
                Edit bio
              </button>
            )}

            <div className="mt-5 flex gap-x-2 items-center ">
              <span>
                <GrLocation />
              </span>
              <div>
                From{" "}
                <strong>
                  {currentUser?.city ? currentUser?.city : " somewhere"}
                </strong>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="bg-white dark:bg-[#242526] p-4 rounded-lg ">
              <div class="flex justify-start items-center ">
                <div class="text-2xl font-extrabold dark:text-[#e4e6eb] ">
                  Album
                </div>
              </div>
              <div className="flex justify-between rounded-lg gap-1 mt-3 ">
                {postsOfUser
                  ?.filter((post) => post.image.url)
                  ?.map((p) => (
                    <div className="w-[30%] grow	relative cursor-pointer image-photo">
                      <Link to={`/post/${p._id}`}>
                        <img
                          src={
                            p.image.isVideo
                              ? "/image/video-icon.png"
                              : p.image.url
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3">
        {isLogin?.user?._id === id && (
          <CreatePost
            statePost={{ setPosts: setPostsOfUser, posts: postsOfUser }}
          />
        )}
        {isLoading ? (
          <LoadingPost />
        ) : postsOfUser ? (
          postsOfUser.map((post) => (
            <Post
              key={post._id}
              currentPost={post}
              userId={isLogin?.user?._id}
              allPost={{ posts: postsOfUser, setPosts: setPostsOfUser }}
            />
          ))
        ) : (
          <div class="w-full text-center text-xl font-semibold pt-[5vh] flex-col ">
            <div>
              This user has no posts yet .<br />
              Let's do something! :3
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabProfilePost;
