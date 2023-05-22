import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FiTrash } from "react-icons/fi";

import ToolTip from "./Tooltip";
import moment from "moment/moment";
import { Close } from "@mui/icons-material";

const nt = [
  {
    nId: 2,
    title: "Wallmart send you a message",
    body: "Order is delayed",
    date: "11-09-2022",
  },
  {
    nId: 3,
    title: "Best Buy send you a message",
    body: "Check your mail for Order status",
    date: "11-10-2022",
  },
  {
    nId: 4,
    title: "Flipkart send you a message",
    body: "Can you explain me this delay?",
    date: "11-10-2022",
  },
  {
    nId: 5,
    title: "Raghav send you a message",
    body: "Hey Avinash can you this Order details",
    date: "01-10-2022",
  },
  {
    nId: 6,
    title: "Yash Sarkar send you a message",
    body: "Order is delivered",
    date: "11-10-2022",
  },
];
const Notifications = ({ showNotifications, setShowNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const ITEM_HEIGHT = 48;

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setSelectedNotification(null);
    setAnchorEl(null);
  };

  return (
    <Drawer
      className="max-h-screen overflow-y-auto"
      open={showNotifications}
      onClose={() => {
        setShowNotifications(false);
      }}
      anchor={"right"}
    >
      <div className="w-[550px]   pb-2  xs:w-screen">
        <div className="flex flex-col sticky top-0 mt-0 right-0 bg-[white] z-[5]  ">
          <div className="flex items-center justify-between   bg-primary-bg px-4  py-2">
            <p className="font-medium text-lg  text-white">Notifications</p>
            <div className="flex space-between">
              {nt?.length > 0 ? (
                <ToolTip title="Mark all notifications as read">
                  <IconButton className="p-1 outline-none">
                    <MdOutlineMarkEmailRead
                      style={{ fontSize: "24px", color: "white" }}
                    />
                  </IconButton>
                </ToolTip>
              ) : (
                ""
              )}

              {nt?.length > 0 ? (
                <ToolTip title="Clear all notifications">
                  <IconButton
                    className="ml-2 p-1 outline-none"
                    onClick={() => setDeleteAll(true)}
                  >
                    <FiTrash style={{ fontSize: "22px", color: "white" }} />
                  </IconButton>
                </ToolTip>
              ) : (
                ""
              )}

              <ToolTip title="Close">
                <IconButton
                  className="ml-2 p-1 outline-none"
                  onClick={() => {
                    setShowNotifications(false);
                  }}
                  style={{ fontSize: "22px", color: "white" }}
                >
                  <Close />
                </IconButton>
              </ToolTip>
            </div>
          </div>

          <div className="flex items-center justify-center bg-[white] shadow">
            <TextField
              value={searchText}
              variant="standard"
              onChange={(e) => {
                setSearchText(e.target.value);
                getAllNotifications(e.target.value);
              }}
              placeholder="Search Notifications"
              className="w-full flex-1 px-4 rounded-none placeholder-black border-none py-2 shadow-none "
              InputProps={{
                disableUnderline: true,

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton title="Search">
                      <AiOutlineSearch
                        style={{ fontSize: "22px", color: "black" }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <div>
          {nt?.length > 0 &&
            nt?.map((d, index) => (
              <div
                className={`flex items-center justify-center shadow-sm my-1 py-1 ${
                  !d?.isRead ? "bg-[white]" : "bg-[#d5f4e6]"
                } `}
                key={d?.nId}
              >
                <div className="mx-2 ml-4 pb-3  md:ml-5">
                  <Avatar
                    sx={{
                      bgcolor:
                        d.title == "Rejection alert!" ? "#f04949" : "#F17B33",
                    }}
                  >
                    {d?.title[0] ? d?.title[0] : "B"}
                  </Avatar>
                </div>
                <div className="flex flex-col my-1 pb-1 bg-white text-black w-5/6 cursor-pointer">
                  <div className="flex justify-between mb-1 px-2 ">
                    <p className="text-sm font-bold mr-2">
                      {d?.title ? d?.title : "NA"}
                    </p>
                    <p className="text-xs py-0.5">
                      {d?.date
                        ? moment(d?.date).format("DD-MM-YYYY HH:mm")
                        : ""}
                    </p>
                  </div>
                  <div
                    className={`py-1 mx-2 bg-white text-xs text-left pl-0 font-medium
                                    flex justify-between  px-2
                                `}
                  >
                    <p>{d?.body ? d?.body : ""}</p>
                  </div>
                </div>
                <div>
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => {
                      setSelectedNotification(d);
                      handleClick(e);
                    }}
                  >
                    <BsThreeDotsVertical className="text-lg m-1" />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        backgroundColor: "#ece6e6",
                        width: "20ch",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {!selectedNotification?.isRead ? (
                      <MenuItem
                        value="MARK_AS_READ"
                        key="MARK_AS_READ"
                        className="capitalize"
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        <MdOutlineMarkEmailRead size={22} className="mr-4" />{" "}
                        Mark as read
                      </MenuItem>
                    ) : (
                      ""
                    )}

                    <MenuItem
                      value="CLEAR"
                      key="CLEAR"
                      style={{
                        fontWeight: "600",
                      }}
                      className="capitalize"
                    >
                      <FiTrash size={22} className="mr-4" /> Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Dialog open={deleteAll} onClose={() => setDeleteAll(false)}>
        <DialogContent className="px-5 pt-4 pb-3">
          <div className="w-full">
            Are you sure want to delete All Notifications?
          </div>
        </DialogContent>
        <DialogActions className="pr-4 mb-2">
          <Button
            style={{
              padding: "3px 16px 3px 16px",
            }}
            className=" bg-gray-400 text-black normal-case rounded"
            // variant="contained"
            type="submit"
            onClick={() => {
              setDeleteAll(false);
            }}
          >
            Cancel
          </Button>
          <Button
            style={{
              padding: "3px 16px 3px 16px",
            }}
            className=" bg-primary-bg hover:bg-primary-bg normal-case rounded"
            variant="contained"
            type="submit"
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Notifications;
