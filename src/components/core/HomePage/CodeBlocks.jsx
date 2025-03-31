import React from 'react'
import CTAButton from "../HomePage/Button"
import HighlightText from './HighlightText'
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'



const CodeBlocks = ({
  position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>

      {/* Section 1 */}
      <div className="w-[50%] flex flex-col gap-8">
        <div className="text-2xl font-semibold">{heading}</div>
        <div className="text-white-500 font-bold text-lg">
          {subheading}
        </div>

        <div className="flex gap-7 mt-7">
          <CTAButton
            active={ctabtn1.active}
            linkto={ctabtn1.linkto}
            className="transition-all duration-300 hover:bg-purple-600 hover:text-white p-3 rounded-md shadow-lg"
          >
            <div className="flex gap-2 items-center">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton
            active={ctabtn2.active}
            linkto={ctabtn2.linkto}
            className="transition-all duration-300 hover:bg-purple-600 hover:text-white p-3 rounded-md shadow-lg"
          >
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-row text-[10px] lg:w-[500px] py-4 h-fit w-[100%]">
        {/* Line numbers */}
        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold space-y-1">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
        </div>

        {/* Code Block */}
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 py-3 rounded-md border border-gray-300 shadow-lg`}
          style={{ background: backgroundGradient ? backgroundGradient : 'linear-gradient(to right,rgb(145, 35, 255),rgb(10, 11, 15))' }}
        >
          <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
              fontSize: "1rem", // Add some font size for readability
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>

    </div>
  );
}

export default CodeBlocks;
