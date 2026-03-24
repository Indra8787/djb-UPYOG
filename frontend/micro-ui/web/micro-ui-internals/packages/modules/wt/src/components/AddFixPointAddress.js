import React, { useState, useEffect } from "react";
import { SubmitBar, Toast, Loader, Card, CardLabel, TextInput, MobileNumber, DatePicker } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import Timeline from "../../../vendor/src/components/VENDORTimeline";
import AddFixFillAddress from "./AddFixFillAddress";
import { fixedPointPayload } from "../utils";

const AddFixPointAddress = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get("id");

  const [formData, setFormData] = useState({});
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // ✅ Memoize filters and config to prevent excessive re-fetching/re-renders
  const searchFilters = React.useMemo(() => ({ tenantId, filters: { bookingId: editId } }), [tenantId, editId]);
  const searchConfig = React.useMemo(() => ({ enabled: !!editId }), [editId]);

  // ✅ Fetch data if editing
  const { isLoading: isEditLoading, data: editData } = Digit.Hooks.wt.useFixedPointSearchAPI(
    searchFilters,
    searchConfig
  );

  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (editId && editData?.waterTankerBookingDetail && !isDataFetched) {
      const data = editData.waterTankerBookingDetail.find((item) => item.bookingId === editId);

      if (data) {
        setFormData({
          owner: {
            name: data.applicantDetail?.name,
            mobileNumber: data.applicantDetail?.mobileNumber,
            alternateNumber: data.applicantDetail?.alternateNumber,
            emailId: data.applicantDetail?.emailId,
            applicantId: data.applicantDetail?.applicantId,
          },
          address: {
            ...data.address,
            addressId: data.address?.addressId,
            applicantId: data.address?.applicantId,
          },
          bookingId: data.bookingId,
          bookingNo: data.bookingNo,
          auditDetails: data.auditDetails,
        });
        setIsDataFetched(true);
      }
    }
  }, [editData, editId, isDataFetched]);

  const addressConfig = React.useMemo(() => ({ key: "address" }), []);

  const handleSelect = React.useCallback((key, data) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        ...data,
      },
    }));
  }, []);

  const { mutate: createFixedPoint } = Digit.Hooks.wt.useCreateFixedPoint(tenantId);
  const { mutate: updateFixedPoint } = Digit.Hooks.wt.useUpdateFixedPoint(tenantId);

  const handleSubmit = (e) => {
    console.log("Submitting Form Data:", formData);
    const payload = fixedPointPayload({
      ...formData,
      tenantId,
    });
    console.log("Generated Payload:", payload);

    const mutation = editId ? updateFixedPoint : createFixedPoint;
    mutation(payload, {
      onSuccess: () => {
        setShowToast({ label: editId ? t("WT_FILLING_POINT_UPDATED_SUCCESS") : t("WT_FILLING_POINT_CREATED_SUCCESS") });
        queryClient.invalidateQueries("wtFixedPointSearchList");
        setTimeout(() => {
          setShowToast(null);
          history.push("/digit-ui/employee/wt/search-filling-fix-point");
        }, 3000);
      },
      onError: (error) => {
        console.error("Mutation Error:", error);
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
      <Timeline steps={["WT_FIXED_POINT"]} currentStep={1} />

      <div style={{ flex: 1, marginLeft: isMobile ? "0px" : "24px" }}>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", columnGap: "32px", rowGap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>{`${t("COMMON_APPLICANT_NAME")}`} <span className="astericColor">*</span></CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={true}
                name="name"
                value={formData?.owner?.name}
                style={{ width: "100%" }}
                onChange={(e) => handleSelect("owner", { name: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>{`${t("COMMON_MOBILE_NUMBER")}`} <span className="astericColor">*</span></CardLabel>
              <MobileNumber 
                value={formData?.owner?.mobileNumber} 
                name="mobileNumber" 
                onChange={(value) => handleSelect("owner", { mobileNumber: value })} 
                style={{ width: "100%" }} 
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>{`${t("COMMON_EMAIL_ID")}`} <span className="astericColor">*</span></CardLabel>
              <TextInput
                t={t}
                type={"email"}
                isMandatory={true}
                name="emailId"
                value={formData?.owner?.emailId}
                style={{ width: "100%" }}
                onChange={(e) => handleSelect("owner", { emailId: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <CardLabel>{`${t("COMMON_ALT_MOBILE_NUMBER")}`}</CardLabel>
              <MobileNumber 
                value={formData?.owner?.alternateNumber} 
                name="alternateNumber" 
                onChange={(value) => handleSelect("owner", { alternateNumber: value })} 
                style={{ width: "100%" }} 
              />
            </div>
          </div>
        </Card>
        <AddFixFillAddress t={t} config={addressConfig} onSelect={handleSelect} formData={formData} isEdit={!!editId} />
        <div style={{ display: "flex", marginBottom: "24px", justifyContent: isMobile ? "center" : "flex-end" }}>
          <SubmitBar label={editId ? t("ES_COMMON_UPDATE") : t("ES_COMMON_SAVE")} onSubmit={handleSubmit} />
        </div>
      </div>
      {showToast && <Toast error={showToast.isError} label={showToast.label} onClose={() => setShowToast(null)} />}
    </div>
  );
};

export default AddFixPointAddress;
