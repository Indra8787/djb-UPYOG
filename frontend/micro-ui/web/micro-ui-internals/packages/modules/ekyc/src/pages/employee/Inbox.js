import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const MOCK_DATA_ITEMS = [
    { applicationNumber: "EKYC-2024-001", citizenName: "Rahul Sharma", mobileNumber: "9876543210", status: "COMPLETED" },
    { applicationNumber: "EKYC-2024-002", citizenName: "Anjali Devi", mobileNumber: "9123456789", status: "PENDING" },
    { applicationNumber: "EKYC-2024-003", citizenName: "Amit Kumar", mobileNumber: "8888888888", status: "REJECTED" },
    { applicationNumber: "EKYC-2024-004", citizenName: "Priya Singh", mobileNumber: "7777777777", status: "COMPLETED" },
    { applicationNumber: "EKYC-2024-005", citizenName: "Suresh Gupta", mobileNumber: "6666666666", status: "PENDING" },
];

const Inbox = ({
    parentRoute,
    businessService = "EKYC",
    initialStates = {},
    filterComponent,
    isInbox,
}) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();

    // 1. Unified State Management
    const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
    const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
    const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: true }]);

    // Define the default option for the dropdown
    const defaultStatusOption = useMemo(() => ({ label: t("EKYC_STATUS_ALL"), value: "" }), [t]);

    // Maintain the full search objects for the Search component
    const [searchParams, setSearchParams] = useState(initialStates.searchParams || { status: defaultStatusOption });

    // 2. Local Filtering Logic for Static Data
    const filteredStaticData = useMemo(() => {
        return MOCK_DATA_ITEMS.filter((item) => {
            let match = true;
            // Extract the string value from the status object if it exists
            const currentStatus = searchParams.status?.value !== undefined ? searchParams.status.value : searchParams.status;

            if (currentStatus && item.status !== currentStatus) {
                match = false;
            }
            return match;
        });
    }, [searchParams]);

    const staticCountData = useMemo(() => {
        return {
            total: MOCK_DATA_ITEMS.length,
            completed: MOCK_DATA_ITEMS.filter(i => i.status === "COMPLETED").length,
            pending: MOCK_DATA_ITEMS.filter(i => i.status === "PENDING").length,
            rejected: MOCK_DATA_ITEMS.filter(i => i.status === "REJECTED").length
        };
    }, []);

    // 3. Handlers
    const handleSearch = useCallback((filterParam) => {
        // Here we keep the full objects (like for dropdowns) in searchParams
        // so that the Search component can display them correctly.
        setSearchParams((prev) => ({ ...prev, ...filterParam }));
        setPageOffset(0);
    }, []);

    const fetchNextPage = () => setPageOffset((prev) => prev + pageSize);
    const fetchPrevPage = () => setPageOffset((prev) => Math.max(prev - pageSize, 0));

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        setPageOffset(0);
    };

    const handleSort = useCallback((args) => {
        if (args.length > 0) setSortParams(args);
    }, []);

    // 4. Form Configuration
    const searchFields = useMemo(() => [
        {
            label: t("EKYC_STATUS"),
            name: "status",
            type: "dropdown",
            options: [
                { label: t("CHOOSE_STATUS"), value: "" },
                { label: t("EKYC_STATUS_COMPLETED"), value: "COMPLETED" },
                { label: t("EKYC_STATUS_PENDING"), value: "PENDING" },
                { label: t("EKYC_STATUS_REJECTED"), value: "REJECTED" },
            ],
            optionsKey: "label"
        },
    ], [t]);

    return (
        <div className="ekyc-employee-container">
            <div className="inbox-main-container">
                {Digit.Utils.browser.isMobile() ? (
                    <MobileInbox
                        data={{ items: filteredStaticData, totalCount: filteredStaticData.length }}
                        isLoading={false}
                        onSearch={handleSearch}
                        searchFields={searchFields}
                        searchParams={searchParams}
                        parentRoute={parentRoute}
                        countData={staticCountData}
                    />
                ) : (
                    <DesktopInbox
                        businessService={businessService}
                        data={{ items: filteredStaticData, totalCount: filteredStaticData.length }}
                        isLoading={false}
                        searchFields={searchFields}
                        onSearch={handleSearch}
                        onSort={handleSort}
                        onNextPage={fetchNextPage}
                        onPrevPage={fetchPrevPage}
                        currentPage={Math.floor(pageOffset / pageSize)}
                        pageSizeLimit={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        parentRoute={parentRoute}
                        searchParams={searchParams}
                        sortParams={sortParams}
                        totalRecords={filteredStaticData.length}
                        countData={staticCountData}
                    />
                )}
            </div>
        </div>
    );
};

export default Inbox;