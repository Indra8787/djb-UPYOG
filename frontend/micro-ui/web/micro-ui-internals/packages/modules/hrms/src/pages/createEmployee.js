import { FormComposer, Toast, Loader, Header } from "@djb25/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../components/config/config";

const Stepper = ({ customSteps, currentStep, onStepClick, t }) => {
  return (
    <div className="" style={{ width: "20%", background: "#fff", padding: "20px 0", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "4px" }}>
      {customSteps.map((stepObj, index, arr) => (
        <div className="timeline-checkpoint" key={index} style={{ padding: "0 20px" }}>
          <div className="timeline-content" style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <span
              className={`circle ${index <= currentStep ? "active" : ""}`}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: index <= currentStep ? "#386af4ff" : "#eee",
                color: index <= currentStep ? "#fff" : "#000",
                marginRight: "12px",
                flexShrink: 0,
              }}
            >
              {index < currentStep ? (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.70019 9.99966L0.283526 5.58299C-0.0914742 5.20799 -0.0914742 4.59966 0.283526 4.22466C0.658526 3.84966 1.26686 3.84966 1.64186 4.22466L4.70019 7.28299L12.3585 0.283002C12.7919 -0.116998 13.4419 -0.0836647 13.8419 0.349669C14.2419 0.783002 14.1919 1.458 13.7752 1.84134L4.70019 9.99966Z"
                    fill="white"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span
              className="secondary-color"
              style={{ fontWeight: index === currentStep ? "bold" : "normal", cursor: index < currentStep ? "pointer" : "default" }}
              onClick={() => index < currentStep && onStepClick(index)}
            >
              {t(stepObj.head)}
            </span>
          </div>
          {index < arr.length - 1 && (
            <div
              className={`line ${index < currentStep ? "active" : ""}`}
              style={{
                height: "40px",
                width: "2px",
                background: index < currentStep ? "#f47738" : "#eee",
                marginLeft: "15px",
                marginTop: "-20px",
                marginBottom: "10px",
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

const CreateEmployee = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [phonecheck, setPhonecheck] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const [activeStep, setActiveStep] = useState(0);

  const defaultValues = {
    Jurisdictions: [
      {
        id: undefined,
        key: 1,
        hierarchy: null,
        boundaryType: null,
        boundary: {
          code: tenantId,
        },
        roles: [],
      },
    ],
  };
  const [sessionFormData, setSessionFormData] = useState(defaultValues);

  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "egov-hrms", ["CommonFieldsConfig"], {
    select: (data) => {
      return {
        config: data?.MdmsRes?.["egov-hrms"]?.CommonFieldsConfig,
      };
    },
    retry: false,
    enable: false,
  });
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  const checkMailNameNum = (formData) => {
    const email = formData?.SelectEmployeeEmailId?.emailId || "";
    const name = formData?.SelectEmployeeName?.employeeName || "";
    const address = formData?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress || "";
    const validEmail = email.length === 0 ? true : Boolean(email.match(Digit.Utils.getPattern("Email")));
    return Boolean(validEmail && name.match(Digit.Utils.getPattern("Name")) && address.match(Digit.Utils.getPattern("Address")));
  };
  useEffect(() => {
    if (mobileNumber && mobileNumber.length == 10 && mobileNumber.match(Digit.Utils.getPattern("MobileNo"))) {
      setShowToast(null);
      Digit.HRMSService.search(tenantId, null, { phone: mobileNumber }).then((result, err) => {
        if (result.Employees.length > 0) {
          setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_MOB" });
          setPhonecheck(false);
        } else {
          setPhonecheck(true);
        }
      });
    } else {
      setPhonecheck(false);
    }
  }, [mobileNumber]);

  const config = mdmsData?.config ? mdmsData.config : newConfig;
  const formDataRef = React.useRef(sessionFormData);

  const validate = (currentData, currentPhoneCheck, step) => {
    let isValid = true;
    const currentConfig = config[step];
    const stepHead = currentConfig?.head;

    if (stepHead === "Personal Details") {
      isValid =
        currentData?.SelectEmployeeName?.employeeName &&
        currentData?.SelectEmployeePhoneNumber?.mobileNumber &&
        currentData?.SelectEmployeeGender?.gender?.code &&
        currentPhoneCheck &&
        checkMailNameNum(currentData);
    } else if (stepHead === "HR_NEW_EMPLOYEE_FORM_HEADER") {
      isValid = currentData?.SelectEmployeeType?.code && currentData?.SelectDateofEmployment?.dateOfAppointment;
    } else if (stepHead === "HR_JURISDICTION_DETAILS_HEADER") {
      let check = false;
      for (let i = 0; i < currentData?.Jurisdictions?.length; i++) {
        let key = currentData?.Jurisdictions[i];
        if (!(key?.boundary && key?.boundaryType && key?.hierarchy && key?.tenantId && key?.roles?.length > 0)) {
          check = false;
          break;
        } else {
          check = true;
        }
      }
      isValid = check;
    } else if (stepHead === "HR_ASSIGN_DET_HEADER") {
      let setassigncheck = false;
      for (let i = 0; i < currentData?.Assignments?.length; i++) {
        let key = currentData?.Assignments[i];
        if (
          !(
            key.department &&
            key.designation &&
            key.fromDate &&
            (currentData?.Assignments[i].toDate || currentData?.Assignments[i]?.isCurrentAssignment)
          )
        ) {
          setassigncheck = false;
          break;
        } else if (currentData?.Assignments[i].toDate == null && currentData?.Assignments[i]?.isCurrentAssignment == false) {
          setassigncheck = false;
          break;
        } else {
          setassigncheck = true;
        }
      }
      isValid = setassigncheck;
    } else {
      isValid = true;
    }

    let isFormValid = Boolean(isValid);
    if (isFormValid !== canSubmit) {
      setSubmitValve(isFormValid);
    }
  };

  useEffect(() => {
    validate(formDataRef.current, phonecheck, activeStep);
  }, [phonecheck, activeStep, config, canSubmit]);

  const onFormValueChange = (setValue = true, formData) => {
    formDataRef.current = { ...sessionFormData, ...formData };
    if (formData?.SelectEmployeePhoneNumber?.mobileNumber !== mobileNumber) {
      setMobileNumber(formData?.SelectEmployeePhoneNumber?.mobileNumber);
    }
    validate(formDataRef.current, phonecheck, activeStep);
  };

  const navigateToAcknowledgement = (Employees) => {
    history.replace("/digit-ui/employee/hrms/response", { Employees, key: "CREATE", action: "CREATE" });
  };

  const onSubmit = (data) => {
    const isFinalStep = activeStep === config.length - 1;
    const finalData = { ...sessionFormData, ...data };
    formDataRef.current = finalData;
    setSessionFormData(finalData);

    if (!isFinalStep) {
      setActiveStep(activeStep + 1);
      return;
    }

    // Final submit logic
    if (finalData.Jurisdictions.filter((juris) => juris.tenantId == tenantId).length == 0) {
      setShowToast({ key: true, label: "ERR_BASE_TENANT_MANDATORY" });
      return;
    }
    if (
      !Object.values(
        finalData.Jurisdictions.reduce((acc, sum) => {
          if (sum && sum?.tenantId) {
            acc[sum.tenantId] = acc[sum.tenantId] ? acc[sum.tenantId] + 1 : 1;
          }
          return acc;
        }, {})
      ).every((s) => s == 1)
    ) {
      setShowToast({ key: true, label: "ERR_INVALID_JURISDICTION" });
      return;
    }
    let roles = finalData?.Jurisdictions?.map((ele) => {
      return ele.roles?.map((item) => {
        item["tenantId"] = ele.boundary;
        return item;
      });
    });

    const mappedroles = [].concat.apply([], roles);
    let Employees = [
      {
        tenantId: tenantId,
        employeeStatus: "EMPLOYED",
        assignments: finalData?.Assignments,
        code: finalData?.SelectEmployeeId?.code ? finalData?.SelectEmployeeId?.code : undefined,
        dateOfAppointment: new Date(finalData?.SelectDateofEmployment?.dateOfAppointment).getTime(),
        employeeType: finalData?.SelectEmployeeType?.code,
        jurisdictions: finalData?.Jurisdictions,
        user: {
          mobileNumber: finalData?.SelectEmployeePhoneNumber?.mobileNumber,
          name: finalData?.SelectEmployeeName?.employeeName,
          correspondenceAddress: finalData?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress,
          emailId: finalData?.SelectEmployeeEmailId?.emailId ? finalData?.SelectEmployeeEmailId?.emailId : undefined,
          gender: finalData?.SelectEmployeeGender?.gender.code,
          dob: new Date(finalData?.SelectDateofBirthEmployment?.dob).getTime(),
          roles: mappedroles,
          tenantId: tenantId,
        },
        serviceHistory: [],
        education: [],
        tests: [],
      },
    ];
    /* use customiseCreateFormData hook to make some chnages to the Employee object */
    Employees = Digit?.Customizations?.HRMS?.customiseCreateFormData
      ? Digit.Customizations.HRMS.customiseCreateFormData(finalData, Employees)
      : Employees;

    if (finalData?.SelectEmployeeId?.code && finalData?.SelectEmployeeId?.code?.trim().length > 0) {
      Digit.HRMSService.search(tenantId, null, { codes: finalData?.SelectEmployeeId?.code }).then((result, err) => {
        if (result.Employees.length > 0) {
          setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_ID" });
          return;
        } else {
          navigateToAcknowledgement(Employees);
        }
      });
    } else {
      navigateToAcknowledgement(Employees);
    }
  };

  const handleSecondaryAction = () => {
    setSessionFormData(formDataRef.current);
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleStepClick = (index) => {
    if (index < activeStep) {
      setSessionFormData(formDataRef.current);
      setActiveStep(index);
    }
  };

  const isFinalStep = activeStep === config.length - 1;
  const activeConfig = React.useMemo(() => [config[activeStep]], [config, activeStep]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {/* <div style={isMobile ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" } : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }}>
        <Header>{t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}</Header>
      </div> */}
      <div style={{ display: "flex", width: "100%", gap: isMobile ? "0px" : "24px", flexDirection: isMobile ? "column" : "row" }}>
        <Stepper customSteps={config} currentStep={activeStep} onStepClick={handleStepClick} t={t} />
        <div style={{ flex: "1", overflowY: "auto" }}>
          <FormComposer
            key={activeStep}
            defaultValues={sessionFormData}
            heading={t("")}
            config={activeConfig}
            onSubmit={onSubmit}
            onFormValueChange={onFormValueChange}
            isDisabled={!canSubmit}
            label={isFinalStep ? t("HR_COMMON_BUTTON_SUBMIT") : t("CS_COMMON_NEXT")}
            // secondaryActionLabel={activeStep !== 0 ? t("CS_COMMON_BACK") : null}
            onSecondayActionClick={handleSecondaryAction}
          />
        </div>
      </div>
      {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </div>
  );
};
export default CreateEmployee;
