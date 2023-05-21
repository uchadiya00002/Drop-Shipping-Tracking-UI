import React, { useEffect, useState } from "react";
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
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../../utils";
import {
  invoiceSelector,
  fetchInvoices,
} from "../../store/slices/invoiceSlice";
import styled from "@emotion/styled";
import ViewDetails from "../UI/ViewDetails";
import Notify from "../../components/Input/Notify";
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
    value: "RECEIVED",
    label: "RECEIVED",
  },
  {
    value: "PARTIALY CONFIRMED",
    label: "PARTIALY CONFIRMED",
  },
  {
    value: "PARTIALLY RECEIVED",
    label: "PARTIALLY RECEIVED",
  },
];

const InvoiceTable = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const [sortKeys, setSortKeys] = useState({
    invoiceDate: 1,
    invoiceNumber: 1,
    orderNo: 1,
    supplierId: 1,
    supplierName: 1,
    paymentDueDate: 1,
    receivedDate: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const invoices = useSelector(invoiceSelector);

  useEffect(async () => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      } else {
        getInvoices();
      }
    }
  }, [user, page, searchText, limit, status, sortKeys, route]);

  const getInvoices = async () => {
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
          orderStatus: status,
        };
      }
      if (route.query.type != "Aging Report") {
        const res = await dispatch(fetchInvoices(payload));
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
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

  const listHeadings = [
    { label: "SL NO", sticky: "left" },
    { label: "INVOICE DATE", key: "invoiceDate", sticky: "left" },
    { label: "INVOICE NUMBER", key: "invoiceNumber", sticky: "left" },
    { label: "ORDER NUMBER", key: "orderNo", sticky: "left" },
    { label: "SUPPLIER ID", key: "supplierId" },
    { label: "SUPPLIER NAME", key: "supplierName" },
    { label: "ORDER STATUS" },
    { label: "RECEIVED DATE", key: "receivedDate" },
    { label: "PAYMENT DUE DATE", key: "paymentDueDate" },
    { label: "PAYMENT TERMS" },
    { label: "PAYMENT STATUS" },
    { label: "GROUP CODE" },
    { label: "ORG CODE" },
    { label: "COMPANY CODE" },
    { label: "PLANT NAME" },
    { label: "PRICE", key: "totalPrice" },
    { label: "CURRENCY" },
    {
      label: "ACTIONS",
    },
  ];

  const listFields = listFromDict({
    invoiceDate: { name: "invoice Date" },
    invoiceNumber: { name: "invoice Number" },
    orderNo: { name: "order Number" },
    supplierId: { name: "supplier Id" },
    supplierFields: { name: "supplier fields" },
    orderStatus: { name: "order Status" },
    paymentDueDate: { name: "payment Due Date" },
    paymentTerms: { name: "payment terms" },
    paymentStatus: { name: "payment status" },
    followUpStatus: { name: "follow up Status" },
  });

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    return fallBack;
  }

  return (
    <div className="w-full lg:mt-12 mt-16 xs:mt-20 drawer-open reduce-wid  overflow-auto drawer-close smooth   fixed z-[3] ">
      <div className="bg-[white]  ">
        <div className=" px-2.5 py-1 bg-[white] z-[2] ">
          <div className="flex flex-row my-1 justify-end items-center xs:flex-col  bg-[white]  ">
            <div className="ml-1 mr-2 md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full mb-2 md:mb-0 lg:mb-0 xl:mb-0 2xl:mb-0">
              <CustomSelect
                value={status}
                values={allStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="md:w-52 lg:w-52 xl:w-32 2xl:w-32 w-full"
              />
            </div>
            <SearchBar
              searchText={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              clear={() => setSearchText("")}
            />
            <div className="flex justify-center items-center text-[#65748B] ml-1 xs:w-full  xs:mx-auto xs:mb-4">
              <Pagination
                limit={limit}
                page={page}
                count={invoices.count}
                onClick={(val) => setPage(val)}
                length={invoices.data.length}
              />
            </div>
            <div className="ml-1 md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full">
              <CustomSelect
                value={limit}
                limit={true}
                onChange={(e) => setLimit(e.target.value)}
                className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
              />
            </div>
          </div>
        </div>

        {!loading && invoices?.data?.length > 0 ? (
          <TableContainer
            className="xs:pb-[190px] "
            sx={{ maxHeight: "calc(100vh - 170px)" }}
            component={Paper}
          >
            <Table
              stickyHeader={true}
              className="sticky top-0"
              aria-label="customized table"
            >
              <TableHead
                className="whitespace-nowrap"
                initialState={{
                  pinnedColumns: {
                    left: ["SL NO", "INVOICE DATE", , "INVOICE NUMBER"],
                  },
                }}
              >
                <TableRow>
                  {listHeadings?.map((h, index) => {
                    return (
                      <StyledTableCell
                        onClick={() => {
                          setSelectedHeading(h);
                          h?.key && handleSort(h?.key);
                        }}
                        className={`${
                          h?.key && "whitespace-nowrap cursor-pointer"
                        } ${index == 0 && "z-[10] sticky left-0 top-0"}
                          ${
                            index == 1
                              ? "z-[10] sticky left-[4.5rem] lg:left-[4.15rem]"
                              : ""
                          } 
                          whitespace-nowrap
                          ${
                            index == 2
                              ? "z-[10] sticky left-[12.65rem] lg:left-[11.1rem]  "
                              : ""
                          }
                          `}
                        style={{
                          padding: isXs ? "8px 16px" : "10px 16px",
                        }}
                      >
                        <ToolTip title={h?.key && "Sort"}>
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
              <TableBody className="overflow-scroll">
                {invoices?.data?.map((item, index) => (
                  <StyledTableRow
                    key={index}
                    className="overflow-y-scroll whitespace-nowrap"
                  >
                    <StyledTableCell
                      className="z-[5] sticky left-0 bg-[white]"
                      component="th"
                      scope="row"
                      align="left"
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                    >
                      {(page - 1) * limit + index + 1}
                    </StyledTableCell>
                    <StyledTableCell
                      component="th"
                      align="left"
                      className="z-[5] sticky left-[4.5rem] lg:left-[4.15rem] bg-[white]"
                      scope="row"
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                    >
                      {item?.invoiceDate ? item?.invoiceDate : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      align="left"
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      className="z-[5] sticky left-[12.65rem] lg:left-[11.1rem] bg-[white]"
                    >
                      {item?.invoiceNumber ? item?.invoiceNumber : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.orderNo ? item?.orderNo : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.supplierId ? item?.supplierId : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        minWidth: "150px",
                        padding: isXs ? "8px 16px" : "12px 16px",
                        minWidth: "150px",
                      }}
                      align="left"
                    >
                      {item?.supplierName ? item?.supplierName : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.orderStatus === "CONFIRMED" ? (
                        <span className="text-[#00AA57]">CONFIRMED</span>
                      ) : item?.orderStatus === "ORDERED" ? (
                        <span className="text-[#3ED331]">ORDERED</span>
                      ) : item?.orderStatus === "PARTIALY CONFIRMED" ? (
                        <span className="text-[#3ED331]">
                          PARTIALY CONFIRMED
                        </span>
                      ) : item?.orderStatus === "PARTIALLY RECEIVED" ? (
                        <span className="text-[#3ED331]">
                          PARTIALLY RECEIVED
                        </span>
                      ) : item?.orderStatus === "RECEIVED" ? (
                        <span className="text-[#3ED331]">RECEIVED</span>
                      ) : (
                        item?.orderStatus
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.receivedDate ? item?.receivedDate : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.paymentDueDate ? item?.paymentDueDate : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.paymentTerms ? item?.paymentTerms : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.paymentStatus === "COMPLETED" ? (
                        <span className="text-[#00AA57]">COMPLETED</span>
                      ) : item?.paymentStatus === "PENDING" ? (
                        <span className="text-[#FF3838]">PENDING</span>
                      ) : item?.paymentStatus === "PARTIALLY PAID" ? (
                        <span className="text-[#7B61FF]">PARTIALLY PAID</span>
                      ) : item?.paymentStatus ? (
                        item?.paymentStatus
                      ) : (
                        "NA"
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.groupCode ? item?.groupCode : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: "8px 16px",
                      }}
                      align="left"
                    >
                      {item?.orgCode ? item?.orgCode : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: "8px 16px",
                      }}
                      align="left"
                    >
                      {item?.companyCode ? item?.companyCode : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.plantName ? item?.plantName : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.totalPrice ? item?.totalPrice : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                    >
                      {item?.currency ? item?.currency : "NA"}
                    </StyledTableCell>

                    <StyledTableCell
                      style={{
                        padding: isXs ? "8px 16px" : "12px 16px",
                      }}
                      align="left"
                      className="whitespace-nowrap"
                    >
                      <div className=" ">
                        <ToolTip title="View">
                          <Visibility
                            size={18}
                            className="text-[#6B7280] cursor-pointer sm:text-sm md:text-base lg:text-lg xl:text-xl"
                            onClick={() => {
                              setOpenPopup(true);
                              setSelectedInvoice(item);
                            }}
                          />
                        </ToolTip>
                        <ToolTip title="Notify">
                          <Notifications
                            className="text-[#6B7280] cursor-pointer ml-2 sm:text-sm md:text-base lg:text-lg xl:text-xl "
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(item?.orderNo);
                              setShowDialog(true);
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
        ) : loading ? (
          <div className="flex justify-center items-center">
            <div className="my-56">
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
            <div className="my-28">No Invoices...</div>
          </div>
        )}
      </div>

      <ViewDetails
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          setSelectedInvoice(null);
        }}
        focused={selectedInvoice}
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

export default InvoiceTable;
