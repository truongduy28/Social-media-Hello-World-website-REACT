import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingDetailPost from "../components/loading/Loading.DetailPost";
import { APIURI } from "../config";
import Nav from "./../components/common/Nav";
import moment from "moment";
import { useAppContext } from "../context/useContext";
import { AiOutlineCamera, AiOutlineHeart, AiOutlineSend } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import Comment from "../components/Comment";
import Post from "../components/Post";

import ReactLoading from "react-loading";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import app from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const DetailPost = () => {
  const { isLogin } = useAppContext();
  const [imageCommentShow, setImageCommentShow] = useState(null);
  const [imageComment, setImageComment] = useState(null);

  const userId = isLogin?.user?._id;
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [formAddComment, setFormAddComment] = useState({
    textComment: "",
    imageComment: "",
    postedBy: isLogin?.user?._id,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  let likeCount = post?.likes?.length;
  let commentCount = post?.comments?.length;

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      const { data } = await axios.get(`${APIURI}/posts/${id}`);
      setPost(data.post);
      likeCount = post?.likes?.length;
      commentCount = post?.comments?.length;
      setIsLoading(false);
    };
    getPost();
  }, [id]);

  const unlike = async (postId, userId) => {
    setLikeLoading(true);
    try {
      const { data } = await axios.put(`${APIURI}/posts/unlike-post`, {
        postId,
        userId,
      });

      setPost({ ...post, likes: data.post.likes });
    } catch (error) {
      console.log(error);
    }
    setLikeLoading(false);
  };

  const like = async (postId, userId) => {
    setLikeLoading(true);
    try {
      const { data } = await axios.put(`${APIURI}/posts/like-post`, {
        postId,
        userId,
      });
      setPost({ ...post, likes: data.post.likes });
    } catch (error) {
      console.log(error);
    }
    setLikeLoading(false);
  };

  const addComment = async (postId, postedBy) => {
    setCommentLoading(true);

    if (!formAddComment?.textComment) {
      toast.warning("Please enter a comment content");
      return;
    }
    try {
      let image;
      if (imageComment) {
        // setCommentLoading(!false);

        const fileName = new Date().getTime() + imageComment.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageComment);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            setCommentLoading(true);

            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                //  setState({ ...state, image: downloadURL });
                image = downloadURL;
                // navigate("/profile");
              })
              .then(async () => {
                const { data } = await axios.put(
                  `${APIURI}/posts/add-comment`,
                  {
                    postId,
                    comment: formAddComment?.textComment,
                    image,
                    postedBy,
                  }
                );
                setPost({ ...post, comments: data.post.comments });
                setShowComment(true);
                setFormAddComment({
                  textComment: "",
                  imageComment: "",
                  postedBy: isLogin?.user?._id,
                });
                setImageComment(null);
                setCommentLoading(false);

                setImageCommentShow(null);
              });
          }
        );
      } else {
        const { data } = await axios.put(`${APIURI}/posts/add-comment`, {
          postId,
          comment: formAddComment?.textComment,
          postedBy,
        });
        setPost({ ...post, comments: data.post.comments });
        setShowComment(true);
        setFormAddComment({
          textComment: "",
          imageComment: "",
          postedBy: isLogin?.user?._id,
        });
        setImageComment(null);
        setCommentLoading(false);
        setImageCommentShow(null);
      }
    } catch (error) {
      console.log(error);
      setCommentLoading(false);
    }
    setCommentLoading(false);
  };

  const handleImage = async (e) => {
    try {
      setImageCommentShow(null);
      const file = e.target.files[0];
      // @ts-ignore
      setImageCommentShow(URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Nav />
      {isLoading ? (
        <LoadingDetailPost />
      ) : post ? (
        <div className="content">
          <div className=" hidden md:flex fixed w-screen h-[90vh] bg-[#F0F2F5] dark:bg-black dark:text-white pt-[0px] px-[15%] rounded-lg ">
            <div className="w-full h-[90%] mt-[30px] grid grid-cols-5  relative  shadow-post ">
              <div className="col-span-3 bg-white dark:bg-[#242526] relative flex items-center justify-center h-full">
                <div className="absolute h-[95%] w-[95%] flex items-center bg-[#F0F2F5] dark:bg-black  justify-center ">
                  {post?.image?.url && post?.image?.isVideo ? (
                    <video src={post?.image?.url} controls width="100%"></video>
                  ) : (
                    <img
                      src={post?.image?.url}
                      alt=""
                      className="object-cover w-full h-auto max-h-full"
                    />
                  )}
                </div>
              </div>
              <div className="col-span-2 dark:bg-[#242526] p-4 h-full bg-white rounded ">
                <div className="post__authur flex items-center pl-2 pr-3 sm:px-3 md:px-4">
                  <div
                    className="post__authur_avt"
                    onClick={() => navigate(`/profile/${post?.postedBy?._id}`)}
                  >
                    <img
                      className=" w-10 h-10 rounded-full object-cover cursor-pointer "
                      src={post?.postedBy?.image}
                      alt=""
                    />
                  </div>
                  <div className="post__authur_name flex-1 ml-2 text-gray-700  dark:text-[#e4e6eb] ">
                    <p className=" cursor-pointer font-semibold">
                      {post?.postedBy?.name}
                    </p>
                    <span className="text-xs">
                      {post?.createdAt && moment(post?.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div class="my-5  text-[17px]  ">{post?.content}</div>
                <div className="post__interactive">
                  {/* post's comment and like quantity */}
                  {(commentCount > 0 || likeCount > 0) && (
                    <div className="px-4 py-[10px] flex gap-x-[6px] items-center text-[15px] ">
                      {/* like quantity */}
                      {likeCount > 0 && (
                        <>
                          {!post.likes.includes(userId) ? (
                            <>
                              <AiOutlineHeart className="text-[18px] text-[#65676b] dark:text-[#afb0b1]" />
                              <span className="like-count">
                                {`${likeCount} like${likeCount > 1 ? "s" : ""}`}
                              </span>
                            </>
                          ) : (
                            <>
                              <AiFillHeart className="text-[18px] text-[#c22727] dark:text-[#c22727]" />
                              <span className="like-count">
                                {likeCount > 1
                                  ? `You and ${likeCount - 1} other${
                                      likeCount > 2 ? "s" : ""
                                    }`
                                  : `You`}
                              </span>
                            </>
                          )}
                        </>
                      )}
                      {/* comment quantity */}
                      <span className="text-[14px] ml-auto text-[#65676b] dark:text-[#afb0b1] ">
                        {commentCount > 0 &&
                          `${commentCount} ${
                            commentCount > 1 ? "comments" : "comment"
                          }`}
                      </span>
                    </div>
                  )}

                  {/* button like and comment */}
                  <div className="mx-[12px] mt-2 py-1 flex items-center justify-between border-y dark:border-y-[#3E4042] border-y-[#CED0D4] px-[6px]  ">
                    {post?.likes?.includes(userId) ? (
                      <button
                        className=" py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#c22727] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#c22727] transition-50 cursor-pointer  "
                        onClick={() => unlike(post._id, userId)}
                        disabled={likeLoading}
                      >
                        {likeLoading ? (
                          <ReactLoading
                            type="spin"
                            width={20}
                            height={20}
                            color="#c22727"
                          />
                        ) : (
                          <>
                            <AiFillHeart className="text-xl translate-y-[1px] text-[#c22727] " />
                            Like
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        className=" py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer "
                        onClick={() => like(post._id, userId)}
                        disabled={likeLoading}
                      >
                        {likeLoading ? (
                          <ReactLoading
                            type="spin"
                            width={20}
                            height={20}
                            color="#6A7583"
                          />
                        ) : (
                          <>
                            <AiOutlineHeart className="text-xl translate-y-[1px] " />
                            Like
                          </>
                        )}
                      </button>
                    )}

                    <button
                      className="py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer "
                      onClick={() => {
                        setShowComment(!showComment);
                      }}
                      disabled={!commentCount}
                    >
                      <FiMessageSquare className="text-xl translate-y-[2px] " />
                      Comment
                    </button>
                  </div>

                  {/* {Show comment} */}
                  {showComment && (
                    <div className="px-4 pt-1 overflow-y-scroll max-h-[40vh] ">
                      {post.comments
                        ?.sort((a, b) => a.created.localeCompare(b.created))
                        .filter((comment) => comment.isDelete === false)
                        .map((comment) => (
                          <Comment
                            key={comment._id}
                            currentComment={comment}
                            userId={userId}
                            postId={post._id}
                          />
                        ))}
                    </div>
                  )}

                  {/* form  add comment */}
                  <div className="flex gap-x-1.5 px-2 sm:px-3 md:px-4 py-1 items-center ">
                    <img
                      src={isLogin?.user?.image}
                      alt="user_avatar"
                      className="w-8 sm:w-9 h-8 sm:h-9 object-cover shrink-0 rounded-full "
                    />
                    <form
                      className="flex px-2 rounded-full bg-[#F0F2F5] w-full mt-1 items-center dark:bg-[#3A3B3C]  "
                      onSubmit={(e) => {
                        e.preventDefault();
                        setCommentLoading(true);
                        addComment(post._id, userId);
                        setCommentLoading(false);
                      }}
                    >
                      <input
                        type="text"
                        className="px-2 py-1 sm:py-1.5 border-none focus:ring-0 bg-inherit rounded-full w-full font-medium dark:placeholder:text-[#b0b3b8] "
                        placeholder="Write a comment..."
                        value={formAddComment.textComment}
                        disabled={commentLoading}
                        onChange={(e) => {
                          setFormAddComment({
                            ...formAddComment,
                            textComment: e.target.value,
                          });
                        }}
                      />
                      {!commentLoading && (
                        <label>
                          <AiOutlineCamera className="shrink-0 text-[18px] transition-50 mr-2 opacity-60 hover:opacity-100 dark:text-[#b0b3b8] cursor-pointer " />
                          <input
                            // onChange={handleImage}
                            type="file"
                            accept="image/*"
                            name="avatar"
                            hidden
                            onChange={(e) => {
                              handleImage(e);
                              setImageComment(e.target.files[0]);
                            }}
                          />
                        </label>
                      )}
                      <button
                        type="submit"
                        disabled={
                          commentLoading || !formAddComment?.textComment
                        }
                      >
                        {commentLoading ? (
                          <ReactLoading
                            type="spin"
                            width={20}
                            height={20}
                            color="#7d838c"
                          />
                        ) : (
                          <AiOutlineSend className="shrink-0 text-xl transition-50 hover:scale-125 dark:text-[#b0b3b8] " />
                        )}
                      </button>
                    </form>
                  </div>

                  {/* image when comment have image */}
                  <div className="transition-50 flex items-start justify-start w-full px-20 group ">
                    {imageCommentShow && (
                      <div className="relative ">
                        <img
                          // @ts-ignore
                          src={imageCommentShow}
                          alt="image_comment"
                          className="h-20 w-auto object-contain "
                        />
                        {!commentLoading && (
                          <MdCancel
                            className="absolute hidden group-hover:flex top-1 right-1 text-xl transition-50 cursor-pointer "
                            // onClick={deleteImageComment}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden pt-[65px] px-1 min-h-screen ">
            <Post
              currentPost={post}
              key={post._id}
              // currentPost={post}
              userId={isLogin?.user?._id}
              allPost={{}}
            />
          </div>
        </div>
      ) : (
        <p>k co post</p>
      )}
    </>
  );
};

export default DetailPost;
