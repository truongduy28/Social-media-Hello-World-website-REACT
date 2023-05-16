import React from "react";

// import icons
import { BsPeople } from "react-icons/bs";
import { ImEarth } from "react-icons/im";

const FilterPost = ({ tab }) => {
  const { tabPost, setTabPost, setPage } = tab;

  return (
    <div className="filter-post container-create-post bg-white w-full px-5   rounded-lg shadow-post mb-5 dark:bg-[#242526] ">
      <div className="flex">
        <div
          className={`flex-1 font-medium flex items-center justify-center gap-x-2  cursor-pointer pt-3 pb-2 ${
            tabPost === "community"
              ? " text-blue-300 border-b-4  border-blue-300"
              : " text-gray-400"
          }`}
          onClick={() => {
            setTabPost("community");
            setPage(1);
          }}
        >
          <span className={`${tabPost === "community" && "text-blue-300"}`}>
            <ImEarth />
          </span>
          <span>Community</span>
        </div>
        <div
          className={`flex-1 font-medium flex items-center justify-center gap-x-2 cursor-pointer pt-3 pb-2  ${
            tabPost === "follow"
              ? " border-b-4  border-blue-300 text-blue-300 "
              : " text-gray-400 "
          }`}
          onClick={() => {
            setTabPost("follow");
            setPage(1);
          }}
        >
          <span className={`${tabPost === "follow" && "text-blue-300"}`}>
            <BsPeople />
          </span>
          <span>Follow</span>
        </div>
      </div>
    </div>
  );
};

export default FilterPost;
