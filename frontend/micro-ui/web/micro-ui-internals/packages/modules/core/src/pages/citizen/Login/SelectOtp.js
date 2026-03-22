import React, { useState, Fragment, useEffect } from "react";
import { ButtonSelector, CardText, FormStep, LinkButton, OTPInput, CardLabelError } from "@djb25/digit-ui-react-components";
import useInterval from "../../../hooks/useInterval";

const SelectOtp = ({ config, otp, onOtpChange, onResend, onSelect, t, error, userType = "citizen", canSubmit }) => {
  const [timeLeft, setTimeLeft] = useState(180);
  const TYPE_REGISTER = { type: "register" };
  const TYPE_LOGIN = { type: "login" };
  const [errorRegister, setErrorRegister] = useState(false);
  const getUserType = () => Digit.UserService.getType();

  useInterval(
    () => {
      setTimeLeft(timeLeft - 1);
    },
    timeLeft > 0 ? 1000 : null
  );

  useEffect(async () => {
    if (window.location.href.includes("code")) {
      let code = window.location.href.split("=")[1].split("&")[0];
      let TokenReq = {
        code_verifier: sessionStorage.getItem("code_verfier_register"),
        code: code,
        module: "REGISTER",
        redirect_uri: "https://upyog.niua.org/digit-ui/citizen/login/otp",
      };
      const data = await Digit.DigiLockerService.token({ TokenReq });
      registerUser(data);
    } else if (window.location.href.includes("error=")) {
      window.location.href = window.location.href.split("/otp")[0];
    }
  }, []);

  const registerUser = async (response) => {
    const data = {
      dob: response?.TokenRes?.dob.substring(0, 2) + "/" + response?.TokenRes?.dob.substring(2, 4) + "/" + response?.TokenRes?.dob.substring(4, 8),
      mobileNumber: response?.TokenRes?.mobile,
      name: response?.TokenRes?.name,
      tenantId: "pg",
      userType: getUserType(),
    };
    sessionStorage.setItem("userName", response?.TokenRes?.mobile);
    const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    if (!err) {
      history.replace(`${path}/otp`, { from: getFromLocation(location.state, searchParams) });
      return;
    } else {
      await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
      sessionStorage.setItem("userName", response?.TokenRes?.mobile);
    }
  };

  const handleResendOtp = () => {
    onResend();
    setTimeLeft(180);
  };

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, "pg");
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };

  if (userType === "employee") {
    return (
      <Fragment>
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <OTPInput length={6} onChange={onOtpChange} value={otp} />
        </div>
        {timeLeft > 0 ? (
          <CardText style={{ textAlign: "center", color: "#505A5F" }}>{`${t("CS_RESEND_ANOTHER_OTP")} ${timeLeft} ${t(
            "CS_RESEND_SECONDS"
          )}`}</CardText>
        ) : (
          <p
            className="card-text-button"
            onClick={handleResendOtp}
            style={{ textAlign: "center", color: "#F47738", cursor: "pointer", fontWeight: "bold" }}
          >
            {t("CS_RESEND_OTP")}
          </p>
        )}
        {error && <CardLabelError style={{ textAlign: "center" }}>{t("CS_INVALID_OTP")}</CardLabelError>}
      </Fragment>
    );
  }

  return (
    <div className="select-otp-wrapper">
      <FormStep onSelect={onSelect} config={config} t={t} isDisabled={!(otp?.length === 6 && canSubmit)} cardStyle={{ display: "contents" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
          <OTPInput length={6} onChange={onOtpChange} value={otp} />
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {timeLeft > 0 ? (
            <CardText style={{ color: "#6B7280", fontSize: "16px" }}>
              {t("CS_RESEND_ANOTHER_OTP")} <span style={{ fontWeight: "700", color: "#0B0B0B" }}>{timeLeft}</span> {t("CS_RESEND_SECONDS")}
            </CardText>
          ) : (
            <p
              className="card-text-button"
              onClick={handleResendOtp}
              style={{
                color: "#F47738",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              {t("CS_RESEND_OTP")}
            </p>
          )}
        </div>

        {error && <CardLabelError style={{ textAlign: "center", marginTop: "12px" }}>{t("CS_INVALID_OTP")}</CardLabelError>}
        {errorRegister && <CardLabelError style={{ textAlign: "center", marginTop: "12px" }}>{t("CS_ALREADY_REGISTERED")}</CardLabelError>}
      </FormStep>
    </div>
  );
};

export default SelectOtp;
