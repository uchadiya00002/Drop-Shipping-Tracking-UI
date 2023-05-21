import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  tableCellClasses,
  TableCell,
  Paper,
  styled,
  useMediaQuery,
} from "@mui/material";
import { ArrowDownward, ArrowUpward, Visibility } from "@mui/icons-material";
import { getCriticalOrders } from "../../store/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { ordersSelector } from "../../store/slices/orderSlice";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../../utils";
import ViewDetails from "../../components/UI/ViewDetails";
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
const CriticalOrders = (props) => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortKeys, setSortKeys] = useState({
    poNumber: 1,
    orderDate: 1,
    supplierName: 1,
    supplierId: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");

  const route = useRouter();
  const { user, fallBack } = useAuth();
  const orders = useSelector(ordersSelector);
  const isXs = useMediaQuery("(max-width:1360px)");
  useEffect(() => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      }
      getOrders();
    }
  }, [user, page, searchText, status, limit, sortKeys]);

  const getOrders = async () => {
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

      await dispatch(getCriticalOrders(payload));
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

  const listHeadings = [
    { label: "ORDER ID", key: "poNumber" },
    { label: "ORDER DATE", key: "orderDate" },
    {
      label: "ORDER DESCRIPTION",
    },
    { label: "ORDER QTY" },
    { label: "NEED BY DATE" },
    { label: "SUPPLIER ID", key: "supplierId" },
    { label: "SUPPLIER NAME", key: "supplierName" },
    { label: "MATERIAL ID" },
    {
      label: "MATERIAL NAME",
    },
    {
      label: "STATUS",
    },
    {
      label: "ACTIONS",
    },
  ];

  const listFields = listFromDict({
    orderId: { name: "Order ID" },
    orderDate: { name: "Order Date" },
    orderDescription: { name: "Order Description", type: "remarks" },
    orderQuantity: { name: "Order QTY" },
    needByDate: { name: "Need By Date" },
    supplierId: { name: "Supplier ID" },
    supplierName: { name: "Supplier Name" },

    status: { name: "Status" },
  });

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className="w-full lg:mt-12 mt-16 drawer-open reduce-wid  xs:mt-20 drawer-close smooth   fixed z-[3]">
      <div className="bg-[white] ">
        <div className=" px-2.5 py-1 bg-[white] z-[2] xs:py-9 xs:relative xs:mx-auto xs:px-0  xs:w-full">
          <div className="flex flex-row my-1 xs:px-4 xs:flex-col xs:w-full justify-end items-center  ">
            <div className="mr-1 xs:w-full xs:m-1 ml-2">
              <CustomSelect
                value={status}
                values={allStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
              />
            </div>
            <div className="xs:w-full xs:m-1  ml-1">
              <SearchBar
                searchText={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                clear={() => setSearchText("")}
              />
            </div>
            <div className="flex justify-center  ml-1 items-center text-[#65748B] xs:w-full xs:mx-auto xs:m-1">
              <Pagination
                limit={limit}
                page={page}
                count={orders.count}
                length={orders?.data?.length}
                onClick={(val) => setPage(val)}
              />
            </div>
            <div className=" ml-1 xs:w-full xs:m-1">
              <CustomSelect
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
                limit={true}
              />
            </div>
          </div>
        </div>
        {!loading && orders?.data?.length > 0 ? (
          <div class="overflow-auto">
            <TableContainer
              className=" xs:pb-20"
              sx={{ maxHeight: "calc(100vh - 170px)" }}
              component={Paper}
            >
              <Table
                stickyHeader
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
                            padding: isXs ? "5px 14px" : "10px 14px",
                          }}
                          onClick={() => {
                            setSelectedHeading(h);

                            h?.key && handleSort(h?.key);
                          }}
                          className={`${
                            h.key && "whitespace-nowrap cursor-pointer"
                          } whitespace-nowrap
                          ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                    ${index == 1 ? "z-[10] sticky left-[81.5px] " : ""}
                          `}
                        >
                          <ToolTip title={h?.key ? "Sort" : ""}>
                            <div>
                              {h?.label}
                              {h?.key && selectedHeading?.label == h?.label ? (
                                sortKeys[selectedColumnKey] == -1 ? (
                                  <ArrowDownward className="ml-2 text-[#03045E]" />
                                ) : sortKeys[selectedColumnKey] == 1 ? (
                                  <ArrowUpward className="ml-2 text-[#03045E]" />
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
                  {orders?.data?.map((item, index) => (
                    <StyledTableRow
                      key={index}
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() =>
                        route.push(`/order/criticalItems/${item?.orderId}`)
                      }
                    >
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                          maxWidth: "81.5px",
                          minWidth: "81.5px",
                        }}
                        component="th"
                        scope="row"
                        className="z-[5] sticky left-0 bg-[white]"
                      >
                        {item?.orderId ? item?.orderId : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                        className="z-[5] sticky left-[81.5px] bg-[white]"
                      >
                        {item?.orderDate ? item?.orderDate : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        {item?.orderDescription ? item?.orderDescription : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        {item?.orderQuantity ? item?.orderQuantity : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        {item?.needByDate ? item?.needByDate : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        {item?.supplierId ? item?.supplierId : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        {item?.supplierName ? item?.supplierName : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        {item?.materialId ? item?.materialId : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        {item?.materialName ? item?.materialName : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          padding: isXs ? "4px 14px" : "12px 14px",
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
                          padding: isXs ? "4px 14px" : "12px 14px",
                        }}
                        align="left"
                      >
                        <Visibility
                          className="text-[#6B7280] cursor-pointer ml-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPopup(true);
                            setSelectedOrder(item);
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!orders?.data?.length > 0 && (
              <div className="flex justify-center items-center w-full font-semibold text-lg my-40 xs:my-10 ">
                No orders....
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center">
            <div className="my-28 ">
              <CircularProgress />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center xs:mt-0 mt-[72px] ">
            <div className="my-28">No Orders...</div>
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

export default CriticalOrders;
