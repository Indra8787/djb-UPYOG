import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AddressDetails, SubmitBar, Toast, Loader } from "@djb25/digit-ui-react-components";
import { fillingPointPayload } from "../utils";
import Timeline from "../../../vendor/src/components/VENDORTimeline";
import { useLocation } from "react-router-dom";

import AddFillingPointMetaData from "./AddFillingPointMetaData";
import AddFixFillAddress from "./AddFixFillAddress";

const AddFillingPointAddress = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("id");

  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const addressConfig = { key: "address" };

  // ✅ Fetch data if editing
  const { isLoading: isEditLoading, data: editData } = Digit.Hooks.wt.useTankerSearchAPI(
    { tenantId, filters: { bookingId: editId } },
    { enabled: !!editId }
  );

  const handleSelect = (key, data) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        ...data,
      },
    }));
  };

  useEffect(() => {
    if (editId && editData?.waterTankerBookingDetail) {
      // Find the specific record that matches the ID from the URL
      const data = editData.waterTankerBookingDetail.find((item) => item.bookingId === editId);

      if (data) {
        setFormData({
          owner: {
            fillingPointName: data.fillingpointmetadata?.fillingPointName || data.fillingpointmetadata?.name,
            emergencyName: data.fillingpointmetadata?.emergencyName,
            aeName: data.fillingpointmetadata?.aeName,
            aeMobile: data.fillingpointmetadata?.aeMobile || data.fillingpointmetadata?.mobileNumber,
            aeEmail: data.fillingpointmetadata?.aeEmail || data.fillingpointmetadata?.emailId,
            jeName: data.fillingpointmetadata?.jeName,
            jeMobile: data.fillingpointmetadata?.jeMobile || data.fillingpointmetadata?.jeMobileNumber,
            jeEmail: data.fillingpointmetadata?.jeEmail || data.fillingpointmetadata?.jeEmailId,
            eeName: data.fillingpointmetadata?.eeName,
            eeMobile: data.fillingpointmetadata?.eeMobile || data.fillingpointmetadata?.eeMobileNumber,
            eeEmail: data.fillingpointmetadata?.eeEmail || data.fillingpointmetadata?.eeEmailId,
          },
          address: {
            ...data.address,
          },
          bookingId: data.bookingId,
          auditDetails: data.auditDetails,
        });
      }
    }
  }, [editData, editId]);

  const onSelect = (key, data) => {
    setFormData((prev) => ({ ...prev, [key]: data }));
  };

  const steps = ["WT_FILLING_POINT"];

  const { mutate: createFillingPoint } = Digit.Hooks.wt.useCreateFillPoint(tenantId);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const payload = fillingPointPayload({
      ...formData,
      tenantId,
    });

    const mutation = createFillingPoint;

    mutation(payload, {
      onSuccess: () => {
        setShowToast({ label: editId ? t("WT_FILLING_POINT_UPDATED_SUCCESS") : t("WT_FILLING_POINT_CREATED_SUCCESS") });
        setTimeout(() => setShowToast(null), 5000);
      },
      onError: (error) => {
        setShowToast({
          label: error?.response?.data?.Errors?.[0]?.message || (editId ? t("WT_FILLING_POINT_UPDATED_ERROR") : t("WT_FILLING_POINT_CREATED_ERROR")),
          isError: true,
        });
        setTimeout(() => setShowToast(null), 5000);
      },
    });
  };

  const isMobile = window.Digit.Utils.browser.isMobile();

  if (isEditLoading) return <Loader />;

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <Timeline steps={steps} currentStep={1} />

      <div style={{ flex: 1, marginLeft: isMobile ? "0px" : "24px" }}>
        <div>
          <AddFillingPointMetaData
            t={t}
            config={{ key: "owner" }}
            onSelect={onSelect}
            formData={formData}
            visibleFields={[
              "fillingPointName",
              "emergencyName",
              "aeName",
              "aeMobile",
              "aeEmail",
              "jeName",
              "jeMobile",
              "jeEmail",
              "eeName",
              "eeMobile",
              "eeEmail",
            ]}
          />

          <AddFixFillAddress t={t} config={addressConfig} onSelect={handleSelect} formData={formData} />
          <div style={{ display: "flex", marginBottom: "24px", justifyContent: isMobile ? "center" : "flex-end" }}>
            <SubmitBar label={editId ? t("ES_COMMON_UPDATE") : t("ES_COMMON_SAVE_NEXT")} onSubmit={handleSubmit} />
          </div>
        </div>

        {showToast && <Toast error={showToast.isError} label={showToast.label} onClose={() => setShowToast(null)} />}
      </div>
    </div>
  );
};

export default AddFillingPointAddress;
