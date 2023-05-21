import React from "react";
import { Button } from "@mui/material";
import { useField } from "formik";

const ButtonWrapper = ({ label, ...otherProps }) => {
  return (
    <Button
      sx={{ background: "#03045E" }}
      {...otherProps}
      variant="contained"
      className=" bg-[#03045E] hover:bg-[#0e106a] ml-auto my-3 py-3  font-semibold normal-case rounded-lg "
    >
      {label}
    </Button>
  );
};

export default ButtonWrapper;
