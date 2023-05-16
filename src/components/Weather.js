import React, { useEffect, useState } from "react";
import { API_WEATHER_SERVER } from "../config";
import axios from "axios";
import LoadingWeather from "./loading/Loading.Weather";
import { BiRadioCircle } from "react-icons/bi";

const Weather = () => {
  const [location, setLocation] = useState("Cần Thơ");
  const [resData, setResData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleGetWeather();
  }, []);

  const handleGetWeather = async (e) => {
    setIsLoading(true);
    if (e) e.preventDefault();
    try {
      const { data } = await axios.get(API_WEATHER_SERVER + "&q=" + location);
      setResData(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <LoadingWeather />
  ) : resData ? (
    <>
      <div className="weather-container bg-white  shadow-post  flex flex-col items-center rounded-lg py-2 sm:py-3 md:py-4 px-5  text-gray-800 dark:bg-[#242526] dark:text-[#e4e6eb] md:fixed w-full mb-5 md:w-[24%]">
        <div className="weather__top flex items-center gap-x-1 w-[85%] dark:dark:bg-[#393A3B]  rounded-full  overflow-hidden text-[15px]   ">
          <div className="weather__top_input w-full bg-[#F1F2F4]  dark:bg-[#393A3B] ">
            <form onSubmit={(e) => handleGetWeather(e)} className="w-full ">
              <input
                type="text"
                className=" border-0 bg-inherit  text-center fucus:ring-0 focus-within:ring-0 py-2 dark:placeholder:text-white/50 rounded-full w-[100%] mx-auto "
                placeholder="Search city..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </form>
          </div>
        </div>

        {/* <hr className=" my-2 h-[0.3px] bg-gray-100" /> */}

        <div className="weather__body text-center border-y-[1px] dark:border-white/30 border-black/30 w-full  my-5 py-5 ">
          <h2 className="text-xl md:text-2xl font-semibold  mb-0  w-full text-center ">
            {resData?.location?.name}
          </h2>
          <span className="text-xl md:text-2xl font-semibold mt-3 pt-2 md:pt-4 mb-0 w-full text-center ">
            ({resData?.location.country})
          </span>
          <p className="my-2"> {resData?.current?.condition?.text}</p>
          <div className="weather__img w-full flex items-center justify-center ">
            <img
              className="w-14 sm:w-18 md:w-20 h-14 sm:h-18 md:h-20 bg-sky-500 dark:bg-sky-700 rounded-full my-2 "
              // src="https://openweathermap.org/img/wn/04n@2x.png"
              src={resData?.current?.condition?.icon}
              alt="weather"
            />
          </div>
          <p className="md-4 md:mb-6 text-[40px] sm:text-50px md:text-[60px] font-bold w-full flex justify-center leading-[48px] ">
            {resData?.current?.temp_c}
            <BiRadioCircle className="text-2xl " />C
          </p>
          <p className="font-bold text-base sm:text-[18px] md:text-xl ">
            Like Feel
          </p>
          <p className=" text-[14px] sm:text-base flex justify-center ">
            {resData?.current?.feelslike_c}
            <BiRadioCircle className="text-[10px] mt-1 " />C
          </p>
        </div>
        {/* <hr className=" my-2 h-[0.3px] bg-gray-100" /> */}

        <div className="weather__bot flex flex-wrap gap-2 gap-y-4 justify-center">
          <div className="w-[45%] text-center">
            <p className="font-semibold tracking-wide	text-lg">Gust</p>
            <span>{resData?.current?.gust_kph} km/h</span>
          </div>
          <div className="w-[45%] text-center">
            <p className="font-semibold tracking-wide	text-lg">Cloud</p>
            <span>{resData?.current?.cloud} %</span>
          </div>
          <div className="w-[45%] text-center">
            <p className="font-semibold tracking-wide	text-lg">Humidity</p>
            <span> {resData?.current?.humidity} %</span>
          </div>
          <div className="w-[45%] text-center">
            <p className="font-semibold tracking-wide	text-lg">Wind</p>
            <span>{resData?.current?.wind_kph} km/h</span>
          </div>
        </div>
      </div>
    </>
  ) : (
    <p> k có</p>
  );
};

export default Weather;
