import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import React from "react";

function Pagination({ page, limit, onClick, count, length, ...props }) {
  const pageStart = length > 0 ? limit * (page - 1) + 1 : 0;
  const pageEnd = length > 0 ? limit * (page - 1) + length : 0; //page * count
  const maxPage = Math.ceil(count / limit);
  const hasNext = page < maxPage;

  return (
    <div className="flex items-center whitespace-nowrap">
      <button
        disabled={page == 1}
        className={`ml-1 mb-1 ${page == 1 ? "opacity-50" : "opacity-1"}`}
        onClick={() => onClick(page - 1)}
      >
        <ArrowBackIos fontSize="22" />
      </button>
      <div className="flex lg:text-sm md:text-sm">
        <p>{pageStart}</p>-
        <p>
          {pageEnd} of {count}
        </p>
      </div>
      <button
        disabled={!hasNext}
        className={`md:ml-1 mb-1 ${!hasNext ? "opacity-50" : "opacity-1"}`}
        onClick={() => onClick(page + 1)}
      >
        <ArrowForwardIos fontSize="22" />
      </button>
    </div>
  );
}

export default Pagination;
