import React, { useState } from "react";

import { Nav } from "../components";
import TabAdminSatis from "../components/Tab.Admin.Statistics";
import TabAdmiUser from "../components/Tab.Admin.User";
import DocbarAdmin from "./../components/common/Docbar.Admin";
import TabAdminPost from "./../components/Tab.Admin.Post";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useContext";
import TabAdminReport from "../components/Tab.Admin.Report";

const Admin = () => {
  const { isLogin } = useAppContext();
  const navigate = useNavigate();

  const convertDate = (time) => {
    const date = new Date(time);
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return `${yyyy}-${mm >= 10 ? mm : "0" + mm}-${dd >= 10 ? dd : "0" + dd}`;
  };
  const [tab, setTab] = useState("post");

  React.useEffect(() => {
    if (isLogin?.user?.role !== "Admin") {
      navigate("/");
    }
  }, [tab]);
  return (
    <>
      <Nav />
      <div className="content min-h-[100vh] relative ">
        {tab === "post" ? (
          <TabAdminPost />
        ) : tab === "user" ? (
          <TabAdmiUser />
        ) : tab === "report" ? (
          <TabAdminReport />
        ) : (
          <TabAdminSatis convertDate={convertDate} />
        )}
        <DocbarAdmin control={{ tab, setTab }} />
      </div>
    </>
  );
};

export default Admin;
