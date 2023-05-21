import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Button,
  CircularProgress,
  TableCell,
  TableRow,
  tableCellClasses,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Paper,
  Menu,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  FileDownloadOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useAuth } from "../../utils/hooks";
import Pagination from "../../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../../utils";
import { invoiceReport, deliveryReport } from "../../store/slices/invoiceSlice";
import styled from "@emotion/styled";
import ViewDetails from "../UI/ViewDetails";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { $axios, $baseURL } from "../axios/axios";
import ToolTip from "../UI/Tooltip";
import SearchBar from "../UI/SearchBar";
import CustomSelect from "../UI/CustomSelect";

const AgingReport = (props) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [result, setResult] = useState([]);
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [sortKeys, setSortKeys] = useState({
    supplierId: 1,
    supplierName: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const [type, setType] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(async () => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      }
      if (type == "") {
        if (route.query.type == "OrdersPerSupplier") {
          const subType = route.query.type;
          setType("OrdersPerSupplier");
        } else {
          setType("InvoicesPerSupplier");
        }
      }
      getResults();
    }
  }, [
    user,
    type,

    page,
    searchText,
    limit,
    status,
    route.query.type,
    sortKeys,
  ]);

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
        sort: sort,
      };

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
      }

      let res;
      if (
        route.query.type != "OrdersPerSupplier" &&
        type == "InvoicesPerSupplier"
      ) {
        res = await dispatch(invoiceReport(payload));
      } else if (
        // route.query.type == "OrdersPerSupplier" ||
        type == "OrdersPerSupplier"
      ) {
        res = await dispatch(deliveryReport(payload));
      }
      setResult(res.data);
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

  const handleExport = async () => {
    try {
      let response;

      if (type == "InvoicesPerSupplier") {
        response = await $axios({
          url: `${$baseURL}/agingReport/invoiceAgingReport/export`,
          method: "POST",
          responseType: "blob",
        });
      } else {
        response = await $axios({
          url: `${$baseURL}/agingReport/deliveryAgingReport/export`,
          method: "POST",
          responseType: "blob",
        });
      }

      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Aging Report.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
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
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

  const listHeadings = [
    { label: "SUPPLIER ID", key: "supplierId" },
    { label: "SUPPLIER NAME", key: "supplierName" },

    {
      label: type == "InvoicesPerSupplier" ? "FOR PAYMENT" : "FOR DELIVERY",
    },
    {
      label: "DELAYED",
    },
    {
      label: "DUE IN 7D",
    },
    {
      label: "DUE IN 7-14D",
    },
    {
      label: "DUE IN 15-30D",
    },
    {
      label: "DUE IN 30+",
    },
  ];

  const listFields = listFromDict({
    serialNo: { name: "serial No" },
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
    // router.push('/')
    return fallBack;
  }

  return (
    <div
      className="  bg-[#E5E5E5] flex flex-col min-h-screen px-5 "
      // style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="drawer-open reduce-wid  drawer-close smooth   flex py-3 bg-[#E5E5E5]  fixed z-[3] ">
        <h1 className="text-xl font-bold ">Aging Report</h1>
      </div>
      <div className="mt-14 drawer-open reduce-wid  drawer-close smooth   fixed z-[3]">
        <div className="bg-[white] w-full ">
          <div className=" px-2.5 py-2 bg-[white]  w-full z-[2]">
            <div className="flex flex-row my-1 justify-center items-center  w-full xs:flex-col  bg-[white]  ">
              <div className="flex items-center  text-xl ">
                <Button
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  disableElevation
                  onClick={handleClick}
                  endIcon={
                    <KeyboardArrowDownIcon style={{ fontSize: "20px" }} />
                  }
                  className="text-black font-bold text-lg "
                >
                  {type == "InvoicesPerSupplier"
                    ? "Invoices Per Supplier"
                    : "Orders Per Supplier"}
                </Button>
              </div>
              <Button
                onClick={() => handleExport()}
                className="ml-auto xs:w-full xs:mb-2 normal-case "
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

              <div className="xs:w-full ml-2 mr-1">
                <SearchBar
                  searchText={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  clear={() => setSearchText("")}
                />
              </div>
              <div className="flex justify-center ml-1 items-center text-[#65748B] xs:w-full  xs:mx-auto xs:my-2">
                <Pagination
                  limit={limit}
                  page={page}
                  count={count}
                  onClick={(val) => setPage(val)}
                  length={result?.length}
                />
              </div>
              <div className="ml-1  xs:w-full xs:mb-2">
                <CustomSelect
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
                  limit={true}
                />
              </div>
            </div>
          </div>

          {!loading && result?.length > 0 ? (
            <div class="overflow-hidden  ">
              <TableContainer
                className=" xs:pb-[190px] "
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
                            onClick={() => {
                              setSelectedHeading(h);
                              h?.key && handleSort(h?.key);
                            }}
                            className={`${
                              h.key && "whitespace-nowrap cursor-pointer"
                            }
                          
                          ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                          ${index == 1 ? "z-[10] sticky left-[7.05rem]" : ""}
                          `}
                            style={{
                              padding: "10px 14px",
                            }}
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
                    {result?.map((item, index) => (
                      <StyledTableRow
                        key={index}
                        className="cursor-pointer"
                        onClick={() => {
                          type == "InvoicesPerSupplier"
                            ? route.push({
                                pathname: `/invoices/agingReport/${item?.supplierId}`,
                                query: {
                                  supplierName: item?.supplierName,
                                  type: "InvoicesPerSupplier",
                                },
                              })
                            : route.push({
                              pathname: `/invoices/agingReport/${item?.supplierId}`,
                              query: {
                                supplierName: item?.supplierName,
                                type: "OrdersPerSupplier",
                              },
                            }
                              );
                        }}
                      >
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                          }}
                          className="z-[5] sticky left-0 bg-[white]"
                        >
                          {item?.supplierId ? item?.supplierId : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                          }}
                          className="z-[5] sticky left-[7.05rem] bg-[white]"
                        >
                          {item?.supplierName ? item?.supplierName : "NA"}
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                          }}
                        >
                          {type == "InvoicesPerSupplier"
                            ? item?.forPayment
                            : type == "OrdersPerSupplier"
                            ? item?.forDelivery
                            : "0"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                            color: "red",
                          }}
                        >
                          {item?.delay ? item?.delay : "0"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                            color: "#e3d408",
                          }}
                        >
                          {item?.dueIn7d ? item?.dueIn7d : "0"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                            color: "#e3d408",
                          }}
                        >
                          {item?.dueIn7To14d ? item?.dueIn7To14d : "0"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                            color: "green",
                          }}
                        >
                          {item?.dueIn14To30d ? item?.dueIn14To30d : "0"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{
                            padding: isXs ? "6px 14px" : "10px 14px",
                            color: "green",
                          }}
                        >
                          {item?.dueIn30dPlus ? item?.dueIn30dPlus : "0"}
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
              style={{
                marginTop: "80px",
              }}
            >
              <div className="my-28">No Records...</div>
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

        <Menu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              route.push({
                pathname: "/agingreport",
                query: {
                  type: "InvoicesPerSupplier"
                },
              })
              setType("InvoicesPerSupplier");
              handleClose();
            }
            }
            // onClick={() => {
            //   setType("InvoicesPerSupplier");
            //   handleClose();
            // }}
          >
            Invoices Per Supplier
          </MenuItem>
          <MenuItem
            onClick={() => {
              route.push({
                pathname: "/agingreport",
                query: {
                  type: "OrdersPerSupplier"
                },
              })
              setType("OrdersPerSupplier");
              handleClose();
            }
            }
            // onClick={() => {
            //   setType("OrdersPerSupplier");
            //   handleClose();
            // }}
          >
            Orders Per Supplier
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default AgingReport;
