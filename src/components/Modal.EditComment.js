import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { GiEarthAmerica } from "react-icons/gi";
import { RiCloseCircleFill, RiImageAddFill } from "react-icons/ri";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";

import { useAppContext } from "../context/useContext";
import { APIURI } from "../config";
import axios from "axios";
import { toast } from "react-toastify";

const ModalEditComment = ({ state }) => {
  const {
    openModalEditComment,
    setOpenModalEditComment,
    comment,
    setComment,
    postId,
  } = state;
  const { isLogin } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formCommentEdit, setFormCommentEdit] = useState(comment);
  const [imageShow, setImageShow] = useState(comment.image);
  const [file, setFile] = useState(null);
  const handleRemoveImage = () => {
    setImageShow(null);
    setFile(null);
    formCommentEdit.image = "";
  };

  const handleImage = async (e) => {
    try {
      setFile(null);
      const file = e.target.files[0];
      // @ts-ignore
      setImageShow(URL.createObjectURL(file));
      handleShowMedia(file, URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMedia = (fileUploaded, url, imageOfPost) => {
    console.log(imageOfPost || "k có");

    if (fileUploaded) {
      const fileType = fileUploaded["type"];
      console.log(url);

      // const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      const validVideoTypes = ["video/mp4", "video/ogg", "image/webm"];
      // console.log(validVideoTypes.includes(fileType));

      if (validVideoTypes.includes(fileType)) {
        return (
          <>
            <video scr={url} controls width="100%">
              {" "}
            </video>
            <div
              className="z-20 absolute top-2 right-2"
              onClick={() => handleRemoveImage()}
            >
              <RiCloseCircleFill size={"27"} />
            </div>
          </>
        );
      } else {
        return (
          <>
            <img className="w-auto " src={imageShow} alt="file" />
            <div
              className="z-20 absolute top-2 right-2"
              onClick={() => handleRemoveImage()}
            >
              <RiCloseCircleFill size={"27"} />
            </div>
          </>
        );
      }
    }
    if (imageOfPost) {
      return (
        <>
          <img className="w-auto " src={imageOfPost} alt="file" />
          <div
            className="z-20 absolute top-2 right-2"
            onClick={() => handleRemoveImage()}
          >
            <RiCloseCircleFill size={"27"} />
          </div>
        </>
      );
    }
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    console.log(formCommentEdit);
    try {
      setIsLoading(true);

      if (file) {
        const fileName = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
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
                formCommentEdit.image = downloadURL;
              })
              .then(async () => {
                const { data } = await axios.patch(
                  `${APIURI}/posts/edit-comment/${postId}`,
                  formCommentEdit
                );
                const currentComment = data?.postUpdated?.comments?.find(
                  (c) => c._id == comment._id
                );

                console.log(currentComment);
                setComment({
                  ...comment,
                  text: currentComment?.text,
                  image: currentComment?.image,
                });
                toast.success("Update comment successfully!");
                setFormCommentEdit({
                  _id: comment._id,
                  text: "",
                  image: "",
                });
                console.log(comment);
                setIsLoading(false);
                setOpenModalEditComment(false);
              });
          }
        );
      } else {
        const { data } = await axios.patch(
          `${APIURI}/posts/edit-comment/${postId}`,
          formCommentEdit
        );
        const currentComment = data?.postUpdated?.comments?.find(
          (c) => c._id == comment._id
        );

        console.log(currentComment);
        setComment({
          ...comment,
          text: currentComment?.text,
          image: currentComment?.image,
        });
        toast.success("Update comment successfully!");
        setFormCommentEdit({
          _id: comment._id,
          text: "",
          image: "",
        });
        console.log(comment);
        // // setPost({ ...post, formCommentEdit });
        // setPost(data.post);
        // setOpenModalEditPost(false);
        setIsLoading(false);
        setOpenModalEditComment(false);
      }
      setIsLoading(false);
    } catch (error) {
      if (error?.response?.data?.msg) {
        toast.error(error?.response?.data?.msg);
      } else {
        toast.error("Fail");

        console.log(error);
      }
    }
  };

  return (
    <div>
      <div>
        <div
          className={`mx-auto bg-white dark:bg-[#242526] rounded-xl px-4 z-[202] box-shadow fixed top-[10%] right-10 md:right-[27%] left-10 md:left-[27%]  ${
            openModalEditComment ? " visible" : " hidden"
          }`}
        >
          <div className="POST">
            <div className="font-extrabold py-4 text-xl text-center border-b-[1px] border-black/20 dark:border-white/20 relative ">
              Edit Comment
              <span
                className="cursor-pointer absolute top-[50%] translate-y-[-50%] right-3 "
                onClick={() => setOpenModalEditComment(!openModalEditComment)}
              >
                <AiFillCloseCircle size="25" />
              </span>
            </div>
            <div className="flex gap-x-2 py-4 items-center  ">
              <img
                src={isLogin?.user?.image}
                alt=" "
                className="w-10 h-10 rounded-full object-cover "
              />
              <div>
                <div className="text-[15px] font-semibold ">
                  {isLogin?.user?.name}
                </div>
                <button className="px-2 py-1 flex gap-x-0.5 items-center text-[12px] bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-lg mt-0.5 font-semibold scrollbar scrollbar-thumb-sky-200 scrollbar-track-gray-100 ">
                  <span>
                    <GiEarthAmerica />
                  </span>
                  <span className=" ">Global</span>
                </button>
              </div>
            </div>
            <form onSubmit={(e) => handleEditComment(e)}>
              {/* <textarea
                className="input-modal style-3 bg-inherit focus:ring-0 border-0 w-full placeholder:text-[#a0a0a1] text-[22px] h-[150px] relative outline-none"
                placeholder={`What's on your mind, ${isLogin?.user?.name}?`}
                onChange={(e) =>
                  setFormComformCommentEdit({ ...formCommentEdit, content: e.target.value })
                }
                defaultValue={formCommentEdit?.content}
              ></textarea> */}
              <input
                type="text"
                className="input-modal  bg-inherit focus:ring-0 border w-full placeholder:text-[#a0a0a1] text-[22px]  relative outline-none dark:border-none"
                placeholder={`What's your comment, ${isLogin?.user?.name}?`}
                onChange={(e) =>
                  setFormCommentEdit({
                    ...formCommentEdit,
                    text: e.target.value,
                  })
                }
                value={formCommentEdit?.text}
              />
              <div className="relative flex w-full h-[200px] p-2 rounded-md border dark:border-white/20 group justify-center items-center overflow-hidden ">
                {imageShow ? (
                  handleShowMedia(file, imageShow, formCommentEdit.image)
                ) : (
                  <div className="w-full h-full rounded-md flex flex-col items-center justify-center dark:group-hover:bg-[#47494A] relative bg-[#EAEBED]/60 group-hover:bg-[#d9dadc]/60 dark:bg-inherit ">
                    <span className="absolute top-2 right-2 text-gray-500">
                      {" "}
                      <RiCloseCircleFill size={"27"} />
                    </span>

                    <div className="bg-gray-200 rounded-full p-3 text-gray-700">
                      <RiImageAddFill size={"30"} />
                    </div>
                    <div className="font-semibold text-[18px] leading-5 text-black/60 dark:text-white/60 ">
                      Add photos
                    </div>
                    <span className="text-[12px] text-[#949698] dark:text-[#b0b3b8] ">
                      or drag and drop
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*,video/*"
                  className="absolute w-full h-full top-0 left-0 z-10 cursor-pointer opacity-0 "
                  onChange={(e) => {
                    handleImage(e);
                    setFile(e.target.files[0]);
                    //   handleShowMedia(file, )
                  }}
                />
              </div>
              <button
                className={`w-full py-1.5 text-center rounded-[4px] font-semibold my-3 dark:bg-[#505151] dark:text-white/70 text-white ${
                  isLoading ? "bg-blue-300 " : " bg-[#3982E4] "
                } `}
                disabled={isLoading}
              >
                {!isLoading ? "Post" : "..."}
              </button>
            </form>
          </div>
        </div>

        <div
          className="z-[10] bg-gray-200 opacity-40 fixed w-full h-full top-0 right-0 "
          onClick={() => setOpenModalEditComment(!openModalEditComment)}
        ></div>
      </div>
    </div>
  );
};

export default ModalEditComment;
