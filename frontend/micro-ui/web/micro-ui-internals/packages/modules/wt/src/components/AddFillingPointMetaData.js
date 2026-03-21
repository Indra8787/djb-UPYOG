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
    {
      label: "WT_AE_NAME",
      name: "name",
      isMandatory: true,
      validation: {
        pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
    },
    {
      label: "WT_AE_MOBILE_NUMBER",
      name: "mobileNumber",
      isMandatory: true,
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
       validation: {
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        maxLength: 10,
      },
    },
    {
      label: "WT_AE_EMAIL_ID",
      name: "emailId",
      validation: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-z.-]+\\.(com|org|in)$",
        title: t("CORE_COMMON_EMAIL_ID_INVALID"),
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
      name: "jeMobileNumber",
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
       validation: {
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        maxLength: 10,
      },
    },
    {
      label: "WT_JE_EMAIL_ID",
      name: "jeEmailId",
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
      name: "eeMobileNumber",
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        maxLength: 10,
      },
    },
    {
      label: "WT_EE_ALT_MOBILE_NUMBER",
      name: "alternateNumber",
      componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
      validation: {
        pattern: "[6-9]{1}[0-9]{9}",
        type: "tel",
        maxLength: 10,
      },
    },
    {
      label: "WT_EE_EMAIL_ID",
      name: "eeEmailId",
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

    onSelect(sectionKey, {
      ...formData?.[sectionKey],
      [name]: value,
    });
  };

  return (
    <Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
