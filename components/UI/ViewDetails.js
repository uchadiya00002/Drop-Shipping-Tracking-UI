import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { $date, $prettify, getDeepValue } from "../../utils";

function ViewDetails({ open, onClose, listFields, focused, ...props }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
        <div className="py-4 px-6 lg:py-2 lg:text-sm font-bold text-[#03045E]">
          View Details
        </div>
        <DialogContent className="p-0">
          <div>
            {listFields.map((uf) => {
              let val;
              if (uf.type == "Date") {
                if (focused && focused[uf.key]) {
                  const date = focused[uf.key];
                  val = $date(date);
                } else {
                  val = "";
                }
              } else {
                val = getDeepValue(focused, uf.source || uf.key);
                if (typeof val == "boolean") {
                  val = val ? "True" : "False";
                }

                val = uf.displayFn?.(val) ?? val;
              }

              // if(val == 0){
              //     val = "0"
              // }
              return (
                <div
                  key={uf.key}
                  className={`flex ${
                    uf.type == "remarks" ? "flex-col" : "flex-row"
                  } justify-between text-sm mb-2 py-3 lg:py-2 px-6 lg:mb-1  border-b`}
                >
                  <p className="font-medium ">{$prettify(uf.name || uf.key)}</p>
                  <p className={`${uf.type == "remarks" ? "mt-2" : ""}`}>
                    {val || ""}
                  </p>
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ViewDetails;
