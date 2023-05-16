import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";

const PeopleCardProfile = ({ u, handleUnFollow, tab }) => {
  const [isLoadingUnFollow, setIsLoadingUnFollow] = useState(false);

  return (
    <div>
      {" "}
      <div
        key={u._id}
        className="col-span-1 flex items-center gap-x-3 px-4 py-5 "
      >
        <Link to={`/profile/${u._id}`}>
          <img
            src={u.image}
            alt=""
            className="w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 rounded-md object-cover cursor-pointer "
          />
        </Link>
        <div>
          <div className="text-[14px] sm:text-[17px]  font-semibold cursor-pointer ">
            <Link to={`/profile/${u._id}`}>{u.name}</Link>
          </div>
          <div className="text-[12px] sm:text-[14px] dark:text-[#b0b3b8]  ">
            {u.email}
          </div>
        </div>

        {isLoadingUnFollow ? (
          <div className="w-16 sm:w-20 h-8 sm:h-10 flex items-center justify-center pb-2 ml-auto bg-[#3C4D63]/50 transition-20 text-white rounded-md">
            <ReactLoading type="spin" width="20%" height="20%" color="white" />
          </div>
        ) : (
          <button
            className="px-3 sm:px-4 py-1 md:py-2 ml-auto hover:bg-[#3C4D63] bg-[#3C4D63]/50 transition-20 text-white rounded-md text-[14px] sm:text-base  "
            onClick={() => handleUnFollow(u)}
          >
            Unfollow
          </button>
        )}
      </div>
    </div>
  );
};

export default PeopleCardProfile;
