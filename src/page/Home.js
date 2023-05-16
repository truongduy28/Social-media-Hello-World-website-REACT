import { useNavigate } from "react-router-dom";
import { Nav } from "../components";
// import { useAppContext } from "../context/useContext";
import { motion } from "framer-motion";
import { useAppContext } from "../context/useContext";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { dark, isLogin } = useAppContext();

  // useEffect(() => {
  //   if (isLogin?.user) {
  //     navigate("/");
  //   }
  // }, []);
  //   const { dark } = useAppContext();
  //   const containerVariants = {
  //     hidden: {
  //       opacity: 0,
  //       x: "100vw",
  //     },
  //     visible: {
  //       opacity: 1,
  //       x: 0,
  //       transition: { type: "spring", delay: 0 },
  //     },
  //     exit: {
  //       x: "-100vh",
  //       transition: { ease: "easeInOut", duration: 500 },
  //     },
  //   };

  return (
    <div>
      <Nav />
      <div className="content ">
        <div
        // variants={containerVariants}
        // initial="hidden"
        // animate="visible"
        // exit="exit"
        // className="w-screen h-screen "
        >
          <div
            style={{ backgroundImage: `url('/image/bg.png')` }}
            className={`fixed w-full h-full bottom-0 left-0 dark:opacity-100 opacity-0  wave object-contain duration-300 `}
          />
          <img
            src="image/img-home.png"
            alt="rocket"
            className="absolute right-0 top-0 h-full w-auto object-contain wave "
          />
          <div className="top-[13vh] md:top-[15vh] left-10 text-[40px] sm:text-[60px] md:text-[80px] font-semibold z-10 absolute text-[#210028] dark:text-sky-300 raleway ">
            Hello World{" "}
            <div className="text-[25px] sm:text-[35px] md:text-[40px] text-pink-600 font-light raleway-light italic">
              where start everything!
            </div>{" "}
          </div>{" "}
          <div className="absolute bottom-16 left-10 md:w-[30%] pr-5 md:pr-0">
            <div className="font-bold text-xl sm:text-2xl md:text-3xl md:my-3 dark:text-gray-300 ">
              Connect now!{" "}
            </div>{" "}
            <div className="text-[13px] sm:text-base md:text-[18px]  dark:text-gray-300">
              A place that connects people all over the world. Similar to the
              Internet, Hello World creates a flat world - where there is no
              longer a geographical distance that allows all users to post and
              share status, personal information and interact with others. .{" "}
            </div>{" "}
            <div className="flex gap-x-3 items-center justify-start mt-6 sm:mt-8 md:mt-10 ">
              <button
                className=" boxed dark:text-gray-300 px-7 text-xl font-semibold"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login{" "}
              </button>{" "}
              <button
                className=" boxed dark:text-gray-300 px-7 text-xl font-semibold"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Register{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default Home;
