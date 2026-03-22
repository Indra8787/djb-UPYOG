import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch, Switch, Route, Redirect, useLocation } from "react-router-dom";
import { loginSteps } from "./config";
import SelectMobileNumber from "./SelectMobileNumber";
import SelectOtp from "./SelectOtp";
import SelectName from "./SelectName";
import { Banner, Card, CardHeader, CardText, SubmitBar, StatusTable, Row, Toast, Loader, Stepper } from "@djb25/digit-ui-react-components";
import Background from "../../../components/Background";

const Register = ({ stateCode }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { path } = useRouteMatch();
  const location = useLocation();
  const [params, setParams] = Digit.Hooks.useSessionStorage("CITIZEN_REGISTRATION_DATA", {});
  const [isRegistered, setIsRegistered] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = useMemo(() => {
    if (location.pathname.endsWith("/mobile-number")) return 0;
    if (location.pathname.endsWith("/otp")) return 1;
    if (location.pathname.endsWith("/name")) return 2;
    return 0;
  }, [location]);

  const handleMobileNumberSelect = async (data) => {
    setParams({ ...params, ...data });
    setIsLoading(true);
    try {
      await Digit.UserService.sendOtp(
        {
          otp: {
            mobileNumber: data.mobileNumber,
            type: "register",
            userType: "CITIZEN",
            tenantId: stateCode,
          },
        },
        stateCode
      );
      setIsLoading(false);
      history.push(`${path}/otp`);
    } catch (err) {
      setIsLoading(false);
      setShowToast({ label: t("CORE_COMMON_OTP_SEND_FAILED", "Failed to send OTP"), error: true });
      console.error("OTP send failed:", err);
    }
  };

  const handleResendOtp = async () => {
    try {
      await Digit.UserService.sendOtp(
        {
          otp: {
            mobileNumber: params.mobileNumber,
            type: "register",
            userType: "CITIZEN",
            tenantId: stateCode,
          },
        },
        stateCode
      );
      setShowToast({ label: t("CORE_COMMON_OTP_RESENT", "OTP Resent Successfully") });
    } catch (err) {
      setShowToast({ label: t("CORE_COMMON_OTP_RESEND_FAILED", "Failed to resend OTP"), error: true });
      console.error("OTP resend failed:", err);
    }
  };

  const handleOtpSelect = (data) => {
    setParams({ ...params, ...data });
    history.push(`${path}/name`);
  };

  const handleNameSelect = async (data) => {
    const finalData = {
      ...params,
      ...data,
      name: data.name,
      username: params.mobileNumber,
      otpReference: params.otp,
      dob: data.dob ? new Date(data.dob).getTime() : null,
      gender: data.gender?.code || data.gender,
      tenantId: stateCode,
      userType: "CITIZEN",
    };
    setIsLoading(true);
    try {
      await Digit.UserService.registerUser(finalData, stateCode);
      setIsLoading(false);
      setShowToast({ label: t("CORE_COMMON_REGISTRATION_SUCCESSFUL", "Successfully Registered") });
      setIsRegistered(true);
      Digit.SessionStorage.del("CITIZEN_REGISTRATION_DATA");
    } catch (err) {
      setIsLoading(false);

      const isLoginError = err?.response?.data?.Errors?.[0]?.code === "LOGIN_ERROR";
      if (isLoginError) {
        setShowToast({ label: t("CORE_COMMON_REGISTRATION_SUCCESSFUL", "Successfully Registered") });
        setIsRegistered(true);
        Digit.SessionStorage.del("CITIZEN_REGISTRATION_DATA");
      } else {
        setShowToast({ label: t("CORE_COMMON_REGISTRATION_FAILED", "Registration Failed"), error: true });
        console.error("Registration failed:", err);
      }
    }
  };

  const handleMobileChange = (event) => {
    const { value } = event.target;
    setParams({ ...params, mobileNumber: value });
  };

  const handleOtpChange = (value) => {
    setParams({ ...params, otp: value });
  };

  const closeToast = () => {
    setShowToast(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isRegistered) {
    return (
      <div className="Citizen_register registration-page-container">
        <div className="registration-card">
          {/* Left Side: Sidebar - Success State */}
          <div className="registration-sidebar">
            <div className="sidebar-header">
              <h1>UPYOG</h1>
              <p>{t("CITIZEN_REGISTRATION_PORTAL", "Citizen Registration Portal")}</p>
            </div>

            <div className="success-icon-wrapper">
              <div className="icon-outer">
                <div className="icon-inner">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <h2>{t("CORE_COMMON_ALL_DONE", "All Done!")}</h2>
              <p>{t("CORE_COMMON_REGISTRATION_SUCCESS_DESC", "You have been successfully registered with Delhi Jal Board.")}</p>
            </div>

            <div className="sidebar-footer">{t("CORE_COMMON_COPYRIGHT_FOOTER", "© 2026 Delhi Jal Board. All rights reserved.")}</div>
          </div>

          {/* Right Side: Success Content */}
          <div className="registration-content">
            <div className="content-wrapper">
              <h1>{t("CORE_COMMON_LOGIN_CREDENTIALS")}</h1>
              <p>
                {t(
                  "CORE_COMMON_REGISTRATION_COMPLETE_DESC",
                  "Your registration is complete. Please use your registered mobile number as your username to continue."
                )}
              </p>

              <div className="credentials-box">
                <StatusTable>
                  <Row label={t("CORE_COMMON_USERNAME", "Username")} text={params.mobileNumber} textStyle={{ fontWeight: "600", color: "#1E293B" }} />
                  <Row
                    label={t("CORE_COMMON_PASSWORD", "Password")}
                    text={t("CORE_COMMON_PASSWORD_SENT_SMS", "Sent via SMS to your mobile")}
                    textStyle={{ color: "#059669", fontWeight: "600" }}
                  />
                </StatusTable>
              </div>

              <button className="continue-btn" onClick={() => history.push("/digit-ui/citizen/login")}>
                {t("CORE_COMMON_CONTINUE_TO_LOGIN")}
              </button>
            </div>
          </div>
        </div>
        {showToast && <Toast label={showToast.label} error={showToast.error} onClose={closeToast} />}
      </div>
    );
  }

  return (
    <div className="Citizen_register registration-page-container">
      <div className="registration-card">
        {/* Left Side: Sidebar Stepper */}
        <div className="registration-sidebar">
          <div className="sidebar-header">
            <h1>UPYOG</h1>
            <p>{t("CITIZEN_REGISTRATION_PORTAL", "Citizen Registration Portal")}</p>
          </div>

          <div className="stepper-wrapper-vertical">
            <Stepper steps={loginSteps} currentStep={currentStep} t={t} />
          </div>

          <div className="sidebar-footer">{t("CORE_COMMON_COPYRIGHT_FOOTER", "© 2026 Delhi Jal Board. All rights reserved.")}</div>
        </div>

        {/* Right Side: Form Content */}
        <div className="registration-content">
          <Switch>
            <Route path={`${path}/mobile-number`}>
              <SelectMobileNumber
                t={t}
                onSelect={handleMobileNumberSelect}
                config={loginSteps[0]}
                mobileNumber={params.mobileNumber || ""}
                onMobileChange={handleMobileChange}
                canSubmit={true}
              />
            </Route>
            <Route path={`${path}/otp`}>
              <SelectOtp
                t={t}
                onSelect={handleOtpSelect}
                config={loginSteps[1]}
                otp={params.otp || ""}
                onOtpChange={handleOtpChange}
                canSubmit={true}
                onResend={handleResendOtp}
              />
            </Route>
            <Route path={`${path}/name`}>
              <SelectName t={t} onSelect={handleNameSelect} config={loginSteps[2]} isDisabled={false} />
            </Route>
            <Route>
              <Redirect to={`${path}/mobile-number`} />
            </Route>
          </Switch>
        </div>
      </div>
      {showToast && <Toast label={showToast.label} error={showToast.error} onClose={closeToast} />}
    </div>
  );
};

export default Register;
