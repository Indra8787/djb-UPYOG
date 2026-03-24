import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CardLabel, TextInput, MobileNumber, DatePicker, SubmitBar, Toast, Card, Dropdown } from "@djb25/digit-ui-react-components";
import Timeline from "../../../vendor/src/components/VENDORTimeline";

const VendorAssign = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();

  const [showToast, setShowToast] = useState(null);
  const [workOrderId, setWorkOrderId] = useState("");
  const [vendor, setVendor] = useState(null);
  const [applicantName, setApplicantName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");

  const { data: vendorOptions, isLoading: isVendorLoading } = Digit.Hooks.fsm.useVendorSearch({
    tenantId,
    filters: { status: "ACTIVE" },
    config: {
      select: (data) => data?.vendor || [],
    },
  });

  const { mutate: createWorkOrder } = Digit.Hooks.wt.useVendorWorkOrderCreate(tenantId);

  const handleSubmit = () => {
    const payload = {
      vendorWorkOrder: {
        id: workOrderId,
        tenantId,
        name: applicantName,
        vendorId: vendor?.code || vendor?.id,
        validFrom: new Date(validFrom).getTime(),
        validTo: new Date(validTo).getTime(),
        mobileNumber,
        alternateNumber,
        emailId,
        serviceType: "WT",
      },
    };

    createWorkOrder(payload, {
      onSuccess: (result) => {
        setShowToast({ isError: false, label: t("ES_COMMON_SAVE_SUCCESS") });
      },
      onError: (err) => {
        setShowToast({ isError: true, label: err?.response?.data?.Errors?.[0]?.message || t("ES_COMMON_ERROR_SAVING") });
      },
    });

    console.log(payload, "iuyui");
  };

  const isMobile = window.Digit.Utils.browser.isMobile();
  const inputStyles = { width: isMobile ? "100%" : "50%" };

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <Timeline steps={["Vendor Assign"]} currentStep={1} />

      <div style={{ flex: 1, marginLeft: isMobile ? "0px" : "24px" }}>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", columnGap: "32px", rowGap: "8px" }}>
            {/* <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("WT_WORK_ORDER_ID")}`} <span className="astericColor">*</span>
              </CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={true}
                name="workOrderId"
                value={workOrderId}
                style={{ width: "100%" }}
                onChange={(e) => setWorkOrderId(e.target.value)}
              />
            </div> */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("WT_VENDOR_NAME")}`} <span className="astericColor">*</span>
              </CardLabel>
              <Dropdown t={t} option={vendorOptions} optionKey="name" select={setVendor} selected={vendor} placeholder={t("WT_SELECT_VENDOR")} />
            </div>
            {/* <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("COMMON_APPLICANT_NAME")}`} <span className="astericColor">*</span>
              </CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={true}
                name="applicantName"
                value={applicantName}
                style={{ width: "100%" }}
                onChange={(e) => setApplicantName(e.target.value)}
              />
            </div> */}
            {/* <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("CORE_COMMON_APPLICANT_MOBILE_NUMBER")}`} <span className="astericColor">*</span>
              </CardLabel>
              <MobileNumber value={mobileNumber} name="mobileNumber" onChange={(value) => setMobileNumber(value)} style={{ width: "100%" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>{`${t("WT_VENDOR_ALT_MOBILE_NUMBER")}`}</CardLabel>
              <MobileNumber
                value={alternateNumber}
                name="alternateNumber"
                onChange={(value) => setAlternateNumber(value)}
                style={{ width: "100%" }}
              />
            </div> */}
            {/* <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("CORE_COMMON_APPLICANT_EMAIL_ID")}`} <span className="astericColor">*</span>
              </CardLabel>
              <TextInput
                t={t}
                type={"email"}
                isMandatory={true}
                name="emailId"
                value={emailId}
                style={{ width: "100%" }}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div> */}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("COMMON_VALID_FROM_DATE")}`} <span className="astericColor">*</span>
              </CardLabel>
              <DatePicker date={validFrom} onChange={(date) => setValidFrom(date)} style={{ width: "100%" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("COMMON_VALID_TO_DATE")}`} <span className="astericColor">*</span>
              </CardLabel>
              <DatePicker date={validTo} onChange={(date) => setValidTo(date)} style={{ width: "100%" }} />
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", marginTop: "24px", justifyContent: isMobile ? "center" : "flex-end" }}>
          <SubmitBar label={t("ES_COMMON_SAVE")} onSubmit={handleSubmit} />
        </div>
      </div>
      {showToast && <Toast error={showToast.isError} label={showToast.label} onClose={() => setShowToast(null)} />}
    </div>
  );
};

export default VendorAssign;
