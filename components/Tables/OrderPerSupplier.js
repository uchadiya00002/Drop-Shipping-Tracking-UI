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

import ToolTip from "../UI/Tooltip";

const listHeadingsForOrder = [
  "SUPPLIER ID",
  "SUPPLIER NAME",
  "FOR DELIVERY",
  "DELAYED",
  "DUE IN 7D",
  "DUE IN 7-14D",
];

const OrderPerSupplier = () => {
  const [count, setCount] = useState(0);
  const route = useRouter();
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
      // boxShadow: "none",
      padding: isXs ? "5px 10px" : "8px 18px",
      // fontFamily: "Gentium Book Plus",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));
  const orders = [
    {
      supplierId: "1234",
      supplierName: "Wallmart",
      forDelivery: 4,
      delay: 4,
      dueIn7d: 1,
      dueIn7To14d: 2,
    },
    {
      supplierId: "3545",
      supplierName: "Best Buy",
      forDelivery: 4,
      delay: 4,
      dueIn7d: 1,
      dueIn7To14d: 2,
    },
    {
      supplierId: "3573",
      supplierName: "Ondoor",
      forDelivery: 4,
      delay: 4,
      dueIn7d: 1,
      dueIn7To14d: 2,
    },
    {
      supplierId: "7543",
      supplierName: "Dmart",
      forDelivery: 4,
      delay: 4,
      dueIn7d: 1,
      dueIn7To14d: 2,
    },
  ];

  return (
    <div className="bg-[white] rounded">
      <div className="flex flex-row px-5 xs:px-3 md:px-3 bg-[white] rounded">
        <div className="flex flex-col text-sm py-2">
          <h2 className="text-base   font-semibold">
            Orders By Supplier
            {/* Aging Report (Purchase Order) */}
          </h2>
        </div>

        <div className="ml-auto flex my-3 h-8">
          {route?.pathname == "/home" ? (
            <ToolTip title="Go to PO Dashboard">
              <Button
                className=" bg-primary-bg p-0 text-base font-semibold normal-case  rounded"
                variant="contained"
                onClick={() => route.push("/order/purchaseOrder")}
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

          {/* <ToolTip title="View All">
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
          </ToolTip> */}
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
                          className={`whitespace-nowrap 
                          `}
                        >
                          {h}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody className="">
                  {orders.map((order, index) => (
                    <StyledTableRow className="whitespace-nowrap " key={index}>
                      <StyledTableCell align="center" className="">
                        {order?.supplierId ? order?.supplierId : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className=" text-sm z-[5] bg-[white]"
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
      <p className="ml-auto  invisible bg-[white] lg:text-sm xl:text-base md:text-sm sm:text-xs 2xl:text-base font-normal pt-2  md:py-0.5  text-end px-5 rounded-b-lg ">
        Click View All to see More
      </p>
      {/* </div> */}
    </div>
  );
};

export default OrderPerSupplier;
