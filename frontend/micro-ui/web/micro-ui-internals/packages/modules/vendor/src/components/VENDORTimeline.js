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
          <div className="stepper-row-vendor" key={index}>
            
            <div className="stepper-left">
              <div
                className={`step-circle 
                ${isActive ? "active" : ""} 
                ${isCompleted ? "completed" : ""}`}
              >
                {isCompleted ? <TickMark fillColor="#fff" /> : stepNumber}
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
              className={`step-label 
              ${isActive ? "active-text" : ""} 
              ${isCompleted ? "completed-text" : ""}`}
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