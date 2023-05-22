import {
  ArrowDownward,
  ArrowDropDown,
  ArrowDropUp,
  ArrowUpward,
  ClearRounded,
  Close,
  CloseFullscreenRounded,
  DeleteOutlined,
  EditOutlined,
  KeyboardArrowRight,
  Notifications,
  Search,
  ShoppingCartOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  InputAdornment,
  InputLabel,
  // makeStyles,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCriticalOrders,
  fetchFuzzyTypes,
  updateItemForSupp,
} from "../../store/slices/collabSlice";
import {
  getPurchaseOrder,
  ordersSelector,
  updatePurchaseItem,
  updatePurchaseOrder,
} from "../../store/slices/orderSlice";
import Pagination from "../../components/UI/Pagination";
import styled from "@emotion/styled";
import ToolTip from "../UI/Tooltip";
import SearchBar from "../UI/SearchBar";
import CustomSelect from "../UI/CustomSelect";
import moment from "moment";
import Notify from "../Input/Notify";
import { checkSingleUser, updateAccount } from "../../store/slices/authSlice";

const CollabTableForBuyer = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("LAST UPDATED");
  const [searchText, setSearchText] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [count, setCount] = useState(0);
  const [result, setResult] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [sortKeys, setSortKeys] = useState({
    supplierId: 1,
    supplierName: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");
  const [show, setShow] = useState(null);
  const [subRows, setSubRows] = useState([]);
  const [viewItemDetails, setViewItemDetails] = useState(null);
  const { user, fallBack } = useAuth();
  const [name, setName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reasonValue, setReasonValue] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState("");
  const [selectedBuyerId, setSelectedBuyerId] = useState("");
  const [selectedItem, setselectedItem] = useState("");
  const role = useSelector((state) => state.auth?.user?.role);
  const [autoDelete, setAutoDelete] = useState(
    user.autoDeleteReceivedPOsFromCollaboration
  );
  const [showDialog, setShowDialog] = useState(false);
  const [type, setType] = useState(role == "BUYER" ? "supplierId" : "poNumber");
  const [fuzzyOptions, setFuzzyOptions] = useState([]);
  const [filter, setFilter] = useState(null);
  const [showSearch, setShowSearch] = useState("");
  const [selectedForDelete, setSelectedForDelete] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const orders = useSelector(ordersSelector);
  const open = Boolean(anchorEl);
  const isXs = useMediaQuery("(max-width:1360px)");
  const todaysDate = new Date();
  useEffect(async () => {
    if (user) {
      getResults();
      // getList()
    }
  }, [user, page, searchText, limit, status, route, sortKeys, filter]);

  useEffect(async () => {
    if (user) {
      getList(type);
      handleCheckUser();
      // setAutoDelete(user?.autoDeleteReceivedPOsFromCollaboration);
    }
  }, [user]);

  const getResults = async () => {
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
        // conditions: {
        //   status: "SHIPPED",
        // },
        sort: sort,
      };
      let condition = {};
      if (status != "LAST UPDATED") {
        condition.type = status;
      }

      if (filter) {
        condition[type] = filter;
      }

      payload.conditions = condition;
      if (searchText.length > 0) {
        payload.searchTerm = searchText;
      }

      const res = await dispatch(fetchCriticalOrders(payload));
      if (res) {
        setResult(res?.data?.data);
        setCount(res?.data?.data?.count);
        setShow(null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getList = async (value) => {
    try {
      let payload = {};
      let condition = {};
      condition.type = value;
      payload.conditions = condition;

      const res = await dispatch(fetchFuzzyTypes(payload));
      if (res) {
        setFuzzyOptions(res.data.data);
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

  useEffect(() => {
    if (route && user) {
      if (!selectedSupplier == "") {
        getOrdersOfSelSupplier(selectedSupplier);
      }
    }
  }, [user, route, selectedSupplier, searchOrder]);

  const getOrdersOfSelSupplier = async (supplier) => {
    setLoading(true);
    try {
      let payload = {
        pagination: {
          limit: 100,
          page: page,
          supplierId: selectedSupplier,
          criticalParts: true,
        },
        conditions: {
          supplierId: selectedSupplier,
          criticalParts: true,
        },
      };

      if (searchOrder.length > 0) {
        payload.searchTerm = searchOrder;
        payload.conditions = {
          supplierId: selectedSupplier,
          criticalParts: true,
        };
      }

      if (status != "ALL") {
        payload.conditions = {
          status: status,
          supplierId: selectedSupplier,
          criticalParts: true,
        };
      }

      const res = await dispatch(getPurchaseOrder(payload));
      if (res) {
        getOrdersOfSelSupplier(selectedSupplier);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#F3F4F6",
      color: "#121828",
      fontWeight: 600,
      fontFamily: "Roboto",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: isXs ? 12 : 16,
      fontFamily: "Roboto",
      padding: "6px 10px",
    },
  }));

  const useStyles = makeStyles({
    input: {
      // height: 10,
      // padding: 0,
      // replace with your desired height
    },
  });

  const classes = useStyles();
  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

  const listHeadings = [
    { label: "Supplier ID", key: "supplierId" },
    {
      label: role == "SUPPLIER" ? "Buyer Name" : "Supplier Name",
      key: "supplierName",
    },
    { label: "PO Number" },
    { label: "PO Description" },
    { label: "PO Status" },
    { label: "Delivery Due In" },
    { label: "Line Items" },
    { label: "Last Update On" },
  ];

  if (role == "BUYER") {
    listHeadings.splice(8, 0, { label: "Actions" });
  }

  // if (show) {
  listHeadings.push(
    { label: "Line-Item Number" },
    { label: "Line-Item Status" },
    { label: "Line-Item Description" },
    { label: "Delivery Date" },
    { label: "Updates" },
    { label: "Actions" }
  );
  // }

  let allStatus = [
    { label: "PO Number", value: "poNumber" },
    { label: "Status", value: "status" },
    { label: "Material Number", value: "Material Number" },
    { label: "Material Description", value: "Material Description" },
    { label: "Delivery Due In", value: "Due In" },
  ];

  if (role == "BUYER") {
    allStatus.unshift(
      { label: "Supplier Id", value: "supplierId" },
      { label: "Supplier Name", value: "supplierName" }
    );
  }

  const removeOrderFromCollab = async ({ poNumber }) => {
    try {
      const payload = {
        poNumber,
        criticalParts: { criticalParts: false },
      };
      const res = await dispatch(updatePurchaseOrder(payload));
      if (res) {
        getResults();
        setSelectedForDelete(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeItemFromCollab = async ({ orderNo, itemNo }) => {
    try {
      const payload = {
        orderNo,
        itemNo,
        criticalParts: { criticalParts: false },
      };
      const res = await dispatch(updatePurchaseItem(payload));
      if (res) {
        setShow(null);
        setSelectedForDelete(null);
        getResults();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateItemStatus = async ({ poNumber, itemNo, info }) => {
    try {
      const payload = {
        poNumber,
        itemNo,
        info,
      };

      const res = await dispatch(updateItemForSupp(payload));
      if (res) {
        getResults();
        setReasonValue("");
        setShowPopup(false);
        setName("");
      }
    } catch (error) {
      setShowPopup(false);
    } finally {
      setLoading(false);
    }
  };

  const updateAutoDeleteStatus = async (values) => {
    try {
      let payload = {
        autoDeleteReceivedPOsFromCollaboration: !autoDelete,
      };
      console.log(payload);
      const res = await dispatch(updateAccount(payload, user._id));
      if (res.data) {
        handleCheckUser();
      }
    } catch (error) {}
  };

  const handleCheckUser = async () => {
    try {
      const payload = { _id: user?._id };
      const res = await dispatch(checkSingleUser(payload));
      if (res) {
        const userInfo = res?.data?.data;
        setAutoDelete(userInfo.autoDeleteReceivedPOsFromCollaboration);
      }
    } catch (error) {
    } finally {
    }
  };

  return (
    <>
      <div className="bg-[white] mt-14 drawer-open reduce-wid  drawer-close smooth   fixed z-[3]">
        <div className="flex ml-auto justify-end xs:flex-col items-center px-2.5  bg-[white]">
          <div>
            <div
              className={`flex xs:w-full items-center ${
                role == "BUYER" && "mr-2"
              } xs:mt-5 text-base`}
            >
              <CustomSelect
                value={type}
                values={allStatus}
                fuzzy
                placeholder="Select"
                onChange={(e) => {
                  setType(e.target.value);
                  getList(e.target.value);
                }}
                notAll
                className="md:w-32 lg:w-32 xl:w-32 2xl:w-32 w-full bg-[red]"
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={fuzzyOptions}
                size="small"
                sx={{
                  display: "inline-block",
                  "& input": {
                    width: 200,
                    border: "1px solid #abb6c9",
                    borderLeft: "none",
                    borderRadius: "1px",
                    padding: "4.3px 4px",
                    outline: "2px solid transparent",
                    outlineOffset: "2px",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    borderTopRightRadius: "4px",
                    borderBottomRightRadius: "4px",
                  },
                }}
                onChange={(e, value) => {
                  setFilter(value);
                  setShowSearch(value);
                }}
                onInputChange={(e) => {
                  setShowSearch(e.target.value);
                }}
                renderInput={(params) => (
                  <div className="flex relative" ref={params.InputProps.ref}>
                    {/* <div className="absolute inset-y-0 text-[#6a7487] rights */}
                    <input type="Search" label="auto" {...params.inputProps} />
                    {!showSearch?.length > 0 && (
                      <div className="absolute inset-y-0 text-[#abb6c9] text-xs right-2 flex items-center">
                        <Search
                          className="cursor-pointer"
                          fontSize="small"
                          color="#6a7487"
                        />
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row xs:flex-col xs:w-full py-3 justify-center items-center  ">
            {role == "BUYER" && (
              <div className="xs:w-full xs:mx-5">
                <CustomSelect
                  label="Auto Delete Received PO"
                  labelId="test-select-label"
                  value={autoDelete}
                  values={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  onChange={(e) => {
                    setAutoDelete(e.target.value);
                    updateAutoDeleteStatus();
                  }}
                  className="md:w-32 lg:w-32 xl:w-32 2xl:w-32 w-full  bg-[red]"
                  notAll
                />
              </div>
            )}
            <div className="ml-2 xs:w-full xs:m-2">
              <CustomSelect
                value={status}
                notAll
                values={[
                  { label: "Latest Updates", value: "LAST UPDATED" },
                  { label: "Delayed", value: "DELAYED" },
                  { label: "Shipped", value: "SHIPPED" },
                ]}
                onChange={(e) => setStatus(e.target.value)}
                className="md:w-36 lg:w-36 xl:w-36 2xl:w-32 w-full bg-[red]"
              />
            </div>

            <div className="flex justify-center  items-center mx-1 text-[#65748B] xs:w-full  xs:mx-auto xs:m-2">
              <Pagination
                limit={limit}
                page={page}
                count={count}
                onClick={(val) => setPage(val)}
                length={result?.data?.length}
              />
            </div>
            <div className="xs:mx-5 xs:w-full">
              <CustomSelect
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
                limit={true}
              />
            </div>
          </div>
        </div>
        <div class=" ">
          {!loading && result?.data?.length > 0 ? (
            <div class="">
              <TableContainer
                className=" xs:pb-[190px]"
                sx={{ maxHeight: "calc(100vh - 170px)" }}
                component={Paper}
              >
                <Table
                  stickyHeader={true}
                  className="sticky top-0"
                  sx={{ minWidth: 700 }}
                  aria-label="customized table"
                >
                  <TableHead className="">
                    <TableRow>
                      {listHeadings.map((h, index) => {
                        return (
                          <StyledTableCell
                            onClick={() => {
                              setSelectedHeading(h);
                              h?.key && handleSort(h?.key);
                            }}
                            className={`${
                              h.key && "whitespace-nowrap cursor-pointer"
                            }
                                whitespace-nowrap
                                ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                                ${index == 1 && "z-[10] sticky left-[5.9rem]"}
                              
                                `}
                            style={{
                              padding: isXs ? "6px 12px" : "10px 14px",
                              maxWidth:
                                h.label == "Line-Item Number" && "130px",
                            }}
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
                  <TableBody>
                    {result?.data?.map((row) => {
                      let dueIn = row.deliveryDueIn;
                      let background = "bg-[green]";
                      let text = "text-white";
                      if (dueIn == "DELAYED") {
                        background = "bg-[red]";
                        text = "text-white";
                      } else if (dueIn == "+30D") {
                        background = "bg-[green]";
                        text = "text-white";
                      } else if (dueIn == "15-30D") {
                        background = "bg-[#ecd7ae]";
                        text = "text-black";
                      } else if (dueIn == "7-14D") {
                        background = "bg-[#e9a31b]";
                        text = "text-white";
                      } else if (dueIn == "7D") {
                        background = "bg-[#F17B33]";
                        text = "text-white";
                      }
                      let item = row?.items && row?.items[0];
                      const materialAvailabilityStatus = item?.reason.find(
                        (r) => r.name == "Material Availability"
                      )?.status;
                      const processingStatus = item?.reason.find(
                        (r) => r.name == "Processing"
                      )?.status;
                      const prepToDispatchStatus = item?.reason.find(
                        (r) => r.name == "Prepare to dispatch"
                      )?.status;
                      const shippedAndReceivedtatus = item?.status;

                      return (
                        <React.Fragment key={row.id}>
                          <StyledTableRow>
                            <StyledTableCell className="sticky left-0 top-0 z-[5] bg-[white]">
                              {row?.supplierId ? row?.supplierId : "NA"}
                            </StyledTableCell>
                            <StyledTableCell className="sticky left-[5.9rem] top-0 z-[5] bg-[white]">
                              {role == "SUPPLIER"
                                ? row?.userId?.firstName +
                                  " " +
                                  row?.userId?.lastName
                                : row?.supplierName}
                            </StyledTableCell>
                            <StyledTableCell>{row?.poNumber}</StyledTableCell>
                            <StyledTableCell style={{ minWidth: "150px" }}>
                              {row?.description ? row?.description : "NA"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <div
                                className={`
                                  ${
                                    row?.status == "RECEIVED"
                                      ? "bg-received"
                                      : row?.status == "PARTIALLY RECEIVED"
                                      ? "bg-part-received"
                                      : row?.status == "REJECTED"
                                      ? "bg-rejected"
                                      : row?.status == "PARTIALLY REJECTED"
                                      ? "bg-part-rejected"
                                      : row?.status == "PARTIALLY SHIPPED"
                                      ? "bg-part-shipped"
                                      : row?.status == "SHIPPED"
                                      ? "bg-shipped"
                                      : row?.status == "SERVICED"
                                      ? "bg-[#FF8C00]"
                                      : // : row?.status == "ORDERED"
                                      // ? "bg-[#FEDC56]"
                                      row?.status == "PARTIALLY SERVICED"
                                      ? "bg-[#FEDC56]"
                                      : ""
                                  } 
                                  ${
                                    row?.status == "RECEIVED"
                                      ? "text-white"
                                      : row?.status == "PARTIALLY RECEIVED"
                                      ? "text-white"
                                      : row?.status == "REJECTED"
                                      ? "text-white"
                                      : row?.status == "PARTIALLY REJECTED"
                                      ? "text-white"
                                      : row?.status == "PARTIALLY SHIPPED"
                                      ? "text-black"
                                      : row?.status == "SHIPPED"
                                      ? "text-black"
                                      : // : row?.status == "CONFIRMED"
                                      // ? "text-white"
                                      row?.status == "SERVICED"
                                      ? "text-white"
                                      : row?.status == "PARTIALLY SERVICED"
                                      ? "text-[#333333]"
                                      : "text-black"
                                  } 
                                
                                  px-2 py-1.5 rounded text-center  w-[136px] font-[400]`}
                              >
                                {row.status ? row?.status : "NA"}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div
                                className={`${background} ${text}
                                  px-2 py-1.5 rounded text-center lg:w-24 w-28  font-[400]`}
                              >
                                {row?.deliveryDueIn ? row?.deliveryDate : "NA"}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row?.items ? row?.items?.length : ""}
                            </StyledTableCell>
                            <StyledTableCell style={{ minWidth: "150px" }}>
                              {row?.newDeliveryDateModifiedAt
                                ? moment(row?.newDeliveryDateModifiedAt).format(
                                    "DD.MM.YYYY hh:mm A"
                                  )
                                : ""}
                            </StyledTableCell>
                            {role == "BUYER" && (
                              <StyledTableCell>
                                <div className="flex justify-between text-[#6B7280]">
                                  {/* <div
                                  className={`${
                                    show && "mr-1.5"
                                  } cursor-pointer`}
                                >
                                  <ToolTip
                                    title={`${
                                      show == row?._id
                                        ? "Hide Details"
                                        : "See Details"
                                    }`}
                                  >
                                    {show != row?._id ? (
                                      <Visibility
                                        fontSize="small"
                                        onClick={() => {
                                          let data = row.items.slice(1);
                                          if (!show) {
                                            setSubRows(data);
                                            setShow(row._id);
                                          } else if (show && show != row._id) {
                                            setSubRows(data);
                                            setShow(row._id);
                                          } else {
                                            setShow(null);
                                          }
                                        }}
                                      />
                                    ) : (
                                      <VisibilityOff
                                        fontSize="small"
                                        onClick={() => {
                                          setShow(null);
                                        }}
                                      />
                                    )}
                                  </ToolTip>
                                </div> */}
                                  {role == "BUYER" && (
                                    <div
                                      className={`${
                                        show && "mr-1.5"
                                      } cursor-pointer`}
                                    >
                                      <ToolTip title="Expedite">
                                        <Notifications
                                          fontSize="small"
                                          onClick={() => {
                                            setShowDialog(true);
                                            setSelectedPoNumber(row.poNumber);
                                          }}
                                        />
                                      </ToolTip>
                                    </div>
                                  )}
                                  {role == "BUYER" && (
                                    <div className="cursor-pointer">
                                      <ToolTip title="Remove Purchase Order">
                                        <DeleteOutlined
                                          fontSize="small"
                                          onClick={() => {
                                            setSelectedForDelete(row);
                                            // removeOrderFromCollab({
                                            //   poNumber: row?.poNumber,
                                            // });
                                          }}
                                        />
                                      </ToolTip>
                                    </div>
                                  )}
                                </div>
                              </StyledTableCell>
                            )}
                            {/* {show == row?._id ? ( */}
                            <StyledTableCell
                              align="center"
                              // style={{
                              //   fontSize: isXs ? 12 : 16,
                              //   fontFamily: "Roboto",
                              //   padding: "6px 15px 6px 48px",
                              // }}
                            >
                              <div className="flex">
                                <div className="pl-5 flex items-center">
                                  {row?.items?.[0]?.itemNo}{" "}
                                  {/* {console.log(row?.items?.[0]?.status)} */}
                                </div>

                                {/* <ToolTip
                                    title={`${
                                      show == row?._id
                                        ? "Hide Details"
                                        : "See Details"
                                    }`}
                                  > */}
                                {row.items.length > 1 && (
                                  <div>
                                    {!show ? (
                                      <ArrowDropUp
                                        fontSize="small"
                                        className="cursor-pointer"
                                        onClick={() => {
                                          let data = row.items.slice(1);
                                          if (!show) {
                                            setSubRows(data);
                                            setShow(row._id);
                                          } else if (show && show != row._id) {
                                            setSubRows(data);
                                            setShow(row._id);
                                          } else {
                                            setShow(null);
                                          }
                                        }}
                                      />
                                    ) : (
                                      <ArrowDropDown
                                        fontSize="small"
                                        className="cursor-pointer"
                                        onClick={() => {
                                          setShow(null);
                                        }}
                                      />
                                    )}
                                  </div>
                                )}
                                {/* </ToolTip> */}
                              </div>
                            </StyledTableCell>
                            {/* ) : (
                              show && <StyledTableCell />
                            )} */}
                            {/* {show == row?._id ? ( */}

                            <StyledTableCell>
                              <div
                                className={`
                                
                                ${
                                  row?.items?.[0]?.status == "RECEIVED"
                                    ? "bg-received"
                                    : row?.items?.[0]?.status ==
                                      "PARTIALLY RECEIVED"
                                    ? "bg-part-received"
                                    : row?.items?.[0]?.status == "REJECTED"
                                    ? "bg-rejected"
                                    : row?.items?.[0]?.status ==
                                      "PARTIALLY REJECTED"
                                    ? "bg-part-rejected"
                                    : row?.items?.[0]?.status ==
                                      "PARTIALLY SHIPPED"
                                    ? "bg-part-shipped"
                                    : row?.items?.[0]?.status == "SHIPPED"
                                    ? "bg-shipped"
                                    : row?.items?.[0]?.status == "SERVICED"
                                    ? "bg-[#FF8C00]"
                                    : // : row?.items?.[0]?.status == "ORDERED"
                                    // ? "bg-[#FEDC56]"
                                    row?.items?.[0]?.status ==
                                      "PARTIALLY SERVICED"
                                    ? "bg-[#FEDC56]"
                                    : ""
                                } 
                                ${
                                  row?.items?.[0]?.status == "RECEIVED"
                                    ? "text-white"
                                    : row?.items?.[0]?.status ==
                                      "PARTIALLY RECEIVED"
                                    ? "text-white"
                                    : row?.items?.[0]?.status == "REJECTED"
                                    ? "text-white"
                                    : row?.items?.[0]?.status ==
                                      "PARTIALLY REJECTED"
                                    ? "text-white"
                                    : row?.items?.[0]?.status ==
                                      "PARTIALLY SHIPPED"
                                    ? "text-black"
                                    : row?.items?.[0]?.status == "SHIPPED"
                                    ? "text-black"
                                    : // : row?.items?.[0]?.status == "CONFIRMED"
                                    // ? "text-white"
                                    row?.items?.[0]?.status == "SERVICED"
                                    ? "text-white"
                                    : row?.items?.[0]?.status ==
                                      "PARTIALLY SERVICED"
                                    ? "text-[#333333]"
                                    : "text-black"
                                } 
                               
                                  px-2 py-1.5 rounded text-center w-[136px] font-[400]`}
                              >
                                {row?.items?.[0]?.status}{" "}
                                {/* {row.status ? row?.status : "NA"} */}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              {row?.items?.[0]?.itemDescription}
                            </StyledTableCell>
                            {/* ) : (
                              show && <StyledTableCell />
                            )} */}
                            {/* {show == row?._id ? ( */}
                            <StyledTableCell>
                              {row?.items?.[0]?.newDeliveryDate.length > 0 &&
                              row?.items?.[0]?.statusForNewDeliveryDate ==
                                "ACCEPTED"
                                ? row?.items?.[0]?.newDeliveryDate
                                : row?.items?.[0]?.oldDeliveryDate}
                            </StyledTableCell>
                            {/* ) : (
                              show && <StyledTableCell />
                            )} */}
                            {/* {show == row?._id ? ( */}
                            <StyledTableCell>
                              <div className="flex w-20">
                                <ToolTip title="Material Availability">
                                  <div
                                    className={`border border-black p-2.5 w-4
                                    ${
                                      role == "SUPPLIER" &&
                                      materialAvailabilityStatus !=
                                        "Available" &&
                                      !(
                                        shippedAndReceivedtatus == "SHIPPED" ||
                                        shippedAndReceivedtatus == "RECEIVED"
                                      ) &&
                                      "cursor-pointer"
                                    } 
                                    ${
                                      materialAvailabilityStatus ==
                                        "Available" ||
                                      shippedAndReceivedtatus == "SHIPPED" ||
                                      shippedAndReceivedtatus == "RECEIVED"
                                        ? "bg-[green]"
                                        : materialAvailabilityStatus ==
                                          "Shortage"
                                        ? "bg-[orange]"
                                        : materialAvailabilityStatus == "Issue"
                                        ? "bg-[red]"
                                        : "bg-[white]"
                                    }`}
                                    onClick={() => {
                                      if (
                                        materialAvailabilityStatus !=
                                          "Available" &&
                                        shippedAndReceivedtatus != "SHIPPED" &&
                                        shippedAndReceivedtatus != "RECEIVED"
                                      ) {
                                        setSelectedPoNumber(row.poNumber);
                                        setselectedItem(item.itemNo);
                                        setSelectedBuyerId(
                                          row?.items?.[0]?.userId?._id
                                        );
                                        setName("Material Availability");
                                        setStatuses([
                                          "Available",
                                          "Shortage",
                                          "Issue",
                                        ]);
                                        setShowPopup(
                                          materialAvailabilityStatus !=
                                            "Available"
                                        );
                                      }
                                    }}
                                  ></div>
                                </ToolTip>
                                <ToolTip title="Processing">
                                  <div
                                    className={`border border-black p-2.5 w-4
                                    ${
                                      role == "SUPPLIER" &&
                                      materialAvailabilityStatus ==
                                        "Available" &&
                                      processingStatus != "Complete" &&
                                      "cursor-pointer"
                                    }
                                    ${
                                      processingStatus == "Complete" ||
                                      shippedAndReceivedtatus == "SHIPPED" ||
                                      shippedAndReceivedtatus == "RECEIVED"
                                        ? "bg-[green]"
                                        : processingStatus == "In Progress"
                                        ? "bg-[orange]"
                                        : processingStatus == "Issue"
                                        ? "bg-[red]"
                                        : "bg-[white]"
                                    }`}
                                    onClick={() => {
                                      setSelectedPoNumber(row.poNumber);
                                      setselectedItem(item.itemNo);
                                      setSelectedBuyerId(
                                        row?.items?.[0]?.userId?._id
                                      );
                                      setStatuses([
                                        "Complete",
                                        "In Progress",
                                        "Issue",
                                      ]);
                                      setName("Processing");
                                      setShowPopup(
                                        materialAvailabilityStatus ==
                                          "Available" &&
                                          processingStatus != "Complete"
                                      );
                                    }}
                                  ></div>
                                </ToolTip>
                                <ToolTip title="Prepare to dispatch">
                                  <div
                                    className={`border border-black p-2.5 w-4
                                    ${
                                      role == "SUPPLIER" &&
                                      materialAvailabilityStatus ==
                                        "Available" &&
                                      processingStatus == "Complete" &&
                                      prepToDispatchStatus != "Dispatched" &&
                                      "cursor-pointer"
                                    }
                                    ${
                                      prepToDispatchStatus == "Dispatched" ||
                                      shippedAndReceivedtatus == "SHIPPED" ||
                                      shippedAndReceivedtatus == "RECEIVED"
                                        ? "bg-[green]"
                                        : prepToDispatchStatus == "In Progress"
                                        ? "bg-[orange]"
                                        : prepToDispatchStatus == "Delay"
                                        ? "bg-[red]"
                                        : "bg-[white]"
                                    }`}
                                    onClick={() => {
                                      setSelectedPoNumber(row.poNumber);
                                      setselectedItem(item.itemNo);
                                      setSelectedBuyerId(
                                        row?.items?.[0]?.userId?._id
                                      );
                                      setStatuses([
                                        "Dispatched",
                                        "In Progress",
                                        "Delay",
                                      ]);
                                      setName("Prepare to dispatch");
                                      setShowPopup(
                                        processingStatus == "Complete" &&
                                          prepToDispatchStatus != "Dispatched"
                                      );
                                    }}
                                  ></div>
                                </ToolTip>
                                <ToolTip title="Shipped">
                                  <div
                                    className={`border border-black p-2.5 w-4
                                    ${
                                      role == "SUPPLIER" &&
                                      materialAvailabilityStatus ==
                                        "Available" &&
                                      processingStatus == "Complete" &&
                                      prepToDispatchStatus == "Dispatched" &&
                                      "cursor-pointer"
                                    }
                                    ${
                                      shippedAndReceivedtatus == "SHIPPED" ||
                                      shippedAndReceivedtatus == "RECEIVED"
                                        ? "bg-[green]"
                                        : "bg-[white]"
                                    }`}
                                    onClick={() => {
                                      setSelectedPoNumber(row.poNumber);
                                      setselectedItem(item.itemNo);
                                      setSelectedBuyerId(
                                        row?.items?.[0]?.userId?._id
                                      );
                                      setStatuses(["Shipped"]);
                                      setName("Shipped");
                                      setSelectedStatus("Shipped");
                                      setShowPopup(
                                        prepToDispatchStatus == "Dispatched"
                                      );
                                    }}
                                  ></div>
                                </ToolTip>
                              </div>
                            </StyledTableCell>
                            {/* ) : (
                              show && <StyledTableCell />
                            )} */}
                            {/* {show == row?._id ? ( */}
                            <StyledTableCell>
                              <div className="flex justify-between text-[#6B7280]">
                                <div className="mr-2 cursor-pointer">
                                  <ToolTip title="See Details">
                                    <Visibility
                                      fontSize="small"
                                      onClick={() => {
                                        setViewItemDetails(item);
                                      }}
                                    />
                                  </ToolTip>
                                </div>
                                {role == "BUYER" && (
                                  <div className="cursor-pointer">
                                    <ToolTip title="Remove Line-Item">
                                      <DeleteOutlined
                                        fontSize="small"
                                        onClick={() => {
                                          setSelectedForDelete(row.items[0]);
                                          // removeItemFromCollab({
                                          //   orderNo: row.poNumber,
                                          //   itemNo: row.items[0].itemNo,
                                          // });
                                        }}
                                      />
                                    </ToolTip>
                                  </div>
                                )}
                              </div>
                            </StyledTableCell>
                            {/* ) : (
                              show && <StyledTableCell />
                            )} */}
                          </StyledTableRow>
                          {show == row?._id &&
                            subRows.map((subRow) => {
                              const materialAvailabilityStatus =
                                subRow?.reason.find(
                                  (r) => r.name == "Material Availability"
                                )?.status;
                              const processingStatus = subRow?.reason.find(
                                (r) => r.name == "Processing"
                              )?.status;
                              const prepToDispatchStatus = subRow?.reason.find(
                                (r) => r.name == "Prepare to dispatch"
                              )?.status;
                              const shippedAndReceivedtatus = subRow?.status;
                              return (
                                <StyledTableRow>
                                  <StyledTableCell />
                                  <StyledTableCell />
                                  <StyledTableCell />
                                  <StyledTableCell />
                                  <StyledTableCell />
                                  <StyledTableCell />
                                  <StyledTableCell />
                                  {role == "BUYER" && <StyledTableCell />}
                                  <StyledTableCell />
                                  <StyledTableCell align="center">
                                    <div>
                                      {subRow?.itemNo ? subRow?.itemNo : "NA"}
                                    </div>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <div
                                      className={`
                                      
                                      ${
                                        subRow?.status == "RECEIVED"
                                          ? "bg-received"
                                          : subRow?.status ==
                                            "PARTIALLY RECEIVED"
                                          ? "bg-part-received"
                                          : subRow?.status == "REJECTED"
                                          ? "bg-rejected"
                                          : subRow?.status ==
                                            "PARTIALLY REJECTED"
                                          ? "bg-part-rejected"
                                          : subRow?.status ==
                                            "PARTIALLY SHIPPED"
                                          ? "bg-part-shipped"
                                          : subRow?.status == "SHIPPED"
                                          ? "bg-shipped"
                                          : subRow?.status == "SERVICED"
                                          ? "bg-[#FF8C00]"
                                          : // : subRow?.status == "ORDERED"
                                          // ? "bg-[#FEDC56]"
                                          subRow?.status == "PARTIALLY SERVICED"
                                          ? "bg-[#FEDC56]"
                                          : ""
                                      } 
                                      ${
                                        subRow?.status == "RECEIVED"
                                          ? "text-white"
                                          : subRow?.status ==
                                            "PARTIALLY RECEIVED"
                                          ? "text-white"
                                          : subRow?.status == "REJECTED"
                                          ? "text-white"
                                          : subRow?.status ==
                                            "PARTIALLY REJECTED"
                                          ? "text-white"
                                          : subRow?.status ==
                                            "PARTIALLY SHIPPED"
                                          ? "text-black"
                                          : subRow?.status == "SHIPPED"
                                          ? "text-black"
                                          : // : subRow?.status == "CONFIRMED"
                                          // ? "text-white"
                                          subRow?.status == "SERVICED"
                                          ? "text-white"
                                          : subRow?.status ==
                                            "PARTIALLY SERVICED"
                                          ? "text-[#333333]"
                                          : "text-black"
                                      } 
                                    
                                        px-2 py-1.5 rounded text-center w-[136px] font-[400]`}
                                    >
                                      {subRow?.status}{" "}
                                      {/* {row.status ? row?.status : "NA"} */}
                                    </div>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {subRow?.itemDescription
                                      ? subRow?.itemDescription
                                      : "NA"}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {subRow?.newDeliveryDate?.length > 0 &&
                                    subRow?.statusForNewDeliveryDate ==
                                      "ACCEPTED"
                                      ? subRow?.newDeliveryDate
                                      : subRow?.oldDeliveryDate}
                                  </StyledTableCell>
                                  {show == row?._id ? (
                                    <StyledTableCell>
                                      <div className="flex w-20">
                                        <ToolTip title="Material Availability">
                                          <div
                                            className={`border border-black p-2.5 w-4
                                            ${
                                              role == "SUPPLIER" &&
                                              materialAvailabilityStatus !=
                                                "Available" &&
                                              "cursor-pointer"
                                            } 
                                            ${
                                              materialAvailabilityStatus ==
                                                "Available" ||
                                              shippedAndReceivedtatus ==
                                                "SHIPPED" ||
                                              shippedAndReceivedtatus ==
                                                "RECEIVED"
                                                ? "bg-[green]"
                                                : materialAvailabilityStatus ==
                                                  "Shortage"
                                                ? "bg-[orange]"
                                                : materialAvailabilityStatus ==
                                                  "Issue"
                                                ? "bg-[red]"
                                                : "bg-[white]"
                                            }`}
                                            onClick={() => {
                                              setSelectedPoNumber(
                                                subRow.orderNo
                                              );
                                              setselectedItem(subRow.itemNo);
                                              setSelectedBuyerId(
                                                subRow?.userId?._id
                                              );
                                              setName("Material Availability");
                                              setStatuses([
                                                "Available",
                                                "Shortage",
                                                "Issue",
                                              ]);
                                              setShowPopup(
                                                materialAvailabilityStatus !=
                                                  "Available"
                                              );
                                            }}
                                          ></div>
                                        </ToolTip>
                                        <ToolTip title="Processing">
                                          <div
                                            className={`border border-black p-2.5 w-4
                                            ${
                                              role == "SUPPLIER" &&
                                              materialAvailabilityStatus ==
                                                "Available" &&
                                              processingStatus != "Complete" &&
                                              "cursor-pointer"
                                            }
                                            ${
                                              processingStatus == "Complete" ||
                                              shippedAndReceivedtatus ==
                                                "SHIPPED" ||
                                              shippedAndReceivedtatus ==
                                                "RECEIVED"
                                                ? "bg-[green]"
                                                : processingStatus ==
                                                  "In Progress"
                                                ? "bg-[orange]"
                                                : processingStatus == "Issue"
                                                ? "bg-[red]"
                                                : "bg-[white]"
                                            }`}
                                            onClick={() => {
                                              setSelectedPoNumber(
                                                subRow.orderNo
                                              );
                                              setselectedItem(subRow.itemNo);
                                              setSelectedBuyerId(
                                                subRow?.userId?._id
                                              );
                                              setStatuses([
                                                "Complete",
                                                "In Progress",
                                                "Issue",
                                              ]);
                                              setName("Processing");
                                              setShowPopup(
                                                materialAvailabilityStatus ==
                                                  "Available" &&
                                                  processingStatus != "Complete"
                                              );
                                            }}
                                          ></div>
                                        </ToolTip>
                                        <ToolTip title="Prepare to dispatch">
                                          <div
                                            className={`border border-black p-2.5 w-4
                                          ${
                                            role == "SUPPLIER" &&
                                            materialAvailabilityStatus ==
                                              "Available" &&
                                            processingStatus == "Complete" &&
                                            prepToDispatchStatus !=
                                              "Dispatched" &&
                                            "cursor-pointer"
                                          }
                                          ${
                                            prepToDispatchStatus ==
                                              "Dispatched" ||
                                            shippedAndReceivedtatus ==
                                              "SHIPPED" ||
                                            shippedAndReceivedtatus ==
                                              "RECEIVED"
                                              ? "bg-[green]"
                                              : prepToDispatchStatus ==
                                                "In Progress"
                                              ? "bg-[orange]"
                                              : prepToDispatchStatus == "Delay"
                                              ? "bg-[red]"
                                              : "bg-[white]"
                                          }`}
                                            onClick={() => {
                                              setSelectedPoNumber(
                                                subRow.orderNo
                                              );
                                              setselectedItem(subRow.itemNo);
                                              setSelectedBuyerId(
                                                subRow?.userId?._id
                                              );
                                              setStatuses([
                                                "Dispatched",
                                                "In Progress",
                                                "Delay",
                                              ]);
                                              setName("Prepare to dispatch");
                                              setShowPopup(
                                                processingStatus ==
                                                  "Complete" &&
                                                  prepToDispatchStatus !=
                                                    "Dispatched"
                                              );
                                            }}
                                          ></div>
                                        </ToolTip>
                                        <ToolTip title="Shipped">
                                          <div
                                            className={`border border-black p-2.5 w-4
                                            ${
                                              role == "SUPPLIER" &&
                                              materialAvailabilityStatus ==
                                                "Available" &&
                                              processingStatus == "Complete" &&
                                              prepToDispatchStatus ==
                                                "Dispatched" &&
                                              "cursor-pointer"
                                            }
                                            ${
                                              shippedAndReceivedtatus ==
                                                "SHIPPED" ||
                                              shippedAndReceivedtatus ==
                                                "RECEIVED"
                                                ? "bg-[green]"
                                                : "bg-[white]"
                                            }`}
                                            onClick={() => {
                                              setSelectedPoNumber(
                                                subRow.orderNo
                                              );
                                              setselectedItem(subRow.itemNo);
                                              setSelectedBuyerId(
                                                subRow?.userId?._id
                                              );
                                              setStatuses(["Shipped"]);
                                              setName("Shipped");
                                              setSelectedStatus("Shipped");
                                              setShowPopup(
                                                prepToDispatchStatus ==
                                                  "Dispatched"
                                              );
                                            }}
                                          ></div>
                                        </ToolTip>
                                      </div>
                                    </StyledTableCell>
                                  ) : (
                                    show && <StyledTableCell />
                                  )}
                                  <StyledTableCell>
                                    <div className="flex justify-between text-[#6B7280]">
                                      <div className="mr-2 cursor-pointer">
                                        <ToolTip title="See Details">
                                          <Visibility
                                            fontSize="small"
                                            onClick={() => {
                                              setViewItemDetails(subRow);
                                            }}
                                          />
                                        </ToolTip>
                                      </div>
                                      {role == "BUYER" && (
                                        <div className="cursor-pointer">
                                          <ToolTip title="Remove Line-Item">
                                            <DeleteOutlined
                                              fontSize="small"
                                              onClick={() => {
                                                setSelectedForDelete(subRow);
                                                // removeItemFromCollab({
                                                //   orderNo: subRow.orderNo,
                                                //   itemNo: subRow.itemNo,
                                                // });
                                              }}
                                            />
                                          </ToolTip>
                                        </div>
                                      )}
                                    </div>
                                  </StyledTableCell>
                                </StyledTableRow>
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center">
              <div className="my-56">
                <CircularProgress />
              </div>
            </div>
          ) : (
            <div
              className="flex justify-center items-center"
              // style={{
              //   marginTop: "80px",
              // }}
            >
              <div className="my-32">No Records...</div>
            </div>
          )}
        </div>
      </div>
      {
        <Dialog
          open={openPopup}
          onClose={() => {
            setSelectedSupplier(null);
            setOpenPopup(false);
          }}
          className="m-1 w-full"
        >
          <DialogContent>
            <div
              className={`w-[520px] lg:w-[400px] lg:h-[300px] lg:py-1 bg-[white] rounded-sm mr-2 h-[380px]  py-2
         `}
            >
              <div className=" mx-1 flex justify-between items-center mb-2">
                <h2 className="text-xl  font-bold ">Critical Orders</h2>
                <ToolTip title="Close">
                  <ClearRounded
                    fontSize="20"
                    className="text-gray-400 text-lg cursor-pointer normal-case rounded-lg "
                    onClick={() => {
                      setOpenPopup(false);
                      setSelectedSupplier(null);
                    }}
                  />
                </ToolTip>
              </div>

              <div className="mx-1 flex justify-center relative flex-col">
                <TextField
                  size="small"
                  className=" w-full mr-4  mb-1 sticky"
                  type="text"
                  id="input-with-icon-textfield"
                  label="Search"
                  variant="outlined"
                  value={searchOrder}
                  onChange={(e) => {
                    setSearchOrder(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Toggle password visibility">
                          {searchText?.length > 0 ? (
                            <Close onClick={() => setSearchOrder("")} />
                          ) : (
                            <AiOutlineSearch />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div>
                  {/* widget  */}
                  {!loading ? (
                    orders?.data?.map((d, idx) => {
                      const date =
                        d?.deliveryDate && d?.deliveryDate.split(".");
                      const year = date && date[2];
                      const month = date && date[1] - 1;
                      const day = date && date[0];
                      const needBy = new Date(year, month, day);

                      return (
                        <div
                          key={d?.id}
                          className="flex items-center  justify-center mt-1 cursor-pointer shadow-sm"
                          onClick={() => {
                            route.push({
                              pathname: `collaborationRoom/${d?.poNumber}`,
                            });
                          }}
                        >
                          <div className=" pb-5 mt-1 mr-auto top-0 ml-1 md:ml-5">
                            <ShoppingCartOutlined />
                          </div>
                          <div className="flex flex-col  bg-white text-black w-5/6">
                            <div className="flex justify-between  px-2 ">
                              <p className="text-sm lg:text-xs font-bold mr-2">
                                {d?.poNumber}
                              </p>
                            </div>
                            <div
                              className={`py-2 lg:py-0.5  mx-2 bg-white text-xs lg:text-[10px] text-left pl-0 font-medium
                                  flex justify-between   px-4
                              `}
                            >
                              <p>
                                Item No: {d?.totalItems ? d?.totalItems : "NA"}
                              </p>

                              {needBy < todaysDate ? (
                                <span className="text-[#FF1212] text-xs lg:text-[10px] py-0.5">
                                  DELAYED
                                </span>
                              ) : (
                                <p className="text-xs lg:text-[10px] py-0.5">
                                  {d?.status === "REJECTED" ? (
                                    <span className="text-[#FF1212]">
                                      REJECTED
                                    </span>
                                  ) : d?.status === "CONFIRMED" ? (
                                    <span className="text-[#3ED331]">
                                      CONFIRMED
                                    </span>
                                  ) : d?.status === "ORDERED" ? (
                                    <span className="text-[#3ED331]">
                                      ORDERED
                                    </span>
                                  ) : d?.status === "PARTIALLY REJECTED" ? (
                                    <span className="text-[#FF1212]">
                                      PARTIALLY REJECTED
                                    </span>
                                  ) : d?.status === "PARTIALY CONFIRMED" ? (
                                    <span className="text-[#3ED331]">
                                      PARTIALY CONFIRMED
                                    </span>
                                  ) : d?.status === "RECEIVED" ? (
                                    <span className="text-[#3ED331]">
                                      RECEIVED
                                    </span>
                                  ) : d?.status === "PARTIALLY RECEIVED" ? (
                                    <span className="text-[#3ED331]">
                                      PARTIALY RECEIVED
                                    </span>
                                  ) : d?.status === "SHIPPED" ? (
                                    <span className="text-[#90EE90]">
                                      SHIPPED
                                    </span>
                                  ) : (
                                    d?.status.toUpperCase()
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <ToolTip title="Show Details">
                              <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? "long-menu" : undefined}
                                aria-expanded={open ? "true" : undefined}
                                aria-haspopup="true"
                                onClick={(e) => {}}
                              >
                                <KeyboardArrowRight className="text-lg ml-auto " />
                              </IconButton>
                            </ToolTip>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex justify-center items-center w-full h-full ">
                      <CircularProgress />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
      <Drawer
        anchor="right"
        open={!!viewItemDetails}
        onClose={() => setViewItemDetails(null)}
        PaperProps={{
          sx: { width: "60%" },
        }}
      >
        <DialogContent style={{ padding: "16px" }}>
          <div>
            <div className="text-xl font-bold mb-2">Item Details</div>
            <div>
              <div>
                <span className="text-sm font-semibold">
                  Line-Item Material Number :
                </span>{" "}
                <span className="text-sm font-bold">
                  {viewItemDetails?.itemNo ? viewItemDetails?.itemNo : "NA"}
                </span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold">
                  Line-Item Delivery Date :
                </span>{" "}
                <span className="text-sm font-bold">
                  {viewItemDetails?.newDeliveryDate.length > 0 &&
                  viewItemDetails?.statusForNewDeliveryDate == "ACCEPTED"
                    ? viewItemDetails?.newDeliveryDate
                    : viewItemDetails?.oldDeliveryDate}
                </span>
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-sm font-semibold mb-1">
                  Description :{" "}
                </span>
                <span className="text-xs font-bold">
                  {viewItemDetails?.itemDescription
                    ? viewItemDetails?.itemDescription
                    : "NA"}
                </span>
              </div>
            </div>
            <div>
              <Table className="border">
                <TableHead>
                  {[
                    "Material Availability",
                    "Processing",
                    "Prepare To Dispatch",
                    "Shipped",
                  ].map((h) => (
                    <TableCell className="border border-black bg-[#F3F4F6] p-1.5">
                      {h}
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {/* {viewItemDetails?.reason.map((r,i) => {
                    return <React.Fragment> */}
                  <TableRow>
                    <TableCell
                      style={{
                        verticalAlign: "top",
                        // padding: viewItemDetails?.reason.find((r) => r.name == "Material Availability")?.value && "6px"
                      }}
                      className="border border-black w-[25%] p-2"
                    >
                      {viewItemDetails?.reason.find(
                        (r) => r.name == "Material Availability"
                      )?.value && (
                        <div className=" h-full pb-auto">
                          <div className="flex mb-2">
                            <div
                              className={`w-5 h-5 rounded-full mr-2 border border-[#6298e3]
                          ${
                            viewItemDetails?.reason.find(
                              (r) => r.name == "Material Availability"
                            )?.status == "Available"
                              ? "bg-[green]"
                              : viewItemDetails?.reason.find(
                                  (r) => r.name == "Material Availability"
                                )?.status == "Shortage"
                              ? "bg-[orange]"
                              : viewItemDetails?.reason.find(
                                  (r) => r.name == "Material Availability"
                                )?.status == "Issue"
                              ? "bg-[red]"
                              : "bg-[white]"
                          }`}
                            ></div>
                            <div>
                              {
                                viewItemDetails?.reason.find(
                                  (r) => r.name == "Material Availability"
                                )?.status
                              }
                            </div>
                          </div>
                          <div>
                            {
                              viewItemDetails?.reason.find(
                                (r) => r.name == "Material Availability"
                              )?.value
                            }
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      className="border border-black w-[25%] p-2"
                      style={{
                        verticalAlign: "top",
                        // padding: viewItemDetails?.reason.find((r) => r.name == "Processing")?.value && "2px"
                      }}
                    >
                      {viewItemDetails?.reason.find(
                        (r) => r.name == "Processing"
                      )?.value && (
                        <div className="h-full">
                          <div className="flex mb-2">
                            <div
                              className={`w-5 h-5 rounded-full mr-2 border border-[#6298e3]
                                ${
                                  viewItemDetails?.reason.find(
                                    (r) => r.name == "Processing"
                                  )?.status == "Complete"
                                    ? "bg-[green]"
                                    : viewItemDetails?.reason.find(
                                        (r) => r.name == "Processing"
                                      )?.status == "In Progress"
                                    ? "bg-[orange]"
                                    : viewItemDetails?.reason.find(
                                        (r) => r.name == "Processing"
                                      )?.status == "Issue"
                                    ? "bg-[red]"
                                    : "bg-[white]"
                                }`}
                            ></div>
                            <div>
                              {
                                viewItemDetails?.reason.find(
                                  (r) => r.name == "Processing"
                                )?.status
                              }
                            </div>
                          </div>
                          <div>
                            {
                              viewItemDetails?.reason.find(
                                (r) => r.name == "Processing"
                              )?.value
                            }
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        verticalAlign: "top",
                        // padding: viewItemDetails?.reason.find((r) => r.name == "Prepare to dispatch")?.value && "2px"
                      }}
                      className="border border-black w-[25%] p-2"
                    >
                      {viewItemDetails?.reason.find(
                        (r) => r.name == "Prepare to dispatch"
                      )?.status && (
                        <div className="h-full">
                          <div className="flex mb-2">
                            <div
                              className={`w-5 h-5 rounded-full mr-2 border border-[#6298e3]
                                  ${
                                    viewItemDetails?.reason.find(
                                      (r) => r.name == "Prepare to dispatch"
                                    )?.status == "Dispatched"
                                      ? "bg-[green]"
                                      : viewItemDetails?.reason.find(
                                          (r) => r.name == "Prepare to dispatch"
                                        )?.status == "In Progress"
                                      ? "bg-[orange]"
                                      : viewItemDetails?.reason.find(
                                          (r) => r.name == "Prepare to dispatch"
                                        )?.status == "Delay"
                                      ? "bg-[red]"
                                      : "bg-[white]"
                                  }`}
                            ></div>
                            <div>
                              {
                                viewItemDetails?.reason.find(
                                  (r) => r.name == "Prepare to dispatch"
                                )?.status
                              }
                            </div>
                          </div>
                          <div>
                            {
                              viewItemDetails?.reason.find(
                                (r) => r.name == "Prepare to dispatch"
                              )?.value
                            }
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        verticalAlign: "top",
                        // padding: viewItemDetails?.reason.find((r) => r.name != "Shipped")?.value && "16px"
                      }}
                      className="border border-black w-[25%] p-2"
                    >
                      {viewItemDetails?.reason.find((r) => r.name == "Shipped")
                        ?.value && (
                        <div className="h-full">
                          <div className="flex mb-2">
                            <div
                              className={`w-5 h-5 rounded-full mr-2 border border-[#6298e3]
                                  ${
                                    viewItemDetails?.reason.find(
                                      (r) => r.name == "Shipped"
                                    )?.status == "Shipped"
                                      ? "bg-[green]"
                                      : "bg-[white]"
                                  }`}
                            ></div>
                            <div>
                              {
                                viewItemDetails?.reason.find(
                                  (r) => r.name == "Shipped"
                                )?.status
                              }
                            </div>
                          </div>
                          <div>
                            {
                              viewItemDetails?.reason.find(
                                (r) => r.name == "Shipped"
                              )?.value
                            }
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  {/* </React.Fragment> 
                  })} */}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Drawer>

      {role == "SUPPLIER" && showPopup && (
        <Dialog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          className="p-2 m-2 xs:w-full"
        >
          <div className="text-lg font-bold border-b-gray-700 px-4 pt-2">
            {name} Reason
          </div>
          <DialogContent className="px-4 py-1.5">
            <div className="flex flex-col w-96">
              {name != "Shipped" && (
                <div className="mb-2">
                  <span className="font-bold text-sm">Status*</span>
                  <CustomSelect
                    value={selectedStatus}
                    notAll
                    onlyOption
                    values={statuses}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-[red]"
                  />
                  {/* <TextField
                  // id="outlined-select-currency"
                  select
                  fullWidth
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map((option) => (
                    <MenuItem className=" " key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField> */}
                </div>
              )}
              <TextField
                id="outlined-multiline-static"
                label="Reason"
                value={reasonValue}
                onChange={(e) => setReasonValue(e.target.value)}
                multiline
                rows={5}
                inputProps={{ maxLength: 100 }}
                helperText={
                  <div className="flex justify-end">
                    {reasonValue.length}/100
                  </div>
                }
              />
            </div>
            {/* <label className="font-semibold text-base">
              <Checkbox
                className=" "
                color="primary"
                // size="small"
                label="ddd"
                checked={updateAll}
                onClick={() => {
                  setUpdateAll(!updateAll);
                }}
              />
              Update this detail for all Items*
            </label> */}
          </DialogContent>
          <DialogActions className="pr-4 mb-2">
            <Button
              style={{
                padding: "3px 16px 3px 16px",
              }}
              className=" bg-gray-400 text-black normal-case rounded"
              // variant="contained"
              type="submit"
              onClick={() => {
                setShowPopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                padding: "3px 16px 3px 16px",
              }}
              className=" bg-primary-bg hover:bg-primary-bg normal-case rounded"
              variant="contained"
              disabled={reasonValue === ""}
              type="submit"
              onClick={() => {
                let data = {
                  poNumber: selectedPoNumber,
                  itemNo: selectedItem,
                  info: {
                    buyerUserId: selectedBuyerId,
                    reason: [
                      {
                        name: name,
                        status: selectedStatus,
                        value: reasonValue,
                      },
                    ],
                  },
                };

                updateItemStatus(data);
                setShowPopup(false);
                setReasonValue("");
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={!!selectedForDelete}
        onClose={() => setSelectedForDelete(null)}
      >
        <DialogContent className="px-5 pt-4 pb-3">
          <div className="w-full">
            Are you sure want to remove
            {selectedForDelete?.poNumber ? (
              <span>
                {" "}
                Order{" "}
                <span className="font-bold">{selectedForDelete?.poNumber}</span>
              </span>
            ) : selectedForDelete?.itemNo ? (
              <span>
                {" "}
                Item{" "}
                <span className="font-bold">{selectedForDelete?.itemNo}</span>
              </span>
            ) : null}{" "}
            from collaboration room?
          </div>
        </DialogContent>
        <DialogActions className="pr-4 mb-2">
          <Button
            style={{
              padding: "3px 16px 3px 16px",
            }}
            className=" bg-gray-400 text-black normal-case rounded"
            // variant="contained"
            type="submit"
            onClick={() => {
              setSelectedForDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            style={{
              padding: "3px 16px 3px 16px",
            }}
            className=" bg-primary-bg hover:bg-primary-bg normal-case rounded"
            variant="contained"
            type="submit"
            onClick={() => {
              if (selectedForDelete?.poNumber) {
                removeOrderFromCollab({
                  poNumber: selectedForDelete?.poNumber,
                });
              } else if (selectedForDelete?.itemNo) {
                removeItemFromCollab({
                  orderNo: selectedForDelete?.orderNo,
                  itemNo: selectedForDelete?.itemNo,
                });
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Notify
        setShowDialog={setShowDialog}
        showDialog={showDialog}
        orderNo={selectedPoNumber}
      />
    </>
  );
};

export default CollabTableForBuyer;
