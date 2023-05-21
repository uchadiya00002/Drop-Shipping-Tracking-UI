import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const ToggleSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked ": {
    color: "#FFFFFF",
    // opacity: "20%",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#6EA642",
    opacity: "100%",
    color: "#EBEBEB",
  },
}));
export default ToggleSwitch;
