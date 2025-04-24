import React from 'react';
import CTAButton from "../../../components/core/HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/Images/instructor_mern.jpg";
import HighlightText from './HighlightText';

const InstructorSection = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <div className="lg:w-[50%]">
          <img
            src={Instructor}
            alt="Instructor"
            className="shadow-white shadow-[-20px_-20px_0_0] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:opacity-90"
          />
        </div>
        <div className="lg:w-[50%] flex gap-10 flex-col">
          <h1 className="lg:w-[50%] text-4xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-richblack-500">
            Become an
            <HighlightText text={"instructor"} />
          </h1>

          <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-richblack-500">
            Instructors from around the world teach millions of students on
            TeachNew. We provide the tools and skills to teach what you
            love.
          </p>

          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex items-center gap-3 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-blue-600">
                Start Teaching Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
