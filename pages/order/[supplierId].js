import React, { useEffect, useRef, useState } from "react";
import {
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
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
import styled from "@emotion/styled";
import { AiOutlineSearch, AiOutlineRight } from "react-icons/ai";
import { BiImport } from "react-icons/bi";
import {
  ArrowBack,
  ArrowDownward,
  ArrowUpward,
  Close,
  FileDownloadOutlined,
  Info,
  Visibility,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import {
  getPurchaseOrder,
  ordersSelector,
} from "../../store/slices/orderSlice";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $date, $windowExists, listFromDict } from "../../utils";
import ViewDetails from "../../components/UI/ViewDetails";
import { $axios, $baseURL } from "../../components/axios/axios";
import ToolTip from "../../components/UI/Tooltip";
import SearchBar from "../../components/UI/SearchBar";
import CustomSelect from "../../components/UI/CustomSelect";

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

const orderBySupplier = (props) => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    orderDate: 1,
    deliveryDate: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [sort, setSort] = useState(1);
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const orders = useSelector(ordersSelector);
  const { supplierName, supplierId } = route.query;

  useEffect(() => {
    if (user) {
      // if (user?.role == "SUPPLIER") {
      //   route.push("/collaborationRoom");
      // }
      // console.log(route.query);
      // const supplierId = route.query.supplierId;
      getOrdersOfSelSupplier();
    }
  }, [user, page, searchText, limit, status, route, supplierId, sortKeys]);

  const getOrdersOfSelSupplier = async () => {
    if (selectedColumnKey != "") {
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      let sort;
      if (selectedColumnKey != "" && sortKeys[selectedColumnKey] != 0) {
        sort = {
          [selectedColumnKey]: sortKeys[selectedColumnKey],
        };
      }

      let payload = {
        pagination: {
          limit: limit,
          page: page,
        },
        conditions: {
          supplierId,
        },
        sort: sort,
      };

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
        payload.conditions = {
          supplierId: supplierId,
        };
      }

      if (status != "ALL") {
        payload.conditions = {
          status: status,
          supplierId: supplierId,
        };
      }

      const res = await dispatch(getPurchaseOrder(payload));
      if (res) {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (columnKey) => {
    setSelectedColumnKey(columnKey);
    handleSortValue();
  };

  const handleSortValue = () => {
    let _sortKeys = { ...sortKeys };

    Object.keys(_sortKeys)?.map((key) => {
      if (selectedColumnKey !== key) {
        _sortKeys[key] = 1;
      }
    });

    switch (sortKeys[selectedColumnKey]) {
      case 1:
        _sortKeys[selectedColumnKey] = -1;
        break;
      case -1:
        _sortKeys[selectedColumnKey] = 0;
        break;
      case 0:
        _sortKeys[selectedColumnKey] = 1;
    }

    setSortKeys(_sortKeys);
  };

  const handleExport = async (supplierId) => {
    try {
      let payload = {
        supplierId: supplierId,
      };

      let response = await $axios({
        url: `${$baseURL}/purchaseOrder/export`,
        method: "POST",
        data: payload,
        responseType: "blob",
      });

      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Suppliers Order.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    } catch (error) {}
  };

  const listHeadings = [
    { label: "ORDER", key: "poNumber" },
    { label: "DATE", key: "orderDate" },
    {
      label: "PO DESCRIPTION",
    },
    { label: "DELIVERY DATE", key: "deliveryDate" },
    {
      label: "STATUS",
    },
    {
      label: "LINE ITEMS",
    },
    {
      label: "FOLLOW UP 1",
    },

    {
      label: "STATUS",
    },
    {
      label: "FOLLOW UP 2",
    },
    {
      label: "STATUS",
    },

    {
      label: "FOLLOW UP 3",
    },

    {
      label: "STATUS",
    },
    {
      label: "ACTIONS",
    },
  ];

  const listFields = listFromDict({
    poNumber: { name: "Order Number" },
    orderDate: { name: "Order Date" },
    supplierId: { name: "Supplier ID" },
    supplierName: { name: "Supplier Name" },
    status: { name: "Status" },
    followUp1: { name: "Follow Up 1", type: "Date" },
    statusForFollowUp1: { name: "Follow Up 1 Status" },
    followUp2: { name: "Follow Up 2", type: "Date" },
    statusForFollowUp2: { name: "Follow Up 2 Status" },
    followUp3: { name: "Follow Up 3", type: "Date" },
    statusForFollowUp3: { name: "Follow Up 3 Status" },
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
      // fontFamily: "Gentium Book Plus",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div
      className="w-full bg-[#E5E5E5] flex flex-col grow px-5 xs:min-h-screen"
      // style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div
        className="flex py-5 lg:py-2 bg-[#E5E5E5] w-full z-[10]  xs:mx-auto xs:px-0 drawer-open reduce-wid  drawer-close smooth lg:mt-1   mt-2 fixed"
        // style={{
        //   width: "calc(100% - 104px)",
        // }}
      >
        <h1 className="text-2xl font-bold lg:text-base  xs:text-3xl">
          Purchase Order
        </h1>
        <Button
          // variant="outlined"
          onClick={() => handleExport(supplierId)}
          className="ml-auto normal-case lg:py-1 lg:text-xs "
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
      <div className=" z-[4]  bg-[white] my-5 lg:mt-12 py-5 lg:py-1 drawer-open reduce-wid  drawer-close smooth    mt-20 xs:mt-24 fixed  w-full right-5  px-2.5   xs:w-full    xs:flex xs:justify-center xs:items-center xs:flex-col  border-[#E5E5E5]">
        <div
          className="text-xl mb-1 lg:mb-1 cursor-pointer lg:text-base flex flex-row items-center "
          onClick={() => route.back()}
        >
          <ArrowBack fontSize="small" />
          <h1 className="font-semibold text-lg xs:text-2xl lg:text-base xs:font-bold ml-4  lg:ml-2">
            Orders
          </h1>
        </div>
        <div>
          <h1 className="font-bold text-2xl lg:text-base pb-1 xs:text-xl xs:font-semibold">
            {supplierName}
          </h1>
          <div className="font-medium  lg:text-xs  lg:pb-1  pb-1.5 mr-2">
            <span className="font-medium lg:text-xs text-lg pb-1 mr-2 text-[#6B7280]">
              Supplier ID
            </span>
            <span>{supplierId}</span>
          </div>
        </div>
      </div>

      <div className="bg-[white]  z-[2]   drawer-open reduce-wid  drawer-close smooth   fixed  mt-60 xs:mt-64 lg:mt-36 ">
        <div
          className={`px-2 py-3 bg-[white] z-[2] lg:py-1     xs:w-full`}
          // style={{
          //   width: "calc(100% - 104px)",
          // }}
        >
          <div className="flex flex-row xs:w-full my-4 lg:my-0 justify-center sticky top-0 items-center xs:flex-col ">
            <h1 className="text-xl lg:text-base font-bold md:mr-3 xs:whitespace-nowrap md:text-xs md:py-1  xs:w-40 xs:mx-auto ">
              Purchase Order
            </h1>
            <div className="ml-auto mr-1 xs:w-full xs:m-1">
              <CustomSelect
                value={status}
                values={allStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
              />
            </div>
            <div className="xs:w-full  xs:m-1 ml-1">
              <SearchBar
                searchText={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                clear={() => setSearchText("")}
              />
            </div>
            <div className="flex justify-center items-center ml-1  xs:m-1 text-[#65748B] xs:w-full  xs:mx-auto ">
              <Pagination
                limit={limit}
                page={page}
                count={orders.count}
                onClick={(val) => setPage(val)}
                length={orders?.data?.length}
              />
            </div>
            <div className="ml-1 xs:w-full xs:m-1">
              <CustomSelect
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
                limit={true}
              />
            </div>
          </div>
        </div>
        {!loading && orders?.data.length > 0 ? (
          <div className="overflow-hidden ">
            <TableContainer
              sx={{ maxHeight: isXs ? 300 : 400 }}
              component={Paper}
              className="lg:pb-[10px]"
            >
              <Table
                stickyHeader={true}
                className="sticky top-0"
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                // className="min-w-full  xs:mt-0"
              >
                <TableHead className="w-full">
                  <TableRow>
                    {listHeadings.map((h, index) => {
                      return (
                        <StyledTableCell
                          onClick={() => {
                            setSelectedHeading(h);

                            h?.key && handleSort(h?.key);
                          }}
                          style={{
                            padding: isXs ? "4px 14px" : "6px 14px",
                          }}
                          className={`
                       ${h.key && "whitespace-nowrap cursor-pointer"} ${
                            index == 0 && "z-[10] sticky left-0 top-0"
                          }
                    whitespace-nowrap
                       ${index == 1 && "z-[10] sticky left-[80px] "} 
                          `}
                          key={index}
                        >
                          <ToolTip title={h.key ? "Sort" : ""}>
                            <div>
                              {h.label}
                              {h.key && selectedHeading?.label == h?.label ? (
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
                                h.key && ""
                              )}
                            </div>
                          </ToolTip>
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody className="w-full relative mt-20">
                  {orders?.data.length > 0 &&
                    orders?.data?.map((orderDetail, idx) => (
                      <StyledTableRow
                        className="cursor-pointer mt-20 whitespace-nowrap "
                        onClick={() =>
                          route.push(`/order/items/${orderDetail?.poNumber}`)
                        }
                      >
                        {/* <StyledTableCell
                          align="left"
                          className="z-[5] sticky left-0 bg-[white]"
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                            minWidth: "109px",
                            maxWidth: "109px",
                          }}
                        >
                          {(page - 1) * limit + idx + 1}
                        </StyledTableCell> */}
                        <StyledTableCell
                          align="left"
                          className="z-[5] sticky  bg-[white] left-0"
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                            minWidth: "80px",
                            maxWidth: "80px",
                          }}
                        >
                          {orderDetail?.poNumber ? orderDetail?.poNumber : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                          className="z-[5] sticky bg-[white] left-[80px]"
                        >
                          {orderDetail?.orderDate
                            ? orderDetail?.orderDate
                            : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                            minWidth: "150px",
                          }}
                          align="left"
                        >
                          {orderDetail?.description
                            ? orderDetail?.description
                            : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                          className={`${
                            orderDetail.isDeliveryDateChanged &&
                            orderDetail.statusForNewDeliveryDate == "ACCEPTED"
                              ? "text-[#3399ff]"
                              : "text-[black]"
                          }`}
                        >
                          {orderDetail?.deliveryDate
                            ? orderDetail?.deliveryDate
                            : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
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
                          ) : (
                            orderDetail?.status.toUpperCase()
                          )}
                          {/* {orderDetail.status
                            ? orderDetail.status.toUpperCase()
                            : "NA"} */}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          onClick={() =>
                            route.push(`/order/items/${orderDetail?.poNumber}`)
                          }
                        >
                          <div className="cursor-pointer underline decoration-blue-700">
                            {orderDetail?.totalItems}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {orderDetail?.followUp1
                            ? $date(orderDetail.followUp1)
                            : ""}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                        >
                          {orderDetail?.statusForFollowUp1 === "DELAYED" ? (
                            <span className="text-[#FF1212]">DELAYED</span>
                          ) : orderDetail?.statusForFollowUp1 === "PENDING" ? (
                            <span className="text-[#FABB71]">PENDING</span>
                          ) : orderDetail?.statusForFollowUp1 ===
                            "COMPLETED" ? (
                            <span className="text-[#3ED331]">COMPLETED</span>
                          ) : (
                            orderDetail?.statusForFollowUp1
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                        >
                          {orderDetail.followUp2
                            ? $date(orderDetail.followUp2)
                            : ""}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                        >
                          {orderDetail?.statusForFollowUp2 === "DELAYED" ? (
                            <span className="text-[#FF1212]">DELAYED</span>
                          ) : orderDetail?.statusForFollowUp2 === "PENDING" ? (
                            <span className="text-[#FABB71]">PENDING</span>
                          ) : orderDetail?.statusForFollowUp2 ===
                            "COMPLETED" ? (
                            <span className="text-[#3ED331]">COMPLETED</span>
                          ) : (
                            orderDetail?.statusForFollowUp2
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                        >
                          {orderDetail.followUp3
                            ? $date(orderDetail.followUp3)
                            : ""}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                        >
                          {orderDetail?.statusForFollowUp3 === "DELAYED" ? (
                            <span className="text-[#FF1212]">DELAYED</span>
                          ) : orderDetail?.statusForFollowUp3 === "PENDING" ? (
                            <span className="text-[#FABB71]">PENDING</span>
                          ) : orderDetail?.statusForFollowUp3 ===
                            "COMPLETED" ? (
                            <span className="text-[#3ED331]">COMPLETED</span>
                          ) : (
                            orderDetail?.statusForFollowUp3
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          className="text-sm whitespace-nowrap"
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
                            <ToolTip title="More Info">
                              <Info
                                fontSize="small"
                                className="text-[#6B7280] ml-2 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  route.push(
                                    `/order/items/${orderDetail?.poNumber}`
                                  );
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

            {!orders?.data.length > 0 && (
              <div className="flex justify-center items-center w-full font-semibold text-lg my-40 ">
                No orders....
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center my-40">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex justify-center items-center my-20">
            No orders...
          </div>
        )}
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

export default orderBySupplier;
