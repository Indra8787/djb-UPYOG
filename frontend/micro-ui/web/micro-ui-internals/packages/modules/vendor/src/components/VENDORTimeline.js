// import React from "react";
// import { useTranslation } from "react-i18next";
// import { TickMark } from "@djb25/digit-ui-react-components";

// let actions = [];

// const getAction = (flow) => {
//   switch (flow) {
//     case "STAKEHOLDER":
//       actions = [];
//       break;
//     default:
//       actions = ["VENDOR_ADDITIONAL_DETAILS", "VENDOR_DOCUMENT_DETAILS","VENDOR_SUMMARY"];
//   }
// };
// const Timeline = ({ currentStep = 1, flow = "" }) => {
//   const { t } = useTranslation();
//   const isMobile = window.Digit.Utils.browser.isMobile();
//   getAction(flow);
//   return (
//     <div className="timeline-container" style={isMobile ? {} : { maxWidth: "960px", minWidth: "640px", marginRight: "auto" }}>
//       {actions.map((action, index, arr) => (
//         <div className="timeline-checkpoint" key={index}>
//           <div className="timeline-content">
//             <span className={`circle ${index <= currentStep - 1 && "active"}`}>{index < currentStep - 1 ? <TickMark /> : index + 1}</span>
//             <span className="secondary-color">{t(action)}</span>
//           </div>
//           {index < arr.length - 1 && <span className={`line ${index < currentStep - 1 && "active"}`}></span>}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Timeline;



import React from "react";
import { useTranslation } from "react-i18next";
import { TickMark } from "@djb25/digit-ui-react-components";

const Timeline = ({ steps = [], currentStep = 1 }) => {
  const { t } = useTranslation();

  return (
    <div className="custom-stepper-card">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div className="stepper-row" key={index}>
            <div className="stepper-left">
              <div
                className={`step-circle ${
                  isActive ? "active" : ""
                } ${isCompleted ? "completed" : ""}`}
              >
                {isCompleted ? <TickMark fillColor="red" /> : stepNumber}
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`step-line ${
                    isCompleted ? "completed-line" : ""
                  }`}
                />
              )}
            </div>

            <div
              className={`step-label ${
                isActive ? "active-text" : ""
              } ${isCompleted ? "completed-text" : ""}`}
            >
              {t(label)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;