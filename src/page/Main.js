import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalCreatePost from "../components/Modal.CreatePost";
import { APIURI } from "../config";
import { useAppContext } from "../context/useContext";
import Nav from "./../components/common/Nav";
import CreatePost from "./../components/CreatePost";
import Post from "./../components/Post";
import Suggest from "./../components/Suggest";
import Weather from "./../components/Weather";
import LoadingPost from "./../components/loading/Loading.Post";
import FilterPost from "../components/Filter.Post";
import InfiniteScroll from "react-infinite-scroll-component";

const Main = () => {
  const { dark, user, loginRequired, axios, isLogin } = useAppContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [tabPost, setTabPost] = useState("community");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    handleGetPosts();
  }, [tabPost, isLogin]);

  const handleGetPosts = async () => {
    setIsLoading(true);
    if (tabPost === "follow") {
      const { data } = await axios.get(
        `${APIURI}/posts/post-of-follower-user/${isLogin?.user?._id}?page=${page}`
      );
      setPosts(data.posts);
    } else {
      const { data } = await axios.get(
        `${APIURI}/posts/all-posts?page=${page}`
      );
      setPosts(data.posts);
    }
    setIsLoading(false);
  };

  // const getNewPosts = async () => {
  //   try {
  //     let dataTemp;
  //     const { data } = await axios.get(
  //       `${APIURI}/posts/all-posts?page=${page + 1}`
  //     );
  //     if (tabPost === "follow") {
  //       dataTemp = data?.posts.filter(
  //         (p) =>
  //           p.postedBy._id === isLogin.user._id ||
  //           p.postedBy.follower?.includes(isLogin.user._id)
  //       );
  //     } else {
  //       dataTemp = data?.posts;
  //     }
  //     setPosts([...posts, ...dataTemp]);
  //     setPage(page + 1);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getNewPosts = async () => {
    if (tabPost === "follow") {
      const { data } = await axios.get(
        `${APIURI}/posts/post-of-follower-user/${isLogin?.user?._id}?page=${
          page + 1
        }`
      );
      setPosts([...posts, ...data.posts]);
    } else {
      const { data } = await axios.get(
        `${APIURI}/posts/all-posts?page=${page + 1}`
      );
      setPosts([...posts, ...data.posts]);
    }
    setPage(page + 1);
  };
  const content = () => {
    if (isLoading) {
      return <LoadingPost />;
    }
    if (posts?.length === 0) {
      return (
        <div className="w-full text-center text-xl font-semibold pt-[20vh] flex-col ">
          <div>
            You don't post anything and don't follow anyone.
            <br />
            Let's do something! :3
          </div>
        </div>
      );
    }
    return (
      <InfiniteScroll
        dataLength={posts.length}
        next={getNewPosts}
        hasMore={true}
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <b>Yay! You have seen it all</b>
        //   </p>
        // }
        // loader={<LoadingPost />}
      >
        {posts?.map((post) => (
          <Post
            key={post._id}
            currentPost={post}
            userId={isLogin?.user?._id}
            allPost={{ posts, setPosts }}
          />
          // <p>{post.content}</p>
        ))}
      </InfiniteScroll>
    );
  };

  return (
    <div>
      <Nav />
      <div
        className="content bg-[#e5e7eb] dark:bg-[#121212]  w-full h-full"
        id="content"
      >
        <div className="left md:block hidden ">
          <Weather />
        </div>
        <div className="center my-0 min-h-[100vh] mb-0 w-[95%] md:w-[40%] ">
          <FilterPost tab={{ tabPost, setTabPost, setPage }} />
          <CreatePost statePost={{ setPosts, posts }} />
          {posts && content()}
        </div>
        <div className="right md:block hidden">
          <Suggest />
        </div>
      </div>
    </div>
  );
};

export default Main;
