import React, { useEffect, useRef, useState } from "react";
import {
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  TableCell,
  TableRow,
  tableCellClasses,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import {
  Close,
  Visibility,
  Notifications,
  South,
  UnfoldMore,
  North,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../../utils";
import ViewDetails from "../../components/UI/ViewDetails";
import { fetchRejectedOrders } from "../../store/slices/orderSlice";
import styled from "@emotion/styled";
import Notify from "../../components/Input/Notify";
import ToolTip from "../UI/Tooltip";
import SearchBar from "../UI/SearchBar";
import CustomSelect from "../UI/CustomSelect";
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

const RejectedOrders = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    supplierName: 1,
    supplierId: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const [selectedHeading, setSelectedHeading] = useState("");

  const route = useRouter();
  const { user, fallBack } = useAuth();
  useEffect(async () => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      } else {
        getRejectedOrders();
      }
    }
  }, [user, page, searchText, limit, status, sortKeys]);

  const getRejectedOrders = async () => {
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
        sort: sort,
      };

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
      }

      if (status != "ALL") {
        payload.conditions = {
          status: status,
        };
      }
      const res = await dispatch(fetchRejectedOrders(payload));
      setRejectedOrders(res.data);
      setCount(res.count);
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

  const listHeadings = [
    { label: "SUPPLIER NAME", key: "supplierName" },

    { label: "SUPPLIER ID", key: "supplierId" },
    {
      label: "ORDER NUMBER",
      key: "poNumber",
    },

    {
      label: "ORDER DESCRIPTION",
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
    supplierName: { name: "Supplier Name" },
    supplierId: { name: "Supplier ID" },
    poNumber: { name: "Order Number" },
    description: { name: "Order Description", type: "remarks" },
    status: { name: "Status" },
    reasons: { name: "Reasons", type: "remarks" },
  });

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className="bg-[white] xs:pt-0  z-[3] drawer-open reduce-wid  drawer-close smooth lg:mt-14 xs:mt-0 mt-16 fixed ">
      <div
        className={`px-2.5 py-3 lg:py-0.5  bg-[white]  xs:py-9 xs:relative xs:mx-auto xs:px-4  xs:w-full
      `}
      >
        <div className="flex flex-row my-2 xs:w-full justify-between items-center xs:flex-col  ">
          <h1 className="text-xl font-bold  md:mr-3 md:text-xs md:py-1  xs:mx-auto  ">
            Rejections
          </h1>
          <div className="flex flex-row xs:w-full xs:flex-col ">
            <div className="mr-1 ml-2 xs:m-1 xs:mx-0 xs:w-full">
              <CustomSelect
                value={status}
                values={allStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full "
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
            <div className="flex ml-1 xs:m-1 justify-center items-center xs:my-3 text-[#65748B] ">
              <Pagination
                limit={limit}
                page={page}
                count={count}
                length={rejectedOrders.length}
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

      {!loading && rejectedOrders?.length > 0 ? (
        <div class="overflow-hidden :mt-5  ">
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
                <TableRow className=" xs:mt-0">
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
                        }
                          
                          ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                    ${index == 1 ? "z-[10] sticky left-[8.25rem]" : ""}
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
                {rejectedOrders?.map((item, index) => (
                  <StyledTableRow
                    key={index}
                    className="cursor-pointer"
                    onClick={() => route.push(`/rejections/${item?.poNumber}`)}
                  >
                    <StyledTableCell
                      style={{
                        padding: isXs ? "4px 12px" : "8px 12px",
                      }}
                      component="th"
                      scope="row"
                      className="z-[5] sticky left-0 bg-[white]"
                    >
                      {item?.supplierName ? item?.supplierName : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "4px 12px" : "8px 12px",
                      }}
                      align="left"
                      className="z-[5] sticky left-[8.25rem] bg-[white]"
                    >
                      {item?.supplierId ? item?.supplierId : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "4px 12px" : "8px 12px",
                      }}
                      align="left"
                    >
                      <div className="border-b-2 border-b-indigo-200 w-fit">
                        {item?.poNumber ? item?.poNumber : "NA"}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "4px 12px" : "8px 12px",
                      }}
                      align="left"
                    >
                      {item?.description ? item?.description : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "4px 12px" : "8px 12px",
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
                        padding: isXs ? "4px 12px" : "8px 12px",
                      }}
                      align="left"
                    >
                      {item?.reasons ? item?.reasons : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "4px 12px" : "8px 12px",
                      }}
                      align="left"
                    >
                      <div className="">
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
                        <ToolTip title="Notify">
                          <Notifications
                            className="text-[#6B7280] cursor-pointer ml-2 m-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDialog(true);
                              setSelectedOrder(item?.poNumber);
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

          {!rejectedOrders?.length > 0 && (
            <div className="flex justify-center items-center w-full font-semibold text-lg ">
              No Rejected Orders...
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
        <div className="flex justify-center items-center mt-[80px] xs:mt-0">
          <div className="my-32">No Rejected Orders...</div>
        </div>
      )}

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

export default RejectedOrders;
