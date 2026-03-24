import React from "react";
import { TextInput, Dropdown, MultiSelectDropdown, CustomNameDropdown, CardLabel, Loader } from "@djb25/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddTripModal = ({ t, closeModal, onSubmit, initialValues }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: initialValues || {},
  });

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading: isFixedPointLoading, data: fixedPointsData } = Digit.Hooks.wt.useFixedPointSearchAPI({
    tenantId,
    filters: { limit: 1000 },
  });

  const fixedPoints = fixedPointsData?.waterTankerBookingDetail || [];

  const fixedPointOptions = fixedPoints.map((fp) => ({
    name: fp?.applicantDetail?.name || "NA",
    mobileNumber: fp?.applicantDetail?.mobileNumber || "NA",
    locality: fp?.address?.locality || "NA",
    displayLabel: `${fp?.applicantDetail?.name || "NA"} | ${fp?.applicantDetail?.mobileNumber || "NA"} | ${fp?.address?.locality || "NA"}`,
    value: fp.bookingId,
    fullAddress: [
      fp?.address?.houseNo && `${t("WT_HOUSE_NO")} = ${fp.address.houseNo}`,
      fp?.address?.streetName && `${t("WT_STREET_NAME")} = ${fp.address.streetName}`,
      fp?.address?.landmark && `${t("WT_LANDMARK")} = ${fp.address.landmark}`,
      fp?.address?.locality && `${t("WT_LOCALITY")} = ${fp.address.locality}`,
      // fp?.address?.city && `${t("WT_CITY")} = ${fp.address.city}`,
    ]
      .filter(Boolean)
      .join(", "),
  }));

  const selectedFixedPointCode = watch("fixedPointCode");
  const selectedFixedPoint = fixedPointOptions.find((opt) => opt.value === selectedFixedPointCode);

  const dayOptions = [
    { label: t("MONDAY"), value: "MONDAY" },
    { label: t("TUESDAY"), value: "TUESDAY" },
    { label: t("WEDNESDAY"), value: "WEDNESDAY" },
    { label: t("THURSDAY"), value: "THURSDAY" },
    { label: t("FRIDAY"), value: "FRIDAY" },
    { label: t("SATURDAY"), value: "SATURDAY" },
    { label: t("SUNDAY"), value: "SUNDAY" },
  ];

  const activeOptions = [
    { label: t("YES"), value: "Yes" },
    { label: t("NO"), value: "No" },
  ];

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div
      className="custom-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 200000,
      }}
    >
      <style>
        {`
          .custom-modal-content {
            background-color: #fff;
            border-radius: 8px;
            width: 70%;
            max-width: 800px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            position: relative;
          }
          .add-trip-form {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          @media (max-width: 768px) {
            .custom-modal-content {
              width: 90%;
              max-height: 85vh;
            }
            .add-trip-form {
              grid-template-columns: 1fr;
              gap: 15px;
            }
          }
          @media (max-width: 480px) {
            .custom-modal-content {
              width: 95%;
              max-height: 95vh;
            }
            .custom-modal-body {
              padding: 15px !important;
            }
            .custom-modal-footer {
              padding: 12px 15px !important;
              flex-direction: row;
              justify-content: flex-end;
            }
            .custom-modal-header {
                padding: 12px 15px !important;
            }
            .custom-modal-header h1 {
                font-size: 18px !important;
            }
          }
           @media (max-width: 320px) {
             .custom-modal-footer {
              flex-direction: column-reverse;
              align-items: stretch;
            }
            .custom-modal-footer button {
              width: 100%;
            }
          }
        `}
      </style>
      <div className="custom-modal-content">
        {/* Header */}
        <div
          className="custom-modal-header"
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#1D4E7F" }}>{initialValues ? t("WT_EDIT_TRIP") : t("WT_ADD_TRIP")}</h1>
          <button
            onClick={closeModal}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          className="custom-modal-body"
          style={{
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <div className="add-trip-form">
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_FIXED_POINT_CODE")}</CardLabel>
              {isFixedPointLoading ? (
                <Loader />
              ) : (
                <Controller
                  control={control}
                  name="fixedPointCode"
                  render={(props) => (
                    <CustomNameDropdown
                      option={fixedPointOptions}
                      optionKey="displayLabel"
                      selected={fixedPointOptions.find((opt) => opt.value === props.value)}
                      select={(val) => props.onChange(val.value)}
                      t={t}
                      optionsHeader={{
                        name: "WT_NAME",
                        mobileNumber: "WT_MOBILE_NUMBER",
                        locality: "WT_LOCALITY",
                      }}
                    />
                  )}
                />
              )}
              {selectedFixedPoint && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "#555",
                  }}
                >
                  <strong>{t("WT_ADDRESS")}:</strong> {selectedFixedPoint.fullAddress}
                </div>
              )}
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_DAY")}</CardLabel>
              <Controller
                control={control}
                name="day"
                render={(props) => (
                  <MultiSelectDropdown
                    options={dayOptions}
                    optionsKey="label"
                    selected={dayOptions.filter((opt) => (props.value || []).some((v) => v === opt.value || v?.value === opt.value))}
                    onSelect={(val) => props.onChange(val.map((v) => (Array.isArray(v) ? v[1] : v?.value || v)))}
                    t={t}
                    defaultLabel={t("WT_SELECT_DAYS")}
                    defaultUnit={t("WT_DAYS")}
                  />
                )}
              />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_FREQUENCY_NO")}</CardLabel>
              <TextInput name="frequencyNo" inputRef={register()} />
            </div>

            {/* <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_VEHICLE_ID")}</CardLabel>
              <TextInput name="vehicleId" inputRef={register()} />
            </div> */}
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_ARRIVAL_TIME_TO_FPL")}</CardLabel>
              <TextInput name="arrivalTimeFpl" inputRef={register()} type="time" />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_DEPARTURE_TIME_FROM_FPL")}</CardLabel>
              <TextInput name="departureTimeFpl" inputRef={register()} type="time" />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_ARRIVAL_AT_FIXED_POINT")}</CardLabel>
              <TextInput name="arrivalFixedPoint" inputRef={register()} type="time" />
            </div>

            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_DEPARTURE_AT_FIXED_POINT")}</CardLabel>
              <TextInput name="departureFixedPoint" inputRef={register()} type="time" />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_RETURN_TO_FPL")}</CardLabel>
              <TextInput name="returnFpl" inputRef={register()} type="time" />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_VOLUME")}</CardLabel>
              <TextInput name="volume" inputRef={register()} />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_ACTIVE")}</CardLabel>
              <Controller
                control={control}
                name="active"
                render={(props) => <Dropdown option={activeOptions} optionKey="label" selected={props.value} select={props.onChange} t={t} />}
              />
            </div>

            <div className="field-group remarks-field-group" style={{ gridColumn: "span 2" }}>
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_REMARKS")}</CardLabel>
              <TextInput name="remarks" inputRef={register()} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="custom-modal-footer"
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            className="button-cancel"
            onClick={closeModal}
            style={{
              padding: "8px 20px",
              border: "1px solid #ccc",
              background: "#f4f4f4",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {t("CS_COMMON_CANCEL")}
          </button>
          <button
            className="button-save"
            onClick={handleSubmit(onFormSubmit)}
            style={{
              padding: "8px 20px",
              background: "#1D4E7F",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {initialValues ? t("WT_UPDATE") : t("CS_COMMON_SAVE")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTripModal;
