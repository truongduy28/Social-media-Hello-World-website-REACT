import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/useContext";
import { FaEyeSlash } from "react-icons/fa";
import { GoReply } from "react-icons/go";
import { BsEyeSlash } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import moment from "moment";
import axios from "axios";
import { APIURI } from "../config";
import { useNavigate } from "react-router-dom";

const TabAdmiUser = () => {
  const [allUser, setAllUser] = useState(null);
  const navigate = useNavigate();
  const tableTitile = [
    "NO",
    "AVATAR",
    "NAME",
    "EMAIL",
    "FOLLOWING",
    "FOLLOWR",
    "CREATE AT",
    "STATUS",
  ];

  useEffect(() => {
    const getAllPost = async () => {
      const { data } = await axios.get(`${APIURI}/users/all-user-for-admin`);
      setAllUser(data.users);
    };
    getAllPost();
  }, []);

  return (
    <div className="flex justify-center gap-3 w-[80%] m-auto mt-2 shadow-post ">
      <div
        className="overflow-y-scroll h-fit max-h-[80vh] relative app-scrollbar w-full"
        id="app-scrollbar-style"
      >
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-[#F0F2F5] dark:bg-[#242526] dark:text-gray-400 sticky absolute top-0">
            <tr>
              {tableTitile.map((title) => (
                <th scope="col" className="w-[20px] py-3 px-2">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {allUser?.map((user, index) => (
              <tr
                className="bg-[#fff] dark:bg-[#303030] cursor-pointer "
                key={user._id}
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <td className="py-4 px-2">{index + 1}</td>
                <td className="py-4 px-2">
                  <img
                    className="image-photo w-[40px] rounded-full object-cover"
                    src={user?.image}
                    alt="avt"
                  />
                </td>

                <th
                  scope="row"
                  className="py-4 px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user?.name}
                </th>
                <td className="py-4 px-2">{user?.email}</td>

                <td className="py-4 px-2">{user?.follower?.length}</td>
                <td className="py-4 px-2">{user?.following?.length}</td>
                <td className="py-4 px-2">
                  {moment(user?.createdAt).fromNow()}
                </td>
                <td className="py-4 px-2">
                  {user?.isDelete ? (
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
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold bg-[#F0F2F5] dark:bg-[#242526] text-gray-900 dark:text-white sticky absolute bottom-0 rounded-b-lg overflow-hidden">
              <th scope="row" className="py-3 px-2 text-base ">
                Total
              </th>
              <td colSpan={8} className="py-3 text-right px-2">
                {allUser?.length} users
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TabAdmiUser;
