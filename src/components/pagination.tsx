import React from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => {
          setCurrentPage((prev) => prev - 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={currentPage === 1}
        className="disabled:cursor-not-allowed"
      >
        <MdArrowBack
          size={20}
          className={`transition ${
            currentPage === 1
              ? "text-gray-300"
              : "text-blue-500 hover:text-blue-600"
          }`}
        />
      </button>

      <span className="text-gray-500">
        Page <span className="font-bold">{currentPage}</span> of {totalPages}
      </span>

      <button
        onClick={() => {
          setCurrentPage((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={currentPage === totalPages}
        className="disabled:cursor-not-allowed"
      >
        <MdArrowForward
          size={20}
          className={`transition ${
            currentPage === totalPages
              ? "text-gray-300"
              : "text-blue-500 hover:text-blue-600"
          }`}
        />
      </button>
    </div>
  );
};
export default Pagination;
