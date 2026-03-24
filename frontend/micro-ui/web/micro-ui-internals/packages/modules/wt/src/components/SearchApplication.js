import React, { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  SubmitBar,
  DatePicker,
  CardLabelError,
  Dropdown,
  Table,
  Card,
  MobileNumber,
  Loader,
  Header,
} from "@djb25/digit-ui-react-components";
import { Link } from "react-router-dom";
import { APPLICATION_PATH } from "../utils";
import CollapsibleCardPage from "./CollapseCard";

const WTSearchApplication = ({ tenantId, isLoading, t, onSubmit, data, count, setShowToast, moduleCode }) => {
  const isMobile = window.Digit.Utils.browser.isMobile();
  const user = Digit.UserService.getUser().info;

  const defaultValues = {
    offset: 0,
    limit: 10,
    sortBy: "commencementDate",
    sortOrder: "DESC",
    bookingNo: "",
    mobileNumber: "",
    applicantName: "",
    status: "",
    fromDate: "",
    toDate: "",
  };

  const { register, control, handleSubmit, setValue, getValues, reset, formState, watch } = useForm({
    defaultValues,
  });

  const fromDateValue = watch("fromDate");

  const GetCell = (value) => <span className="cell-text">{value}</span>;

  const columns = useMemo(
    () => [
      {
        Header: t("WT_BOOKING_NO"),
        accessor: "bookingNo",
        disableSortBy: true,
        Cell: ({ row }) => {
          const bookingNo = row.original["bookingNo"];
          const userTypePath = user.type === "EMPLOYEE" ? "employee" : "citizen";
          return (
            <div>
              <span className="link">
                <Link to={`${APPLICATION_PATH}/${userTypePath}/wt/bookingsearch/booking-details/${bookingNo}`}>{bookingNo}</Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("WT_APPLICANT_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(row.original?.applicantDetail?.["name"]),
      },
      {
        Header: t("WT_MOBILE_NUMBER"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(row.original?.applicantDetail?.["mobileNumber"]),
      },
      {
        Header: t("PT_COMMON_TABLE_COL_STATUS_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => GetCell(t(row.original["bookingStatus"])),
      },
    ],
    [t, user.type]
  );

  const statusOptions =
    moduleCode === "TP"
      ? [
          { i18nKey: "TP_BOOKING_CREATED", code: "BOOKING_CREATED", value: t("TP_BOOKING_CREATED") },
          { i18nKey: "TP_PENDING_FOR_APPROVAL", code: "PENDING_FOR_APPROVAL", value: t("TP_PENDING_FOR_APPROVAL") },
          { i18nKey: "TP_PAYMENT_PENDING", code: "PAYMENT_PENDING", value: t("TP_PAYMENT_PENDING") },
          {
            i18nKey: "TP_TEAM_ASSIGNMENT_FOR_VERIFICATION",
            code: "TEAM_ASSIGNMENT_FOR_VERIFICATION",
            value: t("TP_TEAM_ASSIGNMENT_FOR_VERIFICATION"),
          },
          { i18nKey: "TP_TEAM_ASSIGNMENT_FOR_EXECUTION", code: "TEAM_ASSIGNMENT_FOR_EXECUTION", value: t("TP_TEAM_ASSIGNMENT_FOR_EXECUTION") },
          { i18nKey: "TP_TREE_PRUNING_SERVICE_COMPLETED", code: "TREE_PRUNING_SERVICE_COMPLETED", value: t("TP_TREE_PRUNING_SERVICE_COMPLETED") },
        ]
      : [
          { i18nKey: "WT_BOOKING_CREATED", code: "BOOKING_CREATED", value: t("WT_BOOKING_CREATED") },
          { i18nKey: "WT_VENDOR_ASSIGNED", code: "VENDOR_ASSIGNED", value: t("WT_VENDOR_ASSIGNED") },
          { i18nKey: "WT_DELIVERY_PENDING", code: "DELIVERY_PENDING", value: t("WT_DELIVERY_PENDING") },
          { i18nKey: "WT_DELIVERED", code: "DELIVERED", value: t("WT_DELIVERED") },
          { i18nKey: "WT_REQUEST_REJECTED", code: "REQUEST_REJECTED", value: t("WT_REQUEST_REJECTED") },
        ];

  const onSort = useCallback(
    (args) => {
      if (args.length === 0) return;
      setValue("sortBy", args.id);
      setValue("sortOrder", args.desc ? "DESC" : "ASC");
    },
    [setValue]
  );

  const onPageSizeChange = (e) => {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  };

  const nextPage = () => {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  };

  const previousPage = () => {
    const currentOffset = getValues("offset");
    const limit = getValues("limit");
    if (currentOffset - limit >= 0) {
      setValue("offset", currentOffset - limit);
      handleSubmit(onSubmit)();
    }
  };

  const handleClearSearch = () => {
    reset(defaultValues);
    setShowToast(null);
    handleSubmit(onSubmit)();
  };

  return (
    <React.Fragment>
      <div className={user?.type === "CITIZEN" ? "citizen-wrapper" : "employee-wrapper"}>
        <CollapsibleCardPage
          title={t("WT_SEARCH_FILTERS_LABEL") || "Search Filters"}
          defaultOpen={true}
          tabs={[t("WT_SMART_SEARCH"), t("WT_ADVANCED_SEARCH")]} // Define tab names
          defaultTab={t("WT_SMART_SEARCH")}
        >
          {/* The component passes the 'activeTab' string back to us 
             via the render prop function below.
          */}
          {(activeTab) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* --- SMART SEARCH --- */}
              {activeTab === t("WT_SMART_SEARCH") && (
                <div className="wt-search-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "24px" }}>
                  <div className="search-field-wrapper">
                    <label>{t("WT_MOBILE_NUMBER")}</label>
                    <MobileNumber
                      name="mobileNumber"
                      inputRef={register({
                        minLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        maxLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        pattern: { value: /[6789][0-9]{9}/, message: t("CORE_COMMON_MOBILE_ERROR") },
                      })}
                      type="number"
                      maxlength={10}
                    />
                    <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
                  </div>

                  {/* <div className="search-field-wrapper">
                    <label>{t("WT_APPLICANT_NAME")}</label>
                    <TextInput name="applicantName" inputRef={register({})} />
                  </div> */}
                </div>
              )}

              {/* --- ADVANCED SEARCH --- */}
              {activeTab === t("WT_ADVANCED_SEARCH") && (
                <div className="formcomposer-section-grid">
                  <div className="search-field-wrapper">
                    <label>{t("WT_BOOKING_NO")}</label>
                    <TextInput name="bookingNo" inputRef={register({})} />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("WT_APPLICANT_NAME")}</label>
                    <TextInput name="applicantName" inputRef={register({})} />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("WT_MOBILE_NUMBER")}</label>
                    <MobileNumber
                      name="mobileNumber"
                      inputRef={register({
                        minLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        maxLength: { value: 10, message: t("CORE_COMMON_MOBILE_ERROR") },
                        pattern: { value: /[6789][0-9]{9}/, message: t("CORE_COMMON_MOBILE_ERROR") },
                      })}
                      type="number"
                      maxlength={10}
                    />
                    <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("PT_COMMON_TABLE_COL_STATUS_LABEL")}</label>
                    <Controller
                      control={control}
                      name="status"
                      render={(props) => (
                        <Dropdown
                          selected={props.value}
                          select={props.onChange}
                          onBlur={props.onBlur}
                          option={statusOptions}
                          optionKey="i18nKey"
                          t={t}
                        />
                      )}
                    />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("FROM_DATE")}</label>
                    <Controller
                      render={(props) => <DatePicker date={props.value} onChange={props.onChange} max={new Date().toISOString().split("T")[0]} />}
                      name="fromDate"
                      control={control}
                    />
                  </div>

                  <div className="search-field-wrapper">
                    <label>{t("TO_DATE")}</label>
                    <Controller
                      render={(props) => <DatePicker date={props.value} onChange={props.onChange} min={fromDateValue} />}
                      name="toDate"
                      control={control}
                    />
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="wt-search-actions" style={{ display: "flex", justifyContent: isMobile ? "center" : "flex-end", flexDirection: isMobile ? "column-reverse" : "row", gap: "24px", marginTop: "16px" }}>
                <span
                  className="clear-search-link"
                  onClick={handleClearSearch}
                  style={{ color: "#f47738", cursor: "pointer", alignSelf: "center", textDecoration: "underline" }}
                >
                  {t("ES_COMMON_CLEAR_ALL")}
                </span>
                <div style={{ minWidth: isMobile ? "100%" : "160px" }}>
                  <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
                </div>
              </div>
            </form>
          )}
        </CollapsibleCardPage>

        {/* RESULTS TABLE */}
        {!isLoading && data?.display ? (
          <Card style={{ marginTop: 20 }}>
            {t(data.display)
              .split("\\n")
              .map((text, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                  {text}
                </p>
              ))}
          </Card>
        ) : !isLoading && data !== "" ? (
          <Table
            t={t}
            data={data}
            totalRecords={count}
            columns={columns}
            getCellProps={(cellInfo) => ({
              style: {
                minWidth: cellInfo.column.Header === t("WT_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px",
              },
            })}
            onPageSizeChange={onPageSizeChange}
            currentPage={getValues("offset") / getValues("limit")}
            onNextPage={nextPage}
            onPrevPage={previousPage}
            pageSizeLimit={getValues("limit")}
            onSort={onSort}
            disableSort={false}
            sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" }]}
          />
        ) : (
          (data !== "" || isLoading) && <Loader />
        )}
      </div>
    </React.Fragment>
  );
};

export default WTSearchApplication;
