import {
  ArrowBack,
  CalendarMonth,
  Close,
  KeyboardArrowDown,
  KeyboardArrowRight,
  KeyboardArrowUp,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";
import ToolTip from "../../../components/UI/Tooltip";
import {
  getPurchaseOrder,
  itemsSelector,
  ordersSelector,
} from "../../../store/slices/orderSlice";
import { useAuth } from "../../../utils/hooks";
import moment from "moment";

const LineItemsDetail = ({
  selInvoiceOrder,
  showItemDetails,
  selectedItem,
  setSelectedItem,
  setShowItemDetails,
}) => {
  return selInvoiceOrder?.totalItems?.map((item, idx) => (
    <>
      <div className="flex flex-col py-2 shadow-md w-full rounded-md mx-4">
        <h1
          className=" text-sm font-semibold lg:text-xs mb-0.5 px-2 cursor-pointer"
          onClick={() => {
            setSelectedItem(item);
            setShowItemDetails(true);
          }}
        >
          {showItemDetails ? (
            <KeyboardArrowDown className="text-lg" />
          ) : (
            <KeyboardArrowRight className="text-lg" />
          )}
          Line Items {idx + 1}
          {item?.itemDescription ? item?.itemDescription : "NA"}{" "}
          {/* {console.log(item, "item")} */}
          {!!selInvoiceOrder?.newDeliveryDate ? (
            <>
              <span
                className={`mr-2
                ${
                  item?.statusForNewDeliveryDate == "REJECTED"
                    ? "text-[#3399ff]"
                    : "text-black"
                }
                ${
                  item?.statusForNewDeliveryDate == "ACCEPTED" && "line-through"
                }
                
                `}
              >
                (Need By: {item?.oldDeliveryDate ? item?.oldDeliveryDate : "NA"}
                )
              </span>
              <span
                className={`
                ${
                  item?.statusForNewDeliveryDate == "ACCEPTED"
                    ? "text-[#3399ff]"
                    : "text-black"
                }
                ${
                  item?.statusForNewDeliveryDate == "REJECTED" && "line-through"
                }
                
                `}
              >
                (New Need By Date:{" "}
                {selInvoiceOrder?.newDeliveryDate
                  ? item?.newDeliveryDate
                  : "NA"}
                ){" "}
              </span>
            </>
          ) : (
            ` (Need By: ${
              item?.oldDeliveryDate ? item?.oldDeliveryDate : "NA"
            })`
          )}{" "}
        </h1>
        {selectedItem?.itemNo == item?.itemNo
          ? showItemDetails && (
              <div className="text-xs py-2 font-semibold  rounded-md mx-4 mb-0.5">
                <div
                  className={`pb-1 ${
                    item?.followUpStatus1 === "COMPLETED" && "text-[orange]"
                  }`}
                >
                  <span className="mr-2 text-[#6B7280]">FOLLOW UP 1:</span>
                  <span className="font-medium pr-2">
                    {item?.followUp1 ? item?.followUp1 : "NA"}
                  </span>
                  <span className="font-medium">
                    {item?.followUpStatus1 ? item?.followUpStatus1 : "NA"}
                  </span>
                </div>

                <div
                  className={`pb-1 ${
                    item?.followUpStatus2 === "COMPLETED" && "text-[orange]"
                  }`}
                >
                  <span className="  mr-2 text-[#6B7280]">FOLLOW UP 2:</span>
                  <span className="font-medium">
                    {item?.followUp2 ? item?.followUp2 : "NA"}
                  </span>
                  <span className="font-medium">
                    {item?.followUpStatus2
                      ? `  ${item?.followUpStatus2}`
                      : "NA"}
                  </span>
                </div>
                <div
                  className={`pb-1 ${
                    item?.followUpStatus3 === "COMPLETED" && "text-[orange]"
                  }`}
                >
                  <span className="  mr-2 text-[#6B7280]">NEXT FOLLOW UP:</span>
                  <span className="font-medium">
                    {item?.followUp3 ? item?.followUp3 : "NA"}
                  </span>
                  <span className="font-medium">
                    {item?.followUpStatus3
                      ? `  ${item?.followUpStatus3}`
                      : "NA"}
                  </span>
                </div>
              </div>
            )
          : ""}
      </div>
    </>
  ));
};

const orderNo = () => {
  const [show, setShow] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [selInvoiceOrder, setSelInvoiceOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("OrdersPerSupplier");
  const [loading, setLoading] = useState(false);
  const items = useSelector(itemsSelector);
  const route = useRouter();
  const { user, fallBack } = useAuth();
  const todaysDate = new Date();
  const orders = useSelector(ordersSelector);
  const suppEmail =
    orders?.data[0] && orders?.data[0].supplierEmail
      ? orders?.data[0].supplierEmail
      : "NA";
  const { supplierName, supplierId } = route.query;
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (user) {
      if (route.query?.type) {
        setType(route.query?.type);
      }

      if (route.query.supplierName) {
        const supplierName = route.query.supplierName;
        setSupplier(supplierName);

        getOrdersOfSelSupplier(supplierName);
      }
    }
  }, [user, searchText, route?.query?.type, route.query.supplierName]);

  const getOrdersOfSelSupplier = async (supplier) => {
    setLoading(true);

    let conditions = {};

    if (route?.query?.type == "InvoicesPerSupplier") {
      conditions = {
        status: "RECEIVED",
        delay: true,
        supplierName: supplier,
      };
    } else {
      conditions = {
        delay: true,
        supplierName: supplier,
      };
    }
    try {
      let payload = {
        pagination: {
          limit: 100,
          page: page,
        },
        conditions: conditions,
      };

      if (searchText.length > 0) {
        payload.searchTerm = searchText;
      }

      const res = await dispatch(getPurchaseOrder(payload));
      if (res) {
        console.log(res?.data?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full  bg-[#E5E5E5] min-h-screen flex flex-col px-5  ">
        <>
          <div className="bg-[white] lg:text-xs shadow-lg mb-3 xs:mb-0 lg:mb-0 rounded-sm px-4 h-52 lg:mt-5 mt-4  xs:static drawer-open reduce-wid drawer-close smooth   fixed z-[3]  lg:h-32 md:h-44">
            <>
              <div className=" flex flex-row items-center mt-4  lg:mt-1">
                <div
                  className="text-xl lg:mb-0 lg:text-base cursor-pointer "
                  onClick={() => {
                    route.push(`/agingreport?type=${type}`)
                  }
                  }
                >
                  <ToolTip title="Back">
                    <ArrowBack />
                  </ToolTip>
                </div>
                <span className="text-2xl  lg:text-base font-bold ml-1">
                  {supplierName ? supplierName : "Supplier Name"}
                </span>
              </div>
              <div
                onClick={() => setShow(!show)}
                className="font-semibold  mb-0.5 w-fit"
              >
                {show ? (
                  <ToolTip title="Close">
                    <KeyboardArrowUp className="mr-4 text-lg" fontSize="22" />
                  </ToolTip>
                ) : (
                  <ToolTip title="Show More">
                    <KeyboardArrowDown
                      className="mr-4 text-lg "
                      fontSize="22"
                    />
                  </ToolTip>
                )}
                <span className="text-xl font-semibold lg:text-xs mr-4">
                  Supplier Details
                </span>
              </div>
              {show ? (
                <div className="flex flex-col py-2 lg:text-xs shadow-md px-3 rounded-md mx-4">
                  <div className="  pb-1  ">
                    <span className="mr-2 text-[#6B7280] lg:text-xs">
                      Contact Person:
                    </span>
                    <span className="font-medium text-sm lg:text-xs">
                      {supplierName ? supplierName : "Supplier Name"}
                    </span>
                  </div>
                  <div className="  pb-1 ">
                    <span className="mr-2 text-[#6B7280] lg:text-xs">
                      Email:
                    </span>
                    <span className="font-medium text-sm lg:text-xs">
                      {suppEmail ? suppEmail : "Supplier Email"}
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          </div>
          <div className="w whitespace-nowrap drawer-open reduce-wid drawer-close  smooth gap-4 xs:gap-2  xs:static fixed z-[3] lg:mt-40 md:mt-52 xs:mt-4 mt-64 flex xs:flex-col xs:w-full flex-row  ">
            <div
              className={`w-1/2 xs:mb-2 xs:w-full  bg-[white] rounded-sm  lg:h-[300px] pt-0 relative xl:h-[450px] h-[300px]   px-4 
              ${orders?.data?.length > 3 ? "overflow-y-auto" : ""} 
              `}
            >
              {loading ? (
                <div className="flex justify-center w-full h-full items-center">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <div className="sticky z-[3] bg-[white] top-0 ">
                    <h2 className="text-xl font-bold  py-2  lg:text-sm">
                      Purchase Orders
                    </h2>
                    <TextField
                      size="small"
                      className=" w-full mb-1"
                      type="text"
                      id="input-with-icon-textfield"
                      label="Search"
                      variant="outlined"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label="Toggle password visibility">
                              {searchText?.length > 0 ? (
                                <Close onClick={() => setSearchText("")} />
                              ) : (
                                <AiOutlineSearch />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  <div className=" flex justify-center  flex-col">
                    {orders?.data?.length != 0 ? (
                      orders?.data?.map((d, idx) => {
                        const date =
                          type === "InvoicesPerSupplier" && !!d.paymentDueDate
                            ? d.paymentDueDate.split(".")
                            : d?.deliveryDate.split(".");
                        const year = date[2];
                        const month = date[1] - 1;
                        const day = date[0];
                        const needBy = new Date(year, month, day);
                        return (
                          <div
                            key={d?.id}
                            className={`flex items-center justify-center cursor-pointer mt-1 p-2 lg:text-xs shadow-sm ${selInvoiceOrder?._id == d._id && "bg-[#efe7e7] rounded"}`}
                            onClick={() => {
                              setShowItems(true);
                              setSelInvoiceOrder(d);
                            }}
                          >
                            <div className="mt-1 mr-auto top-0 ml-1 ">
                              <ShoppingCartOutlined fontSize="medium" />
                            </div>
                            <div className="flex flex-col  lg:my-0 pt-1 bg-white text-black w-5/6">
                              <div className="flex justify-between  px-2 ">
                                <p className="text-base lg:text-xs font-bold mr-2">
                                  {d?.poNumber ? d?.poNumber : "NA"}
                                </p>
                              </div>
                              <div
                                className={`py-2 lg:py-0.5 mx-2 bg-white text-xs text-left pl-0 font-medium
    flex justify-between  px-4
    `}
                              >
                                <p>
                                  Items:{" "}
                                  {d?.totalItems?.length
                                    ? d?.totalItems?.length
                                    : "NA"}
                                </p>

                                {needBy < todaysDate ? (
                                  <span className="text-[#FF1212]">
                                    DELAYED
                                  </span>
                                ) : (
                                  <p className="text-xs py-0.5">
                                    {d?.status === "REJECTED" ? (
                                      <span className="text-[#FF1212]">
                                        REJECTED
                                      </span>
                                    ) : d?.status === "CONFIRMED" ? (
                                      <span className="text-[#3ED331]">
                                        CONFIRMED
                                      </span>
                                    ) : d?.status === "ORDERED" ? (
                                      <span className="text-[#3ED331]">
                                        ORDERED
                                      </span>
                                    ) : d?.status === "PARTIALLY REJECTED" ? (
                                      <span className="text-[#FF1212]">
                                        PARTIALLY REJECTED
                                      </span>
                                    ) : d?.status === "PARTIALY CONFIRMED" ? (
                                      <span className="text-[#3ED331]">
                                        PARTIALY CONFIRMED
                                      </span>
                                    ) : d?.status === "RECEIVED" ? (
                                      <span className="text-[#3ED331]">
                                        RECEIVED
                                      </span>
                                    ) : d?.status === "PARTIALLY RECEIVED" ? (
                                      <span className="text-[#3ED331]">
                                        PARTIALY RECEIVED
                                      </span>
                                    ) : d?.status === "SHIPPED" ? (
                                      <span className="text-[#90EE90]">
                                        SHIPPED
                                      </span>
                                    ) : (
                                      d?.status.toUpperCase()
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <ToolTip title="Show Details">
                                <IconButton
                                  aria-label="more"
                                  id="long-button"
                                  aria-controls={open ? "long-menu" : undefined}
                                  aria-expanded={open ? "true" : undefined}
                                  aria-haspopup="true"
                                  onClick={(e) => {}}
                                >
                                  <KeyboardArrowRight className="text-lg m-1" />
                                  {/* </ToolTip> */}
                                </IconButton>
                              </ToolTip>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="font-semibold text-base text-center shadow-sm py-2 h-full  flex justify-center items-center">
                        No Orders{" "}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {
              <div
                className={`w-1/2  bg-[white] xs:ml-0 xs:w-full  rounded-sm px-3   py-2 lg:h-[300px] xl:h-[450px] h-[300px] overflow-y-auto  ${
                  items?.data?.length > 7 ? "overflow-y-scroll" : ""
                }`}
              >
                <div className="text-lg lg:text-sm font-bold ">
                  {type == "InvoicesPerSupplier"
                    ? "PO Details"
                    : `Item Details ${selInvoiceOrder ? `(PO ${selInvoiceOrder?.poNumber})` : "" }`}
                </div>
                {showItems ? (
                  type == "InvoicesPerSupplier" ? (
                    <div className="bg-[white] lg:text-xs py-5 lg:py-2  px-2.5 ">
                      <>
                        <div className="  pb-1">
                          <span className="mr-2 text-[#6B7280]">
                            PO Number:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.poNumber
                              ? selInvoiceOrder?.poNumber
                              : "NA"}
                          </span>
                        </div>

                        <div className="  pb-1">
                          <span className="  mr-2 text-[#6B7280]">
                            PO Description:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.description
                              ? selInvoiceOrder?.description
                              : "NA"}
                          </span>
                        </div>

                        <div className="  pb-1">
                          <span className="  mr-2 text-[#6B7280]">
                            Supplier ID:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.supplierId
                              ? selInvoiceOrder?.supplierId
                              : "NA"}
                          </span>
                        </div>
                        <div className="  pb-1">
                          <span className="  mr-2 text-[#6B7280]">
                            Supplier Name:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.supplierName
                              ? selInvoiceOrder?.supplierName
                              : "NA"}
                          </span>
                        </div>
                        <div className="  pb-1">
                          <span className="mr-2 text-[#6B7280]">
                            Invoice Number:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.invoiceNo
                              ? selInvoiceOrder?.invoiceNo
                              : "NA"}
                          </span>
                        </div>
                        <div className="  pb-1">
                          <span className="mr-2 text-[#6B7280]">
                            Invoice Date:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.invoiceDate
                              ? selInvoiceOrder?.invoiceDate
                              : "NA"}
                          </span>
                        </div>

                        <div className="  pb-1">
                          <span className="mr-2 text-[#6B7280]">
                            Payment Terms:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.paymentTerms
                              ? selInvoiceOrder?.paymentTerms
                              : "NA"}
                          </span>
                        </div>
                        <div className="  pb-1">
                          <span className="mr-2 text-[#6B7280]">
                            Payment Due Date:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.paymentDueDate
                              ? selInvoiceOrder?.paymentDueDate
                              : "NA"}
                          </span>
                        </div>
                        <div className="  pb-1">
                          <span className="mr-2 text-[#6B7280]">
                            {selInvoiceOrder?.deleyedByDays
                              ? "Delayed by days"
                              : "Due by days"}
                            :
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.deleyedByDays
                              ? selInvoiceOrder?.deleyedByDays
                              : selInvoiceOrder?.dueByDays}
                          </span>
                        </div>
                        <div className="  pb-1">
                          <span className="mr-2 text-[#6B7280]">
                            Placed on <CalendarMonth fontSize="14px" />:
                          </span>
                          <span className="font-medium">
                            {selInvoiceOrder?.orderDate
                              ? selInvoiceOrder?.orderDate
                              : "NA"}
                          </span>
                        </div>
                      </>
                      <div className="  pb-1 lg:text-xs">
                        <span className="mr-2 lg:text-xs text-[#6B7280]">
                          Line Items:
                        </span>
                        <span className="font-medium">
                          {
                            <LineItemsDetail
                              selInvoiceOrder={selInvoiceOrder}
                              showItemDetails={showItemDetails}
                              selectedItem={selectedItem}
                              setSelectedItem={setSelectedItem}
                              setShowItemDetails={setShowItemDetails}
                            />
                          }
                        </span>
                      </div>
                    </div>
                  ) : (
                    <LineItemsDetail
                      selInvoiceOrder={selInvoiceOrder}
                      showItemDetails={showItemDetails}
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                      setShowItemDetails={setShowItemDetails}
                    />
                  )
                ) : (
                  <div className="font-semibold text-base text-center lg:text-xs shadow-sm py-2 ">
                    Select Order to view items{" "}
                  </div>
                )}
              </div>
            }
          </div>
        </>
      </div>
    </>
  );
};

export default orderNo;
