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
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { RiFilterLine } from "react-icons/ri";
import { FiTrash } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllNotification,
  selectUser,
  selectUserNotifications,
} from "../../store/slices/authSlice";
import { $axios, $baseURL } from "../axios/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToolTip from "./Tooltip";
import moment from "moment/moment";
import { Close } from "@mui/icons-material";

const Notifications = ({ showNotifications, setShowNotifications }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const ITEM_HEIGHT = 48;
  const not = useSelector(selectUserNotifications);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setSelectedNotification(null);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (user) {
      getAllNotifications();
    }
  }, [user, setNotifications]);

  const getAllNotifications = async (value) => {
    setLoading(true);
    const payload = {};
    if (value) {
      payload.searchTerm = value;
    }
    try {
      const res = await dispatch(getAllNotification(payload));
      if (res) {
        const notifications = res?.data?.data;
        console.log(notifications);

        const sortedNotifications = notifications
          ?.map((obj) => {
            return { ...obj, date: new Date(obj.date) };
          })
          .sort((a, b) => b.date - a.date);
        console.log(Array.isArray(sortedNotifications));

        setNotifications(sortedNotifications);
      }
      return res;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  console.log(notifications);

  const readAllNotifications = async () => {
    try {
      const res = await $axios.put(
        `${$baseURL}/users/users/markAllNotificationRead/${user?._id}`
      );
      if (res) {
        const data = res?.data?.data;
        getAllNotifications();
      }
      return res;
    } catch (error) {}
  };
  const clearNotifications = async () => {
    try {
      const res = await $axios.put(
        `${$baseURL}/users/users/clearAllNotifications/${user._id}`
      );
      if (res) {
        const data = res?.data?.data;
        getAllNotifications();
        setDeleteAll(false);
      }
      toast.success(res?.data.message);
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const readSelNotification = async (notification) => {
    try {
      const res = await $axios.put(
        `${$baseURL}/users/users/markSelNotificationRead/${user._id}/${notification.nId}`
      );

      if (res) {
        const data = res?.data?.data;
        handleClose();
        getAllNotifications();
      }
      toast.success(res?.data.message);

      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const clearSelNotification = async (notification) => {
    try {
      const res = await $axios.put(
        `${$baseURL}/users/users/clearSelNotification/${user?._id}/${notification?.nId}`
      );
      if (res) {
        const data = res?.data?.data;
        handleClose();
        getAllNotifications();
      }
      toast.success(res?.data.message);
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Drawer
      className="max-h-screen overflow-y-auto"
      open={showNotifications}
      onClose={() => {
        setShowNotifications(false);
        readAllNotifications();
      }}
      anchor={"right"}
    >
      <div className="w-[550px]   pb-2  xs:w-screen">
        <div className="flex flex-col sticky top-0 mt-0 right-0 bg-[white] z-[5]  ">
          <div className="flex items-center justify-between   bg-primary-bg px-4  py-2">
            <p className="font-medium text-lg  text-white">Notifications</p>
            <div className="flex space-between">
              {notifications?.length > 0 ? (
                <ToolTip title="Mark all notifications as read">
                  <IconButton
                    onClick={readAllNotifications}
                    className="p-1 outline-none"
                  >
                    <MdOutlineMarkEmailRead
                      style={{ fontSize: "24px", color: "white" }}
                    />
                  </IconButton>
                </ToolTip>
              ) : (
                ""
              )}

              {notifications?.length > 0 ? (
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
                    readAllNotifications();
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
          {notifications?.length > 0 &&
            notifications?.map((d, index) => (
              <div
                className={`flex items-center justify-center shadow-sm my-1 py-1 ${
                  d?.isRead ? "bg-[white]" : "bg-[#d5f4e6]"
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
                        onClick={() => {
                          readSelNotification(selectedNotification);
                        }}
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
                      onClick={() => clearSelNotification(selectedNotification)}
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
          {not?.length === 0 && (
            <div className="flex justify-center items-center w-full font-semibold text-2xl my-80 ">
              No Notifications
            </div>
          )}
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
            className=" bg-[#03045E] hover:bg-[#0e106a] normal-case rounded"
            variant="contained"
            type="submit"
            onClick={clearNotifications}
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Notifications;
