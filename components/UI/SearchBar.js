import { Close } from "@mui/icons-material";
import React from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";

function SearchBar({ searchText, onChange, clear }) {
  return (
    <div className="flex relative md:w-56 lg:w-60 xl:w-72 2xl:w-72 w-full">
      <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={onChange}
        className="border border-[#abb6c9] rounded py-1.5 px-2 text-sm md:w-60 w-full outline-none"
      />
      {searchText?.length > 0 ? (
        <div className="absolute inset-y-0 right-2 flex items-center">
          <AiOutlineClose
            className="cursor-pointer"
            size={18}
            color="#6a7487"
            onClick={clear}
          />
        </div>
      ) : (
        <div className="absolute inset-y-0 right-2 flex items-center">
          <AiOutlineSearch color="#6a7487" size={18} />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
