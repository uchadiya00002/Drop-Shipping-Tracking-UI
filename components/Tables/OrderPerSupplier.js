import styled from "@emotion/styled";
import {
  Button,
  CircularProgress,
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdAspectRatio } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deliveryReport } from "../../store/slices/invoiceSlice";
import { $windowExists } from "../../utils";
import { useAuth } from "../../utils/hooks";
import ToolTip from "../UI/Tooltip";

const listHeadingsForOrder = [
  "SUPPLIER ID",
  "SUPPLIER NAME",
  "FOR DELIVERY",
  "DELAYED",
  "DUE IN 7D",
  "DUE IN 7-14D",
  "DUE IN 15-30D",
  "DUE IN 30+",
];

const OrderPerSupplier = ({
  startDate,
  endDate,
  companyCode,
  plantName,
  groupCode,
  orgCode,
  limit,
}) => {
  const { user, fallBack } = useAuth();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const route = useRouter();
  const [orders, setOrders] = useState([]);
  const [typeOrder, setTypeOrder] = useState("OrdersPerSupplier");
  const [loading, setLoading] = useState(false);
  const isLg = useMediaQuery("(min-width:1360px)");
  const isXs = useMediaQuery("(max-width:1360px)");
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      // backgroundColor: { xs: "#F3F4F6", md: "blue", lg: "red" },
      backgroundColor: "#F3F4F6",
      color: "#121828",
      fontWeight: 600,
      fontFamily: "Roboto",
      fontSize: isXs ? 12 : 15,
      padding: "6px 18px",
    },

    [`&.${tableCellClasses.body}`]: {
      fontSize: isXs ? 12 : 15,
      fontFamily: "Roboto",
      padding: isXs ? "5px 10px" : "8px 18px",
      // fontFamily: "Gentium Book Plus",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

  useEffect(async () => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      }
      getResults();
    }
  }, [
    user,
    typeOrder,
    startDate,
    endDate,
    companyCode,
    plantName,
    groupCode,
    orgCode,
    route?.pathname,
  ]);

  const getResults = async () => {
    setLoading(true);
    try {
      let conditions = {};

      if (companyCode != "ALL") {
        conditions.companyCode = companyCode;
      }
      if (plantName != "ALL") {
        conditions.plantName = plantName;
      }
      if (groupCode != "ALL") {
        conditions.groupCode = groupCode;
      }
      if (orgCode != "ALL") {
        conditions.orgCode = orgCode;
      }
      if (startDate != "" && endDate != "") {
        conditions.startDate = startDate;
        conditions.endDate = endDate;
      }

      let payload = {
        conditions: conditions,
        pagination: {
          limit: limit,
          page: 1,
        },
      };

      if (typeOrder == "OrdersPerSupplier" && payload.conditions != {}) {
        const res = await dispatch(deliveryReport(payload));
        if (res) {
          setOrders(res.data);
          setCount(res.count);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
  }, [user]);

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className="bg-[white] rounded">
      <div className="flex flex-row px-5 xs:px-3 md:px-3 bg-[white] rounded">
        <div className="flex flex-col text-sm py-2">
          <h2 className="text-base   font-semibold">
            Aging Report (Purchase Order)
          </h2>
          Orders Per Supplier
        </div>

        <div className="ml-auto flex my-3 h-8">
          {route?.pathname == "/home" ? (
            <ToolTip title="Go to PO Dashboard">
              <Button
                className=" bg-[#03045E] hover:bg-[#0e106a] p-0 mr-4 text-base font-semibold normal-case  rounded"
                variant="contained"
                onClick={() => route.push("/dashboard")}
                style={{
                  padding: "4px",
                }}
              >
                Next
              </Button>
            </ToolTip>
          ) : (
            <div className="ml-auto mr-4"></div>
          )}

          <ToolTip title="View All">
            <Button
              className={`bg-[#03045E] hover:bg-[#0e106a] py-1 whitespace-nowrap  font-semibold normal-case text-base   rounded`}
              variant="contained"
              onClick={() =>
                route.push({
                  pathname: "/agingreport",
                  query: {
                    type: "Aging Report",
                    subType: "OrdersPerSupplier",
                  },
                })
              }
            >
              View All
            </Button>
          </ToolTip>
        </div>
      </div>
      <div className="  ">
        {!loading && orders?.length > 0 ? (
          <div>
            <TableContainer component={Paper}>
              <Table
                // sx={{ overflowX: "auto", height: "auto" }}
                // className="overflow-auto"
                aria-label="customized table"
              >
                <TableHead className="">
                  <TableRow>
                    {listHeadingsForOrder.map((h, index) => {
                      return (
                        <StyledTableCell
                          className={`whitespace-nowrap ${
                            index == 0 && "sticky left-0 top-0 z-[10]"
                          }
                          
                          ${
                            index == 1 &&
                            "sticky left-[7.07rem] lg:left-[6.2rem] md:left-[5.1rem] z-[10]"
                          }
                          `}
                          // style={{
                          //   padding: "8px 18px",
                          // }}
                        >
                          {/* <span className="text-xs"></span> */}
                          {h}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody className="">
                  {orders.map((order, index) => (
                    <StyledTableRow className="whitespace-nowrap " key={index}>
                      <StyledTableCell
                        align="center"
                        className="sticky left-0 top-0 z-[5] bg-[white]"
                      >
                        {order?.supplierId ? order?.supplierId : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        className="sticky left-[7.07rem] lg:left-[6.2rem] md:left-[5.1rem] text-sm z-[5] bg-[white]"
                      >
                        {order?.supplierName ? order?.supplierName : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {typeOrder == "OrdersPerSupplier"
                          ? order?.forDelivery
                          : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "red",
                        }}
                      >
                        {order?.delay ? order?.delay : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "#e3d408",
                        }}
                      >
                        {order?.dueIn7d ? order?.dueIn7d : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "#e3d408",
                        }}
                      >
                        {order?.dueIn7To14d ? order?.dueIn7To14d : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "green",
                        }}
                      >
                        {order?.dueIn14To30d ? order?.dueIn14To30d : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "green",
                        }}
                      >
                        {order?.dueIn30dPlus ? order?.dueIn30dPlus : "0"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center">
            <div className="my-20">
              <CircularProgress />
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center items-center"
            style={{
              marginTop: "10px",
            }}
          >
            <div className="my-20">No Records...</div>
          </div>
        )}
      </div>
      {/* </div> */}

      {/* <div className="h-[20px]"> */}
      <p className="ml-auto mt-auto bg-[white] lg:text-sm xl:text-base md:text-sm sm:text-xs 2xl:text-base font-normal pt-2  md:py-0.5  text-end px-5 rounded-b-lg shadow-sm">
        Click View All to see More
      </p>
      {/* </div> */}
    </div>
  );
};

export default OrderPerSupplier;
