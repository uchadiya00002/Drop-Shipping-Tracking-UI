import React, { useEffect, useState } from "react";
import { MenuItem, Button, Menu } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAuth } from "../utils/hooks";
import { useRouter } from "next/router";
import { $windowExists } from "../utils";
import InvoiceTable from "../components/Tables/InvoiceTable";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AgingReport from "../components/Tables/AgingReport";
import { exportInvoice } from "../store/slices/invoiceSlice";
import { FileDownloadOutlined } from "@mui/icons-material";
import { $axios, $baseURL } from "../components/axios/axios";

const invoices = (props) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("Invoices");
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

  const handleExport = async (poNumber) => {
    try {
      let response = await $axios({
        url: `${$baseURL}/invoice/export`,
        method: "POST",
        // data: payload,
        responseType: "blob",
      });

      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Invoice.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    } catch (error) {}
  };
  useEffect(() => {
    if (user) {
      if (route.query.type) {
        const type = route?.query?.type;
        setType(type);
      }
    }
  }, [user, route]);

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className="w-full bg-[#E5E5E5] xs:min-h-screen grow flex flex-col px-5  ">
      <div className="flex items-center py-5 lg:py-2 text-xl bg-[#E5E5E5] overflow-auto drawer-open reduce-wid  drawer-close smooth fixed z-[3]">
        <span className="text-black font-bold text-2xl">Invoices</span>
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
      <div>
        <InvoiceTable />
      </div>
    </div>
  );
};

export default invoices;
