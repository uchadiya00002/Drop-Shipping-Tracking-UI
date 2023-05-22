import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
  tableCellClasses,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Info,
  Visibility,
} from "@mui/icons-material";

import { useRouter } from "next/router";
// import ViewDetails from "../../components/UI/ViewDetails";
import styled from "@emotion/styled";
// import ToolTip from "UI/Tooltip";
// import { listFromDict } from "../../utils";
import ViewDetails from "../components/UI/ViewDetails";
import ToolTip from "../components/UI/Tooltip";
import { listFromDict } from "../utils";
const allStatus = [
  {
    value: "ORDERED",
    label: "ORDERED",
  },
  {
    value: "CONFIRMED",
    label: "CONFIRMED",
  },
  {
    value: "PARTIALLY CONFIRMED",
    label: "PARTIALLY CONFIRMED",
  },

  {
    value: "PARTIALLY REJECTED",
    label: "PARTIALLY REJECTED",
  },
  {
    value: "RECEIVING",
    label: "RECEIVING",
  },
  {
    value: "SHIPPED",
    label: "SHIPPED",
  },
  {
    value: "REJECTED",
    label: "REJECTED",
  },
];

const listHeadings = [
  "name",
  "category",
  "quantity",
  "price",
  "location",
  "supplier",
  "lastUpdated",
  "Actions",
];

const inventoryData = [
  {
    id: 1,
    name: "Product A",
    category: "Electronics",
    quantity: 50,
    price: 100,
    location: "Warehouse 1",
    supplier: "Supplier X",
    lastUpdated: "2023-05-01",
  },
  {
    id: 2,
    name: "Product B",
    category: "Clothing",
    quantity: 100,
    price: 50,
    location: "Warehouse 2",
    supplier: "Supplier Y",
    lastUpdated: "2023-05-02",
  },
  {
    id: 3,
    name: "Product C",
    category: "Home Appliances",
    quantity: 20,
    price: 200,
    location: "Warehouse 1",
    supplier: "Supplier Z",
    lastUpdated: "2023-05-03",
  },
  {
    id: 4,
    name: "Product D",
    category: "Office Supplies",
    quantity: 75,
    price: 10,
    location: "Warehouse 3",
    supplier: "Supplier X",
    lastUpdated: "2023-05-04",
  },
  {
    id: 5,
    name: "Product E",
    category: "Health & Beauty",
    quantity: 30,
    price: 150,
    location: "Warehouse 2",
    supplier: "Supplier Y",
    lastUpdated: "2023-05-05",
  },
  // Add more objects as needed
];

//   console.log(inventoryData);

const Inventory = (props) => {
  const route = useRouter();
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const hiddenFileInput = useRef(null);

  // const orders = useSelector(ordersSelector);
  // console.log(orders);

  const listFields = listFromDict({
    name: { name: "Name" },
    category: { name: "Category" },
    quantity: { name: "Orders Quantity" },
    price: { name: "Price" },
    location: { name: "Location" },
    supplier: { name: "Supplier" },
    lastUpdated: { name: "Last Updated" },
    // description: { name: "Description", type: "remarks" },
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#F3F4F6",
      color: "#121828",
      fontWeight: 600,
      fontFamily: "Roboto",
      fontSize: isXs ? 12 : 16,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: isXs ? 12 : 16,
      fontFamily: "Roboto",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

  return (
    <div className="w-full bg-[#E5E5E5] xs:min-h-screen grow flex flex-col px-5">
      <div className="flex items-center drawer-open reduce-wid  drawer-close smooth py-3 lg:py-2 text-xl bg-[#E5E5E5] w-full fixed z-[3]">
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          // endIcon={<KeyboardArrowDownIcon style={{ fontSize: "28px" }} />}
          className="text-black font-bold text-lg "
        >
          Inventory
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
        <div className="w-full lg:mt-12 mt-16  drawer-open reduce-wid  drawer-close smooth   fixed z-[3]">
          <div className="bg-[white]  ">
            <div class="overflow-auto">
              <TableContainer
                className=" xs:pb-20"
                style={{ maxHeight: "calc(100vh - 170px)" }}
                // sx={{ maxHeight: 460 }}
                component={Paper}
              >
                <Table
                  stickyHeader
                  sx={{ minWidth: 700 }}
                  aria-label="customized table"
                  className="min-w-full sticky top-0 xs:mt-0"
                >
                  <TableHead>
                    <TableRow>
                      {listHeadings?.map((h, index) => {
                        return (
                          <StyledTableCell
                            onClick={() => {
                              setSelectedHeading(h);

                              h?.key && handleSort(h?.key);
                            }}
                            className={`
                       ${h?.label === "CRITICAL PARTS" && "text-center"} ${
                              h?.key && "whitespace-nowrap cursor-pointer"
                            } 
                    whitespace-nowrap
                          
                            `}
                            key={index}
                            style={{
                              padding: isXs ? "6px 14px" : "10px 14px",
                            }}
                          >
                            <ToolTip title={h?.key ? "Sort" : ""}>
                              <div>{h}</div>
                            </ToolTip>
                          </StyledTableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryData?.map((orderDetail, index) => (
                      <StyledTableRow
                        key={orderDetail?.id}
                        className="whitespace-nowrap"
                      >
                        <StyledTableCell
                          className=" bg-[white]"
                          component="th"
                          align="left"
                          scope="row"
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                            maxWidth: "75.2px",
                            minWidth: "75.2px",
                          }}
                        >
                          {orderDetail?.name ? orderDetail?.name : "NA"}
                        </StyledTableCell>

                        <StyledTableCell
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          align="left"
                          className=" bg-[white]"
                        >
                          {orderDetail?.category ? orderDetail?.category : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          align="left"
                        >
                          {orderDetail?.quantity ? orderDetail?.quantity : "NA"}
                        </StyledTableCell>

                        <StyledTableCell
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          align="left"
                        >
                          {orderDetail?.price ? orderDetail?.price : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          align="left"
                        >
                          <div className="cursor-pointer underline decoration-blue-700">
                            {orderDetail?.location
                              ? orderDetail?.location
                              : "NA"}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          className={`${
                            orderDetail?.isDeliveryDateChanged &&
                            orderDetail?.statusForNewDeliveryDate == "ACCEPTED"
                              ? "text-[#3399ff]"
                              : "text-[black]"
                          }`}
                        >
                          {orderDetail?.supplier ? orderDetail?.supplier : ""}
                        </StyledTableCell>

                        <StyledTableCell
                          align="center"
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                        >
                          <div className="cursor-pointer underline decoration-blue-700">
                            {/* {Array.isArray(orderDetail?.totalItems)
                              ? orderDetail?.totalItems.length
                              : orderDetail?.totalItems
                              ? orderDetail?.totalItems
                              : ""} */}
                            {orderDetail?.lastUpdated
                              ? orderDetail?.lastUpdated
                              : ""}
                            {/* {console.log(orderDetail)} */}
                          </div>
                        </StyledTableCell>

                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          className="text-sm  whitespace-nowrap"
                        >
                          <div className="">
                            <ToolTip title="View">
                              <Visibility
                                className="text-[#6B7280] cursor-pointer"
                                fontSize="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenPopup(true);
                                  setSelectedOrder(orderDetail);
                                }}
                              />
                            </ToolTip>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <ViewDetails
            open={openPopup}
            onClose={() => {
              setOpenPopup(false);
              setSelectedOrder(null);
            }}
            focused={selectedOrder}
            listFields={listFields}
          />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
