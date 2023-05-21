import React, { useEffect, useRef, useState } from "react";
import { MenuItem, Button, Menu } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAuth } from "../utils/hooks";
import { useRouter } from "next/router";
import { $windowExists } from "../utils";
import RejectedOrders from "../components/Tables/RejectedOrders";
import RejectedItems from "../components/Tables/RejectedItems";
import { FileDownloadOutlined } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { $axios, $baseURL } from "../components/axios/axios";

const allStatus = [
  {
    value: "Orders",
    label: "Rejections",
  },
  {
    value: "Items",
    label: "Rejected Line Items",
  },
];

const Rejections = (props) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("Orders");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async () => {
    try {
      let payload = {
        status: "REJECTED",
      };
      let response;

      if (type == "Orders") {
        response = await $axios({
          url: `${$baseURL}/purchaseOrder/export`,
          method: "POST",
          data: payload,
          responseType: "blob",
        });
      } else {
        response = await $axios({
          url: `${$baseURL}/purchaseItem/export`,
          method: "POST",
          data: payload,
          responseType: "blob",
        });
      }

      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Rejections.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    } catch (error) {}
  };

  const route = useRouter();
  const { user, fallBack } = useAuth();

  useEffect(async () => {
    if (user) {
    }
  }, [user, type]);

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className="w-full bg-[#E5E5E5] flex xs:min-h-screen grow  flex-col xs:px-2 px-5">
      <div className="flex items-center py-5 lg:py-2  text-xl bg-[#E5E5E5] drawer-open reduce-wid  drawer-close smooth   fixed z-[3] xs:py-9 xs:relative xs:mx-auto xs:px-0  xs:w-full ">
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon style={{ fontSize: "28px" }} />}
          className="text-black font-bold text-lg "
        >
          {type == "Orders" ? "Rejections" : "Rejected Line Items"}
        </Button>
        <Button
          onClick={() => handleExport()}
          className="ml-auto normal-case "
          startIcon={<FileDownloadOutlined />}
          style={{
            background: "#03045E",
            color: "white",
            fontWeight: "600",
            padding: "2px 8px",
          }}
        >
          Export
        </Button>
      </div>
      <div>{type == "Orders" ? <RejectedOrders /> : <RejectedItems />}</div>

      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            setType("Orders");
            handleClose();
          }}
        >
          Rejections
        </MenuItem>
        <MenuItem
          onClick={() => {
            setType("Items");
            handleClose();
          }}
        >
          Rejected Line Items
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Rejections;
