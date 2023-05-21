import React, { useEffect, useRef, useState } from "react";
import {
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Menu,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../../utils";
import CriticalOrders from "../../components/Tables/CriticalOrders";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PurchaseOrders from "../../components/Tables/PurchaseOrders";
import { FileDownloadOutlined } from "@mui/icons-material";
import { exportOrder } from "../../store/slices/orderSlice";
import { $axios, $baseURL } from "../../components/axios/axios";

const allStatus = [
  {
    value: "ORDERED",
    label: "ORDERED",
  },
  {
    value: "Partialy Confirmed",
    label: "PARTIALLY CONFIRMED",
  },
  {
    value: "Partialy Received",
    label: "PARTIALLY RECEIVED",
  },
  {
    value: "Partially Rejected",
    label: "PARTIALLY REJECTED",
  },
  // {
  //   value: "Received",
  //   label: "RECEIVED",
  // },
  {
    value: "Rejected",
    label: "REJECTED",
  },
  {
    value: "orderCanceled",
    label: "ORDER CANCELED",
  },
  {
    value: "orderedWithError",
    label: "ORDERED WITH ERROR",
  },
];
const purchaseOrder = (props) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("Purchase Order");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const route = useRouter();
  const { user, fallBack } = useAuth();

  useEffect(() => {
    if (user) {
      if (route?.query?.type) {
        const type = route?.query?.type;
        setType(type);
      }
    }
  }, [user, route]);

  const handleExport = async (supplierId) => {
    try {
      let payload = {
        criticalParts: true,
      };

      let response;

      if (type != "Purchase Order") {
        response = await $axios({
          url: `${$baseURL}/purchaseOrder/export`,
          method: "POST",
          data: payload,
          responseType: "blob",
        });
      } else {
        response = await $axios({
          url: `${$baseURL}/purchaseOrder/export`,
          method: "POST",
          // data: payload,
          responseType: "blob",
        });
      }

      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Purchase Order.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    } catch (error) {}
  };

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className="w-full bg-[#E5E5E5] xs:min-h-screen grow flex flex-col px-5">
      <div className="flex items-center drawer-open reduce-wid  drawer-close smooth py-3 lg:py-2 text-xl bg-[#E5E5E5] w-full fixed z-[3]">
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
          // endIcon={<KeyboardArrowDownIcon style={{ fontSize: "28px" }} />}
          className="text-black font-bold text-lg "
        >
          {type == "Purchase Order"
            ? "Purchase Order"
            : "Purchase Order For Critical Follow Up"}
        </Button>
        <Button
          onClick={() => handleExport()}
          className="ml-auto normal-case"
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
      <div>
        {type == "Purchase Order" ? <PurchaseOrders /> : <CriticalOrders />}
      </div>

      {/* <Menu
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
            setType("Purchase Order");
            handleClose();
          }}
        >
          Purchase Orders
        </MenuItem>
        <MenuItem
          onClick={() => {
            setType("Critical Order");
            handleClose();
          }}
        >
          Critical Orders
        </MenuItem>
      </Menu> */}
    </div>
  );
};

export default purchaseOrder;
