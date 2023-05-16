import React from "react";

// import icons
import { BsFilePost } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { MdReport } from "react-icons/md";

const DocbarAdmin = ({ control }) => {
  const { tab, setTab } = control;
  return (
    <>
      <div className="tab-control absolute bottom-2 left-[35%] right-[35%] flex justify-between items-center m-auto bg-white dark:bg-[#242526] gap-2 p-2 rounded-xl shadow-post">
        <div
          className="flex justify-center items-center flex-1 gap-2 dark:hover:bg-black py-2 rounded-md hover:scale-125 duration-300 hover:translate-y-[-6px] cursor-pointer"
          onClick={() => setTab("post")}
        >
          <span>
            <BsFilePost />
          </span>
          <span>Post</span>
        </div>
        <div
          className="flex justify-center items-center flex-1 gap-2 dark:hover:bg-black py-2 rounded-md hover:scale-125 duration-300 hover:translate-y-[-6px] cursor-pointer"
          onClick={() => setTab("user")}
        >
          <span>
            <FaUserCircle />
          </span>
          <span>User</span>
        </div>
        <div
          className="flex justify-center items-center flex-1 gap-2 dark:hover:bg-black py-2 rounded-md hover:scale-125 duration-300 hover:translate-y-[-6px] cursor-pointer"
          onClick={() => setTab("report")}
        >
          <span>
            <MdReport />
          </span>
          <span>Report</span>
        </div>
        <div
          className="flex justify-center items-center flex-1 gap-2 dark:hover:bg-black py-2 rounded-md hover:scale-125 duration-300 hover:translate-y-[-6px] cursor-pointer"
          onClick={() => setTab("statistic")}
        >
          <span>
            <ImStatsDots />
          </span>
          <span>Statistics</span>
        </div>
      </div>
    </>
  );
};

export default DocbarAdmin;
