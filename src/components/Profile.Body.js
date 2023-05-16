import React from "react";
import TabProfileFollowing from "./Tab.Profile.Following";
import TabProfilePost from "./Tab.Profile.Post";
import TabProfileFolower from "./Tab.Profile.Folower";

const ProfileBody = ({ controlTab, currentUser }) => {
  return (
    <div className="mx-4 sm:mx-[5%] md:mx-[15%] px-1 sm:px-10 mt-4 pb-10">
      {controlTab.tab === "post" ? (
        <TabProfilePost currentUser={currentUser} />
      ) : controlTab.tab === "following" ? (
        <TabProfileFollowing />
      ) : controlTab.tab === "follower" ? (
        <TabProfileFolower />
      ) : null}
    </div>
  );
};

export default ProfileBody;
