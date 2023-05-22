import styled from "@emotion/styled";
import { ArrowDownward, ArrowUpward, Close } from "@mui/icons-material";
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
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getPurchaseOrder,
  ordersSelector,
} from "../../store/slices/orderSlice";
import { useAuth } from "../../utils/hooks";
import Pagination from "../UI/Pagination";
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

const listHeadings = [
  { label: "ORDER", key: "poNumber" },
  { label: "ORDER DATE", key: "orderDate" },
  {
    label: "DESCRIPTION",
  },

  { label: "DELIVERY DATE", key: "deliveryDate" },
  { label: "BUYER" },

  {
    label: "STATUS",
  },
];

const CollabTableForSupplier = () => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    orderDate: 1,
    deliveryDate: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const isXs = useMediaQuery("(max-width:1360px)");
  const orders = useSelector(ordersSelector);

  useEffect(() => {
    if (route && user) {
      getOrdersOfSelSupplier(user?.supplierId);
    }
  }, [user, page, searchText, limit, status, route, sortKeys]);

  const getOrdersOfSelSupplier = async (supplierId) => {
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
          supplierId: user?.supplierId,
          criticalParts: true,
        },
        sort: sort,
      };

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
        payload.conditions = {
          supplierId: user?.supplierId,
          criticalParts: true,
        };
      }

      if (status != "ALL") {
        payload.conditions = {
          status: status,
          supplierId: user?.supplierId,
          criticalParts: true,
        };
      }

      const res = await dispatch(getPurchaseOrder(payload));
      if (res) {
        getOrdersOfSelSupplier(user?.supplierId);
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

  return (
    <div className="bg-[white] mt-12 drawer-open reduce-wid  drawer-close smooth xs:static xs:w-full  fixed z-[3]  ">
      <div className="flex justify-between xs:flex-col items-center px-2.5 py-1 bg-[white]">
        <div>
          <div className="flex items-center py-2 text-xl ">
            <h1 className="text-black font-bold text-xl ">
              {/* PO's marked for critical followup */}
              MY PO'S
            </h1>
          </div>
        </div>
        <div className="flex flex-row xs:flex-col my-2 justify-center xs:w-full items-center  ">
          <div className="mr-1 ml-2">
            <CustomSelect
              value={status}
              values={allStatus}
              onChange={(e) => setStatus(e.target.value)}
              className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
            />
          </div>
          <div className="ml-1 xs:w-full xs:m-3">
            <SearchBar
              searchText={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              clear={() => setSearchText("")}
            />
          </div>

          <div className="flex justify-center xs:mb-3 ml-1 items-center text-[#65748B] ">
            <Pagination
              limit={limit}
              page={page}
              count={orders.count}
              onClick={(val) => setPage(val)}
              length={orders?.data?.length}
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
      <div class="flex flex-col">
        <div class="overflow-x-auto sm:-px-6 lg:-px-8 px-0">
          <div class=" inline-block  min-w-full ">
            {!loading && orders?.data?.length > 0 ? (
              <div class="overflow-hidden">
                <TableContainer
                  className="xs:pb-[190px] "
                  sx={{ maxHeight: "calc(100vh - 180px)" }}
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
                        {listHeadings.map((h, index) => {
                          return (
                            <StyledTableCell
                              style={{
                                padding: isXs ? "8px 12px" : "10px 12px",
                              }}
                              onClick={() => {
                                setSelectedHeading(h);
                                h?.key && handleSort(h?.key);
                              }}
                              className={`
                              ${h.key && "whitespace-nowrap cursor-pointer"}  ${
                                index == 0 && "z-[10] sticky left-0 top-0"
                              }
                    
                              ${
                                index == 1 ? "z-[10] sticky left-[5.3rem]" : ""
                              } `}
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
                    </TableHead>
                    <TableBody className="">
                      {orders?.data?.map((orderDetail, index) => (
                        <StyledTableRow
                          key={index}
                          className="cursor-pointer"
                          onClick={() => {
                            route.push({
                              pathname: `collaborationRoom/${orderDetail?.poNumber}`,
                            });
                          }}
                        >
                          <StyledTableCell
                            style={{
                              // minWidth: "150px",
                              padding: isXs ? "8px 12px" : "10px 12px",
                            }}
                            component="th"
                            scope="row"
                            className="z-[5] bg-[white] sticky left-0"
                          >
                            {orderDetail?.poNumber
                              ? orderDetail?.poNumber
                              : "NA"}
                          </StyledTableCell>

                          <StyledTableCell
                            style={{
                              // minWidth: "150px",
                              padding: isXs ? "8px 12px" : "10px 12px",
                            }}
                            className="z-[5] bg-[white] sticky left-[5.3rem]"
                          >
                            {orderDetail?.orderDate
                              ? orderDetail?.orderDate
                              : "NA"}
                          </StyledTableCell>
                          <StyledTableCell
                            style={{
                              // minWidth: "150px",
                              padding: isXs ? "8px 12px" : "10px 12px",
                            }}
                            align="left"
                          >
                            {orderDetail?.description
                              ? orderDetail?.description
                              : "NA"}
                          </StyledTableCell>

                          <StyledTableCell
                            style={{
                              // minWidth: "150px",
                              padding: isXs ? "8px 12px" : "10px 12px",
                            }}
                            align="left"
                          >
                            {orderDetail?.deliveryDate || ""}
                          </StyledTableCell>
                          <StyledTableCell
                            style={{
                              // minWidth: "150px",
                              padding: isXs ? "8px 12px" : "10px 12px",
                            }}
                            align="left"
                          >
                            {orderDetail?.userId?.firstName +
                              " " +
                              orderDetail?.userId?.lastName || ""}
                          </StyledTableCell>
                          <StyledTableCell
                            style={{
                              // minWidth: "150px",
                              padding: isXs ? "8px 12px" : "10px 12px",
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
                            ) : orderDetail?.status === "PARTIALY CONFIRMED" ? (
                              <span className="text-[#3ED331]">
                                PARTIALY CONFIRMED
                              </span>
                            ) : orderDetail?.status === "RECEIVING" ? (
                              <span className="text-[#3ED331]">RECEIVING</span>
                            ) : orderDetail?.status === "PARTIALLY RECEIVED" ? (
                              <span className="text-[#3ED331]">
                                PARTIALY RECEIVED
                              </span>
                            ) : orderDetail?.status === "SHIPPED" ? (
                              <span className="text-[#90EE90]">SHIPPED</span>
                            ) : (
                              orderDetail?.status.toUpperCase()
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
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
      </div>
    </div>
  );
};

export default CollabTableForSupplier;
