import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
  tableCellClasses,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  Info,
  Visibility,
} from "@mui/icons-material";

import { useRouter } from "next/router";
import ViewDetails from "../../components/UI/ViewDetails";
import styled from "@emotion/styled";
import ToolTip from "../UI/Tooltip";
import { listFromDict } from "../../utils";
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
    value: "PARTIALLY CONFIRMED",
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
  { label: "SUPPLIER ID", key: "supplierId" },
  { label: "SUPPLIER NAME", key: "supplierName" },
  { label: "DELIVERY DATE", key: "deliveryDate" },

  {
    label: "STATUS",
  },
  {
    label: "LINE ITEMS",
  },

  {
    label: "ACTIONS",
  },
];

const PurchaseOrders = (props) => {
  const route = useRouter();
  const [openPopup, setOpenPopup] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [selectedHeading, setSelectedHeading] = useState("");
  const isXs = useMediaQuery("(max-width:1360px)");
  const hiddenFileInput = useRef(null);

  // const orders = useSelector(ordersSelector);
  // console.log(orders);

  const listFields = listFromDict({
    poNumber: { name: "Order Number" },
    orderDate: { name: "Order Date" },
    supplierId: { name: "Supplier ID" },
    supplierName: { name: "Supplier Name" },
    status: { name: "Status" },
    description: { name: "Description", type: "remarks" },
  });

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
  const orders = [
    {
      poNumber: "ORD001",
      orderDate: "2023-05-18",
      description: "Lorem ipsum dolor sit amet",
      supplierId: "SUP001",
      supplierName: "Supplier A",
      deliveryDate: "2023-05-25",
      status: "Pending",
      lineItems: [
        { item: "Product A", quantity: 5 },
        { item: "Product B", quantity: 10 },
      ],
    },
    {
      poNumber: "ORD002",
      orderDate: "2023-05-19",
      description: "Consectetur adipiscing elit",
      supplierId: "SUP002",
      supplierName: "Supplier B",
      deliveryDate: "2023-05-26",
      status: "Approved",
      lineItems: [
        { item: "Product C", quantity: 3 },
        { item: "Product D", quantity: 8 },
      ],
    },
    {
      poNumber: "ORD003",
      orderDate: "2023-05-20",
      description: "Duis aute irure dolor in reprehenderit",
      supplierId: "SUP003",
      supplierName: "Supplier C",
      deliveryDate: "2023-05-27",
      status: "Rejected",
      lineItems: [
        { item: "Product E", quantity: 2 },
        { item: "Product F", quantity: 4 },
      ],
    },
    {
      poNumber: "ORD004",
      orderDate: "2023-05-21",
      description: "Excepteur sint occaecat cupidatat non proident",
      supplierId: "SUP004",
      supplierName: "Supplier D",
      deliveryDate: "2023-05-28",
      status: "Pending",
      lineItems: [
        { item: "Product G", quantity: 6 },
        { item: "Product H", quantity: 12 },
      ],
    },
    {
      poNumber: "ORD005",
      orderDate: "2023-05-22",
      description: "Sed ut perspiciatis unde omnis iste natus error",
      supplierId: "SUP005",
      supplierName: "Supplier E",
      deliveryDate: "2023-05-29",
      status: "Approved",
      lineItems: [
        { item: "Product I", quantity: 4 },
        { item: "Product J", quantity: 7 },
      ],
    },
    {
      poNumber: "ORD006",
      orderDate: "2023-05-23",
      description: "Nemo enim ipsam voluptatem quia voluptas",
      supplierId: "SUP006",
      supplierName: "Supplier F",
      deliveryDate: "2023-05-30",
      status: "Pending",
      lineItems: [
        { item: "Product K", quantity: 3 },
        { item: "Product L", quantity: 9 },
      ],
    },
    {
      poNumber: "ORD007",
      orderDate: "2023-05-24",
      description: "Ut enim ad minima veniam, quis nostrum exercitationem",
      supplierId: "SUP007",
      supplierName: "Supplier G",
      deliveryDate: "2023-05-31",
      status: "Rejected",
      lineItems: [
        { item: "Product M", quantity: 2 },
        { item: "Product N", quantity: 5 },
      ],
    },
    {
      poNumber: "ORD008",
      orderDate: "2023-05-25",
      description: "At vero eos et accusamus et iusto odio",
      supplierId: "SUP008",
      supplierName: "Supplier H",
      deliveryDate: "2023-06-01",
      status: "Approved",
      lineItems: [
        { item: "Product O", quantity: 7 },
        { item: "Product P", quantity: 11 },
      ],
    },
    {
      poNumber: "ORD009",
      orderDate: "2023-05-26",
      description: "Temporibus autem quibusdam et aut officiis",
      supplierId: "SUP009",
      supplierName: "Supplier I",
      deliveryDate: "2023-06-02",
      status: "Pending",
      lineItems: [
        { item: "Product Q", quantity: 4 },
        { item: "Product R", quantity: 8 },
      ],
    },
    {
      poNumber: "ORD010",
      orderDate: "2023-05-27",
      description: "Sint et expedita distinctio blanditiis",
      supplierId: "SUP010",
      supplierName: "Supplier J",
      deliveryDate: "2023-06-03",
      status: "Approved",
      lineItems: [
        { item: "Product S", quantity: 3 },
        { item: "Product T", quantity: 6 },
      ],
    },
    {
      poNumber: "ORD011",
      orderDate: "2023-05-28",
      description: "Voluptatem accusantium doloremque laudantium",
      supplierId: "SUP011",
      supplierName: "Supplier K",
      deliveryDate: "2023-06-04",
      status: "Rejected",
      lineItems: [
        { item: "Product U", quantity: 2 },
        { item: "Product V", quantity: 4 },
      ],
    },
    {
      poNumber: "ORD012",
      orderDate: "2023-05-29",
      description: "Totam rem aperiam, eaque ipsa quae ab",
      supplierId: "SUP012",
      supplierName: "Supplier L",
      deliveryDate: "2023-06-05",
      status: "Pending",
      lineItems: [
        { item: "Product W", quantity: 5 },
        { item: "Product X", quantity: 10 },
      ],
    },
    {
      poNumber: "ORD013",
      orderDate: "2023-05-30",
      description: "Inventore veritatis et quasi architecto beatae",
      supplierId: "SUP013",
      supplierName: "Supplier M",
      deliveryDate: "2023-06-06",
      status: "Approved",
      lineItems: [
        { item: "Product Y", quantity: 3 },
        { item: "Product Z", quantity: 7 },
      ],
    },
    {
      poNumber: "ORD014",
      orderDate: "2023-05-31",
      description: "Nemo enim ipsam voluptatem quia voluptas",
      supplierId: "SUP014",
      supplierName: "Supplier N",
      deliveryDate: "2023-06-07",
      status: "Pending",
      lineItems: [
        { item: "Product AA", quantity: 2 },
        { item: "Product BB", quantity: 4 },
      ],
    },
    {
      poNumber: "ORD015",
      orderDate: "2023-06-01",
      description: "Ut enim ad minima veniam, quis nostrum exercitationem",
      supplierId: "SUP015",
      supplierName: "Supplier O",
      deliveryDate: "2023-06-08",
      status: "Rejected",
      lineItems: [
        { item: "Product CC", quantity: 6 },
        { item: "Product DD", quantity: 12 },
      ],
    },
  ];

  return (
    <div className="w-full lg:mt-12 mt-16  drawer-open reduce-wid  drawer-close smooth   fixed z-[3]">
      <div className="bg-[white]  ">
        <div class="overflow-auto">
          <TableContainer
            className=" xs:pb-20"
            style={{ maxHeight: "calc(100vh - 170px)" }}
            // sx={{ maxHeight: 460 }}
            component={Paper}
          >
            <Table
              stickyHeader
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              className="min-w-full sticky top-0 xs:mt-0"
            >
              <TableHead>
                <TableRow>
                  {listHeadings?.map((h, index) => {
                    return (
                      <StyledTableCell
                        onClick={() => {
                          setSelectedHeading(h);

                          h?.key && handleSort(h?.key);
                        }}
                        className={`
                       ${h?.label === "CRITICAL PARTS" && "text-center"} ${
                          h?.key && "whitespace-nowrap cursor-pointer"
                        } 
                    whitespace-nowrap
                          
                            `}
                        key={index}
                        style={{
                          padding: isXs ? "6px 14px" : "10px 14px",
                        }}
                      >
                        <ToolTip title={h?.key ? "Sort" : ""}>
                          <div>{h?.label}</div>
                        </ToolTip>
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((orderDetail, index) => (
                  <StyledTableRow
                    key={orderDetail?.poNumber}
                    className="whitespace-nowrap"
                  >
                    <StyledTableCell
                      className=" bg-[white]"
                      component="th"
                      align="left"
                      scope="row"
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                        maxWidth: "75.2px",
                        minWidth: "75.2px",
                      }}
                    >
                      {orderDetail?.poNumber ? orderDetail?.poNumber : "NA"}
                    </StyledTableCell>

                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                      className=" bg-[white]"
                    >
                      {orderDetail?.orderDate ? orderDetail?.orderDate : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      {orderDetail?.description
                        ? orderDetail?.description
                        : "NA"}
                    </StyledTableCell>

                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      {orderDetail?.supplierId ? orderDetail?.supplierId : "NA"}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      <div className="cursor-pointer underline decoration-blue-700">
                        {orderDetail?.supplierName
                          ? orderDetail?.supplierName
                          : "NA"}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell
                      align="left"
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      className={`${
                        orderDetail?.isDeliveryDateChanged &&
                        orderDetail?.statusForNewDeliveryDate == "ACCEPTED"
                          ? "text-[#3399ff]"
                          : "text-[black]"
                      }`}
                    >
                      {orderDetail?.deliveryDate
                        ? orderDetail?.deliveryDate
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      align="left"
                    >
                      {orderDetail?.status === "Rejected" ? (
                        <span className="text-[#FF1212]">REJECTED</span>
                      ) : orderDetail?.status === "Pending" ? (
                        <span className="text-[#ecd43b]">PENDING</span>
                      ) : orderDetail?.status === "Approved" ? (
                        <span className="text-[#3ED331]">APPROVED</span>
                      ) : (
                        orderDetail?.status?.toUpperCase()
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                    >
                      <div className="cursor-pointer underline decoration-blue-700">
                        {/* {Array.isArray(orderDetail?.totalItems)
                              ? orderDetail?.totalItems.length
                              : orderDetail?.totalItems
                              ? orderDetail?.totalItems
                              : ""} */}
                        {orderDetail?.lineItems?.length
                          ? orderDetail?.lineItems?.length
                          : ""}
                        {/* {console.log(orderDetail)} */}
                      </div>
                    </StyledTableCell>

                    <StyledTableCell
                      align="left"
                      style={{
                        padding: isXs ? "6px 14px" : "13px 14px",
                      }}
                      className="text-sm  whitespace-nowrap"
                    >
                      <div className="">
                        <ToolTip title="View">
                          <Visibility
                            className="text-[#6B7280] cursor-pointer"
                            fontSize="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenPopup(true);
                              setSelectedOrder(orderDetail);
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
        </div>
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

export default PurchaseOrders;
