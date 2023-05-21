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
  Close,
  ArrowBack,
  Visibility,
  Notifications,
  FileDownloadOutlined,
  UnfoldMore,
  North,
  South,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { exportItem, fetchRejectedItems } from "../../store/slices/orderSlice";
import { useDispatch } from "react-redux";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $date, $windowExists, listFromDict } from "../../utils";
import ViewDetails from "../../components/UI/ViewDetails";
import Notify from "../../components/Input/Notify";
import { $axios, $baseURL } from "../../components/axios/axios";
import ToolTip from "../../components/UI/Tooltip";
import CustomSelect from "../../components/UI/CustomSelect";
import SearchBar from "../../components/UI/SearchBar";

const allStatus = [
  {
    value: "REJECTED",
    label: "REJECTED",
  },
  {
    value: "PARTIALLY REJECTED",
    label: "PARTIALLY REJECTED",
  },
];

const rejectItemTrue = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [rejectedItems, setRejectedItems] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [poNumber, setPoNumber] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    itemNo: 1,
    supplierName: 1,
    supplierId: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [sort, setSort] = useState(1);
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const route = useRouter();
  const { user, fallBack } = useAuth();

  useEffect(async () => {
    if (route && user) {
      // if (user?.role == "SUPPLIER") {
      //   route.push("/collaborationRoom");
      // }
      const poNumber = route.query.orderNo;
      setPoNumber(poNumber);
      getRejectedItems(poNumber);
    }
  }, [user, page, searchText, limit, status, route, sortKeys]);

  const getRejectedItems = async (poNumber) => {
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
      const res = await dispatch(fetchRejectedItems(payload));
      if (res) {
        setRejectedItems(res.data);
        setCount(res.count);
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

  const handleExport = async (poNumber) => {
    try {
      let payload = {
        orderNo: poNumber,
        status: "REJECTED",
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
      link.download = "Rejected Item.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    } catch (error) {}
  };

  const listHeadings = [
    { label: "LINE ITEMS", key: "itemNo" },
    { label: "SUPPLIER ID", key: "supplierId" },
    { label: "SUPPLIER NAME", key: "supplierName" },
    { label: "ORDER NUMBER", key: "poNumber" },
    {
      label: "ORDER DESCRIPTION",
    },
    {
      label: "PO QUANTITY",
    },
    {
      label: "REJECTED QUANTITY",
    },

    {
      label: "STATUS",
    },
    {
      label: "REASONS",
    },
    {
      label: "ACTIONS",
    },
  ];

  const listFields = listFromDict({
    itemNo: { name: "Line Item" },
    supplierId: { name: "Supplier ID" },
    supplierName: { name: "Supplier Name" },
    itemDescription: { name: "Order Description" },
    poQuantity: { name: "PO Quantity" },
    rejectedQuantity: { name: "Rejected Quantity" },
    status: { name: "Status" },
    reasons: { name: "Reasons" },
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
    <div className="w-full bg-[#E5E5E5] flex flex-col xs:min-h-screen grow px-5 ">
      <div className="flex my-6 lg:my-3 bg-[#E5E5E5] py-3 z-[5] drawer-open reduce-wid  drawer-close smooth   fixed xs:py-9  xs:mx-auto xs:px-0  xs:w-full">
        <div
          className="text-xl mr-3 cursor-pointer flex flex-row items-center"
          onClick={() => route.back()}
        >
          <ArrowBack />
        </div>
        <h1 className="text-2xl font-bold lg:text-base xs:text-3xl">
          Rejected Items
        </h1>
        <Button
          // variant="outlined"
          onClick={() => handleExport(poNumber)}
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

      <div className="bg-[white] xs:pt-0 mt-16 z-[3] drawer-open reduce-wid  drawer-close smooth   fixed ">
        <div
          className={`px-2.5 py-2 lg:py-1 bg-[white]  xs:mt-14 xs:mx-auto xs:px-4  xs:w-full  `}
        >
          <div className="flex flex-row my-4  justify-between items-center xs:flex-col  ">
            <h1 className="text-xl font-bold  md:mr-3 md:text-xs md:py-1 xs:w-40 xs:mx-auto  ">
              Rejected Items
            </h1>

            <div className="flex  xs:flex-col xs:w-full flex-row ">
              <div className="ml-2 mr-1 xs:m-1">
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
              <div className="flex justify-center xs:m-1 ml-1 items-center text-[#65748B] xs:w-full  xs:mx-auto xs:mb-4">
                <Pagination
                  limit={limit}
                  page={page}
                  count={count}
                  length={rejectedItems?.length}
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

        {!loading && rejectedItems?.length > 0 ? (
          <div class="   xs:pt-0  xs:mt-0">
            <TableContainer
              className="xs:pb-[190px] "
              sx={{ maxHeight: "calc(100vh - 170px)" }}
              component={Paper}
            >
              <Table
                stickyHeader={true}
                className="sticky top-0"
                sx={{ minWidth: 700 }}
                aria-label="customized table"
              >
                <TableHead className="whitespace-nowrap">
                  <TableRow>
                    {listHeadings?.map((h, index) => {
                      return (
                        <StyledTableCell
                          style={{
                            padding: isXs ? "5px 12px" : "10px 12px",
                          }}
                          onClick={() => {
                            setSelectedHeading(h);
                            h?.key && handleSort(h?.key);
                          }}
                          className={`${
                            h.key && "whitespace-nowrap cursor-pointer"
                          }   ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                          ${index == 1 && "z-[10] sticky left-[4rem]"}
                         `}
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
                <TableBody>
                  {rejectedItems?.map((item, index) => (
                    <StyledTableRow className="whitespace-nowrap" key={index}>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        className="z-[5] sticky left-0 bg-[white]"
                        component="th"
                        scope="row"
                      >
                        {item?.itemNo ? item?.itemNo : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        className="z-[5] sticky left-[4rem] bg-[white]"
                        align="left"
                      >
                        {item?.supplierId ? item?.supplierId : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        align="left"
                      >
                        {item?.supplierName ? item?.supplierName : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        align="left"
                      >
                        {item?.orderNo ? item?.orderNo : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        align="left"
                      >
                        {item?.itemDescription ? item?.itemDescription : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        align="left"
                      >
                        {item?.poQuantity ? item?.poQuantity : 0}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        align="left"
                      >
                        {item?.rejectedQuantity ? item?.rejectedQuantity : 0}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                      >
                        {item?.status === "REJECTED" ? (
                          <span className="text-[#FF1212]">REJECTED</span>
                        ) : item?.status === "PARTIALLY REJECTED" ? (
                          <span className="text-[#FF1212]">
                            {" "}
                            PARTIALLY REJECTED
                          </span>
                        ) : (
                          item?.status
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        align="left"
                      >
                        {item?.reasons ? item?.reasons : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 12px" : "6px 12px",
                        }}
                        align="left"
                        className="whitespace-nowrap"
                      >
                        <div className="ml-2">
                          <ToolTip title="View">
                            <Visibility
                              className="text-[#6B7280] cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPopup(true);
                                setSelectedItem(item);
                              }}
                            />
                          </ToolTip>
                          <ToolTip title="Notify">
                            <Notifications
                              className="text-[#6B7280] cursor-pointer ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDialog(true);
                                setSelectedOrder(item?.orderNo);
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
            {!rejectedItems?.length > 0 && (
              <div className="flex justify-center items-center w-full font-semibold text-lg my-36">
                No Rejected Items...
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center">
            <div className="my-44">
              <CircularProgress />
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center"
            style={{
              marginTop: "80px",
            }}
          >
            <div className="my-36 xs:my-16">No Rejected Items...</div>
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
      <Notify
        setShowDialog={setShowDialog}
        showDialog={showDialog}
        orderNo={selectedOrder}
      />
    </div>
  );
};

export default rejectItemTrue;
