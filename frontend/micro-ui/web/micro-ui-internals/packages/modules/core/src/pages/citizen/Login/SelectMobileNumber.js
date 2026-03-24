import React, { useState, useEffect } from "react";
import { CardText, FormStep, CitizenConsentForm, Loader, CheckBox } from "@djb25/digit-ui-react-components";
import { Link } from "react-router-dom";

const SelectMobileNumber = ({ t, onSelect, showRegisterLink, mobileNumber, onMobileChange, config, canSubmit }) => {
  const [isCheckBox, setIsCheckBox] = useState(false);
  const [isCCFEnabled, setisCCFEnabled] = useState(false);
  const [mdmsConfig, setMdmsConfig] = useState("");
  const [error, setError] = useState("");
  const { isLoading, data } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "common-masters", [{ name: "CitizenConsentForm" }]);

  function setTermsAndPolicyDetails(e) {
    setIsCheckBox(e.target.checked);
  }

  const checkDisbaled = () => {
    if (isCCFEnabled?.isCitizenConsentFormEnabled) {
      return !(mobileNumber.length === 10 && canSubmit && isCheckBox);
    } else {
      return !(mobileNumber.length === 10 && canSubmit);
    }
  };

  useEffect(() => {
    if (data?.["common-masters"]?.CitizenConsentForm?.[0]?.isCitizenConsentFormEnabled) {
      setisCCFEnabled(data?.["common-masters"]?.CitizenConsentForm?.[0]);
    }
  }, [data]);

  const onLinkClick = (e) => {
    setMdmsConfig(e.target.id);
  };

  const checkLabels = () => {
    return (
      <span>
        {isCCFEnabled?.checkBoxLabels?.map((data, index) => {
          return (
            <span key={index}>
              {data?.linkPrefix && <span>{t(`${data?.linkPrefix}`, "I agree to the ")}</span>}
              {data?.link && (
                <span
                  id={data?.linkId}
                  onClick={(e) => {
                    onLinkClick(e);
                  }}
                  className="privacy-link"
                >
                  {t(`${data?.link}`, "Privacy Policy")}
                </span>
              )}
              {data?.linkPostfix && <span>{t(`${data?.linkPostfix}`, "")}</span>}
              {index == isCCFEnabled?.checkBoxLabels?.length - 1 && t("LABEL", "")}
            </span>
          );
        })}
      </span>
    );
  };

  const validateMobileNumber = () => {
    if (/^\d{0,10}$/.test(mobileNumber)) {
      setError("");
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value) || value === "") {
      onMobileChange(e);
      validateMobileNumber();
    } else {
      setError(t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID"));
    }
  };

  if (isLoading) return <Loader />;

  const register = async (e) => {
    e.preventDefault();
    const data = await Digit.DigiLockerService.register({ module: "REGISTER" });
    const redirectUrl = data.redirectURL;
    console.log("data", data);
    sessionStorage.setItem("code_verfier_register", data?.codeverifier);
    window.location.href = redirectUrl;
  };

  return (
    <div className="select-mobile-number-wrapper">
      <FormStep
        isDisabled={checkDisbaled()}
        onSelect={onSelect}
        config={config}
        t={t}
        componentInFront={<div className="prefix-container">{t("CORE_COMMON_COUNTRY_CODE_PREFIX", "+91")}</div>}
        onChange={handleMobileChange}
        value={mobileNumber}
        cardStyle={{
          display: "contents",
        }}
      >
        {error && <p className="error-text">{error}</p>}

        {isCCFEnabled?.isCitizenConsentFormEnabled && (
          <div className="consent-form-wrapper">
            <CheckBox
              label={checkLabels()}
              value={isCheckBox}
              checked={isCheckBox}
              onChange={setTermsAndPolicyDetails}
              styles={{ marginBottom: "20px" }}
            />

            <CitizenConsentForm
              t={t}
              isCheckBoxChecked={setTermsAndPolicyDetails}
              labels={isCCFEnabled?.checkBoxLabels}
              mdmsConfig={mdmsConfig}
              setMdmsConfig={setMdmsConfig}
            />
          </div>
        )}

        <div className="or-separator-container">
          <div className="or-text">{t("OR_CONTINUE_WITH", "OR CONTINUE WITH")}</div>
          <button className="digilocker-btn" type="button" onClick={(e) => register(e)}>
            <img src="https://meripehchaan.gov.in/assets/img/icon/digi.png" alt="DigiLocker" />
            {t("CS_REGISTER_WITH_DIGILOCKER", "Register with DigiLocker")}
          </button>
        </div>
      </FormStep>
    </div>
  );
};

export default SelectMobileNumber;
