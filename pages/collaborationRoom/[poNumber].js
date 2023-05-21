import { ArrowBack } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../../components/UI/Chat";
import StepperCollab from "../../components/UI/StepperCollab";
import { fetchcollabs, sendEmailToBuyer } from "../../store/slices/collabSlice";
import { updatePurchaseOrder } from "../../store/slices/orderSlice";
import { $windowExists } from "../../utils";
import { useAuth } from "../../utils/hooks";

const collabForSelOrder = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [emailSub, setEmailSub] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [currentOrderNo, setCurrentOrderNo] = useState("");
  const [currentItemNo, setCurrentItemNo] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [collabs, setCollabs] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedPoNumber, setSelectedPoNumber] = useState(
    route?.query?.poNumber
  );
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChatClose = async () => {
    setCurrentItemNo("");
    setCurrentOrderNo("");
    setCurrentUser("");
    setChatOpen(false);
  };

  const styling = {
    outline: "none",
    position: "absolute",
    bottom: "20%",
    right: "2%",
    transform: "translate(0%, 0%)",
    width: 390,
    backgroundColor: "white",
    borderRadius: "9px",
    boxShadow: 24,
    p: 4,
    height: 400,
    border: "none",
  };

  const { user, fallBack } = useAuth();
  const role = useSelector((state) => state.auth?.user?.role);
  useEffect(async () => {
    if (user && route) {
      if (route && route?.query?.poNumber) {
        const poNumber = route?.query?.poNumber;
        setSelectedPoNumber(poNumber);
        getCollabs();
      }
    }
  }, [user, page, route, setCollabs, selectedPoNumber]);

  const getCollabs = async () => {
    setLoading(true);
    try {
      let payload = {
        pagination: {
          limit: limit,
          page: page,
        },
        conditions: {
          poNumber: selectedPoNumber,
        },
      };
      const res = await dispatch(fetchcollabs(payload));
      if (res) {
        setCollabs(res?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const removeOrderFromCollab = async ({ poNumber }) => {
    try {
      const payload = {
        poNumber,
        criticalParts: { criticalParts: false },
      };
      const res = await dispatch(updatePurchaseOrder(payload));
      if (res) {
        getCollabs();
      }
    } catch (error) {}
  };

  const sendEmail = async ({ email, subject, content }) => {
    try {
      const payload = {
        email,
        subject,
        content,
      };

      const res = await dispatch(sendEmailToBuyer(payload));
      if (res) {
      }
    } catch (error) {
      setShowDialog(false);
    }
  };

  if (!$windowExists) {
    return fallBack;
  } else if (!user) {
    // router.push('/')
    return fallBack;
  }
  return (
    <>
      <div className="w-full min-h-screen bg-[#E5E5E5]  flex flex-col px-5  ">
        {loading ? (
          <div className="flex justify-center w-full h-full items-center">
            <CircularProgress />
          </div>
        ) : collabs?.data?.length > 0 ? (
          collabs?.data?.map((collab, idx) => (
            <>
              <div className="bg-[white] shadow-lg z-[3] drawer-open reduce-wid  drawer-close smooth lg:mt-5 mt-8 fixed  lg:text-xs my-10 lg:my-5 lg:py-2  px-4">
                <>
                  <div className=" flex flex-row my-4 lg:my-1 ">
                    <div className="flex  items-center">
                      <div
                        title="Back"
                        className="text-lg lg:text-xs mr-2 cursor-pointer "
                        onClick={() => route.back()}
                      >
                        <ArrowBack />
                      </div>
                      <h2 className="text-2xl font-bold  lg:text-base ">
                        {collab?.orderNo ? collab?.orderNo : "Order Number"}
                      </h2>
                    </div>
                    <Button
                      className={` bg-[#03045E] hover:bg-[#0e106a] py-1 lg:py-0.5 lg:text-xs text-lg font-bold normal-case  rounded-lg ml-auto ${
                        role === "SUPPLIER" ? "hidden" : "inline"
                      }`}
                      variant="contained"
                      checked={collab?.orderNo}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOrderFromCollab({
                          poNumber: collab?.orderNo,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="flex flex-col py-2 lg:py-0.5">
                    <div
                      className="grid grid-cols-3 gap-4 lg:gap-2 md:grid-cols-2 xs:grid-cols-1 xs:gap-y-3 xs:gap-x-1"
                      key={collab?.orderNo}
                    >
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">Order Number:</p>
                        <span className="font-normal">
                          {collab?.orderNo ? collab?.orderNo : "NA"}
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">Order Date:</p>
                        <span className="font-normal">
                          {collab?.orderDate ? collab?.orderDate : "NA"}
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">Order Quantity:</p>
                        <span className="font-normal">
                          {collab?.orderQuantity ? collab?.orderQuantity : "NA"}
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">Order Description:</p>
                        <span className="font-normal">
                          {collab?.orderDescription
                            ? collab?.orderDescription
                            : "NA"}
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">Material Number:</p>
                        <span className="font-normal">
                          {collab?.materialId ? collab?.materialId : "NA"}
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">
                          Material Description:
                        </p>
                        <span className="font-normal">
                          {collab?.materialName ? collab?.materialName : "NA"}
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">Supplier Name:</p>
                        <span className="font-normal">
                          {collab?.supplierName ? collab?.supplierName : "NA"}
                        </span>
                      </div>
                      <div className="flex flex-row">
                        <p className="font-semibold mr-4">Supplier ID:</p>
                        <span className="font-normal">
                          {collab?.supplierId ? collab?.supplierId : "NA"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              </div>
              <div className="bg-[white] px-4  z-[3]  lg:mt-40 mt-60  drawer-open reduce-wid  drawer-close smooth fixed  my-4 lg:my-0 overflow-x-auto ">
                <h1 className="font-semibold text-lg my-2 lg:text-xs lg:my-1">
                  Line Item Number
                </h1>
                {collab?.allItemDetails?.length > 0 ? (
                  collab?.allItemDetails?.map((item, index) =>
                    loading ? (
                      <div className="flex justify-center items-center py-32">
                        <CircularProgress />
                      </div>
                    ) : (
                      <>
                        <div
                          className="flex justify-between   xs:px-4 py-2 whitespace-nowrap mb-4"
                          key={item?.itemNo}
                        >
                          <div className="xs:mx-2 lg:text-xs  w-14 mr-4 z-[1] ">
                            {item?.itemDescription
                              ? item?.itemDescription
                              : "NA"}
                          </div>

                          <StepperCollab item={item} getCollabs={getCollabs} />

                          <div className="xs:mx-2 whitespace-nowrap">
                            <Button
                              className={`bg-[#03045E] hover:bg-[#0e106a] lg:text-xs   py-1 text-lg font-bold normal-case rounded-lg 
                              ${collab?.supplier ? "mx-4" : "mx-2"} 
                                `}
                              variant="contained"
                              onClick={() => {
                                route.push(
                                  `/collabRoom/${collab?.orderNo}?itemNumber=${item?.itemNo}&buyerId=${item?.userId?._id}`
                                );
                              }}
                            >
                              Details
                            </Button>
                            {collab?.supplier ? (
                              <Button
                                onClick={() => {
                                  setSendTo(
                                    user?.role == "BUYER"
                                      ? collab?.supplier
                                      : item?.userId?._id
                                  );
                                  setCurrentItemNo(item?.itemNo);
                                  setCurrentOrderNo(item?.orderNo);
                                  setCurrentUser(item);
                                  setChatOpen(true);
                                }}
                                className=" bg-[#03045E] hover:bg-[#0e106a] lg:text-xs  py-1 text-lg font-bold normal-case  rounded-lg  "
                                variant="contained"
                              >
                                Chat
                              </Button>
                            ) : (
                              ""
                            )}

                            <Button
                              className={`bg-[#03045E] hover:bg-[#0e106a] lg:text-xs   py-1 text-lg font-bold normal-case rounded-lg 
   ${collab?.supplier ? "mx-4" : "mx-2"} 
     `}
                              variant="contained"
                              onClick={() => {
                                setShowDialog(true);
                                setSelectedEmail(
                                  role === "SUPPLIER"
                                    ? item?.userId?.email
                                    : collab?.supplierEmail
                                );
                              }}
                            >
                              Email
                            </Button>
                          </div>

                          <span className="mx-4 pr-2 lg:text-xs  whitespace-nowrap">
                            ETA:{" "}
                            {item?.itemDeliveryDate
                              ? item?.itemDeliveryDate
                              : "NA"}
                          </span>
                        </div>
                      </>
                    )
                  )
                ) : (
                  <div className=" w-full flex justify-center  items-center">
                    <div className="bg-[white]  h-22 py-16 flex justify-center w-full items-center text-lg ">
                      No Items are Critical
                    </div>
                  </div>
                )}
              </div>
            </>
          ))
        ) : (
          <div className=" w-full flex justify-center my-auto py-40 items-center text-2xl ">
            No orders....
          </div>
        )}
        {/* dialog box for Send Email option */}
        {showDialog && (
          <Dialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
            className="p-2 m-2 xs:w-full"
          >
            <DialogTitle className="font-bold lg:text-sm lg:py-2 lg:mt-2  border-b-gray-700 ">
              Send Email
            </DialogTitle>
            <DialogContent>
              <div className="flex flex-col  w-96 lg:w-80">
                <TextField
                  label="Subject"
                  size="small"
                  className="my-4"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                />

                <TextField
                  id="outlined-multiline-static"
                  label="Email"
                  multiline
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>
            </DialogContent>
            <DialogActions className="px-6 mb-6">
              <Button
                className="  text-gray-400   normal-case lg:text-xs rounded-lg "
                // variant="contained"
                //   disabled={emailSub && emailBody === "" ? true : false}
                onClick={() => {
                  setShowDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className=" bg-[#03045E] hover:bg-[#0e106a]    normal-case lg:text-xs rounded-lg "
                variant="contained"
                disabled={emailSub && emailBody === "" ? true : false}
                onClick={() => {
                  sendEmail({
                    email: selectedEmail,
                    subject: emailSub,
                    content: emailBody,
                  });

                  setShowDialog(false);
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {chatOpen && (
          <div
            style={{ backgroundColor: "#F2F2F2" }}
            className={`container1 mx-auto w-full flex flex-col  flex-grow
      justify-center mt-2 py-2 px-3 pb-5`}
          >
            (
            <Modal
              open={chatOpen}
              onClose={() => handleChatClose()}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div style={styling}>
                <Chat
                  setChatOpen={setChatOpen}
                  currentUser={currentUser}
                  currentOrderNo={currentOrderNo}
                  currentItemNo={currentItemNo}
                  onClick={handleChatClose}
                  sendTo={sendTo}
                />
              </div>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default collabForSelOrder;
