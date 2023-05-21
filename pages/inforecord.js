import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Checkbox,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  styled,
  TableCell,
  tableCellClasses,
  Dialog,
  DialogTitle,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { AiOutlineSearch, AiOutlineRight } from "react-icons/ai";
import {
  ArrowDownward,
  ArrowUpward,
  Close,
  Delete,
  DeleteOutlined,
  Edit,
  EditOutlined,
  FileDownloadOutlined,
  Info,
  North,
  South,
  UnfoldMore,
  Visibility,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../utils/hooks";
import Pagination from "../components/UI/Pagination";
import { useRouter } from "next/router";
import { $windowExists, listFromDict } from "../utils";
import {
  deleteInfoRecord,
  editInfoRecord,
  exportInfoRecord,
  fetchInfoRecords,
  infoRecordSelector,
  markForPayment,
  markForPaymentInfoRecord,
} from "../store/slices/infoRecordSlice";
import { MoreVert } from "@mui/icons-material";
import AddInfoRecord from "../components/forms/AddInfoRecord";
import MenuView from "../components/UI/Menu";
// import { Menu, MenuItem } from "@material-ui/core";
import ViewDetails from "../components/UI/ViewDetails";
import { $axios, $baseURL } from "../components/axios/axios";
import { makeStyles } from "@mui/styles";
import ToolTip from "../components/UI/Tooltip";
import SearchBar from "../components/UI/SearchBar";
import CustomSelect from "../components/UI/CustomSelect";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: "#3087df",
    border: "1px solid #ffffff",
    color: "white",
    fontWeight: 700,
    fontSize: "12px",
  },
}));

function InfoRecord() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [addInfoRecord, setAddInfoRecord] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);

  const [sortKeys, setSortKeys] = useState({
    materialNumber: 1,
    supplierName: 1,
    deliveryLeadTime: 1,
    followUpFrequency: 1,
    followUpStart: 1,
  });
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [sort, setSort] = useState(1);
  const [selectedHeading, setSelectedHeading] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAddInfoRecord(false);
    setSelectedRecord(null);
  };
  const isXs = useMediaQuery("(max-width:1360px)");
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const infoRecords = useSelector(infoRecordSelector);

  useEffect(() => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      }
      getInfoRecords();
    }
  }, [user, page, searchText, status, limit, sortKeys]);

  const getInfoRecords = async () => {
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

      await dispatch(fetchInfoRecords(payload));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const editRecord = async (values) => {
    try {
      let payload = {
        materialNumber: values.materialNumber,
      };

      if (values.editCritical) {
        payload.markForCritical = !values.markForCritical;
      }

      if (values.editRejection) {
        payload.markForRejection = !values.markForRejection;
      }

      const res = await dispatch(editInfoRecord(payload));
      if (res) {
        getInfoRecords();
      }
    } catch (error) {}
  };
  const deleteRecord = async (values) => {
    try {
      let payload = {
        materialNumber: values.materialNumber,
      };

      const res = await dispatch(deleteInfoRecord(payload));
      if (res) {
        getInfoRecords();
      }
    } catch (error) {}
  };
  const handleMarkPayment = async (values) => {
    try {
      let payload = {
        materialNumber: values.materialNumber,
        markForPayment: !values.markForPayment,
      };

      const res = await dispatch(markForPaymentInfoRecord(payload));
      if (res) {
        getInfoRecords();
      }
    } catch (error) {}
  };
  const handleExport = async () => {
    try {
      let response = await $axios({
        url: `${$baseURL}/infoRecord/export`,
        method: "POST",
        responseType: "blob",
      });
      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "info Record.csv";
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 0);
    } catch (error) {}
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
    { label: "Supplier Name", key: "supplierName" },
    { label: "Supplier ID", key: "supplierId" },
    { label: "Material Number", key: "materialNumber" },
    {
      label: "Delivery Lead time(days)",
      key: "deliveryLeadTime",
    },
    {
      label: "Follow up start day",
      key: "followUpStart",
    },
    {
      label: "Follow up frequency",
      key: "followUpFrequency",
    },
    {
      label: "Supplier contact email(s)",
    },
    {
      label: "Buyer contact email(s)",
    },
    {
      label: "Supplier escalation email(s) - Optional",
    },
    {
      label: "Buyer escalation email(s) - Optional",
    },
    {
      label: "AP contact email(s) - Optional",
    },
    {
      label: "Quality contact email(s) - Optional",
    },
    {
      label: "Mark critical - optional",
    },
    {
      label: "Mark for rejectional - optional",
    },
    {
      label: "Mark for payments - optional",
    },
    {
      label: "Actions",
    },
  ];

  const listFields = listFromDict({
    supplierName: { name: "Supplier Name" },
    materialNumber: { name: "Material Number" },
    deliveryLeadTime: { name: "Delivery Lead time(days)" },
    followUpStart: { name: "Follow up start day" },
    followUpFrequency: { name: "Follow up frequency" },
    supplierContactEmail: { name: "Supplier contact email(s)" },
    buyerContactEmail: { name: "Buyer contact email(s)" },
  });

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    return fallBack;
  }

  return (
    <div className="  bg-[#E5E5E5] flex flex-col xs:min-h-screen grow px-5 ">
      <div className="drawer-open reduce-wid  drawer-close smooth   flex py-5 lg:py-2.5 bg-[#E5E5E5]  fixed z-[3] ">
        <h1 className="text-xl font-bold ">Info Record Table</h1>
        <Button
          onClick={() => handleExport()}
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
      <div className="bg-[white] lg:mt-12 mt-16 drawer-open reduce-wid  drawer-close smooth  fixed z-[3] ">
        <div className="flex justify-between xs:flex-col pt-2 items-center px-2.5 py-1 bg-[white] z-[2]">
          <div className="xs:w-full">
            <Button
              className="xs:w-full"
              style={{
                background: "#03045E",
                color: "white",
                fontWeight: "600",
                padding: "2px 8px",
              }}
              onClick={() => {
                setAddInfoRecord(true);
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-row xs:flex-col xs:w-full my-2 justify-center items-center  ">
            <SearchBar
              searchText={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              clear={() => setSearchText("")}
            />
            <div className="ml-1 flex justify-center xs:mb-2 items-center text-[#65748B]">
              <Pagination
                limit={limit}
                page={page}
                count={infoRecords?.count}
                length={infoRecords?.data?.length}
                onClick={(val) => setPage(val)}
              />
            </div>
            <div className="ml-1 md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full">
              <CustomSelect
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="md:w-28 lg:w-28 xl:w-32 2xl:w-32 w-full"
                limit={true}
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col ">
          <div class="overflow-x-auto ">
            <div class="">
              {!loading && infoRecords?.data?.length > 0 ? (
                <div class="overflow-hidden ">
                  <TableContainer
                    className="xs:pb-[190px] "
                    component={Paper}
                    sx={{ maxHeight: "calc(100vh - 170px)" }}
                  >
                    <Table
                      stickyHeader={true}
                      className="sticky top-0"
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                    >
                      <TableHead className="whitespace-nowrap ">
                        <TableRow className="">
                          {listHeadings?.map((h, index) =>
                            h?.label == "Mark critical - optional" ? (
                              <StyledTableCell
                                style={{
                                  padding: isXs ? "4px 16px" : "10px 16px",
                                }}
                              >
                                {h?.label}
                                <ToolTip title="You may mark critical, if escalation mails are to be sent if supplies are not effected latest by Leadtime date.">
                                  <Info
                                    className="text-orange-500 text-lg "
                                    // size="small"
                                    // fontSize="22"
                                  />
                                </ToolTip>
                              </StyledTableCell>
                            ) : h?.label ==
                              "Mark for rejectional - optional" ? (
                              <StyledTableCell
                                style={{
                                  padding: isXs ? "4px 16px" : "10px 16px",
                                }}
                              >
                                {h?.label}
                                <ToolTip title="Notifications will be sent to contacts maintained as “Quality contact email(s)” about rejections">
                                  <Info
                                    // size="small"
                                    className="text-orange-500 text-lg "
                                    // fontSize="22"
                                  />
                                </ToolTip>
                              </StyledTableCell>
                            ) : h?.label == "Mark for payments - optional" ? (
                              <StyledTableCell
                                style={{
                                  padding: isXs ? "4px 16px" : "10px 16px",
                                }}
                              >
                                {h?.label}
                                <ToolTip title="Reminders will be sent to contacts maintained as “AP contact email(s)” about upcoming payments">
                                  <Info
                                    // size="small"
                                    className="text-orange-500 text-lg "
                                    // fontSize="22"
                                  />
                                </ToolTip>
                              </StyledTableCell>
                            ) : (
                              <StyledTableCell
                                onClick={() => {
                                  setSelectedHeading(h);
                                  h?.key && handleSort(h?.key);
                                }}
                                style={{
                                  padding: isXs ? "4px 16px" : "10px 16px",
                                }}
                                className={`${
                                  h.key && "whitespace-nowrap cursor-pointer"
                                } ${index == 0 && "z-[10] sticky left-0 top-0"}
                                ${index == 1 && "z-[10] sticky left-[8rem] top-0"}
                               
                                
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
                            )
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody className="pt-80 whitespace-nowrap">
                        {infoRecords?.data?.map((row, index) => (
                          <StyledTableRow key={row?.materialNumber}>
                            <StyledTableCell
                              className="z-[5] sticky left-0 bg-[white]"
                              component="th"
                              scope="row"
                              align="left"
                              style={{
                                // minWidth: "150px",
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                            >
                              {row?.supplierName ? row?.supplierName : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              className="z-[5] sticky left-[8rem] bg-[white]"
                              component="th"
                              scope="row"
                              align="left"
                              style={{
                                // minWidth: "150px",
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                            >
                              {row?.supplierId ? row?.supplierId : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              align="center"
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              className="bg-[white]"
                            >
                              {row?.materialNumber ? row?.materialNumber : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="center"
                            >
                              {row?.deliveryLeadTime
                                ? row?.deliveryLeadTime
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="center"
                            >
                              {row?.followUpStart ? row?.followUpStart : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="center"
                            >
                              {row?.followUpFrequency
                                ? row?.followUpFrequency
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="left"
                            >
                              {row?.supplierContactEmail
                                ? row?.supplierContactEmail
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="left"
                            >
                              {row?.buyerContactEmail
                                ? row?.buyerContactEmail
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="left"
                            >
                              {row?.supplierEscalationEmail
                                ? row?.supplierEscalationEmail
                                : "NA"}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="left"
                            >
                              {row?.buyerEscalationEmail
                                ? row?.buyerEscalationEmail
                                : "NA"}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="left"
                            >
                              {row?.apContactEmail ? row?.apContactEmail : "NA"}
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="left"
                            >
                              {row?.qualityContactEmail
                                ? row?.qualityContactEmail
                                : "NA"}
                            </StyledTableCell>

                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="center"
                            >
                              <Checkbox
                                color="primary"
                                size="small"
                                // inputProps={{
                                style={{
                                  padding: "0",
                                }}
                                // }}
                                checked={row.markForCritical}
                                onClick={() => {
                                  editRecord({
                                    materialNumber: row?.materialNumber,
                                    markForCritical: row?.markForCritical,
                                    editCritical: true,
                                  });
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="center"
                            >
                              <Checkbox
                                color="primary"
                                size="small"
                                inputProps={{
                                  style: {
                                    padding: "2px",
                                  },
                                }}
                                checked={row.markForRejection}
                                onClick={() => {
                                  editRecord({
                                    materialNumber: row?.materialNumber,
                                    markForRejection: row?.markForRejection,
                                    editRejection: true,
                                  });
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="center"
                            >
                              <Checkbox
                                color="primary"
                                size="small"
                                inputProps={{
                                  style: {
                                    padding: "2px",
                                  },
                                }}
                                checked={row.markForPayment}
                                onClick={() => {
                                  handleMarkPayment({
                                    materialNumber: row?.materialNumber,
                                    markForPayment: row?.markForPayment,
                                  });
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                padding: isXs ? "3px 16px" : "14px 16px",
                              }}
                              align="center"
                            >
                              <div className="flex justify-between text-[#6B7280]">
                                <div className="mr-2 cursor-pointer">
                                  <ToolTip title="View">
                                    <Visibility
                                      fontSize="small"
                                      onClick={() => {
                                        setOpenPopup(true);
                                        setSelectedRecord(row);
                                      }}
                                    />
                                  </ToolTip>
                                </div>
                                <div className="mr-2 cursor-pointer">
                                  <ToolTip title="Edit">
                                    <EditOutlined
                                      fontSize="small"
                                      onClick={() => {
                                        setAddInfoRecord(true);
                                        setAnchorEl(null);
                                        setSelectedRecord(row);
                                      }}
                                    />
                                  </ToolTip>
                                </div>
                                <div className="cursor-pointer">
                                  <ToolTip title="Delete">
                                    <DeleteOutlined
                                      fontSize="small"
                                      onClick={() => {
                                        deleteRecord(row);
                                        setAnchorEl(null);
                                      }}
                                    />
                                  </ToolTip>
                                </div>
                              </div>
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
                <div className="flex justify-center items-center my-40">
                  No Records...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MenuView
        anchorEl={anchorEl}
        handleClose={handleClose}
        onDelete={(value) => {
          deleteRecord(value);
          setAnchorEl(null);
        }}
        selectedRecord={selectedRecord}
        onEdit={() => {
          setAddInfoRecord(true);
          setAnchorEl(null);
          setSelectedRecord(null);
        }}
      />
      <Dialog
        className="w-full"
        open={addInfoRecord}
        // onClose={() => {
        //   setAddInfoRecord(false);
        //   setSelectedRecord(null);
        // }}
      >
        <AddInfoRecord
          onCancel={() => {
            setAddInfoRecord(false);
            setSelectedRecord(null);
          }}
          onSubmit={() => {
            getInfoRecords();
            setAddInfoRecord(false);
          }}
          selectedRecord={selectedRecord}
        />
      </Dialog>

      <ViewDetails
        open={openPopup}
        onClose={() => {
          setOpenPopup(false);
          setSelectedRecord(null);
        }}
        focused={selectedRecord}
        listFields={listFields}
      />
    </div>
  );
}

export default InfoRecord;

export function MoreActions({ handleClick, setSelectedRecord }) {
  return (
    <div>
      <IconButton
        onClick={(e) => {
          handleClick(e);
          setSelectedRecord();
        }}
      >
        <MoreVert />
      </IconButton>
    </div>
  );
}
