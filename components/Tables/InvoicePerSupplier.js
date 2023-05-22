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
import { invoiceReport } from "../../store/slices/invoiceSlice";
import { $windowExists } from "../../utils";
import { useAuth } from "../../utils/hooks";
import ToolTip from "../UI/Tooltip";

const listHeadings = [
  "SUPPLIER ID",
  "SUPPLIER NAME",
  "FOR PAYMENT",
  "DELAYED",
  "DUE IN 7D",
  "DUE IN 7-14D",
];
const result = [
  {
    supplierId: "1234",
    supplierName: "Wallmart",
    forPayment: 4,
    delay: 4,
    dueIn7d: 1,
    dueIn7To14d: 2,
  },
  {
    supplierId: "1234",
    supplierName: "Wallmart",
    forPayment: 4,
    delay: 4,
    dueIn7d: 1,
    dueIn7To14d: 2,
  },
  {
    supplierId: "1234",
    supplierName: "Wallmart",
    forPayment: 4,
    delay: 4,
    dueIn7d: 1,
    dueIn7To14d: 2,
  },
  {
    supplierId: "1234",
    supplierName: "Wallmart",
    forPayment: 4,
    delay: 4,
    dueIn7d: 1,
    dueIn7To14d: 2,
  },
];

const InvoicePerSupplier = () => {
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const route = useRouter();
  const [type, setType] = useState("InvoicesPerSupplier");

  const isLg = useMediaQuery("(min-width:1500px)");
  const isXs = useMediaQuery("(max-width:1360px)");
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      // backgroundColor: { xs: "#F3F4F6", md: "blue", lg: "red" },
      backgroundColor: "#F3F4F6",
      color: "#121828",
      fontWeight: 600,
      fontFamily: "Roboto",
      fontSize: 12,
      padding: "4px 18px",
    },
    [`&.${tableCellClasses.head.breakpoints}`]: {
      backgroundColor: "#121828",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: isXs ? 12 : 15,
      fontFamily: "Roboto",
      padding: isXs ? "5px 10px" : "8px 18px",
      // fontFamily: "Gentium Book Plus",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({}));

  return (
    <div className="bg-[white] rounded">
      <div className="flex flex-row px-5 xs:px-3 md:px-3 bg-[white] rounded">
        <div className="flex flex-col text-sm py-2">
          <h2 className="text-base   font-semibold">
            Invoices Per Supplier
            {/* Aging Report (Invoices) */}
          </h2>
        </div>

        {/* <div className="ml-auto flex my-3 h-8">
          <ToolTip title="View All">
            <Button
              className=" bg-[#03045E] hover:bg-[#0e106a] py-1  font-semibold normal-case  rounded ml-auto"
              variant="contained"
              onClick={() =>
                route.push({
                  pathname: "/agingreport",
                  query: {
                    type: "Aging Report",
                    // subType:"InvoicesPerSupplier"
                  },
                })
              }
            >
              View All
            </Button>
          </ToolTip>
        </div> */}
      </div>

      <div className="">
        {!loading && result?.length > 0 ? (
          <div class="overflow-hidden  ">
            <TableContainer
              // className=" pb-20"
              sx={{ minHeight: isLg ? 180 : 20 }}
              component={Paper}
            >
              <Table
                sx={{ minWidth: 700 }}
                aria-label="customized table"
                style={{
                  marginTop: (result?.length > 0 || loading) && "lg:2px 10px",
                }}
              >
                <TableHead>
                  <TableRow>
                    {listHeadings?.map((h, index) => {
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
                        >
                          {h}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody className="">
                  {result?.map((invoice, index) => (
                    <StyledTableRow key={index} className="whitespace-nowrap">
                      <StyledTableCell
                        className="sticky left-0 top-0 z-[5] bg-[white]"
                        align="center"
                        style={{
                          padding: "8px 18px",
                        }}
                      >
                        {invoice?.supplierId ? invoice?.supplierId : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          padding: "8px 18px",
                        }}
                        className="sticky left-[7.07rem] lg:left-[6.2rem] md:left-[5.1rem] z-[5] bg-[white]"
                      >
                        {invoice?.supplierName ? invoice?.supplierName : "NA"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          padding: "8px 18px",
                        }}
                        component="th"
                        scope="row"
                      >
                        {type == "InvoicesPerSupplier"
                          ? invoice?.forPayment
                          : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "red",
                          padding: "8px 18px",
                        }}
                      >
                        {invoice?.delay ? invoice?.delay : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "#e3d408",
                          padding: "8px 18px",
                        }}
                      >
                        {invoice?.dueIn7d ? invoice?.dueIn7d : "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "#e3d408",
                          padding: "8px 18px",
                        }}
                      >
                        {invoice?.dueIn7To14d ? invoice?.dueIn7To14d : "0"}
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
        <div>
          <p className="ml-auto mt-auto invisible pt-1 lg:text-sm xl:text-base md:text-sm sm:text-xs 2xl:text-base font-normal   text-end px-5">
            Click View All to see More
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePerSupplier;
