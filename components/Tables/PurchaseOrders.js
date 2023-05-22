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
import {
  updatePurchaseOrder,
  uploadExcelSheet,
} from "../../store/slices/orderSlice";
import ToggleSwitch from "../../components/Input/ToggleSwitch";
import { useDispatch, useSelector } from "react-redux";
import {
  getPurchaseOrder,
  ordersSelector,
} from "../../store/slices/orderSlice";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../../utils";
import ViewDetails from "../../components/UI/ViewDetails";
import styled from "@emotion/styled";
import ToolTip from "../UI/Tooltip";
import SearchBar from "../UI/SearchBar";
import CustomSelect from "../UI/CustomSelect";
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
  { label: "ORDER", key: "poNumber" },
  { label: "ORDER DATE", key: "orderDate" },
  {
    label: "DESCRIPTION",
  },
  { label: "SUPPLIER ID", key: "supplierId" },
  { label: "SUPPLIER NAME", key: "supplierName" },
  { label: "DELIVERY DATE", key: "deliveryDate" },

  {
    label: "STATUS",
  },
  {
    label: "LINE ITEMS",
  },

  {
    label: "ACTIONS",
  },
];

const PurchaseOrders = (props) => {
  const route = useRouter();
  const [openPopup, setOpenPopup] = useState(false);
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
    poNumber: { name: "Order Number" },
    orderDate: { name: "Order Date" },
    supplierId: { name: "Supplier ID" },
    supplierName: { name: "Supplier Name" },
    status: { name: "Status" },
    description: { name: "Description", type: "remarks" },
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
  const orders = [
    {
      poNumber: "ff",
      orderDate: "ff",
      description: "ff",
      supplierId: "sss",
      supplierName: "sss",
      deliveryDate: "aaa",
      status: "aaa",
      totalItems: "ddd",
    },
    {
      poNumber: "ff",
      orderDate: "ff",
      description: "ff",
      supplierId: "sss",
      supplierName: "sss",
      deliveryDate: "aaa",
      status: "aaa",
      totalItems: "ddd",
    },
    {
      poNumber: "ff",
      orderDate: "ff",
      description: "ff",
      supplierId: "sss",
      supplierName: "sss",
      deliveryDate: "aaa",
      status: "aaa",
      totalItems: "ddd",
    },
    {
      poNumber: "ff",
      orderDate: "ff",
      description: "ff",
      supplierId: "sss",
      supplierName: "sss",
      deliveryDate: "aaa",
      status: "aaa",
      totalItems: "ddd",
    },
    {
      poNumber: "ff",
      orderDate: "ff",
      description: "ff",
      supplierId: "sss",
      supplierName: "sss",
      deliveryDate: "aaa",
      status: "aaa",
      totalItems: "ddd",
    },
    {
      poNumber: "ff",
      orderDate: "ff",
      description: "ff",
      supplierId: "sss",
      supplierName: "sss",
      deliveryDate: "aaa",
      status: "aaa",
      totalItems: "ddd",
    },
    {
      poNumber: "ff",
      orderDate: "ff",
      description: "ff",
      supplierId: "sss",
      supplierName: "sss",
      deliveryDate: "aaa",
      status: "aaa",
      totalItems: "ddd",
    },
  ];

  return (
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
                        } ${index == 0 && "z-[10] sticky left-0 top-0"}
                    whitespace-nowrap
                          ${
                            index == 1
                              ? "z-[10] sticky top-0 left-[75.2px]"
                              : ""
                          }
                            `}
                        key={index}
                        style={{
                          padding: isXs ? "6px 14px" : "10px 14px",
                        }}
                      >
                        <ToolTip title={h?.key ? "Sort" : ""}>
                          <div>
                            {h?.label}
                            {h?.key && selectedHeading?.label == h?.label ? (
                              sortKeys[selectedColumnKey] == -1 ? (
                                <ArrowDownward
                                  fontSize="small"
                                  className="ml-2 text-[#03045E]"
                                />
                              ) : sortKeys[selectedColumnKey] == 1 ? (
                                <ArrowUpward
                                  fontSize="small"
                                  className="ml-2 text-[#03045E]"
                                />
                              ) : (
                                sortKeys[selectedColumnKey] == 0 && ""
                              )
                            ) : (
                              h?.key && ""
                            )}
                          </div>
                        </ToolTip>
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((orderDetail, index) => (
                  <StyledTableRow
                    key={orderDetail?.poNumber}
                    className="whitespace-nowrap"
                  >
                    <StyledTableCell
                      className="z-[5] sticky left-0 bg-[white]"
                      component="th"
                      align="left"
                      scope="row"
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                        maxWidth: "75.2px",
                        minWidth: "75.2px",
                      }}
                    >
                      {orderDetail?.poNumber ? orderDetail?.poNumber : "NA"}
                    </StyledTableCell>

                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                      className="z-[5] sticky left-[75.2px] bg-[white]"
                    >
                      {orderDetail?.orderDate ? orderDetail?.orderDate : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      {orderDetail?.description
                        ? orderDetail?.description
                        : "NA"}
                    </StyledTableCell>

                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      {orderDetail?.supplierId ? orderDetail?.supplierId : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      <div className="cursor-pointer underline decoration-blue-700">
                        {orderDetail?.supplierName
                          ? orderDetail?.supplierName
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
                      {orderDetail?.deliveryDate
                        ? orderDetail?.deliveryDate
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      {orderDetail?.status === "REJECTED" ? (
                        <span className="text-[#FF1212]">REJECTED</span>
                      ) : orderDetail?.status === "CONFIRMED" ? (
                        <span className="text-[#3ED331]">CONFIRMED</span>
                      ) : orderDetail?.status === "ORDERED" ? (
                        <span className="text-[#3ED331]">ORDERED</span>
                      ) : orderDetail?.status === "PARTIALLY REJECTED" ? (
                        <span className="text-[#FF1212]">
                          PARTIALLY REJECTED
                        </span>
                      ) : orderDetail?.status === "PARTIALLY CONFIRMED" ? (
                        <span className="text-[#3ED331]">
                          PARTIALLY CONFIRMED
                        </span>
                      ) : orderDetail?.status === "RECEIVING" ? (
                        <span className="text-[#3ED331]">RECEIVING</span>
                      ) : orderDetail?.status === "PARTIALLY RECEIVED" ? (
                        <span className="text-[#3ED331]">
                          PARTIALLY RECEIVED
                        </span>
                      ) : orderDetail?.status === "SHIPPED" ? (
                        <span className="text-[#90EE90]">SHIPPED</span>
                      ) : orderDetail?.status === "PARTIALLY SHIPPED" ? (
                        <span className="text-[#90EE90]">
                          PARTIALLY SHIPPED
                        </span>
                      ) : (
                        orderDetail?.status?.toUpperCase()
                      )}
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
                        {orderDetail?.totalItems ? orderDetail?.totalItems : ""}
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
  );
};

export default PurchaseOrders;
