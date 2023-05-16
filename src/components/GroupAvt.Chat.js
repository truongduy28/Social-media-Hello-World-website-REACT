import React from "react";
import Avatar from "@mui/material/Avatar";
import { AvatarGroup, Tooltip } from "@mui/material";

const GroupAvtChat = ({ dataSource, max = 2, user, setOneState }) => {
  console.log("ádc");

  return (
    <div>
      {" "}
      <AvatarGroup max={max}>
        {dataSource.map((receivePeople) => (
          <Tooltip
            title={
              user && receivePeople._id === user._id
                ? "You"
                : receivePeople.name
            }
            placement="top"
            key={receivePeople._id + "grAvatar"}
            onClick={() => {
              setOneState("receiveUser", receivePeople);
            }}
          >
            {/* <img
                src={receivePeople.image.url}
                alt={receivePeople.name}
                className='w-10 h-10 rounded-full object-cover '
            /> */}
            <Avatar alt={receivePeople.name} src={receivePeople.image} />
          </Tooltip>
        ))}
      </AvatarGroup>
    </div>
  );
};

export default GroupAvtChat;
