import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

function CustomSelect({
  value,
  onChange,
  className,
  limit,
  values,
  fuzzy,
  notAll,
  label,
  placeholder,
  onlyOption,
}) {
  const inputLabelStyle = {
    // position: "absolute",
    // top: "4px",
    left: "-4px",
    backgroundColor: !fuzzy && "white",
    padding: "0px",
    fontSize: "0.8rem",
  };

  let data = limit ? [5, 10, 15, 25, 50, 75, 100] : values;
  return (
    <>
      <FormControl variant="outlined" style={{ width: "100%" }}>
        {label && (
          <InputLabel
            className="text-sm"
            id="test-select-label"
            shrink
            htmlFor="my-select"
            style={inputLabelStyle}
          >
            {label}
          </InputLabel>
        )}
        <Select
          value={value}
          onChange={onChange}
          className={className}
          size="small"
          label={label}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          style={{
            fontSize: "14px",
            color: "#808690",
            padding: "1px",
            backgroundColor: fuzzy ? "#f1f9f9" : "white",
            borderRight: "0",
            // borderRadius: fuzzy ? "0px" : "4px",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            borderTopRightRadius: fuzzy ? "0px" : "4px",
            borderBottomRightRadius: fuzzy ? "0px" : "4px",
          }}
        >
          {/* {placeholder && <MenuItem value="" selected>{placeholder}</MenuItem>} */}
          {!limit && !notAll && <MenuItem value="ALL">ALL</MenuItem>}
          {data?.map((option) => (
            <MenuItem
              style={{ fontSize: "14px", padding: "4px 16px" }}
              key={limit ? option : option.value}
              value={limit ? option : onlyOption ? option : option?.value}
            >
              {limit ? option : onlyOption ? option : option?.label}
              {limit && "/page"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default CustomSelect;
