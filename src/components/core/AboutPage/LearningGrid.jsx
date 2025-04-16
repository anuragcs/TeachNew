import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";
import { motion } from "framer-motion";

// Data Array
const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "TeachNew partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The TeachNew curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "TeachNew partners with more than 275+ leading universities and companies to bring innovative learning approaches.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Get certified with credentials recognized by leading institutions partnered with TeachNew.",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Auto-grade tools to evaluate progress and keep you motivated along your TeachNew journey.",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Learn job-ready skills with TeachNew's career-focused courses and placement support.",
  },
];

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      type: "spring",
    },
  }),
};

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12 gap-6">
      {LearningGridArray.map((card, i) => {
        return (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={i}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 8px 30px rgba(255,255,255,0.08)",
            }}
            className={`transition-all duration-300 ease-in-out rounded-xl p-6 cursor-default
              ${i === 0 && "xl:col-span-2 xl:h-[294px]"}  
              ${card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"}
              ${card.order === 3 && "xl:col-start-2"}
            `}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-4 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold leading-tight">
                  {card.heading} <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium text-base">
                  {card.description}
                </p>
                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <h1 className="text-richblack-5 text-xl font-semibold">
                  {card.heading}
                </h1>
                <p className="text-yellow-100 font-medium text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
