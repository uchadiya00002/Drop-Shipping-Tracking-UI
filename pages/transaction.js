import React from "react";

import { useRouter } from "next/router";

import DognutContainer from "../components/chart/DognutContainer";
import CriticalPartChart from "../components/chart/CriticalPartChart";
import ReasonBar from "../components/chart/ReasonBar";
import BarGraph from "../components/chart/barGraph";

const Dashboard = () => {
  const route = useRouter();

  return (
    <div className=" bg-[#E5E5E5] flex flex-col px-3 pb-5 grow ">
      <div className=" mx-3 xs:mx-1  text-xl font-bold mb-2 grid grid-cols-4 mt-4 md:grid-cols-2 xs:grid-cols-2 gap-4 ">
        Transactional Details
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5  gap-4 xs:grid-cols-1 justify-items-stretch	 xs:mx-1 mx-3   items-stretch">
        <div className=" md:col-span-1 xs:col-span-1   xs:flex-col md:flex-col gap-4  col-span-4 flex  ">
          <div className="bg-[white] pt-2   w-2/4 md:w-full xs:w-full  rounded shadow-sm">
            <div className=" px-6   font-bold text-center">
              Order Approval Status
            </div>
            <div className=" h-52 px-3 lg:px-1">
              <DognutContainer />
            </div>{" "}
          </div>

          <div className="bg-[white]   xs:w-full md:w-full  w-2/4  rounded  shadow-sm  ">
            <div className="flex flex-row  w-full sticky p-1.5  ">
              <h2 className=" font-semibold">Critical Parts</h2>
            </div>
            <div>
              <CriticalPartChart />
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

export default Dashboard;
