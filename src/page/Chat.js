import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useAppContext } from "../context/useContext";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { isLogin } = useAppContext();

  return (
    <div style={{ width: "100%" }}>
      {isLogin.user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {isLogin.user && <MyChats fetchAgain={fetchAgain} />}
        {isLogin.user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
