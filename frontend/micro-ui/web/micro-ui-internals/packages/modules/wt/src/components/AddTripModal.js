import React from "react";
import { TextInput, Dropdown, CardLabel } from "@djb25/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddTripModal = ({ t, closeModal, onSubmit, initialValues }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || {},
  });

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
        zIndex: 9999,
      }}
    >
      <div
        className="custom-modal-content"
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "70%",
          maxWidth: "800px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
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
          <div className="add-trip-form" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_FIXED_POINT_CODE")}</CardLabel>
              <TextInput name="fixedPointCode" inputRef={register()} />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_DAY")}</CardLabel>
              <Controller
                control={control}
                name="day"
                render={(props) => <Dropdown option={dayOptions} optionKey="label" selected={props.value} select={props.onChange} t={t} />}
              />
            </div>
            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_FREQUENCY_NO")}</CardLabel>
              <TextInput name="frequencyNo" inputRef={register()} />
            </div>

            <div className="field-group">
              <CardLabel style={{ marginBottom: "8px", fontWeight: "500" }}>{t("WT_VEHICLE_ID")}</CardLabel>
              <TextInput name="vehicleId" inputRef={register()} />
            </div>
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

            <div className="field-group" style={{ gridColumn: "span 2" }}>
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
