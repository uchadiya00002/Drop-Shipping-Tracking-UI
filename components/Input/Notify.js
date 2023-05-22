import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { notify } from "../../store/slices/orderSlice";

const Notify = ({ showDialog, setShowDialog, orderNo }) => {
  const dispatch = useDispatch();
  const [selectedRemarks, setSelectedRemarks] = useState("");
  const submitRemark = async (values) => {
    try {
      let payload = values;

      const res = await dispatch(notify(payload));
      if (res) {
        setShowDialog(false);
        setSelectedRemarks("");
      }
    } catch (error) {}
  };
  return (
    <div>
      {
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          className="p-2 m-2 lg:p-1 xs:w-full"
        >
          <div className="text-2xl font-bold border-b-gray-700 px-4 pt-2">
            Notify
          </div>
          <DialogContent className="px-4 py-1">
            <div className="flex flex-col  w-[460px] lg:w-96  lg:mt-2 mt-2">
              <TextField
                id="outlined-multiline-static"
                label="Remarks"
                multiline
                value={selectedRemarks}
                onChange={(e) => setSelectedRemarks(e.target.value)}
                rows={5}
              />
            </div>
          </DialogContent>
          <DialogActions className="pr-4 mb-1">
            <Button
              style={{
                padding: "3px 16px 3px 16px",
              }}
              className=" bg-gray-400 text-black normal-case rounded"
              // variant="contained"
              //   disabled={emailSub && emailBody === "" ? true : false}
              onClick={() => {
                setShowDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                padding: "3px 16px 3px 16px",
              }}
              className=" bg-primary-bg hover:bg-primary-bg normal-case rounded"
              variant="contained"
              disabled={selectedRemarks === "" ? true : false}
              onClick={() => {
                submitRemark({
                  orderNo,
                  remarks: selectedRemarks,
                });
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  );
};

export default Notify;
