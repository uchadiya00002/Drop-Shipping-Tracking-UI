import { ArrowBack, Router } from "@mui/icons-material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailCard from "../../components/UI/DetailCard";
import { collabSelector, fetchcollabs } from "../../store/slices/collabSlice";
import { useAuth } from "../../utils/hooks";

const DetailPage = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const [orderNo, setOrderNo] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedBuyerId, setSelectedBuyerId] = useState("");
  const { user, fallBack } = useAuth();
  const collabs = useSelector((state) => state.collabs?.collabs);

  useEffect(async () => {
    if (user && route) {
      const poNumber = route.query.poNumber;
      const itemNumber = route.query.itemNumber;
      const buyerId = route.query.buyerId;
      setOrderNo(poNumber);
      setSelectedItem(itemNumber);
      setSelectedBuyerId(buyerId);
      getCollabDetails(poNumber);
    }
  }, [user, route.query]);

  const getCollabDetails = async (poNumber) => {
    try {
      let payload = {
        conditions: {
          orderNo: poNumber,
        },
      };
      const res = await dispatch(fetchcollabs(payload));
      if (res) {
      }
    } catch (error) {
    } finally {
    }
  };

  return (
    <>
      {collabs?.data?.map(
        (collab, index) =>
          selectedBuyerId === collab?.allItemDetails[0]?.userId?._id &&
          collab?.orderNo === orderNo && (
            <div
              className="w-full min-h-screen  bg-[#E5E5E5] flex flex-col px-5 "
              key={collab?.orderNo}
            >
              <div className="flex  my-5 lg:my-2 items-center">
                <div
                  title="Back"
                  className="text-lg lg:text-base  mr-2 cursor-pointer "
                  onClick={() => route.back()}
                >
                  <ArrowBack />
                </div>
                <h2 className="text-3xl font-medium lg:font-semibold lg:text-base ">
                  {collab?.orderNo ? collab?.orderNo : "Order Number"}
                </h2>
              </div>
              <div className="flex justify-start lg:text-sm xs:justify-center mb-4 lg:mb-2 items-center xs:px-0  xs:flex-col xs:w-full ">
                <div className="w-64 px-4  bg-[white] min-h-[100px] lg:min-h-[70px] rounded-xl xs:mx-2  mr-4 py-1 xs:w-full xs:mb-4 ">
                  <div className="flex flex-row">
                    <p className="font-semibold mr-4">Supplier:</p>
                    <span className="font-normal">
                      {collab?.supplierName ? collab?.supplierName : "NA"}
                    </span>
                  </div>
                  <div className="flex flex-row">
                    <p className="font-semibold mr-4">Order Date::</p>
                    <span className="font-normal">
                      {collab?.orderDate ? collab?.orderDate : "NA"}
                    </span>
                  </div>
                </div>
                <div className="w-96 min-h-[100px] lg:min-h-[70px] px-4 bg-[white] mr-4 py-2 xs:mx-2 xs:w-full rounded-xl  ">
                  {collab?.orderDescription ? collab?.orderDescription : "NA"}
                </div>
              </div>

              {/* <div className="my-8"> */}
              {collab?.allItemDetails?.map(
                (item, index) =>
                  selectedBuyerId === item?.userId?._id &&
                  selectedItem === item?.itemNo && (
                    <div className="flex justify-between w-full min-h-[200px] lg:min-h-[180px] max-h-fit mt-8 lg:mt-3 xs:flex-col xs:mx-0">
                      <div className="px-4 bg-[white] w-72 xs:w-full xs:mx-2  min-h-[200px] lg:min-h-[180px] rounded-xl mr-2.5 my-2.5 whitespace-nowrap  py-2">
                        <h2 className="text-xl lg:text-sm font-medium py-2 ">
                          Material Availability
                        </h2>
                        {item?.reason?.length > 0
                          ? item?.reason?.map((reason) =>
                              reason?.name === "Material Availability" ? (
                                <DetailCard item={item} reason={reason} />
                              ) : (
                                ""
                              )
                            )
                          : ""}
                      </div>

                      <div className="px-4 bg-[white] w-72 xs:w-full xs:mx-2 min-h-[200px] lg:min-h-[180px] rounded-xl  m-2.5 whitespace-nowrap  py-2">
                        <h2 className="text-xl lg:text-sm font-medium py-2 ">
                          Processing
                        </h2>
                        {item?.reason?.length > 0
                          ? item?.reason?.map(
                              (reason) =>
                                reason?.name === "Processing" && (
                                  <DetailCard item={item} reason={reason} />
                                )
                            )
                          : ""}
                      </div>

                      <div className="px-4 bg-[white] w-72 xs:w-full xs:mx-2  min-h-[200px] lg:min-h-[180px] rounded-xl m-2.5 whitespace-nowrap py-2 ">
                        <h2 className="text-xl lg:text-sm font-medium py-2 ">
                          Prepare to dispatch
                        </h2>
                        {item?.reason?.length > 0
                          ? item?.reason?.map(
                              (reason) =>
                                reason?.name === "Prepare to dispatch" && (
                                  <DetailCard item={item} reason={reason} />
                                )
                            )
                          : ""}
                      </div>

                      <div className="px-4 bg-[white] w-72 xs:w-full xs:mx-2 min-h-[200px] lg:min-h-[180px] rounded-xl m-2.5 whitespace-nowrap py-2 ">
                        <h2 className="text-xl lg:text-sm font-medium py-2 ">
                          Shipped
                        </h2>
                        {item?.reason?.length > 0
                          ? item?.reason?.map(
                              (reason) =>
                                reason?.name === "Shipped" && (
                                  <DetailCard item={item} reason={reason} />
                                )
                            )
                          : ""}
                      </div>

                      <div className="px-4 bg-[white] w-72 xs:w-full xs:mx-2 min-h-[200px] lg:min-h-[180px] rounded-xl  ml-2.5 my-2.5 whitespace-nowrap py-2 ">
                        <h2 className="text-xl lg:text-sm font-medium py-2 ">
                          Received
                        </h2>
                        {item?.reason?.length > 0
                          ? item?.reason?.map(
                              (reason) =>
                                reason?.name === "Received" && (
                                  <DetailCard item={item} reason={reason} />
                                )
                            )
                          : ""}
                      </div>
                    </div>
                  )
              )}
            </div>
          )
      )}
    </>
  );
};

export default DetailPage;
