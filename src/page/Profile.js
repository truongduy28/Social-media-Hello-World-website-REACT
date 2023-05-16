import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/Profile.Header";
import { Nav } from "../components";
import ProfileBody from "./../components/Profile.Body";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APIURI } from "../config";
import ScrollToTop from "../middleware/ScrollToTop";

const Profile = () => {
  const isLogin = useSelector((state) => state?.user?.value);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [tab, setTab] = useState("post");

  useEffect(() => {
    const getProfile = async () => {
      const { data } = await axios.get(`${APIURI}/users/${id}`);
      setUser(data.user);
    };
    getProfile();
    setTab("post");
  }, [id]);

  return (
    <div>
      <ScrollToTop />
      <Nav />
      <div className="content">
        <ProfileHeader
          user={{ ...user, setUser }}
          controlTab={{ tab, setTab }}
          own={isLogin}
        />
        <ProfileBody controlTab={{ tab, setTab }} currentUser={user} />
      </div>
    </div>
  );
};

export default Profile;
