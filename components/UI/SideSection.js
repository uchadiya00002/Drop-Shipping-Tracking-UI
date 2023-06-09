import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MdDashboard, MdShoppingBag } from "react-icons/md";
import { FaDoorOpen, FaReceipt, FaUserAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { SwapHorizontalCircle } from "@mui/icons-material";

const items = [
  // {
  //   id: 1,
  //   name: "Home",
  //   icon: <AiFillHome />,
  //   route: "/home",
  //   val: "/home",
  // },

  {
    id: 2,
    name: "Dashboard",
    icon: <MdDashboard />,
    route: "/dashboard",
    val: "/dashboard",
  },
  {
    id: 3,
    name: "Orders History",
    icon: <MdShoppingBag />,
    route: "/order/purchaseOrder",
    val: "/order",
  },
  {
    id: 4,
    name: "Payment & Invoice",
    icon: <FaReceipt />,
    route: "/invoices",
    val: "/invoices",
    otherRoute: "/agingReport",
  },

  {
    id: 6,
    name: "Inventory",
    icon: <FaDoorOpen />,
    route: "/inventory",
    val: "/inventory",
    // otherRoute: "/collabRoom",
  },

  // {
  //   id: 9,
  //   name: "Transactional Data",
  //   icon: <SwapHorizontalCircle />,
  //   route: "/transaction",
  //   val: "/transaction",
  // },

  {
    id: 11,
    name: "Profile",
    icon: <FaUserAlt />,
    route: "/account",
    val: "/account",
  },
];

const SideSection = ({
  drawerOpen,
  setDrawerOpen,
  setShowMenubar,
  showMenubar,
}) => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-col bg-primary-bg min-w-fit z-[4] sticky h-screen overflow-hidden left-0 bottom-0 top-0 ${
        showMenubar
          ? "xs:visible xs:opacity-100  xs:z-50 xs:px-5  xs:h-full   "
          : "xs:hidden xs:opacity-0"
      } `}
    >
      <div className="xs:flex xs:justify-between  xs:items-center ">
        {drawerOpen ? (
          <h1
            className={`mt-5 md:mt-3 font-bold md:text-sm text-center text-white xs:text-3xl text-xl `}
          >
            DROP SHIP
          </h1>
        ) : (
          <h1
            className={`mt-5 md:mt-3 font-bold md:text-sm text-center text-white xs:text-3xl text-lg`}
          >
            DS
          </h1>
        )}

        <ClearOutlinedIcon
          fontSize="20"
          className="hidden xs:mt-5  xs:inline xs:cursor-pointer text-white  xs:text-3xl xs:duration-150 "
          onClick={() => {
            setShowMenubar(false);
          }}
        />
      </div>
      <div
        className={`bg-primary-bg h-full overflow-y-auto px-3  duration-300  
        ${drawerOpen ? "w-60 lg:w-52 md:w-48" : "w-16  "}
        ${showMenubar && "xs:w-96"}
        `}
      >
        <IconButton
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="text-[white] w-full xs:hidden "
        >
          {drawerOpen ? (
            <ChevronLeftIcon className=" ml-auto text-[white]" />
          ) : (
            <MenuIcon className="cursor-pointer  mr-2  text-[white]  block " />
          )}
        </IconButton>
        <div
          className={`flex  flex-col   ${
            drawerOpen ? "" : "justify-center items-center  xs:items-start"
          }`}
        >
          {items.map((item) => (
            <div
              className={`flex items-center  xs:flex xs:justify-start text-base md:gap-x-2  gap-x-4 lg:gap-x-2 cursor-pointer pb-2.5 md:pb-1 lg:pb-1 ${
                router.pathname.includes(item.val)
                  ? "text-white"
                  : "text-[#9CAABF]"
              } hover:text-white active:text-white focus:text-white  rounded-md mt-1.5`}
              key={item.id}
              title={item?.name}
              onClick={() => {
                router.push(`${item.route}`);
                showMenubar && setShowMenubar(false);
              }}
            >
              <div className="cursor-pointer text-xl mr-2 block float-left   xs:text-xl  ">
                {item.icon}
              </div>
              <span
                className={` flex-1 duration-200 xs:inline xs:text-xl md:text-xs   ${
                  !drawerOpen && "hidden "
                }  `}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* <p className="text-white text-xs">Logout</p> */}
    </div>
  );
};

export default SideSection;
