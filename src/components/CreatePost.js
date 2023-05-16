import React, { useState } from "react";

// import icons
import { FaVideo } from "react-icons/fa";
import { MdPhoto } from "react-icons/md";

// import state context
import { useAppContext } from "../context/useContext";

// import components
import ModalCreatePost from "./Modal.CreatePost";

const CreatePost = ({ statePost }) => {
  // variables global state
  const { isLogin } = useAppContext();

  // variables of component
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [imageShow, setImageShow] = useState(null);
  const [post, setPost] = useState({
    content: "",
    image: {
      url: "",
      isVideo: false,
    },
    postedBy: isLogin.user._id,
  });

  // function of component
  const handleImage = async (e) => {
    try {
      setFile(null);
      const file = e.target.files[0];
      // @ts-ignore
      setImageShow(URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container-create-post bg-white w-full px-5 pt-5 pb-2 rounded-lg shadow-post mb-5 dark:bg-[#242526] dark:text-[#b0b3b8]">
        <div className="create__top flex items-center">
          <div className="create__top_avt w-[50px]">
            <img
              src={isLogin?.user?.image}
              className="object-cover w-10 h-10 rounded-full shrink-0 "
              alt="avt"
            />
          </div>
          <div
            className="create__top_input flex-1"
            onClick={() => setOpenModal(!openModal)}
          >
            <input
              className="w-full outline-none py-2 px-4 rounded-full 
              bg-gray-100 hover:cursor-pointer hover:bg-gray-200 dark:bg-[#4E4F50]/70 dark:hover:bg-[#4E4F50] dark:text-[#b0b3b8] "
              type="text"
              placeholder={`What's on your mind, ${isLogin?.user?.name}?`}
              disabled
              value={post?.content}
            />
          </div>
        </div>
        <hr className=" my-2 h-[0.3px] bg-gray-100 outline-none border-none dark:bg-[#4e4f50]" />
        <div className="create__bot flex gap-2">
          <div
            className="create__btn flex justify-center items-center flex-1 hover:bg-gray-100 py-2 gap-2 rounded-md hover:cursor-pointer dark:hover:bg-[#4E4F50] "
            onClick={() => setOpenModal(!openModal)}
          >
            <FaVideo className="text-[#f3425f] text-[26px]" />
            <span className="font-semibold text-gray-500 text-sm">Video</span>
          </div>
          <div
            className="create__btn flex justify-center items-center flex-1 hover:bg-gray-100 py-2 gap-2 rounded-md hover:cursor-pointer dark:hover:bg-[#4E4F50] "
            onClick={() => setOpenModal(!openModal)}
          >
            <MdPhoto className={`relative text-[#45bd62] text-[26px] `} />
            <span className=" font-semibold text-gray-500 text-sm">Photo</span>
          </div>
        </div>
      </div>
      {openModal && (
        <ModalCreatePost
          state={{
            post,
            setPost,
            openModal,
            setOpenModal,
            handleImage,
            file,
            setFile,
            imageShow,
            setImageShow,
            isLogin,
          }}
          allPosts={{ statePost }}
        />
      )}
    </>
  );
};

export default CreatePost;
