import { Button, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Widget from "../components/UI/Widget";
import { useAuth } from "../utils/hooks";
import {
  ShoppingCartOutlined,
  DescriptionOutlined,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import OrderPerSupplier from "../components/Tables/OrderPerSupplier";
import InvoicePerSupplier from "../components/Tables/InvoicePerSupplier";
import DognutContainer from "../components/chart/DognutContainer";
import CriticalPartChart from "../components/chart/CriticalPartChart";
import moment from "moment";
import ReasonBar from "../components/chart/ReasonBar";
import DelayedOrdersChart from "../components/chart/DelayedOrdersChart";
import BarGraph from "../components/chart/barGraph";

const home = () => {
  const currentHour = moment().hour();
  const [startDate, setStartDate] = useState(
    moment().startOf("year").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().add(1, "y").startOf("year").format("YYYY-MM-DD")
  );
  const [selectedStatus, setSelectedStatus] = useState("THIS YEAR");
  const [count, setCount] = useState(0);
  const [greetingStatus, setGreetingStatus] = useState("Welcome");
  const route = useRouter();
  const isLg = useMediaQuery("(min-width:1500px)");
  const [w, setW] = useState();
  const handleGreeting = async () => {
    if (currentHour >= 3 && currentHour < 12) {
      setGreetingStatus("Good Morning");
    } else if (currentHour >= 12 && currentHour < 15) {
      setGreetingStatus("Good Afternoon");
    } else if (currentHour >= 15 && currentHour < 20) {
      setGreetingStatus("Good Evening");
    } else {
      setGreetingStatus("Welcome");
    }
  };

  // document.addEventListener('visibilitychange',e=>{
  //   window.location.href = route.pathname
  //   // e.preventDefault()
  // })

  // document.addEventListener('focus',e=>{
  //   alert("XYZ")
  // })

  // document.addEventListener('contextmenu',e=>{
  //   e.preventDefault()
  // })

  return (
    <div className=" bg-[#E5E5E5] flex flex-col px-3 pb-5 grow ">
      <div className=" mx-3 xs:mx-1  grid grid-cols-4 mt-4 md:grid-cols-2 xs:grid-cols-2 gap-4 ">
        <div className=" whitespace-nowrap  w-full ">
          <Widget
            id="1"
            title="Total Orders"
            icon={<ShoppingCartOutlined fontSize="12" />}
            number={10}
            subtitle="Total Orders"
            handleClick={() => route.push("/transactionalData")}
          />
        </div>
        <div className="whitespace-nowrap w-full ">
          <Widget
            id="2"
            title="Pending Orders"
            icon={<DescriptionOutlined fontSize="12" />}
            number={2}
            subtitle="Delivery Date For Aprroval"
            handleClick={() =>
              route.push({
                pathname: "/transactionalData",
                query: {
                  type: "PENDING",
                },
              })
            }
          />
        </div>
        <div className=" w-full">
          <Widget
            id="3"
            title="Approved Orders"
            icon={<ThumbUpAltOutlined fontSize="12" />}
            number={6}
            subtitle="New Delivery Date Approved"
            handleClick={() =>
              route.push({
                pathname: "/transactionalData",
                query: {
                  type: "ACCEPTED",
                },
              })
            }
          />
        </div>
        <div className="  w-full ">
          <Widget
            id="4"
            title="Rejected Orders"
            icon={<ThumbDownAltOutlined fontSize="12" />}
            number={2}
            subtitle="New Delivery Date Rejected"
            handleClick={() =>
              route.push({
                pathname: "/transactionalData",
                query: {
                  type: "REJECTED",
                },
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5  gap-4 xs:grid-cols-1 justify-items-stretch	 xs:mx-1 mx-3   items-stretch">
        <div className="col-span-3 flex flex-col gap-3  h-full xs:col-span-1  rounded-md shadow-sm  ">
          <div className="h-1/2 xs:h-full bg-[white] rounded shadow-sm">
            <OrderPerSupplier />
          </div>
          <div className="h-1/2 xs:h-full  bg-[white] rounded shadow-sm">
            <InvoicePerSupplier />
          </div>
        </div>

        <div className=" md:col-span-2  gap-3  col-span-1 flex justify-center flex-col ">
          <div className="bg-[white] pt-2 h-2/4     rounded shadow-sm">
            <div className=" px-6   font-bold text-center">
              Order Approval Status
            </div>
            <div className=" h-52 px-3 lg:px-1">
              <DognutContainer />
            </div>{" "}
          </div>

          <div className="bg-[white]   w-full h-1/2   rounded  shadow-sm  ">
            <div className="flex flex-row  w-full sticky p-1.5  ">
              <h2 className=" font-semibold">Critical Parts</h2>
              {/* <Button
                className=" bg-[#04045E] hover:bg-[#0e106a] py-1 text-sm font-semibold normal-case  rounded ml-auto"
                variant="contained"
                onClick={() => route.push("/collaborationRoom")}
              >
                View All
              </Button> */}
            </div>
            <div>
              <CriticalPartChart count={count} />
            </div>
          </div>
        </div>
        <div className=" flex col-span-4 gap-3 xs:flex-col h-full xs:col-span-1   rounded-md shadow-sm  ">
          <div className=" bg-[white] w-2/4 rounded-lg md:w-full xs:w-full py-2 shadow-sm md:mb-4  md:mr-1   px-3 ">
            <div className="text-lg md:text-xs  font-bold mt-3 xs:mt-0 pl-1.5">
              Top Reasons For Rejections
            </div>
            <div className=" ">
              <ReasonBar />
            </div>
          </div>{" "}
          {/* <div className="  bg-[white] w-1/3 rounded shadow-sm">
            <div className=" h-48    ">
              <DelayedOrdersChart />
            </div>{" "}
          </div> */}
          <div className=" bg-[white]  w-2/4 xs:w-full py-2  md:w-full rounded-lg shadow-sm md:mb-4   px-3 xs:mx-0 ">
            <div className="flex mt-3">
              <div className="font-bold xs:text-sm md:text-xs text-lg  ">
                Delayed Deliveries By Supplier
              </div>
            </div>
            <div className=" ">
              <BarGraph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;
