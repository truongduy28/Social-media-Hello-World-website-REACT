import React, { useState } from "react";
import Nav from "./../components/common/Nav";
import { useSelector } from "react-redux";
import { AiFillCamera } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { APIURI } from "../config";
import app from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { login, update } from "../redux/userSlice";
import { useAppContext } from "../context/useContext";

const UpdateProfile = () => {
  const { dispatch, navigate } = useAppContext();
  const isLogin = useSelector((state) => state?.user?.value);
  const currentUser = isLogin?.user;
  const [image, setImage] = useState(currentUser?.image);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const initValueState = {
    id: currentUser?._id,
    name: currentUser?.name,
    username: "",
    image: currentUser?.image,
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  // image file
  const [file, setFile] = useState(null);

  const [state, setState] = useState(initValueState);
  const field = [
    {
      label: "Name",
      type: "text",
      placeholder: "John Wick",
      name: "name",
      value: state.name || currentUser.name,
    },
    {
      label: "About",
      type: "text",
      placeholder: "Short biography about you",
      name: "about",
      value: currentUser.about,
      // disabled: true,
    },
    {
      label: "City",
      type: "text",
      placeholder: "The city you live in      ",
      name: "city",
      value: state.city || currentUser.city || null,
      // disabled: true,
    },
    {
      label: "Current password",
      type: "password",
      placeholder: "Type your current password",
      name: "currentPassword",
      value: state.currentPassword,
    },
    {
      label: "New password",
      type: "password",
      placeholder: "Type new password",
      name: "newPassword",
      value: state.newPassword,
    },
    {
      label: "Confirm new password",
      type: "password",
      placeholder: "Confirm new password",
      name: "confirmNewPassword",
      value: state.confirmNewPassword,
    },
  ];

  const handleImage = async (e) => {
    try {
      setImage(null);
      const file = e.target.files[0];
      console.log(file);
      // @ts-ignore
      setImage(URL.createObjectURL(file));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    // console.log(image);
    setLoading(true);
    try {
      const {
        newPassword: password,
        confirmNewPassword: rePassword,
        currentPassword,
      } = state;
      const name = state.name || currentUser.name;
      const about = state.about || currentUser.about;
      const username = state.username || currentUser.username;
      if (file) {
        const fileName = new Date().getTime() + file.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                state.image = downloadURL;
                // navigate("/profile");
              })
              .then(async () => {
                const { data } = await axios.put(
                  `${APIURI}/users/update-user`,
                  state
                );
                dispatch(update(data.user));
                toast(data.msg);
                setState(initValueState);
              });
          }
        );
      } else {
        const { data } = await axios.put(`${APIURI}/users/update-user`, state);
        // console.log(data);
        dispatch(update(data.user));
        toast(data.msg);
        setState(initValueState);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        toast.error(error?.response?.data?.msg);
      } else {
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Nav />
      <div className="content">
        <div className=" pt-[20px] md:pt-[-50px] lg:grid lg:grid-cols-3 lg:px-[10%] px-[5%] overflow-x-hidden ">
          <div className="col-span-1 flex flex-col items-center justify-center pb-10 ">
            <label className="relative group w-40 h-40 cursor-pointer ">
              <img
                src={image || currentUser?.image}
                alt="avatar"
                className="w-full h-full rounded-full object-cover "
              />
              <div className="hidden group-hover:flex flex-col items-center w-full h-full justify-center absolute z-10 dark:bg-black/50 bg-white/30 top-0 left-0 rounded-full transition-50 font-bold ">
                <AiFillCamera className="text-4xl text-black/70 " />
              </div>
              <input
                onChange={(e) => {
                  handleImage(e);
                  setFile(e.target.files[0]);
                }}
                type="file"
                accept="image/*"
                name="avatar"
                hidden
              />
            </label>
            <div className="mt-5 text-3xl font-bold text-center flex items-center gap-x-2 ">
              {currentUser?.name}
            </div>
            <span className="ml text-2xl font-normal mt-1 ">
              ({currentUser?._id})
            </span>
          </div>
          <div className="col-span-2 my-[5%] lg:py-auto py-7 px-6 bg-gray-400/30 lg:rounded-3xl md:rounded-xl rounded-md">
            <div className="w-full text-center lg:text-4xl md:text-3xl text-2xl font-bold lg:my-8 md:my-5 my-4 ">
              Update profile
            </div>
            <form
              className="md:grid grid-cols-2 md:gap-y-12 gap-x-10 flex flex-col gap-y-5 "
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {field.map((v, k) => (
                <div key={k + "field-update"} className="">
                  <div
                    className={`text-sm md:text-[17px] font-bold ml-3 mb-2 ${
                      v.disabled ? "opacity-70" : ""
                    } `}
                  >
                    {v.label}
                  </div>
                  <input
                    type={v.type}
                    className={`input-login ${
                      v.disabled ? "opacity-70" : ""
                    } w-full `}
                    placeholder={v.placeholder}
                    name={v.name}
                    value={v.value}
                    onChange={(event) => handleChange(event)}
                    disabled={v.disabled || loading}
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-center items-center  ">
                <button className="w-32 h-10 flex items-center justify-center transition-50 font-bold text-xl rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white opacity-75 hover:opacity-100 ">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
