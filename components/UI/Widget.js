import React from "react";

const Widget = (props) => {
  return (
    <div
      key={props.id}
      onClick={props.handleClick}
      className={`py-0.5 px-5 bg-[white]  max-h-40  ${
        props.title === "Quality Rejections" ? "mb-0" : "mb-3"
      } gap-x-8  rounded-lg   shadow-sm flex-1 cursor-pointer 
       flex flex-col justify-between`}
    >
      <div className="flex justify-between">
        <h1 className="text-base   md:whitespace-pre-line  font-bold tracking-wider text-left ">
          {props.title}
        </h1>
      </div>
      <div className="flex items-center my-1 md:items-center lg:items-start justify-between">
        <div
          className={`flex items-center md:text-xl lg:text-lg sm:text-base text-3xl justify-center rounded-full lg:h-10 lg:w-10 h-12 w-12  
    ${
      props.title === "Total Orders"
        ? "bg-[#F85D79]"
        : props.title === "Approved Orders"
        ? "bg-[#41a890]"
        : props.title === "Pending Orders"
        ? "bg-[#66a2df]"
        : props.title === "Rejected Orders" || "Quality Rejections"
        ? "bg-[#F17B33]"
        : ""
    }`}
          style={{ color: "white" }}
        >
          {props.icon}
        </div>
        <div className="">
          <h2 className="font-bold  text-base">{props.number}</h2>
          <h2 className="font-normal text-sm">POs</h2>
        </div>
      </div>
      <h2 className="font-medium text-sm  order-2 whitespace-nowrap text-[#65748B]">
        {props.subtitle}
      </h2>
    </div>
  );
};

export default Widget;
