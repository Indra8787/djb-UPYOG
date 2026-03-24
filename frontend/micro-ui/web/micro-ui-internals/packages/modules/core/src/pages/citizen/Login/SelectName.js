import React from "react";
import { FormStep } from "@djb25/digit-ui-react-components";

const SelectName = ({ config, onSelect, t, isDisabled }) => {
  return <FormStep config={config} onSelect={onSelect} t={t} isDisabled={isDisabled} cardStyle={{ display: "contents" }} />;
};

export default SelectName;
