import {
  ArrowBack,
  ArrowDownward,
  ArrowUpward,
  EditOutlined,
} from "@mui/icons-material";

// import { useEffect, useState } from "react";
import "date-fns";
import { AiOutlineSearch } from "react-icons/ai";
import { Close } from "@mui/icons-material";

import styled from "@emotion/styled";
import { Visibility } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { updateTransactionalDataItems } from "../../store/slices/infoRecordSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { $windowExists, listFromDict } from "../../utils";
import { useEffect } from "react";
import { getItems, itemsSelector } from "../../store/slices/orderSlice";
import TransactionSelDate from "../../components/UI/TransactionSelDate";
import ViewDetails from "../../components/UI/ViewDetails";
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
    value: "PARTIALY CONFIRMED",
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

const listHeadingForSupplierRole = [
  { label: "ORDER", key: "poNumber" },

  { label: "ORDER DATE", key: "orderDate" },
  {
    label: "DESCRIPTION",
  },
  { label: "MATERIAL NUMBER", key: "materialNumber" },
  { label: "DELIVERY DATE", key: "deliveryDate" },
  { label: "BUYER NAME" },
  { label: "BUYER EMAIL" },
  { label: "NEW DELIVERY DATE", key: "newDeliveryDate" },
  {
    label: "STATUS OF NEW DELIVERY DATE",
  },
  {
    label: "STATUS",
  },
  { label: "REASON" },
  {
    label: "ACTIONS",
  },
];

const listHeadings = [
  { label: "ORDER", key: "poNumber" },

  { label: "ORDER DATE", key: "orderDate" },
  {
    label: "DESCRIPTION",
  },

  { label: "MATERIAL NUMBER", key: "materialNumber" },
  { label: "DELIVERY DATE", key: "deliveryDate" },
  { label: "NEW DELIVERY DATE", key: "newDeliveryDate" },
  {
    label: "STATUS OF NEW DELIVERY DATE",
  },
  {
    label: "STATUS",
  },
  { label: "REASON" },
  {
    label: "ACTIONS",
  },
];

const transactionalDataItems = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [editInfo, setEditInfo] = useState(false);
  const [hideReason, setHideReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [statusOfNewDate, setStatusOfNewDate] = useState("");
  const [specType, setSpecType] = useState(route?.query?.type);
  const [reasonType, setReasonType] = useState(route?.query?.reason);
  const [newDate, setNewDate] = useState(new Date());
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    orderDate: 1,
    deliveryDate: 1,
    newDeliveryDate: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [sort, setSort] = useState(1);
  const [selectedHeading, setSelectedHeading] = useState("");
  const [show, setShow] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [showDate, setShowDate] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const ITEM_HEIGHT = 48;
  const open = Boolean(anchorEl);
  const isXs = useMediaQuery("(max-width:1360px)");
  const [selectedOrder, setSelectedOrder] = useState("");
  const items = useSelector(itemsSelector);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(async () => {
    if (route && user) {
      const poNumber = route.query.poNumber;
      setPoNumber(poNumber);
      getItemsOfOrders(poNumber);
    }
  }, [
    user,
    page,
    searchText,
    limit,
    status,
    route,
    dispatch,
    sortKeys,
    route.query.poNumber,
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
        },
        conditions: {
          orderNo: poNumber,
        },
        sort: sort,
      };

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
        payload.conditions = {
          orderNo: poNumber,
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
        setSelectedOrder(res);
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

  const updateTransactions = async (values) => {
    const {
      _id,
      newDeliveryDate,
      statusForNewDeliveryDate,
      newDeliveryDateReason,
    } = values;

    let conditions = {};

    if (_id) {
      conditions._id = _id;
    }
    if (newDeliveryDate) {
      conditions.newDeliveryDate = newDeliveryDate;
    }

    if (statusForNewDeliveryDate) {
      conditions.statusForNewDeliveryDate = statusForNewDeliveryDate;
    }
    if (newDeliveryDateReason) {
      conditions.newDeliveryDateReason = newDeliveryDateReason;
    }

    let payload = conditions;
    try {
      const res = await dispatch(updateTransactionalDataItems(payload));
      if (res) {
        setSelectedId("");
        getItemsOfOrders(poNumber);
        setEditInfo(false);
        setNewDate("");
      }
    } catch (error) {}
  };

  const handleDateChange = async (newValue) => {
    const payload = {
      _id: selectedId,
      newDeliveryDate: moment(newValue).format("DD.MM.YYYY"),
    };
    try {
      if (payload.newDeliveryDate.length == 10) {
        const res = await dispatch(updateTransactionalDataItems(payload));
        if (res) {
          setSelectedId("");
          getItemsOfOrders(poNumber);
          setShow(false);
        }
      }
    } catch (error) {}
  };

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

  const listFields = listFromDict({
    orderNo: { name: "Order ID" },
    itemNo: { name: "Item No" },
    itemOrderDate: { name: "Order Date" },
    itemDescription: { name: "Description" },
    itemDeliveryDate: { name: "Delivery Date" },
    newDeliveryDate: { name: "New Delivery Date" },
    statusForNewDeliveryDate: { name: "Status of New Delivery Date" },
    newDeliveryDateReason: { name: "Reason" },
    status: { name: "Status" },
  });

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    return fallBack;
  }

  return (
    <div
      className="  bg-[#E5E5E5] flex flex-col xs:min-h-screen grow  px-5 "
      // style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="drawer-open reduce-wid  drawer-close smooth   flex py-5 bg-[#E5E5E5]  fixed z-[3] ">
        <div
          className="text-xl mb-4 cursor-pointer "
          onClick={() => route.back()}
        >
          <ArrowBack fontSize="medium" className="mr-2" />
        </div>
        <h1 className="text-xl font-bold ">Transactional Data Items</h1>
      </div>
      <div className="bg-[white] xs:pb-10 mt-16 lg:mt-14 drawer-open reduce-wid  drawer-close smooth  fixed z-[3] ">
        <div className="flex justify-between xs:flex-col  items-center px-2.5 py-1 bg-[white] z-[2]">
          <div className="flex flex-row xs:flex-col my-4 lg:my-3 ml-auto xs:justify-center xs:w-full justify-end items-center  ">
            <div className="xs:w-full xs:mb-2 mr-1 ml-2">
              <CustomSelect
                value={status}
                values={allStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
              />
            </div>
            <div className="ml-1 xs:w-full xs:mx-3">
              <SearchBar
                searchText={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                clear={() => setSearchText("")}
              />
            </div>
            <div className="ml-1 xs:my-3 flex justify-center items-center text-[#65748B]">
              <Pagination
                limit={limit}
                page={page}
                count={items?.count}
                length={items?.data?.length}
                onClick={(val) => setPage(val)}
              />
            </div>
            <div className="ml-1 xs:w-full xs:mx-3">
              <CustomSelect
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
                limit={true}
              />
            </div>
          </div>
        </div>
        <div>
          {!loading && items?.data?.length > 0 ? (
            <div class="overflow-hidden ">
              <TableContainer
                className=" xs:pb-[190px] lg:pb-8"
                sx={{ maxHeight: "calc(100vh - 170px)" }}
                component={Paper}
              >
                <Table
                  stickyHeader={true}
                  className="sticky top-0 "
                  sx={{ minWidth: 700 }}
                  aria-label="customized table"
                >
                  <TableHead className="whitespace-nowrap">
                    {user?.role === "SUPPLIER" ? (
                      <TableRow>
                        {listHeadingForSupplierRole?.map((h, index) => {
                          return (
                            <StyledTableCell
                              style={{
                                padding: isXs ? "5px 10px" : "10px 10px",
                              }}
                              onClick={() => {
                                setSelectedHeading(h);

                                h?.key && handleSort(h?.key);
                              }}
                              className={`${
                                h.key && "whitespace-nowrap cursor-pointer"
                              } 
                              
                              ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                              ${
                                index == 1
                                  ? "z-[10] sticky left-[5rem] lg:left-[3.8rem]"
                                  : ""
                              }
                              `}
                            >
                              <ToolTip title={h.key ? "Sort" : ""}>
                                <div>
                                  {h.label}
                                  {h.key &&
                                  selectedHeading?.label == h?.label ? (
                                    sortKeys[selectedColumnKey] == 1 ? (
                                      <ArrowDownward className="ml-2 text-[#03045E]" />
                                    ) : sortKeys[selectedColumnKey] == -1 ? (
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
                    ) : (
                      <TableRow>
                        {listHeadings?.map((h, index) => {
                          return (
                            <StyledTableCell
                              style={{
                                padding: isXs ? "5px 10px" : "10px 10px",
                              }}
                              onClick={() => {
                                setSelectedHeading(h);

                                h?.key && handleSort(h?.key);
                              }}
                              className={`${
                                h.key && "whitespace-nowrap cursor-pointer"
                              } 
                              
                              ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                              ${
                                index == 1
                                  ? "z-[10] sticky left-[5rem] lg:left-[3.8rem]"
                                  : ""
                              }
                              `}
                            >
                              <ToolTip title={h.key ? "Sort" : ""}>
                                <div>
                                  {h.label}
                                  {h.key &&
                                  selectedHeading?.label == h?.label ? (
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
                    )}
                  </TableHead>

                  <TableBody>
                    {items?.data?.map((item, index) => (
                      <StyledTableRow
                        className="whitespace-nowrap"
                        key={item?._id}
                      >
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          component="th"
                          scope="row"
                          className="z-[5] sticky left-0 bg-[white]"
                        >
                          {item?.orderNo ? item?.orderNo : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          align="left"
                          className="z-[5] sticky left-[5rem] lg:left-[3.8rem] bg-[white]"
                        >
                          {item?.itemOrderDate ? item?.itemOrderDate : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          align="left"
                        >
                          {item?.itemDescription ? item?.itemDescription : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          align="left"
                        >
                          {item?.itemNo ? item?.itemNo : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          align="left"
                        >
                          {item?.oldDeliveryDate ? item?.oldDeliveryDate : "NA"}
                        </StyledTableCell>
                        {user?.role === "SUPPLIER" && (
                          <>
                            <StyledTableCell
                              style={{
                                // minWidth: "150px",
                                padding: isXs ? "4px 10px" : "10px 10px",
                              }}
                              align="left"
                            >
                              {user?.role === "SUPPLIER" &&
                                `${item?.userId?.firstName} ${item?.userId?.lastName}`}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                // minWidth: "150px",
                                padding: isXs ? "4px 10px" : "10px 10px",
                              }}
                              align="left"
                            >
                              {user?.role === "SUPPLIER" && item?.userId?.email}
                            </StyledTableCell>
                          </>
                        )}
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          align="left"
                        >
                          {showDate && selectedId === item?._id
                            ? ""
                            : !show
                            ? item?.newDeliveryDate
                            : selectedId !== item?._id && item?.newDeliveryDate}
                          {user?.role === "BUYER" && show ? (
                            selectedId === item?._id && (
                              <div className="flex justify-start">
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <DesktopDatePicker
                                    onClose={() => {
                                      setShow(false);
                                      setSelectedId(null);
                                    }}
                                    disablePast
                                    InputProps={{
                                      disableUnderline: false,
                                      disabled: true,
                                      readOnly: true,
                                    }}
                                    disableOpenPicker={false}
                                    className="w-44 cursor-pointer mr-4"
                                    inputFormat="dd/MM/yyyy"
                                    value={item?.newDeliveryDate}
                                    onChange={handleDateChange}
                                    onChangeRaw={(e) => e.preventDefault()}
                                    renderInput={(params) => (
                                      <TextField
                                        variant="standard"
                                        className="cursor-none"
                                        disabled={true}
                                        inputProps={{
                                          readOnly: true,
                                          disabled: true,
                                        }}
                                        {...params}
                                      />
                                    )}
                                  />
                                </LocalizationProvider>

                                <span
                                  className=" cursor-pointer text-end my-auto text-lg text-red-500"
                                  onClick={() => {
                                    setSelectedId(null);
                                    setShow(false);
                                    setShowDate(true);
                                  }}
                                >
                                  X
                                </span>
                              </div>
                            )
                          ) : user?.role == "BUYER" &&
                            item?.statusForNewDeliveryDate == "PENDING" &&
                            user?._id == item?.newDeliveryDateModifiedBy ? (
                            <IconButton
                              size="small"
                              className="mr-2"
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShow(!show);
                                setShowDate(!showDate);
                                setSelectedId(item?._id);
                                setSelectedItem(item);
                                setSelectedReason(item?.reason);
                              }}
                            >
                              <EditOutlined className="text-lg m-0.5" />
                            </IconButton>
                          ) : user?.role == "BUYER" &&
                            item?.statusForNewDeliveryDate !== "PENDING" ? (
                            <IconButton
                              size="small"
                              className="mr-2"
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShow(!show);
                                setShowDate(!showDate);
                                setSelectedId(item?._id);
                                setSelectedItem(item);
                                setSelectedReason(item?.reason);
                              }}
                            >
                              <EditOutlined className="text-lg m-0.5" />
                            </IconButton>
                          ) : (
                            user?.role == "BUYER" &&
                            item?.statusForNewDeliveryDate === "PENDING" &&
                            user?._id != item?.newDeliveryDateModifiedBy &&
                            ""
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          align="left"
                        >
                          {item?.statusForNewDeliveryDate === "REJECTED" ? (
                            <span className="text-[#FF1212]">REJECTED</span>
                          ) : item?.statusForNewDeliveryDate === "PENDING" ? (
                            <span className="text-[orange]">FOR APPROVAL</span>
                          ) : item?.statusForNewDeliveryDate === "ACCEPTED" ? (
                            <span className="text-[#3ED331]">ACCEPTED</span>
                          ) : item?.statusForNewDeliveryDate ===
                            "PARTIALLY APPROVED" ? (
                            <span className="text-[orange]">
                              PARTIALLY APPROVED
                            </span>
                          ) : (
                            item?.statusForNewDeliveryDate
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            // minWidth: "150px",
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
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
                          ) : item?.status === "RECEIVED" ? (
                            <span className="text-[#3ED331]">RECEIVED</span>
                          ) : item?.status === "PARTIALLY RECEIVED" ? (
                            <span className="text-[#3ED331]">
                              PARTIALY RECEIVED
                            </span>
                          ) : (
                            item?.status
                          )}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          className="whitespace-nowrap"
                          align="left"
                        >
                          {item?.newDeliveryDateReason
                            ? item?.newDeliveryDateReason
                            : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          style={{
                            padding: isXs ? "4px 10px" : "10px 10px",
                          }}
                          align="left"
                          className="whitespace-nowrap text-[#6B7280]"
                        >
                          {user?.role == "SUPPLIER" ? (
                            <ToolTip title="Edit">
                              <EditOutlined
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHideReason(true);
                                  setEditInfo(true);
                                  setSelectedId(item?._id);
                                  setSelectedReason(
                                    item?.newDeliveryDateReason
                                  );
                                  setNewDate(item?.newDeliveryDate);
                                  setSelectedItem(item);
                                  setStatusOfNewDate(
                                    item?.statusForNewDeliveryDate
                                  );
                                }}
                              />
                            </ToolTip>
                          ) : (
                            item?.statusForNewDeliveryDate == "PENDING" &&
                            user?._id != item?.newDeliveryDateModifiedBy && (
                              <ToolTip title="Edit">
                                <EditOutlined
                                  fontSize="small"
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditInfo(true);
                                    setSelectedId(item?._id);
                                    setHideReason(true);
                                    setSelectedReason(
                                      item?.newDeliveryDateReason
                                    );
                                    setNewDate(item?.newDeliveryDate);
                                    setSelectedItem(item);
                                    setStatusOfNewDate(
                                      item?.statusForNewDeliveryDate
                                    );
                                  }}
                                />
                              </ToolTip>
                            )
                          )}
                          <ToolTip title="View">
                            <Visibility
                              className="text-[#6B7280] cursor-pointer ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPopup(true);
                                setSelectedItem(item);
                              }}
                            />
                          </ToolTip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center my-40">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex justify-center items-center my-36">
              No Records...
            </div>
          )}
        </div>
      </div>

      <TransactionSelDate
        editInfo={editInfo}
        user={user}
        newDate={newDate}
        selectedReason={selectedReason}
        setNewDate={setNewDate}
        setSelectedReason={setSelectedReason}
        updateTransactions={updateTransactions}
        setEditInfo={setEditInfo}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        selectedItem={selectedItem}
        hideReason={hideReason}
        setHideReason={setHideReason}
        statusOfNewDate={statusOfNewDate}
      />

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

export default transactionalDataItems;
