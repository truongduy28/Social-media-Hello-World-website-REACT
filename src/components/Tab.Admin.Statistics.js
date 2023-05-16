import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { APIURI } from "../config";
import LineChart from "./chart/Line.Chart";

const TabAdminSatis = ({ convertDate }) => {
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [dataPosts, setDataPosts] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
    getAllPosts();
  }, []);

  const getAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get(`${APIURI}/users/all-user-for-admin`);

      setDataUsers(data.users);
    } catch (error) {
      console.log(error);
    }
    setLoadingUsers(false);
  };

  const getAllPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data } = await axios.get(`${APIURI}/posts/all-posts-for-admin`);

      setDataPosts(data.posts);
    } catch (error) {
      console.log(error);
    }
    setLoadingPosts(false);
  };

  const datasetPosts = useMemo(() => {
    const data = [];
    dataPosts.forEach((v) => {
      // @ts-ignore
      const x = convertDate(v.createdAt);
      const index = data.find((v) => v.x === x);
      if (!index) {
        data.push({ x: x, y: 1 });
      } else {
        data[data.length - 1].y += 1;
      }
    });
    return data;
  }, [dataPosts]);

  const datasetUser = useMemo(() => {
    const data = [];
    dataUsers.forEach((v) => {
      // @ts-ignore
      const x = convertDate(v.createdAt);
      const index = data.find((v) => v.x === x);
      if (!index) {
        data.push({ x: x, y: 1 });
      } else {
        data[data.length - 1].y += 1;
      }
    });
    return data;
  }, [dataUsers]);

  const datasets = [
    {
      label: loadingPosts ? "Loading..." : "Posts",
      data: datasetPosts,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.3,
      borderWidth: 1,
      pointBorderWidth: 0,
      pointHoverBorderWidth: 3,
      pointHoverRadius: 3,
      pointHitRadius: 5,
      pointRadius: 0,
      pointBackgroundColor: "rgb(75, 192, 192)",
    },
    {
      label: loadingUsers ? "Loading..." : "Users",
      data: datasetUser,
      borderColor: "#1565C0",
      tension: 0.3,
      borderWidth: 1,
      pointBorderWidth: 0,
      pointHoverBorderWidth: 3,
      pointHoverRadius: 3,
      pointHitRadius: 5,
      pointRadius: 0,
      pointBackgroundColor: "#1565C0",
    },
  ];

  const datasets1 = {
    label: loadingPosts ? "Loading..." : "Posts",
    data: datasetPosts,
    borderColor: "rgb(75, 192, 192)",
    tension: 0.3,
    borderWidth: 1,
    pointBorderWidth: 0,
    pointHoverBorderWidth: 3,
    pointHoverRadius: 3,
    pointHitRadius: 5,
    pointRadius: 0,
    pointBackgroundColor: "rgb(75, 192, 192)",
  };

  const option = {
    legend: {
      display: true,
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (contents) => {
            const arrTitle = [];
            const contentLength = contents.length;
            contents.forEach((v, index) => {
              arrTitle.push(v.dataset.label);
              arrTitle.push(v.raw.y);
              arrTitle.push(v.raw.x);
              if (index < contentLength - 1) {
                arrTitle.push("----------------");
              }
            });
            return arrTitle;
          },
          label: () => "",
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "week",
          displayFormats: {
            week: "DD/MM",
          },
        },
        grid: { display: false },

        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        grid: { display: false },

        title: {
          display: true,
          text: "Quantity",
        },
      },
    },
    borderColor: "red",
  };
  return (
    <div className="">
      <div className="flex justify-center items-center text-xl mt-5">
        <h3>DATA ANALYTICS</h3>
      </div>

      <div className="w-[60%] m-auto  max-h-[50vh] flex items-center justify-center  mt-20">
        <div className="h-full w-full">
          <LineChart datasets={datasets} option={option} />
        </div>
      </div>
    </div>
  );
};

export default TabAdminSatis;
