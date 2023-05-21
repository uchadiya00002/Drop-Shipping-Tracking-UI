import React from "react";
import { makeStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: "#5c9ddf",
    border: "1px solid #ffffff",
    color: "white",
    fontWeight: 700,
    fontSize: "12px",
  },
}));

function ToolTip({ title, children }) {
  const classes = useStyles();
  return (
    <Tooltip
      title={title}
      classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
    >
      {children}
    </Tooltip>
  );
}

export default ToolTip;
