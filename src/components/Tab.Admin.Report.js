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

const TabAdminReport = () => {
  const [allReport, setAllReport] = useState(null);
  const navigate = useNavigate();
  const tableTitle = [
    { name: "NO", width: "20px" },
    { name: "SOURCE", width: "100px" },
    { name: "CONTENT", width: "auto" },
    { name: "TYPE", width: "auto" },
    { name: "REPORTER", width: "auto" },
    { name: "CREATE AT", width: "100px" },
    { name: "", width: "100px" },
  ];

  useEffect(() => {
    const getAllReport = async () => {
      const { data } = await axios.get(`${APIURI}/report`);
      setAllReport(data);
    };
    getAllReport();
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
              {tableTitle.map((title) => (
                <th
                  scope="col"
                  className=" py-3 px-2"
                  style={{ width: title.width }}
                >
                  {title.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {allReport?.map((report, index) => (
              <tr
                className="bg-[#fff] dark:bg-[#303030] cursor-pointer "
                key={report._id}
                // onClick={() => navigate(`/profile/${user._id}`)}
              >
                <td className="py-4 px-2">{index + 1}</td>
                <td className="py-4 px-2">{report.feature.source}</td>

                <td className="py-4 px-2">{report.content}</td>

                <td className="py-4 px-2">{report.type}</td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={report.reportedBy.image}
                      alt="..."
                      className="w-[40px] rounded-full"
                    />
                    <p>{report.reportedBy.name}</p>
                  </div>
                </td>
                <td className="py-4 px-2">
                  {moment(report?.createdAt).fromNow()}
                </td>
                <td className="py-4 px-2">
                  {report.feature.source !== "app" && (
                    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-center">
                      View
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
                {allReport?.length} reports
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TabAdminReport;
