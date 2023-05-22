import React, { useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import PurchaseOrders from "../../components/Tables/PurchaseOrders";

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
            ? "Order History"
            : "Purchase Order For Critical Follow Up"}
        </Button>
        {/* <Button
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
        </Button> */}
      </div>
      <div>
        <PurchaseOrders />
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
