import { Button, MenuItem, TextField, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Widget from "../components/UI/Widget";
import { useAuth } from "../utils/hooks";
import {
  ShoppingCartOutlined,
  DescriptionOutlined,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
  Info,
} from "@mui/icons-material";
import { $windowExists } from "../utils";
import { useRouter } from "next/router";
import OrderPerSupplier from "../components/Tables/OrderPerSupplier";
import InvoicePerSupplier from "../components/Tables/InvoicePerSupplier";
import DognutContainer from "../components/chart/DognutContainer";
import CriticalPartChart from "../components/chart/CriticalPartChart";
import moment from "moment";
import { fetchDashboard } from "../store/slices/orderSlice";
import { useDispatch } from "react-redux";
import { checkSingleUser } from "../store/slices/authSlice";
import ToolTip from "../components/UI/Tooltip";

const allStatus = [
  {
    value: "TODAY",
    label: "Today",
  },
  {
    value: "THIS WEEK",
    label: "This Week",
  },
  {
    value: "THIS MONTH",
    label: "This Month",
  },
  {
    value: "THIS YEAR",
    label: "This Year",
  },
];
const home = () => {
  const dispatch = useDispatch();
  const currentHour = moment().hour();
  const [startDate, setStartDate] = useState(
    moment().startOf("year").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().add(1, "y").startOf("year").format("YYYY-MM-DD")
  );
  const [selectedStatus, setSelectedStatus] = useState("THIS YEAR");
  const { user, fallBack } = useAuth();
  const [count, setCount] = useState(0);
  const [greetingStatus, setGreetingStatus] = useState("Welcome");
  const route = useRouter();
  const [companyCode, setCompanyCode] = useState("ALL");
  const [plantName, setPlantName] = useState("ALL");
  const [groupCode, setGroupCode] = useState("ALL");
  const [orgCode, setOrgCode] = useState("ALL");
  const totalCount = count?.totalOrderCount || 0;
  const pendingCount = count?.totalPendingCount || 0;
  const approvedCount = count?.totalAcceptedCount || 0;
  const rejectedCount = count?.totalRejectedCount || 0;
  const orderRejectedCount = count?.totalRejectedOrderCount || 0;
  const [userDetails, setUserDetails] = useState(null);
  // const isXs = useMediaQuery("(min-width:769px)");
  const isLg = useMediaQuery("(min-width:1500px)");
  const [w, setW] = useState();
  useEffect(async () => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      }

      if (selectedStatus == "THIS YEAR") {
        handleDate("THIS YEAR");
      }
      handleGreeting();
      handleCheckUser();
      getData();
    }
  }, [
    user,
    selectedStatus,
    companyCode,
    plantName,
    groupCode,
    orgCode,
    currentHour,
    route?.pathname,
  ]);

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
  const handleDate = async (value) => {
    if (value === "TODAY") {
      setStartDate(moment().format("YYYY-MM-DD"));
      setEndDate(moment().add(1, "days").format("YYYY-MM-DD"));
    } else if (value === "THIS WEEK") {
      setStartDate(moment().startOf("week").format("YYYY-MM-DD"));
      setEndDate(moment().day(7).format("YYYY-MM-DD"));
    } else if (value === "THIS MONTH") {
      setStartDate(moment().startOf("month").format("YYYY-MM-DD"));
      setEndDate(moment().add(1, "M").startOf("month").format("YYYY-MM-DD"));
    } else if (value === "THIS YEAR") {
      setStartDate(moment().startOf("year").format("YYYY-MM-DD"));
      setEndDate(moment().add(1, "y").startOf("year").format("YYYY-MM-DD"));
    }
    setSelectedStatus(value);
  };

  const handleCheckUser = async () => {
    // setLoading(true);
    try {
      const payload = { _id: user?._id };
      const res = await dispatch(checkSingleUser(payload));
      if (res) {
        const userInfo = res?.data?.data;
        setUserDetails(userInfo);
      }
    } catch (error) {
    } finally {
      // setLoading(false);
    }
  };

  const getData = async () => {
    try {
      let conditions = {};

      if (companyCode != "ALL") {
        conditions.companyCode = companyCode;
      }
      if (plantName != "ALL") {
        conditions.plantName = plantName;
      }
      if (groupCode != "ALL") {
        conditions.groupCode = groupCode;
      }
      if (orgCode != "ALL") {
        conditions.orgCode = orgCode;
      }

      if (startDate != "" && endDate != "") {
        conditions.startDate = startDate;
        conditions.endDate = endDate;
      }

      let payload = {
        conditions: conditions,
      };

      if (payload.conditions != {}) {
        const res = await dispatch(fetchDashboard(payload));
        if (res) {
          setCount(res?.data?.data);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!user) return;
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

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
      <div className=" flex flex-row  xs:flex-col  mt-4 mb-1  md:mb-0  xs:justify-start  items-center ">
        <h2 className="  md:mb-3 xs:mx-1  xs:mb-2  text-xl font-bold xs:w-full ml-3 mb-3">
          {`${greetingStatus ? greetingStatus : "Welcome"} ${
            userDetails?.firstName ? userDetails?.firstName : ""
          }
        `}
        </h2>

        <div className=" flex   mr-3 xs:mx-1 xs:w-full  xs:flex-col  ml-auto justify-between  xs:justify-center ">
          <ToolTip title="Organization Selections can be made in - Manage settings menu">
            <div
              className={`text-lg xs:text-center xs:mb-1  cursor-pointer text-orange-500 lg:text-xs  mt-1`}
              onClick={() => route.push("/account")}
            >
              <Info />
            </div>
          </ToolTip>
          <TextField
            size="small"
            className="w-32  md:w-1/5 xs:w-full  rounded-md mb-2 mx-1.5"
            id="outlined-select-currency"
            select
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            label="Company Code"
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {userDetails?.companyCodes.map((value) => (
              <MenuItem
                className="w-32 md:w-1/5 xs:w-full"
                key={value}
                value={value}
              >
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            className="w-32 md:w-1/5 xs:w-full  rounded-md mb-2 mx-1.5"
            id="outlined-select-currency"
            select
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            label="Plant Name"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {userDetails?.plantNames.map((value) => (
              <MenuItem
                className="w-32 md:w-1/5 xs:w-full"
                key={value}
                value={value}
              >
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            className="w-32 md:w-1/5 xs:w-full  rounded-md mb-2 mx-1.5"
            id="outlined-select-currency"
            select
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            label="Group Code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {userDetails?.groupCodes.map((value) => (
              <MenuItem
                className="w-32 md:w-1/5 xs:w-full"
                key={value}
                value={value}
              >
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            className="w-32 md:w-1/5 xs:w-full  rounded-md mb-2 mx-1.5"
            id="outlined-select-currency"
            select
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            label="Org Code"
            value={orgCode}
            onChange={(e) => setOrgCode(e.target.value)}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {userDetails?.orgCodes.map((value) => (
              <MenuItem
                className="w-32 md:w-1/5 xs:w-full"
                key={value}
                value={value}
              >
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            className="w-32 md:w-1/5 xs:w-full rounded-md mb-2 ml-1.5 "
            id="outlined-select-currency"
            select
            label="Period"
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            value={selectedStatus}
            onChange={(e) => handleDate(e.target.value)}
          >
            {allStatus.map((option) => (
              <MenuItem
                className="w-32 md:w-1/5 xs:w-full"
                key={option.value}
                value={option.value}
                // onClick={()=>setSelectedStatus(option?.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>

      <div className=" mx-3 xs:mx-1  grid grid-cols-4  md:grid-cols-2 xs:grid-cols-2 gap-4 ">
        <div className=" whitespace-nowrap  w-full ">
          <Widget
            id="1"
            title="Total Orders"
            icon={<ShoppingCartOutlined fontSize="12" />}
            number={totalCount}
            subtitle="Total Orders"
            handleClick={() => route.push("/transactionalData")}
          />
        </div>
        <div className="whitespace-nowrap w-full ">
          <Widget
            id="2"
            title="Pending Orders"
            icon={<DescriptionOutlined fontSize="12" />}
            number={pendingCount}
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
            number={approvedCount}
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
            number={rejectedCount}
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
            <OrderPerSupplier
              startDate={startDate}
              endDate={endDate}
              companyCode={companyCode}
              plantName={plantName}
              groupCode={groupCode}
              orgCode={orgCode}
              limit={5}
            />
          </div>
          <div className="h-1/2 xs:h-full  bg-[white] rounded shadow-sm">
            <InvoicePerSupplier
              startDate={startDate}
              endDate={endDate}
              companyCode={companyCode}
              plantName={plantName}
              groupCode={groupCode}
              orgCode={orgCode}
            />
          </div>
        </div>

        <div className=" md:col-span-2 gap-3 h-full col-span-1 flex justify-center flex-col ">
          <div className="bg-[white] pt-2 h-2/5     rounded shadow-sm">
            <div className=" px-6   font-bold text-center">
              New Delivery Date Approval Status
            </div>
            <div className="lg:h-44 h-56 px-3 lg:px-1">
              <DognutContainer count={count} />
            </div>{" "}
          </div>
          <div className="w-full  ">
            <Widget
              id="5"
              title="Quality Rejections"
              icon={<ThumbDownAltOutlined fontSize="12" />}
              number={orderRejectedCount}
              subtitle="Open POs Rejections"
              handleClick={() => route.push("/rejections")}
            />
          </div>
          <div className="bg-[white] h-2/5  w-full   rounded  shadow-sm  ">
            <div className="flex flex-row  w-full sticky p-1.5  ">
              <h2 className=" font-semibold">Critical Parts</h2>
              <Button
                className=" bg-[#04045E] hover:bg-[#0e106a] py-1 text-sm font-semibold normal-case  rounded ml-auto"
                variant="contained"
                onClick={() => route.push("/collaborationRoom")}
              >
                View All
              </Button>
            </div>
            <div>
              <CriticalPartChart count={count} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default home;

// import { Button, MenuItem, TextField, useMediaQuery } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Widget from "../components/UI/Widget";
// import { useAuth } from "../utils/hooks";
// import {
//   ShoppingCartOutlined,
//   DescriptionOutlined,
//   ThumbUpAltOutlined,
//   ThumbDownAltOutlined,
//   Info,
// } from "@mui/icons-material";
// import { $windowExists } from "../utils";
// import { useRouter } from "next/router";
// import OrderPerSupplier from "../components/Tables/OrderPerSupplier";
// import InvoicePerSupplier from "../components/Tables/InvoicePerSupplier";
// import DognutContainer from "../components/chart/DognutContainer";
// import CriticalPartChart from "../components/chart/CriticalPartChart";
// import moment from "moment";
// import { fetchDashboard } from "../store/slices/orderSlice";
// import { useDispatch } from "react-redux";
// import { checkSingleUser } from "../store/slices/authSlice";
// import ToolTip from "../components/UI/Tooltip";

// const allStatus = [
//   {
//     value: "TODAY",
//     label: "Today",
//   },
//   {
//     value: "THIS WEEK",
//     label: "This Week",
//   },
//   {
//     value: "THIS MONTH",
//     label: "This Month",
//   },
//   {
//     value: "THIS YEAR",
//     label: "This Year",
//   },
// ];
// const home = () => {
//   const dispatch = useDispatch();
//   const currentHour = moment().hour();
//   const [startDate, setStartDate] = useState(
//     moment().startOf("year").format("YYYY-MM-DD")
//   );
//   const [endDate, setEndDate] = useState(
//     moment().add(1, "y").startOf("year").format("YYYY-MM-DD")
//   );
//   const [selectedStatus, setSelectedStatus] = useState("THIS YEAR");
//   const { user, fallBack } = useAuth();
//   const [count, setCount] = useState(0);
//   const [greetingStatus, setGreetingStatus] = useState("Welcome");
//   const route = useRouter();
//   const [companyCode, setCompanyCode] = useState("ALL");
//   const [plantName, setPlantName] = useState("ALL");
//   const [groupCode, setGroupCode] = useState("ALL");
//   const [orgCode, setOrgCode] = useState("ALL");
//   const totalCount = count?.totalOrderCount || 0;
//   const pendingCount = count?.totalPendingCount || 0;
//   const approvedCount = count?.totalAcceptedCount || 0;
//   const rejectedCount = count?.totalRejectedCount || 0;
//   const orderRejectedCount = count?.totalRejectedOrderCount || 0;
//   const [userDetails, setUserDetails] = useState(null);
//   // const isXs = useMediaQuery("(min-width:769px)");
//   const isLg = useMediaQuery("(min-width:1500px)");
//   const [w, setW] = useState();
//   useEffect(async () => {
//     if (user) {
//       if (user?.role == "SUPPLIER") {
//         route.push("/collaborationRoom");
//       }

//       if (selectedStatus == "THIS YEAR") {
//         handleDate("THIS YEAR");
//       }
//       handleGreeting();
//       handleCheckUser();
//       getData();
//     }
//   }, [
//     user,
//     selectedStatus,
//     companyCode,
//     plantName,
//     groupCode,
//     orgCode,
//     currentHour,
//     route?.pathname,
//   ]);

//   const handleGreeting = async () => {
//     if (currentHour >= 3 && currentHour < 12) {
//       setGreetingStatus("Good Morning");
//     } else if (currentHour >= 12 && currentHour < 15) {
//       setGreetingStatus("Good Afternoon");
//     } else if (currentHour >= 15 && currentHour < 20) {
//       setGreetingStatus("Good Evening");
//     } else {
//       setGreetingStatus("Welcome");
//     }
//   };
//   const handleDate = async (value) => {
//     if (value === "TODAY") {
//       setStartDate(moment().format("YYYY-MM-DD"));
//       setEndDate(moment().add(1, "days").format("YYYY-MM-DD"));
//     } else if (value === "THIS WEEK") {
//       setStartDate(moment().startOf("week").format("YYYY-MM-DD"));
//       setEndDate(moment().day(7).format("YYYY-MM-DD"));
//     } else if (value === "THIS MONTH") {
//       setStartDate(moment().startOf("month").format("YYYY-MM-DD"));
//       setEndDate(moment().add(1, "M").startOf("month").format("YYYY-MM-DD"));
//     } else if (value === "THIS YEAR") {
//       setStartDate(moment().startOf("year").format("YYYY-MM-DD"));
//       setEndDate(moment().add(1, "y").startOf("year").format("YYYY-MM-DD"));
//     }
//     setSelectedStatus(value);
//   };

//   const handleCheckUser = async () => {
//     // setLoading(true);
//     try {
//       const payload = { _id: user?._id };
//       const res = await dispatch(checkSingleUser(payload));
//       if (res) {
//         const userInfo = res?.data?.data;
//         setUserDetails(userInfo);
//       }
//     } catch (error) {
//     } finally {
//       // setLoading(false);
//     }
//   };

//   const getData = async () => {
//     try {
//       let conditions = {};

//       if (companyCode != "ALL") {
//         conditions.companyCode = companyCode;
//       }
//       if (plantName != "ALL") {
//         conditions.plantName = plantName;
//       }
//       if (groupCode != "ALL") {
//         conditions.groupCode = groupCode;
//       }
//       if (orgCode != "ALL") {
//         conditions.orgCode = orgCode;
//       }

//       if (startDate != "" && endDate != "") {
//         conditions.startDate = startDate;
//         conditions.endDate = endDate;
//       }

//       let payload = {
//         conditions: conditions,
//       };

//       if (payload.conditions != {}) {
//         const res = await dispatch(fetchDashboard(payload));
//         if (res) {
//           setCount(res?.data?.data);
//         }
//       }
//     } catch (error) {}
//   };

//   useEffect(() => {
//     if (!user) return;
//   }, [user]);

//   useEffect(() => {
//     const handleResize = () => {
//       setW(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   if (!$windowExists) {
//     return fallBack;
//   } else if (!user) {
//     // router.push('/')
//     return fallBack;
//   }

//   return (
//     <div className=" bg-[#E5E5E5] flex flex-col px-3  pb-20 overflow-y-auto grow ">

//     </div>
//   );
// };

// export default home;
