import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import React from "react";

const allReason = [
  {
    value: "PRODUCTION ISSUES",
    label: "Production Issues",
  },
  {
    value: "MATERIAL SHORTAGE",
    label: "Material Shortage",
  },
  {
    value: "ROAD REPAIRS",
    label: "Road Repairs",
  },
  {
    value: "HOLIDAYS",
    label: "Holidays",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const AddDate = ({
  editInfo,
  user,
  updateTransactions,
  setEditInfo,
  setSelectedReason,
  setNewDate,
  newDate,
  selectedId,
  statusOfNewDate,
  selectedReason,
  hideReason,
  selectedItem,
  setSelectedId,
}) => {
  return (
    <>
      <DialogTitle className="font-bold lg:text-xl py-1 mt-3 border-b-gray-700 ">
        <div className=" mx-1">Add Delivery Date</div>
      </DialogTitle>
      <DialogContent className="py-1">
        <div className="flex flex-col m-2 lg:m-1 w-96">
          <span className="font-medium">
            Delivey Date :{" "}
            {selectedItem?.oldDeliveryDate
              ? selectedItem?.oldDeliveryDate
              : "NA"}
          </span>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              disablePast
              label="Select Date"
              required
              className="my-4 cursor-pointer "
              inputFormat="dd/MM/yyyy"
              value={newDate}
              onChange={(newValue) => {
                setNewDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  // variant="standard"
                  className="cursor-none"
                  disabled={true}
                  size="small"
                  inputProps={{
                    readOnly: true,
                    disabled: true,
                  }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>

          <TextField
            size="small"
            className="w-full  xs:mx-auto xs:mb-4 xs:w-full cursor-pointer"
            id="outlined-select-currency"
            select
            required
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
            }}
            label="Select Reason"
            // value={status}
            // onChange={(e) => setStatus(e.target.value)}
          >
            {allReason.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions className="px-6  py-1 lg:mb-2">
        <Button
          className="  my-2 lg:my-0.5 py-2 font-semibold lg:text-sm normal-case rounded-lg ml-auto"
          variant=""
          type="submit"
          onClick={() => {
            setEditInfo(false);
            setSelectedId(null);
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={selectedReason === "" || newDate === "" ? true : false}
          className=" bg-[#03045E] hover:bg-[#0e106a] my-2 lg:my-0.5 py-1.5 font-semibold lg:text-sm normal-case rounded-lg ml-auto"
          variant="contained"
          type="submit"
          onClick={() => {
            let payload;
            if (hideReason) {
              payload = {
                _id: selectedId,
                newDeliveryDate: moment(newDate).format("DD.MM.YYYY"),
                newDeliveryDateReason: selectedReason,
              };
            } else {
              payload = {
                _id: selectedId,
                newDeliveryDate: moment(newDate).format("DD.MM.YYYY"),
                reason: selectedReason,
              };
            }
            updateTransactions(payload);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};

const AcceptOrRejectDate = ({
  user,
  updateTransactions,

  newDate,
  selectedId,
  statusOfNewDate,
  selectedReason,
}) => {
  return (
    <>
      <div className="text-xl font-bold border-b-gray-700 px-4 pt-2">
        New Delivery Date
      </div>
      <DialogContent className="px-4 py-1">
        <div className="w-72 lg:w-72 lg:text-sm my-2 lg:my-1">
          <div className="flex flex-row my-1 lg:my-0.5">
            <p className="font-semibold mr-2">New Delivery Date:</p>
            <span className="font-normal">{newDate ? newDate : "NA"}</span>
          </div>
          {user?.role == "BUYER" && (
            <div className="flex flex-col mb-1">
              <p className="font-semibold mr-2">Reason:</p>
              <span className="font-normal">
                {selectedReason ? selectedReason : "NA"}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
      {statusOfNewDate === "PENDING" && (
        <DialogActions className="px-6 lg:mb-2 mb-6">
          <Button
            className=" bg-[#00AA57] hover:bg-[#129053]  mr-2  normal-case lg:text-xs rounded"
            variant="contained"
            type="submit"
            onClick={() => {
              updateTransactions({
                _id: selectedId,
                statusForNewDeliveryDate: "ACCEPTED",
              });
            }}
          >
            Accept
          </Button>
          <Button
            className=" bg-[#FF3838] hover:bg-[#c01919]    normal-case lg:text-xs rounded"
            variant="contained"
            type="submit"
            onClick={() => {
              updateTransactions({
                _id: selectedId,
                statusForNewDeliveryDate: "REJECTED",
              });
            }}
          >
            Reject
          </Button>
        </DialogActions>
      )}
    </>
  );
};

const TransactionSelDate = ({
  editInfo,
  user,
  updateTransactions,
  setEditInfo,
  setSelectedReason,
  setNewDate,
  newDate,
  selectedId,
  statusOfNewDate,
  selectedReason,
  hideReason,
  selectedItem,
  setSelectedId,
}) => {
  return (
    <div>
      {editInfo && (
        <Dialog
          open={editInfo}
          onClose={() => {
            setEditInfo(false);
            setSelectedId(null);
          }}
          className="p-2 m-2 lg:m-1 lg:p-1 xs:w-full"
        >
          {user?.role == "SUPPLIER" &&
          statusOfNewDate == "PENDING" &&
          (hideReason
            ? user?._id == selectedItem?.newDeliveryDateModifiedBy
            : user?._id == selectedItem?.newDeliveryDateModifiedBy?._id) ? (
            <>
              <AddDate
                updateTransactions={updateTransactions}
                setEditInfo={setEditInfo}
                setSelectedReason={setSelectedReason}
                setNewDate={setNewDate}
                newDate={newDate}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                statusOfNewDate={statusOfNewDate}
                selectedReason={selectedReason}
                hideReason={hideReason}
                selectedItem={selectedItem}
              />
            </>
          ) : user?.role == "SUPPLIER" && statusOfNewDate !== "PENDING" ? (
            <>
              <AddDate
                updateTransactions={updateTransactions}
                setEditInfo={setEditInfo}
                setSelectedReason={setSelectedReason}
                setNewDate={setNewDate}
                newDate={newDate}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                statusOfNewDate={statusOfNewDate}
                selectedReason={selectedReason}
                hideReason={hideReason}
                selectedItem={selectedItem}
              />
            </>
          ) : (
            statusOfNewDate == "PENDING" &&
            (!hideReason
              ? user?._id !== selectedItem?.newDeliveryDateModifiedBy
              : user?._id !== selectedItem?.newDeliveryDateModifiedBy?._id) && (
              <AcceptOrRejectDate
                newDate={newDate}
                selectedId={selectedId}
                statusOfNewDate={statusOfNewDate}
                selectedReason={selectedReason}
                setSelectedId={setSelectedId}
                updateTransactions={updateTransactions}
                user={user}
              />
            )
          )}
        </Dialog>
      )}
    </div>
  );
};

export default TransactionSelDate;
