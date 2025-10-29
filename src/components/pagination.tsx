"use client";
import React from "react";
import Pagination from "@mui/material/Pagination";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface PaginationComponentProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  onChangePage: (newPage: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  page,
  pageSize,
  totalRecords,
  onChangePage,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePrev = () => {
    if (page > 1) onChangePage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onChangePage(page + 1);
  };

  return (
    <div className="relative mt-6 flex items-center">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="hover:text-primary03 disabled:text-neutral04 absolute left-2 flex items-center gap-1 px-2 py-1 disabled:cursor-not-allowed sm:left-0"
      >
        <ArrowBackIcon fontSize="small" /> ก่อนหน้า
      </button>

      <div className="flex flex-1 justify-center px-4">
        <Pagination
          shape="rounded"
          count={totalPages}
          page={page}
          onChange={(_, currentPage) => onChangePage(currentPage)}
          color="primary"
          size="large"
          hidePrevButton
          hideNextButton
        />
      </div>

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="hover:text-primary03 disabled:text-neutral04 absolute right-2 flex items-center gap-1 px-2 py-1 disabled:cursor-not-allowed sm:right-0"
      >
        ถัดไป <ArrowForwardIcon fontSize="small" />
      </button>
    </div>
  );
};

export default PaginationComponent;
