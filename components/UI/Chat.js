import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import ReactScrollableFeed from "react-scrollable-feed";
import {
  fetchChatDetails,
  selectChatDetails,
} from "../../store/slices/authSlice";
import { useAuth } from "../../utils/hooks";
import { $axios, $baseURL } from "../axios/axios";

function Chat({
  setChatOpen,
  currentUser,
  currentOrderNo,
  currentItemNo,
  onClick,
  sendTo,
}) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const chatMessages = useSelector(selectChatDetails);
  const [chatText, setChatText] = useState("");

  useEffect(() => {
    if (user) {
      getChatDetails(currentOrderNo, currentItemNo);
    }
  }, [currentOrderNo, currentItemNo]);

  const handleChange = (e) => {
    setChatText(e.target.value);
  };

  const MessageLeft = ({
    text,
    showNameIcon,
    message,
    currentUser,
    currentOrderNo,
    currentItemNo,
  }) => {
    return (
      <div className="flex break-words  ml-2 ">
        <div className="bg-[white] p-2 rounded-lg my-1 relative w-40">
          <div
            className="h-5 w-5  absolute -bottom-1 -right-6 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "#FF8CC6" }}
          >
            <span className="!text-xs text-white font-medium">
              {user?.role == "BUYER" ? "S" : "B"}
            </span>
          </div>
          <span className="text-black  leading-7 my-0.5">{text}</span>
        </div>
      </div>
    );
  };
  const MessageRight = ({
    text,
    showNameIcon,
    message,
    currentOrderNo,
    currentItemNo,
  }) => {
    return (
      <div className="mr-1 w-40 break-words ">
        <div
          className="p-2 rounded-lg relative my-1"
          style={{ backgroundColor: "#6EA642" }}
        >
          <div
            className="h-5 w-5  absolute -bottom-1 -left-6 flex items-center justify-center rounded-full"
            style={{ background: "#7C9CBF" }}
          >
            <span className="!text-xs text-white font-medium">
              {user?.role == "BUYER" ? "B" : "S"}
            </span>
          </div>
          <span className=" text-white leading-7">{text}</span>
        </div>
      </div>
    );
  };

  const getChatDetails = async (query) => {
    if (user) {
      let payload = {
        conditions: {
          orderNo: currentOrderNo,
          itemNo: currentItemNo,
        },
      };

      try {
        const res = await dispatch(fetchChatDetails(payload));
        return res;
      } catch (e) {}
    }
  };

  const handleSendMessage = async () => {
    const payload = {
      message: chatText,
      to: sendTo, // User _id to whom you want to send message
      orderNo: currentOrderNo,
      itemNo: currentItemNo,
    };
    try {
      const res = await $axios.post(`${$baseURL}/message/sendMessage`, payload);
      if (res) {
        getChatDetails();
      }
    } catch (error) {}
  };
  return (
    <div>
      <div className="upper_header flex items-center justify-between px-4 py-4 pt-2 pb-4">
        <div className="flex items-center">
          <div className="h-10 w-10  bg-[#F17B33] mr-5 flex items-center justify-center rounded-full">
            <span className="text-white">
              {user?.role === "BUYER" ? "S" : "B"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">ERP Team</span>
          </div>
        </div>

        <div>
          <CloseIcon
            className="ml-4 text-gray-600 !text-2xl cursor-pointer"
            onClick={() => {
              onClick();
            }}
          />
        </div>
      </div>
      <div
        className="chat_body h-96 relative bg-gray-100  "
        style={{
          backgroundColor: "rgb(243, 244, 246)",
        }}
      >
        {chatMessages?.length === 0 && (
          <h1 className="text-center">No Messages Yet</h1>
        )}
        <ReactScrollableFeed>
          {chatMessages?.length !== 0 &&
            chatMessages?.map((message) => {
              if (message?.sentBy?._id == user?._id) {
                return (
                  <div className="flex justify-end w-full">
                    <MessageRight
                      currentOrderNo={currentOrderNo}
                      currentItemNo={currentItemNo}
                      message={message}
                      showNameIcon={false}
                      text={message?.message}
                      currentUser={user}
                    />
                  </div>
                );
              } else {
                return (
                  <div className="flex justify-start w-full">
                    <MessageLeft
                      currentOrderNo={currentOrderNo}
                      currentItemNo={currentItemNo}
                      currentUser={user}
                      message={message}
                      showNameIcon={false}
                      text={message?.message}
                    />
                  </div>
                );
              }
            })}
        </ReactScrollableFeed>
      </div>
      <div className="footer_message rounded-bl-md rounded-br-md bg-[white] h-14 px-2 flex items-center">
        <textarea
          style={{ resize: "none" }}
          placeholder="Type your message here.. "
          value={chatText}
          onChange={handleChange}
          rows={1}
          type="text"
          className="w-full py-2 break-words outline-none"
        />
        <SendIcon
          className={`text-gray-500 cursor-pointer ${
            chatText.length === 0 && "opacity-25"
          }`}
          onClick={() => {
            if (chatText.length > 0) {
              handleSendMessage();
            }
            setChatText("");
          }}
        />
      </div>
    </div>
  );
}

export default Chat;
