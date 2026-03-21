import React, { useState } from "react";
import { Card, Table, Menu, AddIcon, TextInput, Dropdown, Label, SubmitBar } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";

const SearchFillingPointAddress = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState("FIXED_POINT");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [status, setStatus] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // ✅ Hooks for Search
  const { isLoading: isFixedLoading, data: fixedPointData, refetch: refetchFixed } = Digit.Hooks.wt.useFixedPointSearchAPI(
    {
      tenantId,
      filters: searchParams,
    },
    { enabled: selectedTab === "FIXED_POINT" }
  );

  const { isLoading: isFillingLoading, data: fillingPointData, refetch: refetchFilling } = Digit.Hooks.wt.useTankerSearchAPI(
    {
      tenantId,
      filters: searchParams,
    },
    { enabled: selectedTab === "FILLING_POINT" }
  );

  const isLoading = selectedTab === "FIXED_POINT" ? isFixedLoading : isFillingLoading;
  const tableData =
    (selectedTab === "FIXED_POINT" ? fixedPointData?.waterTankerBookingDetail : fillingPointData?.waterTankerBookingDetail) || [];

  // ✅ Dynamic config
  const searchConfig = {
    FIXED_POINT: {
      label: "WT_FIXED_POINT_NAME",
      placeholder: "WT_ENTER_FIXED_POINT_NAME",
    },
    FILLING_POINT: {
      label: "WT_FILLING_POINT_NAME",
      placeholder: "WT_ENTER_FILLING_POINT_NAME",
    },
  };

  const statusOptions = [
    { i18nKey: "WT_BOOKING_CREATED", code: "BOOKING_CREATED" },
    { i18nKey: "WT_BOOKING_APPROVED", code: "APPROVED" },
    { i18nKey: "WT_TANKER_DELIVERED", code: "TANKER_DELIVERED" },
    { i18nKey: "WT_ASSIGN_VENDOR", code: "ASSIGN_VENDOR" },
    { i18nKey: "WT_BOOKING_REJECTED", code: "REJECT" },
  ];

  const { label, placeholder } = searchConfig[selectedTab];

  // ✅ Handlers
  const clearSearch = () => {
    setSearchValue("");
    setMobileNumber("");
    setStatus(null);
    setSearchParams({});
  };

  const onTabChange = (tab) => {
    setSelectedTab(tab);
    clearSearch();
  };

  const onAddClick = () => {
    setShowAddMenu((prev) => !prev);
  };

  const onActionSelect = (option) => {
    if (option === "FILLING_POINT") {
      history.push(`/digit-ui/employee/wt/add-filling-point-address`);
    } else if (option === "FIXED_POINT") {
      history.push(`/digit-ui/employee/wt/add-fix-point-address`);
    }
    setShowAddMenu(false);
  };

  const onSearch = () => {
    setSearchParams({
      name: searchValue,
      mobileNumber: mobileNumber,
      status: status?.code,
    });
  };

  const columns = React.useMemo(() => {
    if (selectedTab === "FIXED_POINT") {
      return [
        {
          Header: t("WT_APPLICANT_NAME"),
          accessor: (row) => row?.applicantDetail?.name || "NA",
          id: "applicantName",
          Cell: ({ row }) => (
            <span className="link">
              <Link to={`/digit-ui/employee/wt/add-fix-point-address?id=${row.original.bookingId}`}>
                {row.original.applicantDetail?.name || "NA"}
              </Link>
            </span>
          ),
        },
        {
          Header: t("WT_MOBILE_NUMBER"),
          accessor: (row) => row?.applicantDetail?.mobileNumber || "NA",
          id: "mobileNumber",
        },
        {
          Header: t("WT_LOCALITY"),
          accessor: (row) => row?.address?.locality || "NA",
          id: "locality",
        },
      ];
    } else {
      return [
        {
          Header: t("WT_FILLING_POINT_NAME"),
          accessor: (row) => row?.fillingpointmetadata?.name || "NA",
          id: "fillingPointName",
          Cell: ({ row }) => (
            <span className="link">
              <Link to={`/digit-ui/employee/wt/add-filling-point-address?id=${row.original.bookingId}`}>
                {row.original.fillingpointmetadata?.name || "NA"}
              </Link>
            </span>
          ),
        },
        {
          Header: t("WT_JE_NAME"),
          accessor: (row) => row?.fillingpointmetadata?.jeName || "NA",
          id: "jeName",
        },
        {
          Header: t("WT_LOCALITY"),
          accessor: (row) => row?.address?.locality || "NA",
          id: "locality",
        },
      ];
    }
  }, [selectedTab, t]);

  return (
    <React.Fragment>
      <Card>
        {/* 🔹 Tabs + Add */}
        <div className="search-tabs-container">
          <div>
            <button
              className={selectedTab === "FIXED_POINT" ? "search-tab-head-selected" : "search-tab-head"}
              onClick={() => onTabChange("FIXED_POINT")}
            >
              {t("WT_FIXED_POINT")}
            </button>

            <button
              className={selectedTab === "FILLING_POINT" ? "search-tab-head-selected" : "search-tab-head"}
              onClick={() => onTabChange("FILLING_POINT")}
            >
              {t("WT_FILLING_POINT")}
            </button>
          </div>

          <div className="action-bar-wrap-registry">
            <div className="search-add" onClick={onAddClick}>
              {t("ES_VENDOR_REGISTRY_INBOX_HEADER_ADD")}
              <div className="search-add-icon">
                <AddIcon />
              </div>
            </div>

            {showAddMenu && (
              <Menu localeKeyPrefix={"ES_FSM_ACTION_CREATE"} options={["FIXED_POINT", "FILLING_POINT"]} t={t} onSelect={onActionSelect} />
            )}
          </div>
        </div>

        {/* 🔥 Search Section (same card) */}
        <div className="finance-mainlayout">
          <div className="finance-mainlayout-col1">
            <Label>{t(label)}</Label>
            <TextInput value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={t(placeholder)} />
          </div>

          <div className="finance-mainlayout-col1">
            <Label>{t("WT_MOBILE_NUMBER")}</Label>
            <TextInput value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder={t("WT_ENTER_MOBILE_NUMBER")} />
          </div>

          {selectedTab === "FILLING_POINT" && (
            <div className="finance-mainlayout-col1">
              <Label>{t("PT_COMMON_TABLE_COL_STATUS_LABEL")}</Label>
              <Dropdown option={statusOptions} optionKey="i18nKey" selected={status} select={setStatus} t={t} />
            </div>
          )}
        <div style={{ display: "flex", marginTop: "32px", justifyContent: "flex-end", gap: "16px" }}>

          <SubmitBar label={t("ES_COMMON_SEARCH")} onSubmit={onSearch} />

          <span className="clear-search" onClick={clearSearch}>
            {t("ES_COMMON_CLEAR_SEARCH")}
          </span>
          </div>
        </div>
      </Card>

      {/* 🔹 Table */}
      <Card>
        <Table
          data={tableData}
          columns={columns}
          pageSize={10}
          showPagination={true}
          showPageSizeOptions={true}
          showSearch={false}
          getCellProps={() => ({
            style: {
              padding: "20px 18px",
              fontSize: "16px",
            },
          })}
          t={t}
          isLoading={isLoading}
          isSearchRequired={false}
          isDownloadRequired={true}
          isFilterRequired={true}
          isSortRequired={true}
        />
      </Card>
    </React.Fragment>
  );
};

export default SearchFillingPointAddress;
