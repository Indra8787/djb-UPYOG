import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast, Header, InfoIcon } from "@djb25/digit-ui-react-components";
import { useHistory } from "react-router-dom";
//import VehicleConfig from "../../../configs/VehicleConfig";
import { useQueryClient } from "react-query";
import VehicleConfig from "../../../config/VehicleConfig";
import Timeline from "../../../components/VENDORTimeline";

const AddVehicle = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [showToast, setShowToast] = useState(null);
  const history = useHistory();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [t("ES_FSM_REGISTRY_TITLE_NEW_VEHICLE")];

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  const { isLoading: isLoading, isError: vendorCreateError, data: updateResponse, error: updateError, mutate } = Digit.Hooks.fsm.useVehicleCreate(
    tenantId
  );

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  const Config = VehicleConfig(t);

  Config[0].body.forEach((item) => {
    if (item.label === "ES_FSM_REGISTRY_VEHICLE_NUMBER") {
      item.labelChildren = (
        <div className="tooltip" style={{ paddingLeft: "10px", marginBottom: "-3px" }}>
          <InfoIcon />
          <span className="tooltiptext" style={{ width: "150px", left: "230%", fontSize: "14px" }}>
            {t(item.populators.validation.title)}
          </span>
        </div>
      );
    }
  });

  const [canSubmit, setSubmitValve] = useState(false);

  const defaultValues = {
    tripData: {
      noOfTrips: 1,
      amountPerTrip: null,
      amount: null,
    },
  };

  const onFormValueChange = (setValue, formData) => {
    if (formData?.registrationNumber) {
      let updatedRegNo = formData.registrationNumber
        .toUpperCase()
        .replace(/ /g, "-")
        .replace(/[^A-Z0-9-]/g, "");
      if (updatedRegNo.length > 13) {
        updatedRegNo = updatedRegNo.slice(0, 13);
      }
      if (updatedRegNo !== formData.registrationNumber) {
        setValue("registrationNumber", updatedRegNo);
      }
    }
    if (
      formData?.registrationNumber &&
      formData?.ownerName &&
      formData?.phone &&
      formData?.vehicle?.modal &&
      formData?.vehicle?.type &&
      formData?.selectGender
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSubmit = (data) => {
    const registrationNumber = data?.registrationNumber;
    const vehicleType = data?.vehicle?.type?.code;
    const vehicleModal = data?.vehicle?.modal?.code;
    const tankCapacity = data?.vehicle?.type?.capacity;
    const pollutionCert = new Date(`${data?.pollutionCert}`).getTime();
    const insurance = new Date(`${data?.insurance}`).getTime();
    const roadTax = new Date(`${data?.roadTax}`).getTime();
    const fitnessValidity = new Date(`${data?.fitnessValidity}`).getTime();
    const ownerName = data?.ownerName;
    const phone = data?.phone;
    const additionalDetails = data?.additionalDetails?.code;
    const gender = data?.selectGender?.code;
    const emailId = data?.emailId;
    const dob = new Date(`${data.dob}`).getTime() || new Date(`1/1/1970`).getTime();

    const formData = {
      vehicle: {
        tenantId: tenantId,
        registrationNumber: registrationNumber,
        model: vehicleModal,
        type: vehicleType,
        tankCapacity: tankCapacity,
        suctionType: "SEWER_SUCTION_MACHINE",
        pollutionCertiValidTill: pollutionCert,
        InsuranceCertValidTill: insurance,
        fitnessValidTill: fitnessValidity,
        roadTaxPaidTill: roadTax,
        gpsEnabled: true,
        source: "Municipal records",
        owner: {
          tenantId: stateId,
          name: ownerName,
          fatherOrHusbandName: ownerName,
          relationship: "OTHER",
          gender: "OTHERS",
          dob: dob,
          emailId: "abc@egov.com",
          correspondenceAddress: "",
          mobileNumber: phone,
          gender: gender,
          dob: dob,
          emailId: emailId || "abc@egov.com",
        },
        additionalDetails: {
          serviceType: additionalDetails,
        },
      },
    };

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "ADD_VEHICLE" });
        setTimeout(closeToast, 5000);
        queryClient.invalidateQueries("FSM_VEICLES_SEARCH");
        // setTimeout(() => {
        //   closeToast();
        //   history.push(`/digit-ui/employee/fsm/registry?selectedTabs=VEHICLE`);
        // }, 5000);
      },
    });
  };
  const isMobile = window.Digit.Utils.browser.isMobile();

  return (
    <React.Fragment>
      {/* <div>
        <Header>{t("ES_FSM_REGISTRY_TITLE_NEW_VEHICLE")}</Header>
      </div> */}
      <div style={{ display: "flex", width: "100%", gap: "24px" }}>
        {/* Timeline */}
        <Timeline steps={steps} currentStep={currentStep} />

        <div style={{ flex: "1", overflowY: "auto" }}>
          <FormComposer
            isDisabled={!canSubmit}
            label={t("ES_COMMON_APPLICATION_SUBMIT")}
            config={Config.filter((i) => !i.hideInEmployee).map((config) => {
              return {
                ...config,
                body: config.body.filter((a) => !a.hideInEmployee),
              };
            })}
            fieldStyle={{ marginRight: 0 }}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            onFormValueChange={onFormValueChange}
            noBreakLine={true}
          />
          {showToast && (
            <Toast
              error={showToast.key === "error" ? true : false}
              label={t(showToast.key === "success" ? `ES_FSM_REGISTRY_${showToast.action}_SUCCESS` : showToast.action)}
              onClose={closeToast}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddVehicle;
