import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIURI } from "../config";
import moment from "moment";
import LoadingPost from "./loading/Loading.Post";
import Post from "./Post";
import { useAppContext } from "../context/useContext";
import { FaEyeSlash } from "react-icons/fa";
import { GoReply } from "react-icons/go";
import { BsEyeSlash } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
const TabAdminPost = () => {
  const [allPost, setAllPost] = useState(null);
  const [postView, setPostView] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [couter, setCouter] = useState({
    display: null,
    hidden: null,
  });

  const tableTitile = [
    "NO",
    "AVATAR",
    "NAME",

    "CONTENT",
    "IMAGE/VIDEO",
    "LIKE",
    "COMMENT",
    "CREATE AT",
    "STATUS",
  ];
  const { isLogin } = useAppContext();
  useEffect(() => {
    const getAllPost = async () => {
      const { data } = await axios.get(`${APIURI}/posts/all-posts-for-admin`);
      setAllPost(data.posts);
      if (!postView) {
        setPostView(data.posts[0]);
      }
    };
    getAllPost();
  }, []);

  const deletePost = async (postId, isDelete) => {
    if (isDelete) {
      toast.error("Can't restore post has been deleted!");
      return;
    }

    const accept = window.confirm("You sure that delete this post?");
    if (!accept) return;

    setIsLoadingDelete(true);
    try {
      const res = await axios.put(`${APIURI}/posts/delete/${postId}`, {
        postedBy: isLogin?.user?._id,
      });
      // setPost({ ...post, likes: data.post.likes });
      // console.log("====================================");
      // console.log(res);
      if (res.status === 200) {
        toast.success("Post be deleted!");
        setPostView(res.data.post);

        setAllPost(res.data.allPost);
      }
      // console.log("====================================");
    } catch (error) {
      console.log(error);
    }
    setIsLoadingDelete(false);
  };

  useEffect(() => {
    const tempHIdden = allPost?.filter((p) => p.isDelete === true);
    const tempDisplay = allPost?.filter((p) => p.isDelete === false);
    setCouter({
      display: tempDisplay?.length,
      hidden: tempHIdden?.length,
    });
  }, [allPost]);

  return (
    <div className="flex justify-center gap-3 w-[90%] m-auto mt-2">
      <div className="min-w-[30%] w-[30%]">
        {postView ? (
          <>
            <Post
              key={postView._id}
              currentPost={postView}
              userId={isLogin?.user?._id}
              allPost={{ posts: allPost, setPosts: setAllPost }}
            />
            <div className="flex items-center gap-3">
              <span>Action for post:</span>
              <div
                className={`image-photo w-[40px] ${
                  postView?.isDelete ? " bg-gray-400" : " bg-red-400"
                }  cursor-pointer text-white flex justify-center items-center rounded-full`}
                onClick={() =>
                  deletePost(postView?._id, postView?.isDelete ? "x" : null)
                }
              >
                <span>
                  <FaEyeSlash size={20} />
                </span>
              </div>
              <div className="image-photo w-[40px] bg-sky-400 text-white flex justify-center items-center rounded-full scale-x-[-1] ">
                <span>
                  <GoReply size={20} />
                </span>
              </div>
            </div>
          </>
        ) : (
          <LoadingPost />
        )}
      </div>
      <div className=" flex-1 shadow-lg rounded-lg shadow-post overflow-hidden">
        <div
          className="overflow-y-scroll h-fit max-h-[80vh] relative app-scrollbar"
          id="app-scrollbar-style"
        >
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead className="text-xs text-gray-700 uppercase bg-[#F0F2F5] dark:bg-[#242526] dark:text-gray-400 sticky absolute top-0">
              <tr>
                {tableTitile?.map((title) => (
                  <th scope="col" className="py-3 px-2">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {allPost?.map((post, index) => (
                <tr
                  className="bg-[#fff] dark:bg-[#303030] cursor-pointer "
                  onClick={() => setPostView(post)}
                >
                  <td className="py-4 px-2">{index + 1}</td>
                  <td className="py-4 px-2">
                    <img
                      className="image-photo w-[40px] rounded-full object-cover"
                      src={post?.postedBy?.image}
                      alt="avt"
                    />
                  </td>

                  <th
                    scope="row"
                    className="py-4 px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {post?.postedBy?.name}
                  </th>
                  <td className="py-4 px-2">{post?.content}</td>
                  <td className="py-4 px-2">IMG</td>
                  <td className="py-4 px-2">{post?.likes?.length}</td>
                  <td className="py-4 px-2">{post?.comments?.length}</td>
                  <td className="py-4 px-2">
                    {moment(post?.createdAt).fromNow()}
                  </td>
                  <td className="py-4 px-2">
                    {post?.isDelete ? (
                      <div class=" text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-red-200 text-red-700 rounded-full">
                        <BsEyeSlash />
                        Hidden
                      </div>
                    ) : (
                      <div class="text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
                        <FiEye />
                        Display
                      </div>
                    )}
                  </td>

                  {/* <td className="py-4 px-2">{post?.image?.url}</td> */}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold bg-[#F0F2F5] dark:bg-[#242526] text-gray-900 dark:text-white sticky absolute bottom-0 rounded-b-lg overflow-hidden">
                <th scope="row" className="py-3 px-2 text-base ">
                  Total
                </th>
                <td colSpan={8} className="py-3 text-right px-2">
                  {allPost?.length} posts | {couter.hidden} hidden |{" "}
                  {couter.display} display
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabAdminPost;
