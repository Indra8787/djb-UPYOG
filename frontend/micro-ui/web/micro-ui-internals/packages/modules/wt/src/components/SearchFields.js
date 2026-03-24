import React, { Fragment } from "react";
import { Controller } from "react-hook-form";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, MobileNumber, CardLabelError } from "@djb25/digit-ui-react-components";

const SearchFields = ({ register, control, reset, tenantId, t, previousPage, formState, moduleCode, onClear }) => {
  const statusOptions = [
    { i18nKey: "WT_BOOKING_CREATED", code: "BOOKING_CREATED", value: t("WT_BOOKING_CREATED") },
    { i18nKey: "WT_VENDOR_ASSIGNED", code: "VENDOR_ASSIGNED", value: t("WT_VENDOR_ASSIGNED") },
    { i18nKey: "WT_DELIVERY_PENDING", code: "DELIVERY_PENDING", value: t("WT_DELIVERY_PENDING") },
    { i18nKey: "WT_DELIVERED", code: "DELIVERED", value: t("WT_DELIVERED") },
    { i18nKey: "WT_REQUEST_REJECTED", code: "REQUEST_REJECTED", value: t("WT_REQUEST_REJECTED") },
  ];

    const statusOptionForTreePruning = [
        {
            i18nKey: "TP_BOOKING_CREATED",
            code: "BOOKING_CREATED",
            value: t("TP_BOOKING_CREATED")
        },
        {
            i18nKey: "TP_PENDING_FOR_APPROVAL",
            code: "PENDING_FOR_APPROVAL",
            value: t("TP_PENDING_FOR_APPROVAL")
        },
        {
            i18nKey: "TP_PAYMENT_PENDING",
            code: "PAYMENT_PENDING",
            value: t("TP_PAYMENT_PENDING")
        },
        {
            i18nKey: "TP_TEAM_ASSIGNMENT_FOR_VERIFICATION",
            code: "TEAM_ASSIGNMENT_FOR_VERIFICATION",
            value: t("TP_TEAM_ASSIGNMENT_FOR_VERIFICATION")
        },
        {
            i18nKey: "TP_TEAM_ASSIGNMENT_FOR_EXECUTION",
            code: "TEAM_ASSIGNMENT_FOR_EXECUTION",
            value: t("TP_TEAM_ASSIGNMENT_FOR_EXECUTION")
        },
        {
            i18nKey: "TP_TREE_PRUNING_SERVICE_COMPLETED",
            code: "TREE_PRUNING_SERVICE_COMPLETED",
            value: t("TP_TREE_PRUNING_SERVICE_COMPLETED")
        }
    ];

  return (
    <Fragment>
      <SearchField>
        <label>{t("WT_BOOKING_NO")}</label>
        <TextInput name="bookingNo" inputRef={register({})} />
      </SearchField>
      <SearchField>
        <label>{t("PT_COMMON_TABLE_COL_STATUS_LABEL")}</label>
        <Controller
          control={control}
          name="status"
          render={(props) => (
            <Dropdown
              selected={props.value}
              select={props.onChange}
              onBlur={props.onBlur}
              option={moduleCode === "TP" ? statusOptionForTreePruning : statusOptions}
              optionKey="i18nKey"
              t={t}
              disable={false}
            />
          )}
        />
      </SearchField>
      <SearchField>
        <label>{t("WT_MOBILE_NUMBER")}</label>
        <MobileNumber
          name="mobileNumber"
          inputRef={register({
            minLength: {
              value: 10,
              message: t("CORE_COMMON_MOBILE_ERROR"),
            },
            maxLength: {
              value: 10,
              message: t("CORE_COMMON_MOBILE_ERROR"),
            },
            pattern: {
              value: /[6789][0-9]{9}/,
              //type: "tel",
              message: t("CORE_COMMON_MOBILE_ERROR"),
            },
          })}
          type="number"
          componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
          maxlength={10}
        />
        <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
      </SearchField>
      <SearchField>
        <label>{t("FROM_DATE")}</label>
        <Controller
          render={(props) => (
            <DatePicker date={props.value} disabled={false} onChange={props.onChange} max={new Date().toISOString().split("T")[0]} />
          )}
          name="fromDate"
          control={control}
        />
      </SearchField>
      <SearchField>
        <label>{t("TO_DATE")}</label>
        <Controller
          render={(props) => <DatePicker date={props.value} disabled={false} onChange={props.onChange} />}
          name="toDate"
          control={control}
        />
      </SearchField>
      <SearchField className="submit">
        <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
        <p style={{ marginTop: "10px" }} onClick={onClear}>
          {t(`ES_COMMON_CLEAR_ALL`)}
        </p>
      </SearchField>
    </Fragment>
  );
};

export default SearchFields;
