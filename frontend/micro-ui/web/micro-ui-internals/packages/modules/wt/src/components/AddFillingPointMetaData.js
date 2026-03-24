import React from "react";
import { LabelFieldPair, CardLabel, TextInput, Card } from "@djb25/digit-ui-react-components";

const AddFillingPointMetaData = ({
  t,
  formData = {},
  onSelect,
  config = {},
  visibleFields = [], // ✅ control fields from parent
}) => {
  const sectionKey = config?.key || "metaData";
  // ✅ ALL FIELDS CONFIG
  const inputs = [
    // {
    //   label: "WT_FILLING_POINT_NAME",
    //   name: "fillingPointName",
    //   isMandatory: true,
    // },
    // {
    //   label: "WT_EMERGENCY_NAME",
    //   name: "emergencyName",
    // },

    // AE
    {
      label: "WT_AE_NAME",
      name: "aeName",
      validation: {
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
      },
    },
    {
      label: "WT_AE_MOBILE_NUMBER",
      name: "aeMobile",
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        maxLength: 10,
      },
    },
    {
      label: "WT_AE_EMAIL_ID",
      name: "aeEmail",
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-z.-]+\\.(com|org|in)$",
      },
    },

    // JE
    {
      label: "WT_JE_NAME",
      name: "jeName",
      validation: {
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
      },
    },
    {
      label: "WT_JE_MOBILE_NUMBER",
      name: "jeMobile",
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        maxLength: 10,
      },
    },
    {
      label: "WT_JE_EMAIL_ID",
      name: "jeEmail",
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-z.-]+\\.(com|org|in)$",
      },
    },

    // EE
    {
      label: "WT_EE_NAME",
      name: "eeName",
      validation: {
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
      },
    },
    {
      label: "WT_EE_MOBILE_NUMBER",
      name: "eeMobile",
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        maxLength: 10,
      },
    },
    {
      label: "WT_EE_EMAIL_ID",
      name: "eeEmail",
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-z.-]+\\.(com|org|in)$",
      },
    },
  ];

  // ✅ FILTER FIELDS (core logic)
  const filteredInputs = visibleFields && visibleFields.length > 0 ? inputs.filter((input) => visibleFields.includes(input.name)) : inputs;

  // ✅ SINGLE CHANGE HANDLER
  const handleChange = (value, name) => {
    if (!onSelect) return;

    let newValue = value;
    if (["aeMobile", "jeMobile", "eeMobile", "alternateNumber"].includes(name)) {
      newValue = value.slice(0, 10).replace(/[^0-9]/g, "");
    }

    onSelect(sectionKey, {
      ...formData?.[sectionKey],
      [name]: newValue,
    });
  };

  const isMobile = window.Digit.Utils.browser.isMobile();

  return (
    <Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "16px",
        }}
      >
        {filteredInputs.map((input) => (
          <div key={input.name}>
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t(input.label)}
                {input.isMandatory ? " *" : ""}
              </CardLabel>

              <div style={{ display: "flex" }}>
                {input.componentInFront || null}

                <TextInput
                  value={formData?.[sectionKey]?.[input.name] || ""}
                  onChange={(e) => handleChange(e.target.value, input.name)}
                  maxLength={input.validation?.maxLength}
                  {...input.validation}
                />
              </div>
            </LabelFieldPair>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AddFillingPointMetaData;
