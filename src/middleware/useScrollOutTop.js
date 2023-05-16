import React, { useEffect, useState } from "react";

const useScrollOutTop = () => {
  const [scrolling, setScrolling] = useState(false);

  const onScroll = (e) => {
    setScrolling(e.target.documentElement.scrollTop > 500);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, []);

  console.log(scrolling);

  return scrolling;
};

export default useScrollOutTop;
