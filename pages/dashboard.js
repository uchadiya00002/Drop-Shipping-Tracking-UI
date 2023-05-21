// // import React, { useEffect, useState } from "react";
// // import {
// //   Button,
// //   Card,
// //   MenuItem,
// //   TextField,
// //   useMediaQuery,
// // } from "@mui/material";
// // import { Tooltip } from "@mui/material";
// // import { Bar } from "react-chartjs-2";
// // import { useAuth } from "../utils/hooks";
// // import { $windowExists } from "../utils";
// // import OrderPerSupplier from "../components/Tables/OrderPerSupplier";
// // import DognutContainer from "../components/chart/DognutContainer";
// // import { fetchDashboard, fetchHome } from "../store/slices/orderSlice";
// // import { useDispatch } from "react-redux";
// // import moment from "moment";
// // import { useRouter } from "next/router";
// // import BarGraph from "../components/chart/barGraph";
// // import ReasonBar from "../components/chart/ReasonBar";
// // import { ArrowBack } from "@mui/icons-material";
// // import { checkSingleUser } from "../store/slices/authSlice";
// // import InvoicePerSupplier from "../components/Tables/InvoicePerSupplier";

// // const allStatus = [
// //   {
// //     value: "TODAY",
// //     label: "Today",
// //   },
// //   {
// //     value: "THIS WEEK",
// //     label: "This Week",
// //   },
// //   {
// //     value: "THIS MONTH",
// //     label: "This Month",
// //   },
// //   {
// //     value: "THIS YEAR",
// //     label: "This Year",
// //   },
// // ];

// // const dashboard = () => {
// //   const dispatch = useDispatch();

// //   const [startDate, setStartDate] = useState(
// //     moment().startOf("year").format("YYYY-MM-DD")
// //   );
// //   const [endDate, setEndDate] = useState(
// //     moment().add(1, "y").startOf("year").format("YYYY-MM-DD")
// //   );
// //   const [selectedStatus, setSelectedStatus] = useState("THIS YEAR");
// //   const { user, fallBack } = useAuth();
// //   const [count, setCount] = useState(0);
// //   const [data, setData] = useState(0);
// //   const [userDetails, setUserDetails] = useState(null);
// //   const [companyCode, setCompanyCode] = useState("ALL");
// //   const [plantName, setPlantName] = useState("ALL");
// //   const [groupCode, setGroupCode] = useState("ALL");
// //   const [orgCode, setOrgCode] = useState("ALL");
// //   const [w, setW] = useState();
// //   const isXs = useMediaQuery("(min-width:769px)");
// //   const route = useRouter();
// //   const isLg = useMediaQuery("(min-width:1500px)");

// //   useEffect(async () => {
// //     if (user) {
// //       if (user?.role == "SUPPLIER") {
// //         route.push("/collaborationRoom");
// //       }
// //       handleCheckUser();
// //       getData();
// //     }
// //   }, [user, selectedStatus, route, companyCode, plantName, groupCode, orgCode]);

// //   const handleCheckUser = async () => {
// //     try {
// //       const payload = { _id: user?._id };
// //       const res = await dispatch(checkSingleUser(payload));
// //       if (res) {
// //         const userInfo = res?.data?.data;
// //         setUserDetails(userInfo);
// //       }
// //     } catch (error) {
// //     } finally {
// //     }
// //   };

// //   const getData = async () => {
// //     try {
// //       let conditions = {};

// //       if (companyCode != "ALL") {
// //         conditions.companyCode = companyCode;
// //       }
// //       if (plantName != "ALL") {
// //         conditions.plantName = plantName;
// //       }
// //       if (groupCode != "ALL") {
// //         conditions.groupCode = groupCode;
// //       }
// //       if (orgCode != "ALL") {
// //         conditions.orgCode = orgCode;
// //       }
// //       if (startDate != "" && endDate != "") {
// //         conditions.startDate = startDate;
// //         conditions.endDate = endDate;
// //       }

// //       let payload = {
// //         conditions: conditions,
// //       };
// //       let payloadForGraph = {
// //         pagination: {
// //           limit: 5,
// //         },
// //         conditions: conditions,
// //       };

// //       if (payload.conditions != {}) {
// //         const res = await dispatch(fetchDashboard(payload));
// //         if (res) {
// //           setCount(res?.data?.data);
// //         }
// //         const data = await dispatch(fetchHome(payloadForGraph));
// //         if (data) {
// //           setData(data?.data?.data);
// //         }
// //       }
// //     } catch (error) {
// //     } finally {
// //       // setLoading(false);
// //     }
// //   };

// //   const handleDate = async (value) => {
// //     if (value === "TODAY") {
// //       setStartDate(moment().format("YYYY-MM-DD"));
// //       setEndDate(moment().add(1, "days").format("YYYY-MM-DD"));
// //     } else if (value === "THIS WEEK") {
// //       setStartDate(moment().startOf("week").format("YYYY-MM-DD"));
// //       setEndDate(moment().day(7).format("YYYY-MM-DD"));
// //     } else if (value === "THIS MONTH") {
// //       setStartDate(moment().startOf("month").format("YYYY-MM-DD"));
// //       setEndDate(moment().add(1, "M").startOf("month").format("YYYY-MM-DD"));
// //     } else if (value === "THIS YEAR") {
// //       setStartDate(moment().startOf("year").format("YYYY-MM-DD"));
// //       setEndDate(moment().add(1, "y").startOf("year").format("YYYY-MM-DD"));
// //     }
// //     setSelectedStatus(value);
// //   };

// //   useEffect(() => {
// //     if (!user) return;
// //   }, [user]);

// //   // useEffect(() => {
// //   //   const handleResize = () => {
// //   //     setW(window.innerWidth);
// //   //   };

// //   //   window.addEventListener("resize", handleResize);
// //   //   return () => window.removeEventListener("resize", handleResize);
// //   // }, []);
// //   // useEffect(() => {
// //   //   handlDate()
// //   // }, [selectedStatus]);

// //   if (!$windowExists) {
// //     return fallBack;
// //   } else if (!user) {
// //     // router.push('/')
// //     return fallBack;
// //   }

// //   return (
// //     <div className=" bg-[#E5E5E5] flex flex-col px-3 lg:px-0 lg:h-[calc(100vh-53px)] overflow-y-auto grow ">
// //       <div className=" flex flex-row lg:mb-3 xs:flex-col lg:h-[10%] mt-4 mb-2  md:mb-0 justify-center  items-center ">
// //         <h2 className="sm:text-base xs:text-sm   xs:mb-3 md:mb-2 md:text-xs lg:text-base xl:text-base font-bold ml-3">
// //           PO Dashboard
// //         </h2>

// //         <div className=" flex   mr-3 xs:mx-1  ml-auto justify-between ">
// //           <TextField
// //             size="small"
// //             className="w-32  md:w-1/5 xs:w-28  rounded-md mb-2 mx-1.5"
// //             id="outlined-select-currency"
// //             select
// //             InputProps={{
// //               style: { height: isLg ? 30 : 25, backgroundColor: "white" },
// //             }}
// //             label="Company Code"
// //             value={companyCode}
// //             onChange={(e) => setCompanyCode(e.target.value)}
// //           >
// //             <MenuItem value="ALL">ALL</MenuItem>
// //             {userDetails?.companyCodes.map((value) => (
// //               <MenuItem
// //                 className="w-32 md:w-1/5 xs:w-28"
// //                 key={value}
// //                 value={value}
// //               >
// //                 {value}
// //               </MenuItem>
// //             ))}
// //           </TextField>

// //           <TextField
// //             size="small"
// //             className="w-32 md:w-1/5 xs:w-28  rounded-md mb-2 mx-1.5"
// //             id="outlined-select-currency"
// //             select
// //             InputProps={{
// //               style: { height: isLg ? 30 : 25, backgroundColor: "white" },
// //             }}
// //             label="Plant Name"
// //             value={plantName}
// //             onChange={(e) => setPlantName(e.target.value)}
// //           >
// //             <MenuItem value="ALL">ALL</MenuItem>
// //             {userDetails?.plantNames.map((value) => (
// //               <MenuItem
// //                 className="w-32 md:w-1/5 xs:w-28"
// //                 key={value}
// //                 value={value}
// //               >
// //                 {value}
// //               </MenuItem>
// //             ))}
// //           </TextField>

// //           <TextField
// //             size="small"
// //             className="w-32 md:w-1/5 xs:w-28  rounded-md mb-2 mx-1.5"
// //             id="outlined-select-currency"
// //             select
// //             InputProps={{
// //               style: { height: isLg ? 30 : 25, backgroundColor: "white" },
// //             }}
// //             label="Group Code"
// //             value={groupCode}
// //             onChange={(e) => setGroupCode(e.target.value)}
// //           >
// //             <MenuItem value="ALL">ALL</MenuItem>
// //             {userDetails?.groupCodes.map((value) => (
// //               <MenuItem
// //                 className="w-32 md:w-1/5 xs:w-28"
// //                 key={value}
// //                 value={value}
// //               >
// //                 {value}
// //               </MenuItem>
// //             ))}
// //           </TextField>
// //           <div className=" rounded-md flex md:w-1/5">
// //             <TextField
// //               size="small"
// //               className="w-32  xs:w-28  rounded-md mb-2 mx-1.5"
// //               id="outlined-select-currency"
// //               select
// //               InputProps={{
// //                 style: { height: isLg ? 30 : 25, backgroundColor: "white" },
// //               }}
// //               label="Org Code"
// //               value={orgCode}
// //               onChange={(e) => setOrgCode(e.target.value)}
// //             >
// //               <MenuItem value="ALL">ALL</MenuItem>
// //               {userDetails?.orgCodes.map((value) => (
// //                 <MenuItem className="w-28  xs:w-28" key={value} value={value}>
// //                   {value}
// //                 </MenuItem>
// //               ))}
// //             </TextField>
// //           </div>

// //           <TextField
// //             size="small"
// //             className="w-32 md:w-1/5 xs:w-24 rounded-md mb-2 ml-1.5 "
// //             id="outlined-select-currency"
// //             select
// //             label="Period"
// //             InputProps={{
// //               style: { height: isLg ? 30 : 25, backgroundColor: "white" },
// //             }}
// //             value={selectedStatus}
// //             onChange={(e) => handleDate(e.target.value)}
// //           >
// //             {allStatus.map((option) => (
// //               <MenuItem
// //                 className="w-32 md:w-1/5 xs:w-28"
// //                 key={option.value}
// //                 value={option.value}
// //               >
// //                 {option.label}
// //               </MenuItem>
// //             ))}
// //           </TextField>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-4  gap-4 justify-items-stretch	 xs:mx-1 mx-3 lg:h-[45%]  items-stretch">
// //         <div className="col-span-3 lg:h-[100%] lg:min-h-fit bg-[white] rounded-md shadow-sm  ">
// //           <OrderPerSupplier
// //             startDate={startDate}
// //             endDate={endDate}
// //             companyCode={companyCode}
// //             plantName={plantName}
// //             groupCode={groupCode}
// //             orgCode={orgCode}
// //           />
// //         </div>
// //         <div className=" bg-[white]  lg:h-full rounded-lg  col-span-1    shadow-sm ">
// //           <div className=" mb-2 lg:h-40 h-56  ">
// //             <DognutContainer count={count} />
// //           </div>{" "}
// //           <div className=" py-1.5 lg:py-0.5   px-2 xs:px-1  md:flex-wrap md:py-0.5 flex rounded-b-lg  bg-[white] justify-evenly  ">
// //             <div className="text-xs xs:text-[10px] lg:text-[8px] md:text-[8px]  xs:px-0.5 px-2  mb-0.5  ">
// //               <div className="h-4 lg:h-3 md:h-3 text-[#0A9878] bg-[#0A9878] rounded-sm"></div>
// //               <div>Approved</div>
// //             </div>
// //             <div className="text-xs xs:text-[10px] lg:text-[8px] md:text-[8px] xs:px-0.5 px-2 mb-0.5">
// //               <div className="h-4 lg:h-3 md:h-3 text-[#5196DB] bg-[#66a2df] rounded-sm"></div>{" "}
// //               <div>Pending</div>
// //             </div>
// //             <div className="text-xs xs:text-[10px] lg:text-[8px] md:text-[8px] xs:px-0.5 px-2 mb-0.5">
// //               <div className="h-4 lg:h-3 md:h-3 text-[#F17B33] bg-[#F17B33] rounded-sm"></div>{" "}
// //               <div>Rejected</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-4 gap-4 xs:mx-1  mx-3 lg:mt-4 my-3 lg:h-[45%] lg:mb-2  md:my-2 md:max-h-fit ">
// //         <div className=" bg-[white] col-span-2 xs:mb-4 xs:w-full  md:w-full rounded-lg shadow-sm md:mb-4    px-3 mr-4 xs:mx-0 ">
// //           <div className="mt-3 flex ">
// //             <div className="font-bold xs:text-sm md:text-xs lg:text-xs ">
// //               Suppliers by Delayed Deliveries
// //             </div>

// //             <Button
// //               className={`bg-[#03045E] hover:bg-[#0e106a] ml-auto whitespace-nowrap py-1 xs:text-sm   md:text-xs lg:text-xs font-semibold normal-case   rounded-lg`}
// //               variant="contained"
// //               onClick={() =>
// //                 route.push({
// //                   pathname: "/order/purchaseOrder",
// //                   query: {
// //                     delay: true,
// //                   },
// //                 })
// //               }
// //             >
// //               View All
// //             </Button>
// //           </div>
// //           <div className="  mt-4">
// //             <BarGraph data={data} />
// //           </div>
// //         </div>
// //         <div className=" bg-[white] rounded-lg md:w-full xs:w-full col-span-2 shadow-sm md:mb-4  md:mr-1   px-3 ">
// //           <h2 className="text-lg md:text-xs lg:text-xs font-bold mt-1.5 pl-1.5">
// //             Top Reasons Codes
// //           </h2>
// //           <div className=" ">
// //             <ReasonBar data={data} />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// // export default dashboard;

// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   MenuItem,
//   TextField,
//   useMediaQuery,
// } from "@mui/material";
// import { Tooltip } from "@mui/material";
// import { Bar } from "react-chartjs-2";
// import { useAuth } from "../utils/hooks";
// import { $windowExists } from "../utils";
// import OrderPerSupplier from "../components/Tables/OrderPerSupplier";
// import DognutContainer from "../components/chart/DognutContainer";
// import { fetchDashboard, fetchHome } from "../store/slices/orderSlice";
// import { useDispatch } from "react-redux";
// import moment from "moment";
// import { useRouter } from "next/router";
// import BarGraph from "../components/chart/barGraph";
// import ReasonBar from "../components/chart/ReasonBar";
// import { ArrowBack } from "@mui/icons-material";
// import { checkSingleUser } from "../store/slices/authSlice";
// import InvoicePerSupplier from "../components/Tables/InvoicePerSupplier";

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

// const dashboard = () => {
//   const dispatch = useDispatch();

//   const [startDate, setStartDate] = useState(
//     moment().startOf("year").format("YYYY-MM-DD")
//   );
//   const [endDate, setEndDate] = useState(
//     moment().add(1, "y").startOf("year").format("YYYY-MM-DD")
//   );
//   const [selectedStatus, setSelectedStatus] = useState("THIS YEAR");
//   const { user, fallBack } = useAuth();
//   const [count, setCount] = useState(0);
//   const [data, setData] = useState(0);
//   const [userDetails, setUserDetails] = useState(null);
//   const [companyCode, setCompanyCode] = useState("ALL");
//   const [plantName, setPlantName] = useState("ALL");
//   const [groupCode, setGroupCode] = useState("ALL");
//   const [orgCode, setOrgCode] = useState("ALL");
//   const [w, setW] = useState();
//   const isXs = useMediaQuery("(min-width:769px)");
//   const route = useRouter();

//   useEffect(async () => {
//     if (user) {
//       if (user?.role == "SUPPLIER") {
//         route.push("/collaborationRoom");
//       }
//       handleCheckUser();
//       getData();
//     }
//   }, [user, selectedStatus, route, companyCode, plantName, groupCode, orgCode]);

//   const handleCheckUser = async () => {
//     try {
//       const payload = { _id: user?._id };
//       const res = await dispatch(checkSingleUser(payload));
//       if (res) {
//         const userInfo = res?.data?.data;
//         setUserDetails(userInfo);
//       }
//     } catch (error) {
//     } finally {
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
//       let payloadForGraph = {
//         pagination: {
//           limit: 5,
//         },
//         conditions: conditions,
//       };

//       if (payload.conditions != {}) {
//         const res = await dispatch(fetchDashboard(payload));
//         if (res) {
//           setCount(res?.data?.data);
//         }
//         const data = await dispatch(fetchHome(payloadForGraph));
//         if (data) {
//           setData(data?.data?.data);
//         }
//       }
//     } catch (error) {
//     } finally {
//       // setLoading(false);
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

//   useEffect(() => {
//     if (!user) return;
//   }, [user]);

//   // useEffect(() => {
//   //   const handleResize = () => {
//   //     setW(window.innerWidth);
//   //   };

//   //   window.addEventListener("resize", handleResize);
//   //   return () => window.removeEventListener("resize", handleResize);
//   // }, []);
//   // useEffect(() => {
//   //   handlDate()
//   // }, [selectedStatus]);

//   if (!$windowExists) {
//     return fallBack;
//   } else if (!user) {
//     // router.push('/')
//     return fallBack;
//   }

//   return (
//     <div className=" bg-[#E5E5E5] flex flex-col px-3 lg:px-0 h-[calc(100vh-53px)] grow overflow-auto py-3 gap-2 md:py-1 lg:py-1">
//       <div className=" flex flex-row md:flex-col lg:h-[5%] my-3 mx-3 md:my-0.5 lg:my-1: xs:flex-col  md:mx-1 xs:mx-1 justify-between">
//         <h2 className="sm:text-base xs:text-sm   xs:mb-3 md:mb-2 md:text-xs lg:text-base xl:text-base font-bold ml-3">
//           PO Dashboard
//         </h2>

//         <div className=" flex  md:mx-0  ml-auto xs:mx-0 justify-between ">
//           <TextField
//             size="small"
//             InputProps={{
//               style: { height: 30, backgroundColor: "white" },
//             }}
//             className="w-32 xs:w-28 md:w-1/5   bg-[white]  h-fit rounded-md mx-1.5 xs:mr-1.5 md:mr-1.5"
//             id="outlined-select-currency"
//             select
//             label="Company Code"
//             value={companyCode}
//             onChange={(e) => setCompanyCode(e.target.value)}
//           >
//             <MenuItem value="ALL">ALL</MenuItem>
//             {userDetails?.companyCodes.map((value) => (
//               <MenuItem
//                 className="w-32 xs:w-28 md:w-1/5 "
//                 key={value}
//                 value={value}
//               >
//                 {value}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             size="small"
//             InputProps={{
//               style: { height: 30, backgroundColor: "white" },
//             }}
//             className="w-32 xs:w-28 md:w-1/5  bg-[white] h-fit rounded-md mx-1.5"
//             id="outlined-select-currency"
//             select
//             label="Plant Name"
//             value={plantName}
//             onChange={(e) => setPlantName(e.target.value)}
//           >
//             <MenuItem value="ALL">ALL</MenuItem>
//             {userDetails?.plantNames.map((value) => (
//               <MenuItem
//                 className="w-32 xs:w-28 md:w-1/5 "
//                 key={value}
//                 value={value}
//               >
//                 {value}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             size="small"
//             InputProps={{
//               style: { height: 30, backgroundColor: "white" },
//             }}
//             className="w-32 xs:w-28 md:w-1/5  bg-[white] h-fit rounded-md mx-1.5"
//             id="outlined-select-currency"
//             select
//             label="Group Code"
//             value={groupCode}
//             onChange={(e) => setGroupCode(e.target.value)}
//           >
//             <MenuItem value="ALL">ALL</MenuItem>
//             {userDetails?.groupCodes.map((value) => (
//               <MenuItem
//                 className="w-32 xs:w-28 md:w-1/5 "
//                 key={value}
//                 value={value}
//               >
//                 {value}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             size="small"
//             InputProps={{
//               style: { height: 30, backgroundColor: "white" },
//             }}
//             className="w-32 xs:w-28 md:w-1/5  bg-[white] h-fit rounded-md mx-1.5"
//             id="outlined-select-currency"
//             select
//             label="Org Code"
//             value={orgCode}
//             onChange={(e) => setOrgCode(e.target.value)}
//           >
//             <MenuItem value="ALL">ALL</MenuItem>
//             {userDetails?.orgCodes.map((value) => (
//               <MenuItem
//                 className="w-32 xs:w-28 md:w-1/5 "
//                 key={value}
//                 value={value}
//               >
//                 {value}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             size="small"
//             InputProps={{
//               style: { height: 30, backgroundColor: "white" },
//             }}
//             className="w-32 xs:w-28 md:w-1/5  bg-[white] h-fit rounded-md ml-1.5"
//             id="outlined-select-currency"
//             select
//             label="Period"
//             value={selectedStatus}
//             onChange={(e) => handleDate(e.target.value)}
//           >
//             {allStatus.map((option) => (
//               <MenuItem
//                 className="w-32 xs:w-28 md:w-1/5 "
//                 key={option.value}
//                 value={option.value}
//                 // onClick={()=>setSelectedStatus(option?.value)}
//               >
//                 {option.label}
//               </MenuItem>
//             ))}
//           </TextField>
//         </div>
//       </div>
//       <div className="grid grid-cols-4 gap-4 justify-items-stretch	 xs:mx-1 mx-3 lg:h-[45%]  items-stretch">
//         <div className="col-span-3 lg:h-[100%] lg:min-h-fit bg-[white] rounded-md shadow-sm  ">
//           <OrderPerSupplier
//             startDate={startDate}
//             endDate={endDate}
//             companyCode={companyCode}
//             plantName={plantName}
//             groupCode={groupCode}
//             orgCode={orgCode}
//           />
//         </div>
//         <div className=" bg-[white]  lg:h-full rounded-lg  col-span-1    shadow-sm ">
//           <div className=" mb-2 lg:h-40 h-56  ">
//             <DognutContainer count={count} />
//           </div>{" "}
//           <div className=" py-1.5 lg:py-0.5   px-2 xs:px-1  md:flex-wrap md:py-0.5 flex rounded-b-lg  bg-[white] justify-evenly  ">
//             <div className="text-xs xs:text-[10px] lg:text-[8px] md:text-[8px]  xs:px-0.5 px-2  mb-0.5  ">
//               <div className="h-4 lg:h-3 md:h-3 text-[#0A9878] bg-[#0A9878] rounded-sm"></div>
//               <div>Approved</div>
//             </div>
//             <div className="text-xs xs:text-[10px] lg:text-[8px] md:text-[8px] xs:px-0.5 px-2 mb-0.5">
//               <div className="h-4 lg:h-3 md:h-3 text-[#5196DB] bg-[#66a2df] rounded-sm"></div>{" "}
//               <div>Pending</div>
//             </div>
//             <div className="text-xs xs:text-[10px] lg:text-[8px] md:text-[8px] xs:px-0.5 px-2 mb-0.5">
//               <div className="h-4 lg:h-3 md:h-3 text-[#F17B33] bg-[#F17B33] rounded-sm"></div>{" "}
//               <div>Rejected</div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-row xs:flex-col   md:flex-col justify-between my-2 md:mx-1 xs:mx-1 mx-3 ">
//         <div className=" bg-[white] xs:mb-4 xs:w-full py-2  md:w-full rounded-lg shadow-sm md:mb-4 w-1/2   px-3 mr-4 xs:mx-0 ">
//           <div className=" flex ">
//             <div className="font-bold xs:text-sm md:text-xs lg:text-xs ">
//               Suppliers by Delayed Deliveries
//             </div>

//             <Button
//               className={`bg-[#03045E] hover:bg-[#0e106a] ml-auto whitespace-nowrap py-1 xs:text-sm   md:text-xs lg:text-xs font-semibold normal-case   rounded-lg`}
//               variant="contained"
//               onClick={() =>
//                 route.push({
//                   pathname: "/order/purchaseOrder",
//                   query: {
//                     delay: true,
//                   },
//                 })
//               }
//             >
//               View All
//             </Button>
//           </div>
//           <div className=" lg:w-[95%]">
//             <BarGraph data={data} />
//           </div>
//         </div>
//         {/* <div className=" bg-[white] rounded-lg shadow-sm md:mb-4 w-1/3  p-4 mr-4 md:mr-0">
//             <Bar options={verticalBarOptions} data={barData} />
//           </div> */}
//         <div className=" bg-[white] rounded-lg md:w-full xs:w-full shadow-sm md:mb-4 w-1/2 md:mr-1   px-3 ">
//           <span className="text-lg md:text-xs lg:text-xs font-bold mt-1.5 pl-1.5">
//             Top Reasons Codes{" "}
//           </span>
//           <span className="text-xs font-medium">(Based On Delayed Orders)</span>
//           <div className="lg:w-[95%] ">
//             <ReasonBar data={data} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default dashboard;

// import { useMediaQuery } from "@mui/material";
// import React from "react";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Tooltip } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useAuth } from "../utils/hooks";
import { $windowExists } from "../utils";
import OrderPerSupplier from "../components/Tables/OrderPerSupplier";
import DognutContainer from "../components/chart/DognutContainer";
import { fetchDashboard, fetchHome } from "../store/slices/orderSlice";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useRouter } from "next/router";
import BarGraph from "../components/chart/barGraph";
import ReasonBar from "../components/chart/ReasonBar";
import { ArrowBack } from "@mui/icons-material";
import { checkSingleUser } from "../store/slices/authSlice";
import InvoicePerSupplier from "../components/Tables/InvoicePerSupplier";
import DelayedOrdersChart from "../components/chart/DelayedOrdersChart";

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

const dashboard = () => {
  const [startDate, setStartDate] = useState(
    moment().startOf("year").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().add(1, "y").startOf("year").format("YYYY-MM-DD")
  );
  const [selectedStatus, setSelectedStatus] = useState("THIS YEAR");
  const { user, fallBack } = useAuth();
  const [count, setCount] = useState(0);
  const [data, setData] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [companyCode, setCompanyCode] = useState("ALL");
  const [plantName, setPlantName] = useState("ALL");
  const [groupCode, setGroupCode] = useState("ALL");
  const [orgCode, setOrgCode] = useState("ALL");
  const [w, setW] = useState();
  const dispatch = useDispatch();
  const isXs = useMediaQuery("(min-width:769px)");
  const isLg = useMediaQuery("(min-width:1500px)");
  const route = useRouter();

  useEffect(async () => {
    if (user) {
      if (user?.role == "SUPPLIER") {
        route.push("/collaborationRoom");
      }
      handleCheckUser();
      getData();
    }
  }, [user, selectedStatus, route, companyCode, plantName, groupCode, orgCode]);

  const handleCheckUser = async () => {
    try {
      const payload = { _id: user?._id };
      const res = await dispatch(checkSingleUser(payload));
      if (res) {
        const userInfo = res?.data?.data;
        setUserDetails(userInfo);
      }
    } catch (error) {
    } finally {
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
      let payloadForGraph = {
        pagination: {
          limit: 5,
        },
        conditions: conditions,
      };

      if (payload.conditions != {}) {
        const res = await dispatch(fetchDashboard(payload));
        if (res) {
          setCount(res?.data?.data);
        }
        const data = await dispatch(fetchHome(payloadForGraph));
        if (data) {
          setData(data?.data?.data);
        }
      }
    } catch (error) {
    } finally {
      // setLoading(false);
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

  useEffect(() => {
    if (!user) return;
  }, [user]);

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }

  return (
    <div className=" bg-[#E5E5E5] gap-4 grow p-5">
      <div className=" flex flex-row xs:flex-col justify-between">
        <h2 className="text-2xl lg:text-xl xs:mb-2 font-bold">PO Dashboard</h2>
        <div className=" flex gap-4 xs:m-1 xs:flex-col ml-auto justify-between ">
          <TextField
            size="small"
            className="w-32  md:w-1/5 xs:w-full  rounded-md "
            id="outlined-select-currency"
            select
            label="Company Code"
            InputProps={{
              style: { backgroundColor: "white" },
            }}
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
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            className="w-32 md:w-1/5 xs:w-full  rounded-md "
            id="outlined-select-currency"
            select
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
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            className="w-32 md:w-1/5 xs:w-full  rounded-md "
            id="outlined-select-currency"
            select
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
          <div className=" rounded-md flex md:w-1/5">
            <TextField
              size="small"
              InputProps={{
                style: { backgroundColor: "white" },
              }}
              className="w-32  xs:w-full  rounded-md "
              id="outlined-select-currency"
              select
              label="Org Code"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
            >
              <MenuItem value="ALL">ALL</MenuItem>
              {userDetails?.orgCodes.map((value) => (
                <MenuItem className="w-28  xs:w-full" key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <TextField
            size="small"
            InputProps={{
              style: { backgroundColor: "white" },
            }}
            className="w-32 md:w-1/5 xs:w-full rounded-md "
            id="outlined-select-currency"
            select
            label="Period"
            value={selectedStatus}
            onChange={(e) => handleDate(e.target.value)}
          >
            {allStatus.map((option) => (
              <MenuItem
                className="w-32 md:w-1/5 xs:w-full"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5  xs:grid-cols-1 my-2 gap-4 justify-items-stretch	 xs:mx-1   items-stretch">
        <div className="col-span-3 md:col-span-3 xs:col-span-1  lg:min-h-fit bg-[white] rounded-md shadow-sm  ">
          <OrderPerSupplier
            startDate={startDate}
            endDate={endDate}
            companyCode={companyCode}
            plantName={plantName}
            groupCode={groupCode}
            orgCode={orgCode}
            limit={4}
          />
        </div>
        <div className=" bg-[white]   rounded-lg  col-span-1 md:col-span-2  xs:col-span-1 xs:w-full  shadow-sm ">
          <div className="   h-64  ">
            <DelayedOrdersChart data={data} />
          </div>{" "}
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-1 xs:grid-cols-1 my-2 gap-4 xs:gap-2 justify-items-stretch	 xs:mx-1   items-stretch">
        <div className=" bg-[white]  col-span-2 xs:col-span-1 md:col-span-1 xs:w-full py-2  md:w-full rounded-lg shadow-sm md:mb-4   px-3 xs:mx-0 ">
          <div className="flex mt-3">
            <div className="font-bold xs:text-sm md:text-xs text-lg  ">
              Suppliers by Delayed Deliveries
            </div>

            <Button
              className={`bg-[#03045E] hover:bg-[#0e106a] ml-auto whitespace-nowrap py-1 xs:text-sm   md:text-xs  font-semibold normal-case   rounded`}
              variant="contained"
              onClick={() =>
                route.push({
                  pathname: "/order/purchaseOrder",
                  query: {
                    delay: true,
                  },
                })
              }
            >
              View All
            </Button>
          </div>
          <div className=" ">
            <BarGraph data={data} />
          </div>
        </div>
        {/* <div className=" bg-[white] rounded-lg shadow-sm md:mb-4 w-1/3  p-4 mr-4 md:mr-0">
            <Bar options={verticalBarOptions} data={barData} />
          </div> */}
        <div className=" bg-[white] col-span-2 xs:col-span-1 md:col-span-1 rounded-lg md:w-full xs:w-full py-2 shadow-sm md:mb-4  md:mr-1   px-3 ">
          <div className="text-lg md:text-xs  font-bold mt-3 xs:mt-0 pl-1.5">
            Top Reasons Codes{" "}
            <span className="lg:text-sm text-base font-medium">
              (Based On Delayed Orders)
            </span>
          </div>
          <div className=" ">
            <ReasonBar data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
