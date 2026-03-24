import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CardLabel, TextInput, MobileNumber, DatePicker, SubmitBar, Toast, Card, Dropdown } from "@djb25/digit-ui-react-components";
import Timeline from "../../../vendor/src/components/VENDORTimeline";
import AddFixFillAddress from "./AddFixFillAddress";

const VendorAssign = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();

  const [showToast, setShowToast] = useState(null);
  const [formData, setFormData] = useState({});
  const [applicantName, setApplicantName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [alternateNumber, setAlternateNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [fillingPoint, setFillingPoint] = useState(null);

  const addressConfig = { key: "address" };

  const handleSelect = (key, data) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        ...data,
      },
    }));
  };

  const { data: fetchedOptions, isLoading: isFillingLoading } = Digit.Hooks.wt.useTankerSearchAPI(
    { tenantId, filters: {} },
    {
      select: (data) =>
        data?.waterTankerBookingDetail
          ?.filter((fp) => fp.fillingpointmetadata)
          ?.map((fp) => ({
            name: fp.fillingpointmetadata?.fillingPointName || fp.fillingpointmetadata?.name,
            code: fp.fillingpointmetadata?.fillingPointId || fp.bookingId,
            i18nKey: fp.fillingpointmetadata?.fillingPointName || fp.fillingpointmetadata?.name,
          })),
    }
  );

  const fillingPointOptions =
    fetchedOptions?.length > 0
      ? fetchedOptions
      : [
          { name: "Filling Point 1", code: "FILLING_POINT_1", i18nKey: "WT_FILLING_POINT_1" },
          { name: "Filling Point 2", code: "FILLING_POINT_2", i18nKey: "WT_FILLING_POINT_2" },
          { name: "Filling Point 3", code: "FILLING_POINT_3", i18nKey: "WT_FILLING_POINT_3" },
          { name: "Filling Point 4", code: "FILLING_POINT_4", i18nKey: "WT_FILLING_POINT_4" },
        ];

  const handleSubmit = () => {
    if (!applicantName || !mobileNumber || !emailId || !validFrom || !validTo || !formData.address) {
      setShowToast({ isError: true, label: t("ES_COMMON_FILL_ALL_MANDATORY_FIELDS") });
      return;
    }

    const payload = {
      vendor: {
        tenantId,
        name: applicantName,
        mobileNumber,
        alternateNumber,
        emailId,
        validFrom,
        validTo,
        fillingPoint: fillingPoint?.code,
        address: formData.address,
      },
    };

    Digit.VendorService.createVendor(payload, tenantId)
      .then((result) => {
        setShowToast({ isError: false, label: t("ES_COMMON_SAVE_SUCCESS") });
      })
      .catch((err) => {
        setShowToast({ isError: true, label: err?.response?.data?.Errors?.[0]?.message || t("ES_COMMON_ERROR_SAVING") });
      });
  };

  const isMobile = window.Digit.Utils.browser.isMobile();
  const inputStyles = { width: isMobile ? "100%" : "50%" };

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <Timeline steps={["Vendor Assign"]} currentStep={1} />

      <div style={{ flex: 1, marginLeft: isMobile ? "0px" : "24px" }}>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", columnGap: "32px", rowGap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
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
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
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
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
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
            </div>

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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>
                {`${t("COMMON_FILLING_POINT")}`} <span className="astericColor">*</span>
              </CardLabel>
              <Dropdown
                className="form-field"
                selected={fillingPoint}
                disable={isFillingLoading}
                select={setFillingPoint}
                option={fillingPointOptions}
                optionKey="i18nKey"
                optionCardStyles={{ overflowY: "auto", maxHeight: "300px" }}
                t={t}
                name="fillingPoint"
                placeholder={t("WT_SELECT_FILLING_POINT") || "Select Filling Point"}
                style={{ width: "100%" }}
              />
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
