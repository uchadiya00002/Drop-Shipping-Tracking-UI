import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InvoiceTable from "../components/Tables/InvoiceTable";

const invoices = (props) => {
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

  return (
    <div className="w-full bg-[#E5E5E5] xs:min-h-screen grow flex flex-col px-5  ">
      <div className="flex items-center py-5 lg:py-2 text-xl bg-[#E5E5E5] overflow-auto drawer-open reduce-wid  drawer-close smooth fixed z-[3]">
        <span className="text-black font-bold text-2xl">Invoices</span>
        {/* <Button
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
        </Button> */}
      </div>
      <div>
        <InvoiceTable />
      </div>
    </div>
  );
};

export default invoices;
