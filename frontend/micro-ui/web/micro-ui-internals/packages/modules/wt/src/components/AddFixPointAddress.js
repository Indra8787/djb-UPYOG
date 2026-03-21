import React, { useState, useEffect } from "react";
import { SubmitBar, Toast, Loader } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Timeline from "../../../vendor/src/components/VENDORTimeline";
import AddFixFillAddress from "./AddFixFillAddress";
import AddFillingPointMetaData from "./AddFillingPointMetaData";
import { fixedPointPayload } from "../utils";

const AddFixPointAddress = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("id");

  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // ✅ Fetch data if editing
  const { isLoading: isEditLoading, data: editData } = Digit.Hooks.wt.useFixedPointSearchAPI(
    { tenantId, filters: { bookingId: editId } },
    { enabled: !!editId }
  );

  useEffect(() => {
    console.log("Edit ID:", editId);
    console.log("Search Result:", editData);

    if (editId && editData?.waterTankerBookingDetail) {
      // Find the specific record that matches the ID from the URL
      const data = editData.waterTankerBookingDetail.find((item) => item.bookingId === editId);

      if (data) {
        setFormData({
          owner: {
            name: data.applicantDetail?.name,
            mobileNumber: data.applicantDetail?.mobileNumber,
            alternateNumber: data.applicantDetail?.alternateNumber,
            emailId: data.applicantDetail?.emailId,
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

  const { mutate: createFixedPoint } = Digit.Hooks.wt.useCreateFixedPoint(tenantId);
  // const { mutate: updateFixedPoint } = Digit.Hooks.wt.useUpdateFixedPoint(tenantId);

  const handleSubmit = (e) => {
    const payload = fixedPointPayload({
      ...formData,
      tenantId,
    });

    // const mutation = editId ? updateFixedPoint : createFixedPoint;

    const mutation = createFixedPoint;
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

  if (isEditLoading) return <Loader />;

  return (
    <div style={{ display: "flex", gap: "24px" }}>
      <Timeline steps={["WT_FIXED_POINT"]} currentStep={1} />

      <div style={{ flex: 1 }}>
        <AddFillingPointMetaData
          t={t}
          config={{ key: "owner" }}
          onSelect={handleSelect}
          formData={formData}
          visibleFields={["name", "mobileNumber", "alternateNumber", "emailId"]}
        />
        <AddFixFillAddress t={t} config={addressConfig} onSelect={handleSelect} formData={formData} />
        <div style={{ display: "flex", marginBottom: "24px", justifyContent: "flex-end" }}>
          <SubmitBar label={editId ? t("ES_COMMON_UPDATE") : t("ES_COMMON_SAVE")} onSubmit={handleSubmit} />
        </div>
      </div>
      {showToast && <Toast error={showToast.isError} label={showToast.label} onClose={() => setShowToast(null)} />}
    </div>
  );
};

export default AddFixPointAddress;
