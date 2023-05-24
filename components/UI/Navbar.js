import { Avatar, Badge, Drawer, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

import { AiFillBell } from "react-icons/ai";
import Notifications from "./Notifications";
import SideSection from "./SideSection";

import { useRouter } from "next/router";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenubar, setShowMenubar] = useState(false);

  const router = useRouter();
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

  return (
    <div className="shadow-lg top-0 right-0 left-0  sticky bg-[white] z-50 duration-100  xs:z-50 xs:duration-500">
      <div className=" flex justify-between items-center mx-auto py-1.5 px-5 shadow">
        <div className="p-1 font-semibold">Welcome Avinash</div>
        <div className="flex justify-center text-lg xl:text-2xl  items-center gap-2 text-[#6B7280] ml-2">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
            }}
          >
            <Badge
              badgeContent=" "
              variant="dot"
              overlap="circular"
              color="error"
            >
              <AiFillBell size={20} />
            </Badge>
          </button>
          <Avatar
            src="/images/itachi.jpg"
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            disableElevation
            onClick={handleClick}
            // endIcon={<KeyboardArrowDownIcon style={{ fontSize: "28px" }} />}
            className="h-8 w-8 cursor-pointer "
          ></Avatar>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            // MenuListProps={{
            //   "aria-labelledby": "basic-button",
            // }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                router.push("/account");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/signin");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
          {showNotifications && (
            <Notifications
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
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
