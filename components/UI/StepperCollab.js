import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateItemForSupp } from "../../store/slices/collabSlice";
import { useAuth } from "../../utils/hooks";

const StepperCollab = ({ item, getCollabs }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reasonValue, setReasonValue] = useState("");
  const [selectedItem, setselectedItem] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateAll, setUpdateAll] = useState(false);
  const [selectedPoNumber, setSelectedPoNumber] = useState("");
  const [selectedBuyerId, setSelectedBuyerId] = useState("");
  const { user } = useAuth();
  const role = useSelector((state) => state.auth?.user?.role);
  const materialAvailabilityStatus = item?.reason.find(
    (r) => r.name == "Material Availability"
  )?.status;

  const processingStatus = item?.reason.find(
    (r) => r.name == "Processing"
  )?.status;

  const prepToDispatchStatus = item?.reason.find(
    (r) => r.name == "Prepare to dispatch"
  )?.status;
  const shippedAndReceivedtatus = item?.status;

  let materialAvailabilityStyles = {};
  let processingStyles = {};
  let prepToDispatchStyles = {};
  let shippedStyles = {};
  let receivedStyles = {};
  let allStatus = [];

  useEffect(async () => {
    if (user) {
      const updatedName = item?.reason[0]?.name;
      const updatedStatus = item?.reason[0]?.status
        ? item?.reason[0]?.status
        : "";
      const updatedReason = item?.reason[0]?.value
        ? item?.reason[0]?.value
        : "";

      setName(updatedName);
      setSelectedStatus(updatedStatus);
      setSelectedPoNumber(item?.orderNo);
      setSelectedBuyerId(item?.userId?._id);
      setselectedItem(item?.itemNo);
      setActiveStep(5);
      // if (updatedName === "Material Availability") {
      //   setActiveStep(1);
      //   setReasonValue(updatedReason);
      // } else if (updatedName === "Processing") {
      //   setActiveStep(2);
      //   setReasonValue(updatedReason);
      // } else if (updatedName === "Prepare to dispatch") {
      //   setActiveStep(3);
      //   setReasonValue(updatedReason);
      // } else if (item?.status === "SHIPPED") setActiveStep(4);
      // else if (item?.status === "RECEIVED") setActiveStep(5);
    }
  }, [updateItemStatus, item?.reason[0]?.name, item?.status]);

  switch (name) {
    case "Material Availability":
      allStatus = ["Available", "Shortage", "Issue"];
      break;
    case "Processing":
      allStatus = ["Complete", "In Progress", "Issue"];
      break;
    case "Prepare to dispatch":
      allStatus = ["Dispatched", "In Progress", "Delay"];
      break;

    default:
      allStatus = ["Available", "Shortage", "Issue"];
      break;
  }
  switch (materialAvailabilityStatus) {
    case "Available":
      materialAvailabilityStyles = {
        color: "green",
        backgroundColor: "green",
      };
      break;
    case "Shortage":
      materialAvailabilityStyles = {
        color: "orange",
        backgroundColor: "orange",
      };
      break;
    case "Issue":
      materialAvailabilityStyles = {
        color: "red",
        backgroundColor: "red",
      };
      break;
    default:
      materialAvailabilityStyles = {
        color: "white",
        backgroundColor: "white",
      };
      break;
  }
  switch (processingStatus) {
    case "Complete":
      processingStyles = {
        color: "green",
        backgroundColor: "green",
      };
      break;
    case "In Progress":
      processingStyles = {
        color: "orange",
        backgroundColor: "orange",
      };
      break;
    case "Issue":
      processingStyles = {
        color: "red",
        backgroundColor: "red",
      };
      break;
    default:
      break;
  }
  switch (prepToDispatchStatus) {
    case "Dispatched":
      prepToDispatchStyles = {
        color: "green",
        backgroundColor: "green",
      };
      break;
    case "In Progress":
      prepToDispatchStyles = {
        color: "orange",
        backgroundColor: "orange",
      };
      break;
    case "Delay":
      prepToDispatchStyles = {
        color: "red",
        backgroundColor: "red",
      };
      break;
    default:
      break;
  }
  switch (shippedAndReceivedtatus) {
    case "SHIPPED":
      materialAvailabilityStyles = {
        color: "green",
        backgroundColor: "green",
      };
      processingStyles = {
        color: "green",
        backgroundColor: "green",
      };
      prepToDispatchStyles = {
        color: "green",
        backgroundColor: "green",
      };
      shippedStyles = {
        color: "green",
        backgroundColor: "green",
      };
      break;
    case "RECEIVED":
      materialAvailabilityStyles = {
        color: "green",
        backgroundColor: "green",
      };
      processingStyles = {
        color: "green",
        backgroundColor: "green",
      };
      prepToDispatchStyles = {
        color: "green",
        backgroundColor: "green",
      };
      shippedStyles = {
        color: "green",
        backgroundColor: "green",
      };
      receivedStyles = {
        color: "green",
        backgroundColor: "green",
      };
      break;
    default:
      // receivedStyles = {
      //   color: "green",
      //   backgroundColor: "green",
      // };
      break;
  }

  const stepperStyles = {
    materialAvailable: {
      "& .MuiStepLabel-root  .Mui-completed": {
        color: materialAvailabilityStyles.color,
        // fontSize: "10px",
      },
      "& .MuiStepIcon-root ": {
        backgroundColor: materialAvailabilityStyles.backgroundColor,
        color: "white",
        border: "1px solid #F35235",
        borderRadius: "50%",
        zIndex: 1,
        marginLeft: 2,
        marginRight: 5,
      },
      "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
        color: "black",
        // font: 14,
        // Just text label (COMPLETED)
      },

      "& .MuiStepLabel-root  .Mui-active": {
        color: "white",
        border: "1px solid #F35235",
        borderRadius: "50%",
      },
      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
        color: "common.black",
        border: "none", // Just text label (ACTIVE)
      },
    },
    process: {
      "& .MuiStepLabel-root .Mui-completed": {
        color: processingStyles.color,
      },

      "& .MuiStepIcon-root ": {
        backgroundColor: processingStyles.backgroundColor,
        color: "white",
        border: `1px solid #F35235`,
        borderRadius: "50%",
        zIndex: 1,
        marginLeft: 8,
        marginRight: 8,
      },
      "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
        color: "black", // Just text label (COMPLETED)
      },
      "& .MuiStepLabel-root .Mui-active": {
        color: "white",
        border: "1px solid #F35235",
        borderRadius: "50%",
      },
      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
        color: "common.black",
        // font: 18,
        border: "none", // Just text label (ACTIVE)
      },
    },
    prepareToDispatch: {
      "& .MuiStepLabel-root .Mui-completed": {
        color: prepToDispatchStyles.color,
      },

      "& .MuiStepIcon-root ": {
        backgroundColor: prepToDispatchStyles.backgroundColor,
        color: "white",
        border: `1px solid #F35235`,
        borderRadius: "50%",
        zIndex: 1,
        marginLeft: 8,
        marginRight: 8,
      },
      "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
        color: "black", // Just text label (COMPLETED)
      },
      "& .MuiStepLabel-root .Mui-active .Mui-disabled": {
        color: "white",
        border: "1px solid #F35235",
        borderRadius: "50%",
      },
      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
        color: "common.black",
        border: "none", // Just text label (ACTIVE)
      },
    },
    shipped: {
      "& .MuiStepLabel-root .Mui-completed": {
        color: shippedStyles.color,
      },

      "& .MuiStepIcon-root ": {
        backgroundColor: shippedStyles.backgroundColor,
        color: "white",
        border: `1px solid #F35235`,
        borderRadius: "50%",
        zIndex: 1,
        marginLeft: 8,
        marginRight: 8,
      },
      "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
        color: "black", // Just text label (COMPLETED)
      },
      "& .MuiStepLabel-root .Mui-active .Mui-disabled": {
        color: "white",
        border: "1px solid #F35235",
        borderRadius: "50%",
      },
      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
        color: "common.black",
        border: "none", // Just text label (ACTIVE)
      },
    },
    received: {
      "& .MuiStepLabel-root .Mui-completed": {
        color: receivedStyles.color,
      },

      "& .MuiStepIcon-root ": {
        backgroundColor: receivedStyles.backgroundColor,
        color: "white",
        border: `1px solid #F35235`,
        borderRadius: "50%",
        zIndex: 1,
        marginLeft: 8,
        marginRight: 8,
      },
      "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
        color: "black", // Just text label (COMPLETED)
      },
      "& .MuiStepLabel-root .Mui-active .Mui-disabled": {
        color: "white",
        border: "1px solid #F35235",
        borderRadius: "50%",
      },
      "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
        color: "common.black",
        border: "none", // Just text label (ACTIVE)
      },
    },
  };

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        color: "grey",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#F35235",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#F35235",
      borderTopWidth: 2,
      borderRadius: 1,
    },
  }));

  const updateItemStatus = async ({ poNumber, itemNo, info }) => {
    try {
      const payload = {
        poNumber,
        itemNo,
        info,
      };

      const res = await dispatch(updateItemForSupp(payload));
      if (res) {
        getCollabs();
        setReasonValue("");
        setShowPopup(false);
      }
    } catch (error) {
      setShowPopup(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" ml-4  lg:text-xs ">
        <Stepper
          className="lg:text-xs"
          alternativeLabel
          activeStep={activeStep}
          connector={<QontoConnector />}
          key={item?.itemNo}
        >
          <Step sx={stepperStyles.materialAvailable}>
            <StepLabel
              className="cursor-pointer  whitespace-nowrap"
              onClick={() => {
                setName("Material Availability");
                setShowPopup(materialAvailabilityStatus != "Available");
              }}
            >
              Material Availability
            </StepLabel>
          </Step>

          <Step sx={stepperStyles.process}>
            <StepLabel
              className="cursor-pointer"
              onClick={() => {
                setName("Processing");
                setShowPopup(
                  materialAvailabilityStatus == "Available" &&
                    processingStatus != "Complete"
                );
              }}
            >
              Processing
            </StepLabel>
          </Step>

          <Step sx={stepperStyles.prepareToDispatch}>
            <StepLabel
              className="cursor-pointer"
              onClick={() => {
                setName("Prepare to dispatch");
                setShowPopup(
                  processingStatus == "Complete" &&
                    prepToDispatchStatus != "Dispatched"
                );
              }}
            >
              Prepare for dispatch
            </StepLabel>
          </Step>

          <Step sx={stepperStyles.shipped}>
            <StepLabel>Shipped</StepLabel>
          </Step>
          <Step sx={stepperStyles.received}>
            <StepLabel>Received</StepLabel>
          </Step>
        </Stepper>
      </div>

      {role == "SUPPLIER" && showPopup && (
        <Dialog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          className="p-2 m-2 xs:w-full"
        >
          <DialogTitle className="font-bold   border-b-gray-700 ">
            Reason
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-col m-2 w-96">
              <TextField
                className="mb-4"
                id="outlined-select-currency"
                select
                label="Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {allStatus.map((option) => (
                  <MenuItem className=" " key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="outlined-multiline-static"
                label="Reason"
                value={reasonValue}
                onChange={(e) => setReasonValue(e.target.value)}
                multiline
                rows={5}
              />
            </div>
            <label className="font-semibold text-base">
              <Checkbox
                className=" "
                color="primary"
                // size="small"
                label="ddd"
                checked={updateAll}
                onClick={() => {
                  setUpdateAll(!updateAll);
                }}
              />
              Update this detail for all Items*
            </label>
          </DialogContent>
          <DialogActions className="px-6 mb-6">
            <Button
              className=" bg-gray-400 text-black    normal-case rounded-lg "
              // variant="contained"
              type="submit"
              onClick={() => {
                setShowPopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className=" bg-[#03045E] hover:bg-[#0e106a]    normal-case rounded-lg "
              variant="contained"
              disabled={reasonValue === ""}
              type="submit"
              onClick={() => {
                let data = {
                  poNumber: selectedPoNumber,
                  itemNo: selectedItem,
                  info: {
                    buyerUserId: selectedBuyerId,
                    reason: [
                      {
                        name: name,
                        status: selectedStatus,
                        value: reasonValue,
                      },
                    ],
                  },
                };
                if (updateAll) data.info.updateAll = true;

                updateItemStatus(data);
                setShowPopup(false);
                setReasonValue("");
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default StepperCollab;
