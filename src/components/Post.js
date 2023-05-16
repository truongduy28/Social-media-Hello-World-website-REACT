import React, { useEffect, useState } from "react";
import { BiDotsHorizontalRounded, BiShare } from "react-icons/bi";
import {
  AiFillHeart,
  AiOutlineCamera,
  AiOutlineHeart,
  AiOutlineSend,
  AiOutlineSetting,
  AiOutlineDelete,
} from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import moment from "moment";
import { FiLogOut, FiMessageSquare } from "react-icons/fi";
import ReactLoading from "react-loading";
import axios from "axios";
import { APIURI, HOST } from "../config";
import { useAppContext } from "../context/useContext";
import { toast } from "react-toastify";
import Comment from "./Comment";
import app from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import ModalEditPost from "./Modal.EditPost";
import { FacebookShareButton } from "react-share";
import { TiTick } from "react-icons/ti";

const Post = ({ currentPost, userId, allPost }) => {
  const { posts, setPosts } = allPost;
  const navigate = useNavigate();
  const { isLogin } = useAppContext();
  const [likeLoading, setLikeLoading] = useState(false);
  const [post, setPost] = useState(currentPost);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [imageComment, setImageComment] = useState(null);
  const [imageCommentShow, setImageCommentShow] = useState(null);
  const [isOpenOption, setisOpenOption] = useState(false);
  const [formAddComment, setFormAddComment] = useState({
    textComment: "",
    imageComment: "",
    postedBy: isLogin?.user?._id,
  });
  const [isLoadingDelete, setisLoadingDelete] = useState(false);
  let likeCount = post?.likes?.length;
  let commentCount = post?.comments?.length;
  const [openModalEditPost, setOpenModalEditPost] = useState(false);

  const [profileOfSharedFeed, setProfileOfSharedFeed] = useState(null);
  const [isLoadingProfileOfSharedFeed, setIsLoadingProfileOfSharedFeed] =
    useState(false);

  useEffect(() => {
    if (!post.isShare) return;
    const getProfile = async () => {
      try {
        setIsLoadingProfileOfSharedFeed(true);
        const { data } = await axios.get(
          `${APIURI}/users/${post.isShare.postedBy}`
        );
        setProfileOfSharedFeed(data.user);
        setIsLoadingProfileOfSharedFeed(false);
      } catch (error) {
        console.log(error);
        setIsLoadingProfileOfSharedFeed(false);
      }
    };
    getProfile();
  }, [post]);

  // function logic

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
        const fileName = new Date().getTime() + imageComment.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageComment);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
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
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                image = downloadURL;
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
      setImageCommentShow(URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    const accept = window.confirm("You sure that delete this post?");
    if (!accept) return;

    setisLoadingDelete(true);
    try {
      const res = await axios.put(`${APIURI}/posts/delete/${postId}`);
      if (res.status === 200) {
        toast.success("Post be deleted!");
        const reSetNewPosts = posts.filter((post) => post._id !== postId);
        setPosts(reSetNewPosts);
      }
    } catch (error) {
      console.log(error);
    }
    setisLoadingDelete(false);
  };

  const dropdownPostOptions = (post) => {
    // if(userId)
    return (
      <>
        <div
          className={`absolute z-50 bg-gray-50 top-[130%] right-0 w-max shadow-xl ${
            isOpenOption ? " visible" : " invisible"
          } dark:bg-[#3A3B3C]  `}
        >
          <div className="border-y-[1px] px-2 dark:border-gray-700 ">
            <FacebookShareButton
              url={`${HOST}/post/${post._id}`}
              // quote={"Title or jo bhi aapko likhna ho"}
              hashtag={"#Do_an_3 #CTUT #TDUY..."}
            >
              <p className="flex items-center gap-2 text-gray-600 dark:text-[#e4e6eb]/80 hover:cursor-pointer ">
                <span className="scale-x-[-1]">
                  <BiShare />
                </span>
                <span className="false group flex rounded-md items-center w-full  py-2 text-sm font-semibold tracking-wide  ">
                  Share to Facebook
                </span>
              </p>
            </FacebookShareButton>
          </div>
          <div className="border-y-[1px] px-2 dark:border-gray-700 ">
            <p
              className="flex items-center gap-2 text-gray-600 dark:text-[#e4e6eb]/80 hover:cursor-pointer "
              onClick={() => {
                setOpenModalEditPost(true);
                setisOpenOption(false);
              }}
            >
              <span>
                <AiOutlineSetting />
              </span>
              <span className="false group flex rounded-md items-center w-full  py-2 text-sm font-semibold tracking-wide  ">
                Edit post
              </span>
            </p>
          </div>
          <div className="border-y-[1px] px-2 dark:border-gray-700 ">
            <p
              className="flex items-center gap-2 text-gray-600 dark:text-[#e4e6eb]/80 hover:cursor-pointer "
              onClick={() => deletePost(post?._id)}
            >
              <span>
                <AiOutlineDelete />
              </span>
              <span className="false group flex rounded-md items-center w-full  py-2 text-sm font-semibold tracking-wide  ">
                Delete
              </span>
            </p>
          </div>
        </div>
        <div
          className={`${
            isOpenOption ? " visible" : " invisible"
          } overlay_dropdown fixed top-0 left-0 bottom-0 right-0 opacity-0 z-10`}
          onClick={() => setisOpenOption(false)}
        ></div>
      </>
    );
  };

  return (
    post && (
      <>
        <div className="post-container bg-white dark:bg-[#242526]  mb-5 pt-3 pb-2.5 md:pb-3 rounded-lg shadow-post px-2">
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
            <div className="post__authur_name flex-1 ml-2 text-gray-700 dark:text-[#e4e6ec]  ">
              <p className=" cursor-pointer font-semibold flex items-center gap-2">
                {post?.postedBy?.name}
                {post.postedBy.role === "Admin" && (
                  <TiTick className="text-[17px] text-white rounded-full bg-sky-500 " />
                )}
              </p>

              <span className="text-xs dark:text-[#b0b3b8]">
                {post?.createdAt && moment(post?.createdAt).fromNow()}
              </span>
            </div>
            {userId === post?.postedBy?._id && (
              <div className="post__authur_control relative">
                <span
                  className="hover:bg-black cursor-pointer"
                  onClick={() => setisOpenOption(true)}
                >
                  <BiDotsHorizontalRounded />
                </span>
                {dropdownPostOptions(post)}
              </div>
            )}
          </div>
          <div className="post__content">
            <div className="post__desc pt-2 px-4">
              {post.isShare && profileOfSharedFeed ? (
                <p>
                  {post?.content} of {profileOfSharedFeed.name}
                </p>
              ) : (
                <p>{post?.content.trim()}</p>
              )}
            </div>
            {post.isShare && profileOfSharedFeed ? (
              <div className=" py-2 shadow-post rounded-lg ">
                <div className="post__authur flex items-center pl-2 pr-3 sm:px-3 md:px-4">
                  <div
                    className="post__authur_avt"
                    onClick={() =>
                      navigate(`/profile/${profileOfSharedFeed?._id}`)
                    }
                  >
                    <img
                      className=" w-10 h-10 rounded-full object-cover cursor-pointer "
                      src={profileOfSharedFeed?.image}
                      alt=""
                    />
                  </div>
                  <div className="post__authur_name flex-1 ml-2 text-gray-700 dark:text-[#e4e6ec]  ">
                    <p className=" cursor-pointer font-semibold flex items-center gap-2">
                      {profileOfSharedFeed?.name}
                      {profileOfSharedFeed.role === "Admin" && (
                        <TiTick className="text-[17px] text-white rounded-full bg-sky-500 " />
                      )}
                    </p>

                    <span className="text-xs dark:text-[#b0b3b8]">
                      {post?.isShare.createdAt &&
                        moment(post?.isShare.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="post__img mt-3 flex items-center justify-center px-2 cursor-pointer">
                  <Link to={`/post/${post?._id}`}>
                    {post?.isShare.image?.url &&
                    post?.isShare.image?.isVideo ? (
                      <video
                        src={post?.isShare.image?.url}
                        controls
                        width="100%"
                      ></video>
                    ) : (
                      <img
                        src={post?.isShare.image?.url}
                        alt=""
                        className="w-full h-auto max-h-[300px] sm:max-h-[350px] object-contain bg-[#F0F2F5] dark:bg-[#18191A]'"
                      />
                    )}
                  </Link>
                </div>
              </div>
            ) : null}
            <div className="post__img mt-3 flex items-center justify-center px-2 cursor-pointer ">
              <Link to={`/post/${post?._id}`}>
                {post?.image?.url && post?.image?.isVideo ? (
                  <video src={post?.image?.url} controls width="100%"></video>
                ) : (
                  <img
                    src={post?.image?.url}
                    alt=""
                    className="w-full h-auto max-h-[300px] sm:max-h-[350px] object-contain bg-[#F0F2F5] dark:bg-[#18191A]'"
                  />
                )}
              </Link>
            </div>
          </div>
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
              <div className="px-4 pt-1 ">
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
                  // setCommentLoading(true);
                  addComment(post._id, userId);
                  // setCommentLoading(false);
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
                  disabled={commentLoading || !formAddComment?.textComment}
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
        {openModalEditPost && (
          <ModalEditPost
            state={{
              post,
              setPost,
              openModalEditPost,
              setOpenModalEditPost,
              // handleImage,
              // file,
              // setFile,
              // imageShow,
              // setImageShow,
              setisOpenOption,
              isLogin,
            }}
            // allPosts={{ statePost }}
          />
        )}
      </>
    )
  );
};

export default Post;
