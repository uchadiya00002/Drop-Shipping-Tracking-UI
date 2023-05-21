import { Menu, MenuItem, Popover } from "@mui/material";
import React from "react";

function MenuView({ anchorEl, handleClose, onDelete, selectedRecord, onEdit }) {
  return (
    <div>
      <Menu
        id="1"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit();
          }}
          value="MARK_AS_READ"
          key="MARK_AS_READ"
          className="capitalize"
          style={{
            fontWeight: "600",
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete({ materialNumber: selectedRecord?.materialNumber });
          }}
          style={{
            fontWeight: "600",
          }}
          className="capitalize"
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default MenuView;
