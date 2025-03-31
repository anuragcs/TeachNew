import React from "react";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData }) => {
  return (
    <div
      className={`w-[320px] lg:w-[28%] transition-all duration-300 ease-in-out
        bg-blue-800 text-richblack-25 h-[280px] box-border cursor-pointer
        hover:bg-white hover:shadow-[12px_12px_0_0] hover:shadow-yellow-50`}
    >
      <div className="border-b-[2px] border-blue-400 border-dashed h-[80%] p-5 flex flex-col gap-2">
        <div className="font-semibold text-[18px] hover:text-richblack-800">
          {cardData?.heading}
        </div>

        <div className="text-richblack-400 text-[14px]">{cardData?.description}</div>
      </div>

      <div className="flex justify-between text-richblack-300 px-5 py-2 font-medium text-[14px]">
        {/* Level */}
        <div className="flex items-center gap-2">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* Lessons */}
        <div className="flex items-center gap-2">
          <ImTree />
          <p>{cardData?.lessionNumber} Lessons</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
