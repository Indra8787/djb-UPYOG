// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { FormComposer, Toast } from "@djb25/digit-ui-react-components";
// import { useHistory } from "react-router-dom";
// import { useQueryClient } from "react-query";
// import VendorConfig from "../../../config/VendorConfig";
// import Timeline from "../../../components/VENDORTimeline";

// const AddVendor = ({ parentUrl, heading }) => {

//   const tenantId = Digit.ULBService.getCurrentTenantId();
//   const stateId = Digit.ULBService.getStateId();

//   const { t } = useTranslation();
//   const history = useHistory();
//   const queryClient = useQueryClient();
//     const [currentStep, setCurrentStep] = useState(1);
//   const [showToast, setShowToast] = useState(null);
//   const [canSubmit, setCanSubmit] = useState(false);

//   const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
//   const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
//   const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

//   const { isLoading: isLoading, isError: vendorCreateError, data: updateResponse, error: updateError, mutate } = Digit.Hooks.fsm.useVendorCreate(
//     tenantId
//   );

//   useEffect(() => {
//     setMutationHappened(false);
//     clearSuccessData();
//     clearError();
//   }, []);

//   const Config = VendorConfig(t);

//     const defaultValues = {
//     tripData: {
//       noOfTrips: 1,
//       amountPerTrip: null,
//       amount: null,
//     },
//   };

//   const vendorStepConfig = Config.filter(
//     (config) => config.head === "ES_VRNDOR_NEW_VENDOR_DETAILS"
//   );

//   const addressStepConfig = Config.filter(
//     (config) => config.head === "ES_FSM_REGISTRY_NEW_ADDRESS_DETAILS"
//   );

//   const steps = [
//     t("ES_VRNDOR_NEW_VENDOR_DETAILS"),
//     t("ES_FSM_REGISTRY_NEW_ADDRESS_DETAILS"),
//   ];

//   const onFormValueChange = (setValue, formData) => {

//     if (
//       formData?.vendorName &&
//       formData?.phone &&
//       formData?.selectGender?.code
//     ) {
//       setCanSubmit(true);
//     } else {
//       setCanSubmit(false);
//     }

//   };

//   const closeToast = () => {
//     setShowToast(null);
//   };

//   const onSubmit = (data) => {

//     // STEP CHANGE
//     if (currentStep === 1) {
//       setCurrentStep(2);
//       return;
//     }

//     // FINAL SUBMIT

//     const name = data?.vendorName;
//     const pincode = data?.pincode;
//     const street = data?.street?.trim();
//     const doorNo = data?.doorNo?.trim();
//     const plotNo = data?.plotNo?.trim();
//     const landmark = data?.landmark?.trim();
//     const city = data?.address?.city?.name;
//     const state = data?.address?.city?.state;
//     const district = data?.address?.city?.name;
//     const region = data?.address?.city?.name;
//     const buildingName = data?.buildingName?.trim();
//     const localityCode = data?.address?.locality?.code;
//     const localityName = data?.address?.locality?.name;
//     const localityArea = data?.address?.locality?.area;
//     const gender = data?.selectGender?.code;
//     const emailId = data?.emailId;
//     const phone = data?.phone;
//     const dob = new Date(`${data.dob}`).getTime() || new Date(`1/1/1970`).getTime();
//     const additionalDetails = data?.serviceType?.code;
//     const formData = {
//       vendor: {
//         tenantId: tenantId,
//         name,
//         agencyType: "ULB",
//         paymentPreference: "post-service",

//         address: {
//           tenantId: tenantId,
//           landmark,
//           doorNo,
//           plotNo,
//           street,
//           city,
//           district,
//           region,
//           state,
//           country: "in",
//           pincode,
//           buildingName,

//           locality: {
//             code: localityCode || "",
//             name: localityName || "",
//             label: "Locality",
//             area: localityArea || "",
//           },
//           geoLocation: {
//             latitude: data?.address?.latitude || 0,
//             longitude: data?.address?.longitude || 0,
//           },
//         },
//         owner: {
//           tenantId: stateId,
//           name: name,
//           fatherOrHusbandName: name,
//           relationship: "OTHER",
//           gender: gender,
//           dob: dob,
//           emailId: emailId || "abc@egov.com",
//           mobileNumber: phone,
//         },
//         additionalDetails: {
//           serviceType: additionalDetails, //as fetch serviceType
//         },

//         vehicle: [],
//         drivers: [],
//         source: "WhatsApp",
//       },
//     };

//     mutate(formData, {
//       onError: (error, variables) => {
//         setShowToast({ key: "error", action: error });
//         setTimeout(closeToast, 5000);
//       },
//       onSuccess: (data, variables) => {
//         setShowToast({ key: "success", action: "ADD_VENDOR" });
//         setTimeout(closeToast, 5000);
//       },
//     });
//   };

//   return (
//     <React.Fragment>

//       <div style={{ display: "flex", width: "100%", gap: "24px" }}>

//         {/* Timeline */}

//         <Timeline steps={steps} currentStep={currentStep} />

//         <div style={{ flex: "1", overflowY: "auto" }}>

//           <FormComposer
//             // isDisabled={!canSubmit}
//             label={
//               currentStep === 1
//                 ? t("CS_COMMON_NEXT")
//                 : t("ES_COMMON_APPLICATION_SUBMIT")
//             }
//             config={(currentStep === 1
//               ? vendorStepConfig
//               : addressStepConfig
//             )
//               .filter((i) => !i.hideInEmployee)
//               .map((config) => ({
//                 ...config,
//                 body: config.body.filter((a) => !a.hideInEmployee),
//               }))
//             }
//             onSubmit={onSubmit}
//           defaultValues={defaultValues}
//             onFormValueChange={onFormValueChange}
//             noBreakLine={true}
//           />

//           {showToast && (
//             <Toast
//               error={showToast.key === "error"}
//               label={t(
//                 showToast.key === "success"
//                   ? `ES_FSM_REGISTRY_${showToast.action}_SUCCESS`
//                   : showToast.action
//               )}
//               onClose={closeToast}
//             />
//           )}

//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default AddVendor;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Stepper, Toast } from "@djb25/digit-ui-react-components";
// import { useHistory } from "react-router-dom";
// import { useQueryClient } from "react-query";
import VendorConfig from "../../../config/VendorConfig";

const AddVendor = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const { t } = useTranslation();
  // const history = useHistory();
  // const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [showToast, setShowToast] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  // 👇 store step data
  const [step1Data, setStep1Data] = useState({});

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);

  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);

  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  const { isLoading, isError: vendorCreateError, data: updateResponse, error: updateError, mutate } = Digit.Hooks.fsm.useVendorCreate(tenantId);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  const Config = VendorConfig(t);

  const defaultValues = {
    serviceType: {
      code: "WT",
      name: "WT",
      i18nKey: "WT",
    },
    tripData: {
      noOfTrips: 1,
      amountPerTrip: null,
      amount: null,
    },
  };

  const vendorStepConfig = Config.filter((config) => config.head === "ES_VRNDOR_NEW_VENDOR_DETAILS");

  const addressStepConfig = Config.filter((config) => config.head === "ES_FSM_REGISTRY_NEW_ADDRESS_DETAILS");

  const steps = [{ label: "ES_VRNDOR_NEW_VENDOR_DETAILS" }, { label: "ES_FSM_REGISTRY_NEW_ADDRESS_DETAILS" }];

  const onFormValueChange = (setValue, formData) => {
    if (formData?.vendorName && formData?.phone  && formData?.serviceType?.code) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSubmit = (data) => {
    // STEP 1
    if (currentStep === 1) {
      setStep1Data(data); // save step1 data
      setCurrentStep(2);
      return;
    }

    // FINAL SUBMIT
    const mergedData = { ...step1Data, ...data };

    const name = mergedData?.vendorName;
    const pincode = mergedData?.pincode;
    const street = mergedData?.street?.trim();
    const doorNo = mergedData?.doorNo?.trim();
    const plotNo = mergedData?.plotNo?.trim();
    const landmark = mergedData?.landmark?.trim();
    const city = mergedData?.address?.city?.name;
    const state = mergedData?.address?.city?.state;
    const district = mergedData?.address?.city?.name;
    const region = mergedData?.address?.city?.name;
    const buildingName = mergedData?.buildingName?.trim();
    const localityCode = mergedData?.address?.locality?.code;
    const localityName = mergedData?.address?.locality?.name;
    const localityArea = mergedData?.address?.locality?.area;
    const gender = "MALE";
    const emailId = mergedData?.emailId;
    const phone = mergedData?.phone;

    const dob = new Date(`${mergedData.dob}`).getTime() || new Date(`1/1/1970`).getTime();

    const additionalDetails = mergedData?.serviceType?.code;

    const formData = {
      vendor: {
        tenantId: tenantId,
        name,
        agencyType: "ULB",
        paymentPreference: "post-service",

        address: {
          tenantId: tenantId,
          landmark,
          doorNo,
          plotNo,
          street,
          city,
          district,
          region,
          state,
          country: "in",
          pincode,
          buildingName,

          locality: {
            code: localityCode || "",
            name: localityName || "",
            label: "Locality",
            area: localityArea || "",
          },

          geoLocation: {
            latitude: mergedData?.address?.latitude || 0,
            longitude: mergedData?.address?.longitude || 0,
          },
        },

        owner: {
          tenantId: stateId,
          name: name,
          fatherOrHusbandName: name,
          relationship: "OTHER",
          gender: gender,
          dob: "915148800",
          emailId: emailId || "abc@egov.com",
          mobileNumber: phone,
        },

        additionalDetails: {
          serviceType: additionalDetails,
        },

        vehicle: [],
        drivers: [],
        source: "WhatsApp",
      },
    };

    mutate(formData, {
      onError: (error) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "ADD_VENDOR" });
        setTimeout(closeToast, 5000);
      },
    });
  };

  return (
    <React.Fragment>
      <Stepper steps={steps} currentStep={currentStep - 1} onStepClick={() => {}} t={t} />

      <div style={{ flex: "1", overflowY: "auto" }}>
        {/* STEP 1 */}
        {currentStep === 1 && (
          <FormComposer
            isDisabled={!canSubmit}
            label={t("CS_COMMON_NEXT")}
            config={vendorStepConfig
              .filter((i) => !i.hideInEmployee)
              .map((config) => ({
                ...config,
                body: config.body.filter((a) => !a.hideInEmployee),
              }))}
            onSubmit={onSubmit}
            defaultValues={{
              ...defaultValues,
              ...step1Data,
            }}
            onFormValueChange={onFormValueChange}
            noBreakLine={true}
          />
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <FormComposer
            label={t("ES_COMMON_APPLICATION_SUBMIT")}
            config={addressStepConfig
              .filter((i) => !i.hideInEmployee)
              .map((config) => ({
                ...config,
                body: config.body.filter((a) => !a.hideInEmployee),
              }))}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            onFormValueChange={(setValue, formData) => {}}
            noBreakLine={true}
          />
        )}

        {showToast && (
          <Toast
            error={showToast.key === "error"}
            label={t(showToast.key === "success" ? `ES_FSM_REGISTRY_${showToast.action}_SUCCESS` : showToast.action)}
            onClose={closeToast}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default AddVendor;
