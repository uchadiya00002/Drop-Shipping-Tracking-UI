import React from "react";
import Widget from "../components/UI/Widget";
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
import BarGraph from "../components/chart/barGraph";

const Dashboard = () => {
  const route = useRouter();

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
          />
        </div>
        <div className="whitespace-nowrap w-full ">
          <Widget
            id="2"
            title="Pending Orders"
            icon={<DescriptionOutlined fontSize="12" />}
            number={2}
            subtitle="Approval Pending"
          />
        </div>
        <div className=" w-full">
          <Widget
            id="3"
            title="Approved Orders"
            icon={<ThumbUpAltOutlined fontSize="12" />}
            number={6}
            subtitle="Approval Received"
          />
        </div>
        <div className="  w-full ">
          <Widget
            id="4"
            title="Rejected Orders"
            icon={<ThumbDownAltOutlined fontSize="12" />}
            number={2}
            subtitle="Approval Rejected"
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
