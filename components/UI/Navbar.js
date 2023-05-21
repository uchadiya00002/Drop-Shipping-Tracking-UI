import {
  Badge,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

import {
  AiFillHome,
  AiFillPrinter,
  AiFillBell,
  AiTwotoneSetting,
  AiOutlineSearch,
} from "react-icons/ai";
import Notifications from "./Notifications";
import SideSection from "./SideSection";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  checkSingleUser,
  logoutUser,
  selectUser,
} from "../../store/slices/authSlice";
import { useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { KeyboardArrowDown, Person } from "@mui/icons-material";
import { useRouter } from "next/router";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenubar, setShowMenubar] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  let user = useSelector(selectUser);
  const [notLength, setNotLength] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfile = () => {
    router.push("/account");
    setAnchorEl(null);
  };

  useEffect(async () => {
    if (user) {
      handleCheckUser();
    }
  }, [user, setNotLength, showNotifications]);

  const handleCheckUser = async () => {
    try {
      const payload = { _id: user?._id };
      const res = await dispatch(checkSingleUser(payload));
      if (res) {
        const userInfo = res?.data?.data;
        const newUser = { ...userInfo };
        const unReadNotificationsCount = newUser?.notificationList?.filter(
          (n) => !n.isRead
        );
        setNotLength(unReadNotificationsCount);
      }
    } catch (error) {}
  };

  return (
    <div className="shadow-lg top-0 right-0 left-0  sticky bg-[white] z-50 duration-100  xs:z-50 xs:duration-500">
      <div className=" flex justify-between mx-auto py-1.5 px-5 shadow">
        <div className="p-1 invisible ">
          <TextField
            size="small"
            type="text"
            id="input-with-icon-textfield"
            label="Search"
            variant="outlined"
            inputProps={{
              style: {
                padding: "6px 0px 8px 6px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AiOutlineSearch style={{ padding: "0px" }} size={20} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="flex justify-center text-lg xl:text-2xl  items-center gap-4 text-[#6B7280] ml-2">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
          >
            {notLength && !!notLength?.length ? (
              <Badge
                badgeContent=" "
                variant="dot"
                overlap="circular"
                color="error"
              >
                <AiFillBell size={20} />
              </Badge>
            ) : (
              <AiFillBell size={20} />
            )}
          </button>
          {showNotifications && (
            <Notifications
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              handleCheckUser={handleCheckUser}
            />
          )}

          <MenuIcon
            className="cursor-pointer  hidden xs:inline-block "
            onClick={() => setShowMenubar(!showMenubar)}
          />

          {showMenubar && (
            <Drawer
              anchor="right"
              open={showMenubar}
              onClose={() => setShowMenubar(false)}
              className="hidden xs:block xs:w-screen md:w-screen xs:absolute "
            >
              <SideSection
                showMenubar={showMenubar}
                setShowMenubar={setShowMenubar}
              />
            </Drawer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
