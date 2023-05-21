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
    label: "CRITICAL PARTS",
  },
  {
    label: "ACTIONS",
  },
];

const PurchaseOrders = (props) => {
  const route = useRouter();
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [suppId, setSuppId] = useState(route?.query?.supplierId);
  const [delayStatus, setDelayStatus] = useState(route?.query?.delay);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    orderDate: 1,
    supplierName: 1,
    supplierId: 1,
    deliveryDate: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const hiddenFileInput = useRef(null);
  const { user, fallBack } = useAuth();
  const [orders, setOrders] = useState([]);
  // const orders = useSelector(ordersSelector);
  // console.log(orders);
  useEffect(() => {
    if (user) {
      if (route.query.supplierId) {
        const supp = route.query.supplierId;
        setSuppId(supp);
      }
      if (route.query.delay) {
        const delay = route.query.delay;
        setDelayStatus(delay);
      }

      getOrders();
    }
  }, [user, page, searchText, status, limit, route, suppId, sortKeys]);

  const getOrders = async () => {
    if (selectedColumnKey != "") {
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      let payload;

      let sort;
      if (selectedColumnKey != "" && sortKeys[selectedColumnKey] != 0) {
        sort = {
          [selectedColumnKey]: sortKeys[selectedColumnKey],
        };
      }

      if (route?.query?.supplierId) {
        payload = {
          pagination: {
            limit: limit,
            page: page,
          },
          conditions: {
            supplierId: suppId,
          },
          sort: sort,
        };
      } else if (route?.query?.delay == true) {
        payload = {
          pagination: {
            limit: limit,
            page: page,
          },
          conditions: {
            delay: delayStatus,
          },
          sort: sort,
        };
      } else {
        payload = {
          pagination: {
            limit: limit,
            page: page,
          },
          sort: sort,
        };
      }

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
      }

      if (status != "ALL") {
        payload.conditions = {
          status: status,
        };
      }

      const res = await dispatch(getPurchaseOrder(payload));
      if (res) {
        setOrders(res?.data?.data);
        console.log(res?.data?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("content", file);

    try {
      const res = await dispatch(uploadExcelSheet(formData));
      if (res) {
        getOrders();
      }
    } catch (error) {}
  };

  const updateCrticalPart = async (value) => {
    try {
      const { poNumber, criticalParts } = value;

      const payload = {
        poNumber,
        criticalParts: { criticalParts: !criticalParts },
      };

      const res = await dispatch(updatePurchaseOrder(payload));
      if (res.data) {
        getOrders();
      }
    } catch (error) {}
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

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    return fallBack;
  }

  return (
    <div className="w-full lg:mt-12 mt-16  drawer-open reduce-wid  drawer-close smooth   fixed z-[3]">
      <div className="bg-[white]  ">
        <div className=" px-2 py-1 bg-[white] xs:py-9 xs:relative xs:mx-auto xs:px-4  xs:w-full z-[2]">
          <div className="flex flex-row my-1 xs:flex-col justify-between items-center w-full">
            <input
              type="file"
              className="my-8  mx-5  xs:mx-0 "
              ref={hiddenFileInput}
              style={{ display: "none" }}
              onChange={handleChange}
            />

            <Button
              className=" bg-[#03045E] hover:bg-[#0e106a] xs:w-full font-semibold normal-case py-1 rounded mr-auto md:mr-3 overflow-hidden md:p-0.5    xs:mx-auto"
              variant="contained"
              onClick={uploadFile}
            >
              Upload Order
            </Button>
            <div className="flex flex-row  xs:flex-col xs:w-full">
              <div className="mr-1 xs:m-1 ml-2">
                <CustomSelect
                  value={status}
                  values={allStatus}
                  onChange={(e) => setStatus(e.target.value)}
                  className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
                />
              </div>
              <div className="xs:w-full xs:my-1 xs:mx-0 ml-1">
                <SearchBar
                  searchText={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  clear={() => setSearchText("")}
                />
              </div>
              <div className="flex justify-center xs:m-1 items-center ml-1 text-[#65748B] xs:w-full xs:mx-auto xs:mb-4">
                <Pagination
                  limit={limit}
                  page={page}
                  count={orders?.count}
                  onClick={(val) => setPage(val)}
                  length={orders?.data?.length}
                />
              </div>
              <div className="ml-1 xs:m-1">
                <CustomSelect
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
                  limit={true}
                />
              </div>
            </div>
          </div>
        </div>
        {!loading && orders?.data?.length > 0 ? (
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
                  {orders?.data?.length > 0 &&
                    orders?.data?.map((orderDetail, index) => (
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
                          {orderDetail?.orderDate
                            ? orderDetail?.orderDate
                            : "NA"}
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
                          {orderDetail?.supplierId
                            ? orderDetail?.supplierId
                            : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "6px 14px" : "13px 14px",
                          }}
                          align="left"
                          onClick={() =>
                            route.push(
                              `/order/${orderDetail?.supplierId}?supplierName=${orderDetail?.supplierName}`
                            )
                          }
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
                          onClick={() =>
                            route.push(`/order/items/${orderDetail?.poNumber}`)
                          }
                        >
                          <div className="cursor-pointer underline decoration-blue-700">
                            {/* {Array.isArray(orderDetail?.totalItems)
                              ? orderDetail?.totalItems.length
                              : orderDetail?.totalItems
                              ? orderDetail?.totalItems
                              : ""} */}
                            {orderDetail?.totalItems
                              ? orderDetail?.totalItems
                              : ""}
                            {/* {console.log(orderDetail)} */}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: "6px 6px",
                          }}
                          className="text-sm px-2 whitespace-nowrap text-center "
                        >
                          <ToggleSwitch
                            size="small"
                            checked={orderDetail?.criticalParts}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCrticalPart({
                                poNumber: orderDetail?.poNumber,
                                criticalParts: orderDetail?.criticalParts,
                              });
                            }}
                          />
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
                            <ToolTip title="More Info">
                              <Info
                                className="text-[#6B7280] ml-2 cursor-pointer"
                                fontSize="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  route.push(
                                    `/order/${orderDetail?.supplierId}?supplierName=${orderDetail?.supplierName}`
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

            {!orders?.data?.length > 0 && (
              <div className="flex justify-center items-center w-full font-semibold text-lg my-28 ">
                No orders....
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center">
            <div className="my-60">
              <CircularProgress />
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center"
            style={{
              marginTop: "72px",
            }}
          >
            <div className="my-28">No Orders...</div>
          </div>
        )}
      </div>
      {/* {console.log(selectedOrder)} */}
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
