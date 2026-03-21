import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AddressDetails, SubmitBar, Toast, Loader } from "@djb25/digit-ui-react-components";
import { fillingPointPayload } from "../utils";
import Timeline from "../../../vendor/src/components/VENDORTimeline";
import { useLocation } from "react-router-dom";

import AddFillingPointMetaData from "./AddFillingPointMetaData";

const AddFillingPointAddress = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("id");

  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // ✅ Fetch data if editing
  const { isLoading: isEditLoading, data: editData } = Digit.Hooks.wt.useTankerSearchAPI(
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
            name: data.fillingpointmetadata?.name,
            mobileNumber: data.fillingpointmetadata?.mobileNumber,
            emailId: data.fillingpointmetadata?.emailId,
            jeName: data.fillingpointmetadata?.jeName,
            jeMobileNumber: data.fillingpointmetadata?.jeMobileNumber,
            jeEmailId: data.fillingpointmetadata?.jeEmailId,
            eeName: data.fillingpointmetadata?.eeName,
            eeMobileNumber: data.fillingpointmetadata?.eeMobileNumber,
            eeEmailId: data.fillingpointmetadata?.eeEmailId,
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

  // const { mutate: createFillingPoint } = Digit.Hooks.wt.useCreateFillPoint(tenantId);
  // const { mutate: updateFillingPoint } = Digit.Hooks.wt.useUpdateFillPoint(tenantId);

  const createFillingPoint = [];

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const payload = fillingPointPayload({
      ...formData,
      tenantId,
    });

    // const mutation = editId ? updateFillingPoint : createFillingPoint;
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

  if (isEditLoading) return <Loader />;

  return (
    <div style={{ display: "flex", gap: "24px" }}>
      <Timeline steps={steps} currentStep={1} />

      <div style={{ flex: 1 }}>
        <form onSubmit={handleSubmit}>
          <AddFillingPointMetaData t={t} config={{ key: "owner" }} onSelect={onSelect} formData={formData} />

          <AddressDetails t={t} onSelect={(key, data) => setFormData((prev) => ({ ...prev, [key]: data }))} formData={formData} />

          <SubmitBar label={editId ? t("ES_COMMON_UPDATE") : t("ES_COMMON_SAVE_NEXT")} onSubmit={handleSubmit} />
        </form>

        {showToast && <Toast error={showToast.isError} label={showToast.label} onClose={() => setShowToast(null)} />}
      </div>
    </div>
  );
};

export default AddFillingPointAddress;
