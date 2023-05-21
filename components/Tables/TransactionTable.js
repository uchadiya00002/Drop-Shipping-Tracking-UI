import styled from "@emotion/styled";
import {
  ArrowDownward,
  ArrowUpward,
  Close,
  EditOutlined,
  North,
  Route,
  South,
  UnfoldMore,
  Visibility,
} from "@mui/icons-material";
import {
  IconButton,
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";

import { updateTransactionalData } from "../../store/slices/infoRecordSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import ToolTip from "../UI/Tooltip";

const listHeadingForSupplierRole = [
  { label: "ORDER", key: "poNumber" },

  { label: "ORDER DATE", key: "orderDate" },
  {
    label: "DESCRIPTION",
  },
  { label: "LINE ITEMS" },
  { label: "DELIVERY DATE", key: "deliveryDate" },
  { label: "BUYER NAME" },
  { label: "BUYER EMAIL" },
  { label: "NEW DELIVERY DATE", key: "newDeliveryDate" },
  {
    label: "NEW DELIVERY DATE STATUS",
  },
  {
    label: "STATUS",
  },
  { label: "GROUP CODE", key: "groupCode" },
  { label: "ORG CODE" },
  { label: "COMPANY CODE", key: "companyCode" },
  { label: "PLANT NAME", key: "plantName" },
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
  { label: "LINE ITEMS" },
  { label: "SUPPLIER NAME" },
  { label: "DELIVERY DATE", key: "deliveryDate" },

  { label: "NEW DELIVERY DATE", key: "newDeliveryDate" },
  {
    label: "NEW DELIVERY DATE STATUS",
  },
  {
    label: "STATUS",
  },
  { label: "GROUP CODE", key: "groupCode" },
  { label: "ORG CODE" },
  { label: "COMPANY CODE", key: "companyCode" },
  { label: "PLANT NAME", key: "plantName" },
  { label: "REASON" },
  {
    label: "ACTIONS",
  },
];

const TransactionTable = ({
  transactionalDataResult,

  user,
  selectedId,
  setEditInfo,
  setOpenPopup,
  setSelectedItem,
  setSelectedId,
  setSelectedReason,
  setNewDate,
  setStatusOfNewDate,
  getTransactionalData,
  handleSort,
  sortKeys,
  selectedColumnKey,

  selectedHeading,
  setSelectedHeading,
}) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(true);
  const route = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const isXs = useMediaQuery("(max-width:1360px)");

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

  const handleDateChange = async (newValue) => {
    const payload = {
      _id: selectedId,
      newDeliveryDate: moment(newValue).format("DD.MM.YYYY"),
    };
    try {
      if (payload.newDeliveryDate.length == 10) {
        const res = await dispatch(updateTransactionalData(payload));
        if (res) {
          setShow(false);
          getTransactionalData();
        }
      }
    } catch (error) {}
  };

  return (
    <TableContainer
      className=" xs:pb-[190px] "
      sx={{ maxHeight: "calc(100vh - 170px)" }}
      component={Paper}
    >
      <Table
        stickyHeader={true}
        className="sticky top-0  "
        aria-label="customized table"
      >
        <TableHead className="whitespace-nowrap ">
          {user?.role === "SUPPLIER" ? (
            <TableRow>
              {listHeadingForSupplierRole?.map((h, index) => {
                return (
                  <StyledTableCell
                    style={{
                      padding: isXs ? "4px 10px" : "12px 10px",
                    }}
                    onClick={() => {
                      setSelectedHeading(h);

                      h?.key && handleSort(h?.key);
                    }}
                    className={`${
                      h.key && "whitespace-nowrap cursor-pointer"
                    } ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                    ${
                      index == 1
                        ? "z-[10] sticky left-[5rem] lg:left-[3.8rem]"
                        : ""
                    }
                    `}
                  >
                    <ToolTip title={h.key ? "Sort" : ""}>
                      <div>
                        {h?.label}
                        {h.key && selectedHeading?.label == h?.label ? (
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
                      padding: isXs ? "4px 10px" : "12px 10px",
                    }}
                    onClick={() => {
                      setSelectedHeading(h);

                      h?.key && handleSort(h?.key);
                    }}
                    className={`${
                      h.key && "whitespace-nowrap cursor-pointer"
                    } ${index == 0 && "z-[10] sticky left-0 top-0"}
                    
                    ${
                      index == 1
                        ? "z-[10] sticky left-[5rem] lg:left-[3.8rem]"
                        : ""
                    }
                    `}
                  >
                    <ToolTip title={h.key ? "Sort" : ""}>
                      <div>
                        {h?.label}
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
          )}
        </TableHead>

        <TableBody className="mt-3">
          {transactionalDataResult?.map((item, index) => (
            <StyledTableRow
              key={item?._id}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => route.push(`/transactionalData/${item?.poNumber}`)}
            >
              <StyledTableCell
                component="th"
                scope="row"
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                className="z-[5] sticky left-0 bg-[white]"
              >
                {item?.poNumber ? item?.poNumber : "NA"}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
                className="z-[5] sticky left-[5rem] lg:left-[3.8rem] bg-[white]"
              >
                {item?.orderDate ? item?.orderDate : "NA"}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
              >
                {item?.description ? item?.description : "NA"}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="center"
              >
                {item?.itemsCount ? item?.itemsCount : "NA"}
              </StyledTableCell>
              {user?.role == "BUYER" && (
                <StyledTableCell
                  style={{
                    minWidth: "150px",
                    padding: isXs ? "6px 10px" : "14px 10px",
                  }}
                  align="left"
                >
                  {item?.supplierName ? item?.supplierName : "NA"}
                </StyledTableCell>
              )}
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
              >
                {item?.oldDeliveryDate ? item?.oldDeliveryDate : "NA"}
              </StyledTableCell>
              {user?.role === "SUPPLIER" && (
                <>
                  <StyledTableCell
                    style={{
                      padding: isXs ? "6px 10px" : "14px 10px",
                    }}
                    align="left"
                  >
                    {user?.role === "SUPPLIER" &&
                      `${item?.userId?.firstName} ${item?.userId?.lastName}`}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      padding: isXs ? "6px 10px" : "14px 10px",
                    }}
                    align="left"
                  >
                    {user?.role === "SUPPLIER" && item?.userId?.email}
                  </StyledTableCell>
                </>
              )}
              <StyledTableCell
                style={{
                  minWidth: "150px",
                  padding: "6px 10px",
                }}
                align="left"
                onClick={(e) => e.stopPropagation()}
              >
                {showDate && item?.newDeliveryDate ? (
                  <span
                    className={`${
                      item?.statusForNewDeliveryDate == "REJECTED" &&
                      "line-through"
                    }`}
                  >
                    {item?.newDeliveryDate}
                  </span>
                ) : selectedId === item?._id ? (
                  ""
                ) : (
                  <span
                    className={`${
                      item?.statusForNewDeliveryDate == "REJECTED" &&
                      "line-through"
                    }`}
                  >
                    {item?.newDeliveryDate}
                  </span>
                )}
                {user?.role === "BUYER" && show ? (
                  selectedId === item?._id && (
                    <div className="flex justify-start">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                          onChangeRaw={(e) => e.stopPropagation()}
                          renderInput={(params) => (
                            <TextField
                              variant="standard"
                              className="cursor-none"
                              disabled={true}
                              inputProps={{ readOnly: true, disabled: true }}
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
                        <Close />
                      </span>
                    </div>
                  )
                ) : //

                user?.role == "BUYER" &&
                  item?.statusForNewDeliveryDate === "PENDING" &&
                  user?._id == item?.newDeliveryDateModifiedBy?._id ? (
                  <EditOutlined
                    fontSize="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShow(!show);
                      setShowDate(!showDate);
                      setSelectedId(item?._id);
                    }}
                    className="mx-2 text-[#6B7280]"
                  />
                ) : user?.role == "BUYER" &&
                  item?.statusForNewDeliveryDate !== "PENDING" ? (
                  <EditOutlined
                    fontSize="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShow(!show);
                      setShowDate(!showDate);
                      setSelectedId(item?._id);
                    }}
                    className="mx-2 text-[#6B7280] "
                  />
                ) : (
                  user?.role == "BUYER" &&
                  item?.statusForNewDeliveryDate === "PENDING" &&
                  user?._id != item?.newDeliveryDateModifiedBy?._id &&
                  ""
                )}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  minWidth: "230px",
                  padding: "6px 10px",
                }}
                align="left"
              >
                {item?.statusForNewDeliveryDate === "REJECTED" ? (
                  <span className="text-[#FF1212]">REJECTED</span>
                ) : item?.statusForNewDeliveryDate === "PENDING" ? (
                  <span className="text-[orange]">FOR APPROVAL</span>
                ) : item?.statusForNewDeliveryDate === "ACCEPTED" ? (
                  <span className="text-[#3ED331]">ACCEPTED</span>
                ) : item?.statusForNewDeliveryDate === "PARTIALLY APPROVED" ? (
                  <span className="text-[orange]">PARTIALLY APPROVED</span>
                ) : (
                  item?.statusForNewDeliveryDate
                )}
              </StyledTableCell>

              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
              >
                {item?.status === "REJECTED" ? (
                  <span className="text-[#FF1212]">REJECTED</span>
                ) : item?.status === "CONFIRMED" ? (
                  <span className="text-[#3ED331]">CONFIRMED</span>
                ) : item?.status === "ORDERED" ? (
                  <span className="text-[#3ED331]">ORDERED</span>
                ) : item?.status === "PARTIALLY REJECTED" ? (
                  <span className="text-[#FF1212]">PARTIALLY REJECTED</span>
                ) : item?.status === "PARTIALY CONFIRMED" ? (
                  <span className="text-[#3ED331]">PARTIALY CONFIRMED</span>
                ) : item?.status === "RECEIVED" ? (
                  <span className="text-[#3ED331]">RECEIVED</span>
                ) : item?.status === "PARTIALLY RECEIVED" ? (
                  <span className="text-[#3ED331]">PARTIALY RECEIVED</span>
                ) : (
                  item?.status
                )}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
              >
                {item?.groupCode ? item?.groupCode : "NA"}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  minWidth: "120px",
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
              >
                {item?.orgCode ? item?.orgCode : "NA"}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
              >
                {item?.companyCode ? item?.companyCode : "NA"}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
              >
                {item?.plantName ? item?.plantName : "NA"}
              </StyledTableCell>
              <StyledTableCell
                className="whitespace-nowrap"
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
              >
                {item?.reason ? item?.reason : "NA"}
              </StyledTableCell>
              <StyledTableCell
                style={{
                  padding: isXs ? "6px 10px" : "14px 10px",
                }}
                align="left"
                className="whitespace-nowrap text-[#6B7280]"
              >
                {user?.role == "SUPPLIER" ? (
                  <ToolTip title="Edit">
                    <EditOutlined
                      fontSize="small"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditInfo(true);
                        setSelectedId(item?._id);
                        setSelectedReason(item?.reason);
                        setNewDate(item?.newDeliveryDate);
                        setSelectedItem(item);
                        setStatusOfNewDate(item?.statusForNewDeliveryDate);
                      }}
                    />
                  </ToolTip>
                ) : (
                  item?.statusForNewDeliveryDate == "PENDING" &&
                  user?._id != item?.newDeliveryDateModifiedBy?._id && (
                    <ToolTip title="Edit">
                      <EditOutlined
                        fontSize="small"
                        className="text-[#6B7280]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditInfo(true);
                          setSelectedId(item?._id);
                          setSelectedReason(item?.reason);
                          setNewDate(item?.newDeliveryDate);
                          setSelectedItem(item);
                          setStatusOfNewDate(item?.statusForNewDeliveryDate);
                        }}
                      />
                    </ToolTip>
                  )
                )}

                <ToolTip title="View">
                  <Visibility
                    fontSize="small"
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
  );
};

export default TransactionTable;
