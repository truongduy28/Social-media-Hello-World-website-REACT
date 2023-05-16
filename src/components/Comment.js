import React, { useState } from "react";

// import library and package
import axios from "axios";
import moment from "moment";
import useKeypress from "react-use-keypress";

// import components
import ModalEditComment from "./Modal.EditComment";

// import icons
import { AiFillHeart, AiOutlineSetting, AiOutlineDelete } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { APIURI } from "../config";
import { BsThreeDots } from "react-icons/bs";
const Comment = ({
  currentComment,
  userId,
  autoFetch,
  postId,
  navigate,
  user_img,
  allComment,
}) => {
  // avarible of components
  const [comment, setComment] = useState(currentComment);
  const [showOption, setShowOption] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [likeCommentLoading, setLikeCommentLoading] = useState(false);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
  const [openModalEditComment, setOpenModalEditComment] = useState(false);

  const cancelEdit = () => {
    setShowOption(false);
  };

  useKeypress("Escape", cancelEdit);

  const likeComment = async () => {
    setLikeCommentLoading(true);
    try {
      const { data } = await axios.put(`${APIURI}/posts/like-comment`, {
        postId,
        commentId: comment._id,
        userId,
      });
      const currentComment = data?.postUpdated?.comments?.find(
        // eslint-disable-next-line eqeqeq
        (c) => c._id == comment._id
      );
      setComment({ ...comment, likes: currentComment?.likes });
    } catch (error) {
      console.log(error);
    }
    setLikeCommentLoading(false);
  };

  const deleteComment = async () => {
    setDeleteCommentLoading(true);
    try {
      const { data } = await axios.put(`${APIURI}/posts/delete-comment`, {
        postId,
        commentId: comment._id,
        userId,
      });
      const currentComment = data?.postUpdated?.comments?.find(
        // eslint-disable-next-line eqeqeq
        (c) => c._id == comment._id
      );
      // console.log(currentComment?.likes);
      setComment({ ...comment, isDelete: currentComment?.isDelete });
    } catch (error) {
      console.log(error);
    }

    setDeleteCommentLoading(false);
  };

  const unlikeComment = async () => {
    setLikeCommentLoading(true);
    try {
      const { data } = await axios.put(`${APIURI}/posts/unlike-comment`, {
        postId,
        commentId: comment._id,
        userId,
      });
      const currentComment = data?.postUpdated?.comments?.find(
        (c) => c._id == comment._id
      );
      // console.log(currentComment?.likes);
      setComment({ ...comment, likes: currentComment?.likes });
    } catch (error) {
      console.log(error);
    }
    setLikeCommentLoading(false);
  };

  const handleLikeComment = () => {
    if (comment?.likes?.includes(userId)) {
      unlikeComment();
    } else {
      likeComment();
    }
  };

  const handleDeleteComment = () => {
    if (window.confirm("Do u want delete this comment?")) {
      deleteComment(comment._id);
    }
  };

  // console.log(co129mment);
  if (!currentComment?.postedBy) {
    return (
      <div className=" rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C] px-3 py-2 w-auto my-2 relative border border-red-500 opacity-50 ">
        This comment has been removed because the user is banned.
      </div>
    );
  }

  // reply mode
  const ReplyMode = () => {
    return (
      <div>
        <div
          className={`flex font-extrabold text-[13px] pl-2 gap-x-4 text-[#65676B] dark:text-[#b0b3b8] `}
        >
          <button
            className={`cursor-pointer ${
              comment?.likes?.length > 0 &&
              comment?.likes?.includes(userId) &&
              "text-[#c22727] dark:text-[#c22727]"
            } `}
            disabled={likeCommentLoading}
            onClick={handleLikeComment}
          >
            Like
          </button>

          <div className="font-normal ">
            {moment(comment.created).fromNow()}
          </div>
        </div>
      </div>
    );
  };

  const dropdownCommentOption = () => {
    return (
      <>
        <div
          className={`absolute z-20 bg-gray-50 top-[130%] w-max shadow-xl ${
            showOption ? " visible" : " invisible"
          } dark:bg-[#3A3B3C]   `}
        >
          <div className="border-y-[1px] px-2 dark:border-gray-700  ">
            <p
              className="flex items-center gap-2 text-gray-600 dark:text-[#e4e6eb]/80 hover:cursor-pointer "
              onClick={() => {
                setOpenModalEditComment(true);
                // setisOpenOption(false);
              }}
            >
              <span>
                <AiOutlineSetting />
              </span>
              <span className="false group flex rounded-md items-center w-full  py-2 text-sm font-semibold tracking-wide  ">
                Edit
              </span>
            </p>
          </div>
          <div className="border-y-[1px] px-2 dark:border-gray-700  ">
            <p
              className="flex items-center gap-2 text-gray-600 dark:text-[#e4e6eb]/80 hover:cursor-pointer "
              onClick={() => handleDeleteComment()}
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
            showOption ? " visible" : " invisible"
          } overlay_dropdowns fixed top-0 left-0 bottom-0 right-0 opacity-0 z-10`}
          onClick={() => setShowOption(false)}
        ></div>
      </>
    );
  };
  // console.log(isOpenOption);

  return (
    <>
      <div
        className={`relative comment-container mt-4 ${
          comment?.isDelete && " hidden "
        }`}
      >
        {/* comment main */}
        <div className="relative flex gap-x-1.5 mt-1.5 group">
          {/* avatar of own's comment */}
          <img
            src={comment?.postedBy?.image}
            alt="own_avt_cmt"
            className="z-10 object-cover w-10 h-10 rounded-full cursor-pointer "
            onClick={() => {
              navigate(`/profile/${comment?.postedBy?._id}`);
            }}
          />
          <div
            className={`box-comment relative w-full ${
              editLoading && "opacity-50"
            } `}
          >
            <div className="flex items-center w-full gap-x-1 ">
              <div className="rounded-xl bg-[#F0F2F5] dark:bg-[#3A3B3C] px-3 py-2 max-w-full relative  ">
                <div
                  className="font-bold text-[13px] text-[#050505] dark:text-[#e4e6eb] flex items-center gap-x-1 cursor-pointer "
                  onClick={() => {
                    navigate(`/profile/${comment?.postedBy?._id}`);
                  }}
                >
                  {comment?.postedBy?.name}
                  {comment?.postedBy?.role === "Admin" && (
                    <TiTick className="text-[13px] text-white rounded-full bg-sky-500 " />
                  )}
                </div>
                <div
                  className={` text-[15px] text-[#050505] dark:text-[#cecfd1] `}
                >
                  {comment.text}
                </div>
                {comment?.image && (
                  <img
                    src={comment?.image}
                    alt="image_comment"
                    className="max-h-60 w-auto object-contain my-0.5 "
                  />
                )}

                {comment?.likes?.length > 0 && (
                  <div
                    className={`absolute bottom-2 bg-inherit p-1 ${
                      comment?.likes && comment?.likes?.length > 1
                        ? "px-2 right-[-30px]"
                        : "right-[-20px]"
                    } rounded-full flex items-center gap-x-0.5 border-[1px] border-black/10 dark:border-white/10 text-[13px] `}
                  >
                    <AiFillHeart className="text-[14px] text-[#c22727] dark:text-[#c22727]" />
                    {comment?.likes?.length > 1 ? comment?.likes?.length : ""}
                  </div>
                )}
              </div>
              <div
                className={`  cursor-pointer relative ${
                  comment?.likes?.length > 0 ? "ml-5 " : " "
                } bottom-2 invisible ${
                  // eslint-disable-next-line eqeqeq
                  userId == comment?.postedBy._id && " option-comment"
                } `}
                onClick={() => setShowOption(!showOption)}
              >
                <span className="flex justify-content items-center p-2 hover:bg-gray-200 bg-gray-100 dark:bg-[#3A3B3C] rounded-full">
                  <BsThreeDots />
                </span>
                {showOption && dropdownCommentOption()}
              </div>
            </div>
            {ReplyMode()}
          </div>
        </div>
      </div>
      {openModalEditComment && (
        <ModalEditComment
          state={{
            openModalEditComment,
            setOpenModalEditComment,
            userId,
            comment,
            setComment,
            postId,
          }}
        />
      )}
    </>
  );
};

export default Comment;
