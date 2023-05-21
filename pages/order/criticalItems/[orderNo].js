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
import { AiOutlineSearch } from "react-icons/ai";
import {
  Close,
  CalendarMonth,
  ArrowBack,
  Visibility,
  FileDownloadOutlined,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import {
  getItems,
  itemsSelector,
  singlePurchaseOrder,
  updatePurchaseItem,
} from "../../../store/slices/orderSlice";
import ToggleSwitch from "../../../components/Input/ToggleSwitch";
import { useDispatch, useSelector } from "react-redux";
import {
  getPurchaseOrder,
  ordersSelector,
} from "../../../store/slices/orderSlice";
import { useAuth } from "../../../utils/hooks";
import Pagination from "../../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $date, $windowExists, listFromDict } from "../../../utils";
import ViewDetails from "../../../components/UI/ViewDetails";
import { $axios, $baseURL } from "../../../components/axios/axios";
import ToolTip from "../../../components/UI/Tooltip";
import CustomSelect from "../../../components/UI/CustomSelect";
import SearchBar from "../../../components/UI/SearchBar";
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
    value: "PARTIALY CONFIRMED",
    label: "PARTIALLY CONFIRMED",
  },
  // {
  //   value: "PARTIALLY RECEIVED",
  //   label: "PARTIALLY RECEIVED",
  // },
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
  // {
  //   value: "ORDER CANCELED",
  //   label: "ORDER CANCELED",
  // },
  // {
  //   value: "ORDERED WITH ERROR",
  //   label: "ORDERED WITH ERROR",
  // },
];

const criticalItemTrue = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    orderDate: 1,
    itemNo: 1,
    deliveryDate: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [sort, setSort] = useState(1);
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const hiddenFileInput = useRef(null);
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const items = useSelector(itemsSelector);

  const [selectedItem, setSelectedItem] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(async () => {
    if (route && user) {
      // if (user?.role == "SUPPLIER") {
      //   route.push("/collaborationRoom");
      // }
      const poNumber = route.query.orderNo;
      setPoNumber(poNumber);
      getItemsOfOrders(poNumber);
      const res = await dispatch(singlePurchaseOrder(poNumber));
      if (res) {
        setSelectedOrder(res);
      }
    }
  }, [
    user,
    page,
    searchText,
    limit,
    status,
    route,
    route.query.orderNo,
    dispatch,
    sortKeys,
  ]);

  const getItemsOfOrders = async (poNumber) => {
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

          orderNo: poNumber,
          criticalParts: true,
        },

        conditions: {
          orderNo: poNumber,
          criticalParts: true,
        },
        sort: sort,
      };

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
        payload.conditions = {
          orderNo: poNumber,
          criticalParts: true,
        };
      }

      if (status != "ALL") {
        payload.conditions = {
          status: status,
          orderNo: poNumber,
        };
      }
      const res = await dispatch(getItems(payload));
      if (res) {
        getItemsOfOrders(poNumber);
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

  const updateCrticalPartForItem = async ({
    orderNo,
    itemNo,
    criticalParts,
    // poNumber,
  }) => {
    try {
      const payload = {
        orderNo,
        itemNo,
        criticalParts: { criticalParts: !criticalParts },
      };

      const res = await dispatch(updatePurchaseItem(payload));
      if (res?.data) {
        getItemsOfOrders(orderNo);
      }
    } catch (error) {}
  };
  const handleExport = async (orderNo) => {
    try {
      let payload = {
        orderNo: orderNo,
        criticalParts: true,
      };

      let response = await $axios({
        url: `${$baseURL}/purchaseItem/export`,
        method: "POST",
        data: payload,
        responseType: "blob",
      });

      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Critical Items.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    } catch (error) {}
  };

  const listHeadings = [
    { label: "ITEM NO", key: "itemNo" },
    { label: "ORDER NO", key: "poNumber" },
    { label: "ORDER DATE", key: "orderDate" },
    { label: "DELIVERY DATE", key: "deliveryDate" },
    {
      label: "STATUS",
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
      label: "CRITICAL PARTS",
    },
    {
      label: "ACTIONS",
    },
  ];

  const listFields = listFromDict({
    itemNo: { name: "Item Number" },
    orderNo: { name: "Order Number" },
    itemOrderDate: { name: "Order Date" },
    itemDeliveryDate: { name: "Item Deleiver Date" },
    status: { name: "Status" },
    followUp1: { name: "Follow Up 1", type: "Date" },
    followUpStatus1: { name: "Follow Up 1 Status" },
    followUp2: { name: "Follow Up 2", type: "Date" },
    followUpStatus2: { name: "Follow Up 2 Status" },
    followUp3: { name: "Follow Up 3", type: "Date" },
    followUpStatus3: { name: "Follow Up 3 Status" },
    criticalParts: { name: "Critical Parts" },
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
    <div className="w-full bg-[#E5E5E5] flex flex-col xs:min-h-screen grow px-5  z-[2]">
      <div className="flex py-5 bg-[#E5E5E5] lg:py-2  z-[10] drawer-open reduce-wid  drawer-close smooth    mt-2 fixed w-full    xs:w-full">
        <h1 className="text-2xl lg:text-base font-bold xs:text-3xl">
          Critical Purchase Order
        </h1>
        <Button
          // variant="outlined"
          onClick={() => handleExport(poNumber)}
          className="ml-auto normal-case lg:text-xs lg:py-1 "
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

      <div
        className=" z-[4] bg-[white] my-5 py-5 lg:py-2 w-full  px-2.5 drawer-open reduce-wid  drawer-close smooth lg:mt-12   mt-20 fixed      xs:flex xs:justify-center xs:items-center xs:flex-col border-b-[20px] border-[#E5E5E5]"
        // style={{
        //   width: "calc(100% - 104px)",
        // }}
      >
        <div
          className="text-xl mb-4 lg:mb-1 flex flex-row lg:text-base items-center cursor-pointer "
          onClick={() =>
            route.push({
              pathname: "/order/purchaseOrder",
              query: {
                type: "Critical Order",
              },
            })
          }
        >
          <ArrowBack />
          <h1 className="font-bold text-xl lg:text-base">
            {selectedOrder?.supplierName}
          </h1>
        </div>

        <div className="  lg:text-xs pb-1">
          <span className="  mr-2 text-[#6B7280]">Supplier ID</span>
          <span className="font-medium">{selectedOrder?.supplierId}</span>
        </div>

        <div className="  lg:text-xs pb-1">
          <span className="mr-2 text-[#6B7280]">PO Number</span>
          <span className="font-medium">{selectedOrder?.poNumber}</span>
        </div>
        <div className="  lg:text-xs pb-1">
          <span className="  mr-2 text-[#6B7280]">PO Description</span>
          <span className="font-medium">{selectedOrder?.description}</span>
        </div>
        <div className="  lg:text-xs pb-1">
          <span className="mr-2 text-[#6B7280]">
            Placed on <CalendarMonth fontSize="14px" />
          </span>
          <span className="font-medium">{selectedOrder?.orderDate}</span>
        </div>
      </div>

      <div className="bg-[white]    pt-8 lg:pt-9 drawer-open reduce-wid  drawer-close smooth   fixed  mt-64  lg:mt-36 ">
        <div
          className={`px-2.5 py-3 lg:pb-1 bg-[white]  z-[3] flex justify-between   xs:mx-auto xs:px-4  xs:w-full  `}
        >
          <div className="flex flex-row py-2  lg:pt-2 justify-between w-full items-center xs:flex-col  ">
            <h1 className="text-xl font-bold xs:whitespace-nowrap lg:text-base md:mr-3 md:text-xs md:py-1 xs:w-40 xs:mx-auto  ">
              Critical Purchase Items
            </h1>
            <div className="flex flex-row xs:flex-col xs:w-full ">
              <div className="ml-auto mr-1 xs:w-full xs:m-1">
                <CustomSelect
                  value={status}
                  values={allStatus}
                  onChange={(e) => setStatus(e.target.value)}
                  className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
                />
              </div>
              <div className="xs:w-full xs:m-1 ml-1">
                <SearchBar
                  searchText={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  clear={() => setSearchText("")}
                />
              </div>
              <div className="flex justify-center ml-1 items-center text-[#65748B] xs:w-full  xs:mx-auto xs:m-1">
                <Pagination
                  limit={limit}
                  page={page}
                  count={items.count}
                  length={items?.data.length}
                />
              </div>
              <div className="ml-1 ">
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

        {!loading && items?.data.length > 0 ? (
          <div class="overflow-hidden ">
            <TableContainer
              sx={{ maxHeight: isXs ? 300 : 400 }}
              component={Paper}
              className="lg:pb-10"
            >
              <Table
                stickyHeader={true}
                className="sticky top-0"
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                // className="min-w-full mt-24 xs:mt-0  z-[1]"
              >
                <TableHead
                // className="bg-[#F3F4F6] text-left  py-5"
                >
                  <TableRow className="">
                    {listHeadings.map((h, index) => {
                      return (
                        <StyledTableCell
                          style={{
                            padding: isXs ? "6px 14px" : "8px 14px",
                          }}
                          onClick={() => {
                            setSelectedHeading(h);

                            h?.key && handleSort(h?.key);
                          }}
                          className={`
                       ${h.key && "whitespace-nowrap cursor-pointer"}  ${
                            index == 0 && "z-[10] sticky left-0 top-0"
                          }
                whitespace-nowrap
                   ${index == 1 && "z-[10] sticky left-[76.5px] "} ${
                            index == 2 && "z-[10] sticky left-[163.5px] "
                          } `}
                          key={index}
                        >
                          <ToolTip title={h.key ? "Sort" : ""}>
                            <div>
                              {h.label}
                              {h.key && selectedHeading?.label == h?.label ? (
                                sortKeys[selectedColumnKey] == -1 ? (
                                  <ArrowDownward className="ml-2 text-[#03045E]" />
                                ) : sortKeys[selectedColumnKey] == 1 ? (
                                  <ArrowUpward className="ml-2 text-[#03045E]" />
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
                  {items?.data.length > 0 &&
                    items?.data?.map((item, i) => (
                      <StyledTableRow className="whitespace-nowrap">
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                          className="z-[5] sticky left-0 bg-[white]"
                        >
                          {item?.itemNo ? item?.itemNo : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                          className="z-[5] sticky left-[76.5px] bg-[white]"
                        >
                          {item?.orderNo ? item?.orderNo : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                          className="z-[5] sticky left-[163.5px]  bg-[white]"
                        >
                          {item?.itemOrderDate ? item?.itemOrderDate : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                          className={`${
                            item?.isDeliveryDateChanged &&
                            orderDetail.statusForNewDeliveryDate == "ACCEPTED"
                              ? "text-[#3399ff]"
                              : "text-[black]"
                          }`}
                        >
                          {item?.itemDeliveryDate
                            ? item?.itemDeliveryDate
                            : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {item?.status === "REJECTED" ? (
                            <span className="text-[#FF1212]">REJECTED</span>
                          ) : item?.status === "CONFIRMED" ? (
                            <span className="text-[#3ED331]">CONFIRMED</span>
                          ) : item?.status === "ORDERED" ? (
                            <span className="text-[#3ED331]">ORDERED</span>
                          ) : item?.status === "PARTIALLY REJECTED" ? (
                            <span className="text-[#FF1212]">
                              PARTIALLY REJECTED
                            </span>
                          ) : item?.status === "PARTIALY CONFIRMED" ? (
                            <span className="text-[#3ED331]">
                              PARTIALY CONFIRMED
                            </span>
                          ) : item?.status === "RECEIVING" ? (
                            <span className="text-[#3ED331]">RECEIVING</span>
                          ) : item?.status === "PARTIALLY RECEIVED" ? (
                            <span className="text-[#3ED331]">
                              PARTIALY RECEIVED
                            </span>
                          ) : item?.status === "SHIPPED" ? (
                            <span className="text-[#90EE90]">SHIPPED</span>
                          ) : (
                            item?.status.toUpperCase()
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {item?.followUp1 ? $date(item?.followUp1) : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {item?.followUpStatus1 === "DELAYED" ? (
                            <span className="text-[#FF1212]">DELAYED</span>
                          ) : item?.followUpStatus1 === "PENDING" ? (
                            <span className="text-[#FABB71]">PENDING</span>
                          ) : item?.followUpStatus1 === "COMPLETED" ? (
                            <span className="text-[#3ED331]">COMPLETED</span>
                          ) : (
                            item?.followUpStatus1
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {item?.followUp2 ? $date(item?.followUp2) : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {item?.followUpStatus2 === "DELAYED" ? (
                            <span className="text-[#FF1212]">DELAYED</span>
                          ) : item?.followUpStatus2 === "PENDING" ? (
                            <span className="text-[#FABB71]">PENDING</span>
                          ) : item?.followUpStatus2 === "COMPLETED" ? (
                            <span className="text-[#3ED331]">COMPLETED</span>
                          ) : (
                            item?.followUpStatus2
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {item?.followUp3 ? $date(item?.followUp3) : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          align="left"
                        >
                          {item?.followUpStatus3 === "DELAYED" ? (
                            <span className="text-[#FF1212]">DELAYED</span>
                          ) : item?.followUpStatus3 === "PENDING" ? (
                            <span className="text-[#FABB71]">PENDING</span>
                          ) : item?.followUpStatus3 === "COMPLETED" ? (
                            <span className="text-[#3ED331]">COMPLETED</span>
                          ) : (
                            item?.followUpStatus3
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          className="text-sm px-2 whitespace-nowrap text-center "
                        >
                          <ToggleSwitch
                            size="small"
                            checked={item?.criticalParts}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCrticalPartForItem({
                                orderNo: item?.orderNo,
                                itemNo: item?.itemNo,
                                criticalParts: item?.criticalParts,
                              });
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "3px 14px" : "8px 14px",
                          }}
                          className="text-sm "
                        >
                          <div className="ml-4">
                            <Visibility
                              className="text-[#6B7280] cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPopup(true);
                                setSelectedItem(item);
                              }}
                            />
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!items?.data.length > 0 && (
              <div className="flex justify-center items-center w-full font-semibold text-lg my-32 ">
                No Items....
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center my-40">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex justify-center items-center my-28">
            No Items...
          </div>
        )}
      </div>

      <ViewDetails
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          setSelectedItem(null);
        }}
        focused={selectedItem}
        listFields={listFields}
      />
    </div>
  );
};

export default criticalItemTrue;
