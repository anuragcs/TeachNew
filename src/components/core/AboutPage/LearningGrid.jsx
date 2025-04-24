import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highliteText: "Anyone, Anywhere",
    description:
      "TeachNew partners with more than 275+ leading universities and companies to provide flexible, affordable, and job-relevant online learning opportunities. Whether you're a professional looking to upskill or someone starting your learning journey, TeachNew brings the world of education to your fingertips.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money with TeachNew's curriculum, designed to make learning easier and more aligned with the latest industry demands. Our courses are developed in partnership with industry leaders to ensure you're learning skills that employers actually need and value.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "TeachNew uses innovative teaching methods that combine theory with practical, hands-on projects. Our platform supports learning through interactive videos, real-world simulations, and peer collaboration to ensure you get the most out of every lesson.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Earn recognized certifications from prestigious universities and companies as you complete each course. These credentials will give you the credibility you need to stand out in today's competitive job market.",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "TeachNew's auto-grading system allows for real-time feedback on your work. This feature ensures that you're always aware of your progress and can learn from your mistakes instantly.",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "TeachNew's focus is not only on knowledge but also on making sure you're ready to apply what you've learned. Our courses are designed to ensure you're not just learning theory, but developing.",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${
              i === 0 && "xl:col-span-2 xl:h-[294px]"
            } ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"
            } ${
              card.order === 3 && "xl:col-start-2"
            } transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:opacity-90`}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highliteText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
