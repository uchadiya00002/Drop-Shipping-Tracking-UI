import React from "react";

const DetailCard = ({ item, reason }) => {
  return (
    <div className="bg-[#65748B] rounded-md my-2 p-2 min-h-36 font-normal text-xs bg-opacity-5 ">
      <div className="flex flex-row justify-between pb-2">
        <p className=" mr-4">Item No: {item?.itemNo ? item?.itemNo : ""}</p>
        <span className="text-[#F85D79]">{item?.eta ? item?.eta : ""}</span>
      </div>
      <div className="mr-4  pb-2">
        Status:
        <span className=" ml-1">{reason?.status ? reason?.status : ""}</span>
      </div>
      <p className="mr-4 pb-2">
        Delivery Date: {item?.itemDeliveryDate ? item?.itemDeliveryDate : ""}
      </p>
      <p className="mr-4 text-[#65748B] ">
        {reason?.value ? reason?.value : ""}
      </p>
    </div>
  );
};

export default DetailCard;
