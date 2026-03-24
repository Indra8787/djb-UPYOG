import React, { useState } from "react";
import { Card, Table, Menu, AddIcon, TextInput, Dropdown, Label, SubmitBar, Toast } from "@djb25/digit-ui-react-components";
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
  const [toast, setToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const closeToast = () => {
    setToast(null);
  };

  // ✅ Hooks for Search
  const { isLoading: isFixedLoading, data: fixedPointData, refetch: refetchFixed } = Digit.Hooks.wt.useFixedPointSearchAPI(
    {
      tenantId,
      filters: searchParams,
    },
    { enabled: selectedTab === "FIXED_POINT" }
  );

  const { isLoading: isFillingLoading, data: fillingPointData, refetch: refetchFilling } = Digit.Hooks.wt.useFillPointSearch(
    {
      tenantId,
      filters: searchParams,
    },
    { enabled: selectedTab === "FILLING_POINT" }
  );

  // ✅ Hook to fetch all filling points for mapping dropdown
  const { isLoading: isAllFillingPointsLoading, data: allFillingPointsData } = Digit.Hooks.wt.useFillPointSearch(
    {
      tenantId,
      filters: { limit: 1000 },
    },
    { enabled: true }
  );

  const allFillingPoints = allFillingPointsData?.fillingPoints || [];

  // ✅ Hook for Mapping
  const { mutate: mapFixedFilling } = Digit.Hooks.wt.useFixedFillingMapping(tenantId);

  const isLoading = selectedTab === "FIXED_POINT" ? isFixedLoading : isFillingLoading;
  const tableData = (selectedTab === "FIXED_POINT" ? fixedPointData?.waterTankerBookingDetail : fillingPointData?.fillingPoints) || [];

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
    // Re-trigger search with empty filters for the new tab
    setSearchParams({});
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
    const filters = {
      name: searchValue,
      ...(selectedTab === "FILLING_POINT" ? { mobileNo: mobileNumber } : { mobileNumber: mobileNumber }),
      status: status?.code,
    };
    setSearchParams(filters);
  };

  const onFillingPointSelect = (row, value) => {
    const payload = {
      fixedFillingPointMapping: {
        fixed_pt_name: row.original.applicantDetail?.applicantId,
        filling_pt_name: value.id || value.bookingId || value.fillingPointId || value.uuid || value.fillingpointmetadata?.fillingPointId,
      },
    };

    mapFixedFilling(payload, {
      onSuccess: () => {
        setToast({ label: t("WT_FIXED_FILLING_MAPPING_SUCCESS") });
        setTimeout(closeToast, 5000);
        refetchFixed();
      },
      onError: (err) => {
        setToast({
          label: err?.response?.data?.Errors?.[0]?.message || t("WT_FIXED_FILLING_MAPPING_FAIL"),
          error: true,
        });
        setTimeout(closeToast, 5000);
      },
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
        {
          Header: t("WT_FILLING_POINT"),
          accessor: (row) =>
            row?.fillingPointId ||
            row?.fillingpointmetadata?.fillingPointId ||
            row?.fillingPtName ||
            row?.filling_pt_name ||
            row?.fillingPoint ||
            "NA",
          id: "fillingPoint",
          Cell: ({ row }) => {
            const rowFpId = String(
              row.original.fillingPointId ||
                row.original.fillingpointmetadata?.fillingPointId ||
                row.original.fillingPtName ||
                row.original.filling_pt_name ||
                (typeof row.original.fillingPoint === "object" ? row.original.fillingPoint?.id : row.original.fillingPoint) ||
                row.original.fillingPointDetail?.id ||
                row.original.fillingPointDetail?.bookingId ||
                ""
            );

            const selectedOption = allFillingPoints?.find((fp) => {
              const fpId = String(fp.id || fp.bookingId || fp.fillingPointId || fp.uuid || fp.fillingpointmetadata?.fillingPointId);
              return fpId === rowFpId && rowFpId !== "undefined" && rowFpId !== "null" && rowFpId !== "";
            });

            return (
              <Dropdown
                className="fsm-registry-dropdown"
                selected={selectedOption}
                option={allFillingPoints}
                select={(value) => onFillingPointSelect(row, value)}
                style={{ textAlign: "left" }}
                optionKey="fillingPointName"
                t={t}
              />
            );
          },
        },
      ];
    } else {
      return [
        {
          Header: t("WT_FILLING_POINT_NAME"),
          accessor: (row) => row?.fillingPointName || "NA",
          id: "fillingPointName",
          Cell: ({ row }) => (
            <span className="link">
              <Link to={`/digit-ui/employee/wt/add-filling-point-address?id=${row.original.id}`}>{row.original.fillingPointName || "NA"}</Link>
            </span>
          ),
        },
        {
          Header: t("WT_AE_NAME"),
          accessor: (row) => row?.aeName || "NA",
          id: "aeName",
        },
        {
          Header: t("WT_JE_NAME"),
          accessor: (row) => row?.jeName || "NA",
          id: "jeName",
        },
        {
          Header: t("WT_EE_NAME"),
          accessor: (row) => row?.eeName || "NA",
          id: "eeName",
        },
        {
          Header: t("WT_LOCALITY"),
          accessor: (row) => row?.address?.locality || "NA",
          id: "locality",
        },
      ];
    }
  }, [allFillingPoints, selectedTab, t]);

  const isMobile = window.Digit.Utils.browser.isMobile();

  return (
    <React.Fragment>
      <Card>
        {/* 🔹 Tabs + Add */}
        <div className="search-tabs-container" style={{ flexDirection: isMobile ? "column" : "row", gap: isMobile ? "16px" : "0" }}>
          <div>
            <button
              className={selectedTab === "FIXED_POINT" ? "search-tab-head-selected" : "search-tab-head"}
              onClick={() => onTabChange("FIXED_POINT")}
              style={{ width: isMobile ? "50%" : "auto" }}
            >
              {t("WT_FIXED_POINT")}
            </button>

            <button
              className={selectedTab === "FILLING_POINT" ? "search-tab-head-selected" : "search-tab-head"}
              onClick={() => onTabChange("FILLING_POINT")}
              style={{ width: isMobile ? "50%" : "auto" }}
            >
              {t("WT_FILLING_POINT")}
            </button>
          </div>

          <div className="action-bar-wrap-registry" style={{ alignSelf: isMobile ? "flex-end" : "auto" }}>
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
          <div
            style={{
              display: "flex",
              marginTop: "32px",
              justifyContent: isMobile ? "center" : "flex-end",
              flexDirection: isMobile ? "column-reverse" : "row",
              gap: "16px",
            }}
          >
            <span className="clear-search" onClick={clearSearch} style={{ alignSelf: "center" }}>
              {t("ES_COMMON_CLEAR_SEARCH")}
            </span>
            <SubmitBar label={t("ES_COMMON_SEARCH")} onSubmit={onSearch} />
          </div>
        </div>
      </Card>

      {/* 🔹 Table */}
      <Card>
        <Table
          key={allFillingPoints?.length > 0 ? "loaded" : "loading"}
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
          isLoading={isLoading || isAllFillingPointsLoading}
          isSearchRequired={false}
          isDownloadRequired={true}
          isFilterRequired={true}
          isSortRequired={true}
        />
      </Card>
      {toast && <Toast error={toast.error} label={toast.label} onClose={closeToast} />}
    </React.Fragment>
  );
};

export default SearchFillingPointAddress;
