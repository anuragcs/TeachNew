import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`relative overflow-hidden text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold transition-all duration-300 ease-in-out cursor-pointer
          ${active
          ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white shadow-lg hover:scale-105 hover:from-blue-500 hover:to-blue-700"
          : "bg-richblack-800 text-white border border-richblack-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-richblack-700 hover:scale-105"}
        hover:shadow-xl hover:ring-2 hover:ring-blue-300`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
