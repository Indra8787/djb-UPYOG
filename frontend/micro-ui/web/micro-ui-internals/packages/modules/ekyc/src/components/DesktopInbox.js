import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Table, SubmitBar, Header, Card } from "@djb25/digit-ui-react-components";
import { Link } from "react-router-dom";
import SearchApplication from "./Search";
import StatusCards from "./StatusCards";

const DesktopInbox = ({
    data,
    isLoading,
    onSort,
    onNextPage,
    onPrevPage,
    currentPage,
    pageSizeLimit,
    onPageSizeChange,
    parentRoute,
    searchParams,
    sortParams,
    totalRecords,
    countData,
    onSearch,
    searchFields,
}) => {
    const { t } = useTranslation();

    const columns = useMemo(
        () => [
            {
                Header: t("EKYC_APPLICATION_NO"),
                accessor: "applicationNumber",
                Cell: ({ row }) => {
                    const applicationNumber = row.original?.applicationNumber || "NA";
                    return (
                        <Link to={`${parentRoute}/application-details/${applicationNumber}`}>
                            <span className="ekyc-application-link">
                                {applicationNumber}
                            </span>
                        </Link>
                    );
                },
            },
            {
                Header: t("EKYC_CITIZEN_NAME"),
                accessor: "citizenName",
                Cell: ({ row }) => <span>{row.original?.citizenName || "NA"}</span>
            },
            {
                Header: t("EKYC_MOBILE_NO"),
                accessor: "mobileNumber",
                Cell: ({ row }) => <span>{row.original?.mobileNumber || "NA"}</span>
            },
            {
                Header: t("EKYC_STATUS"),
                accessor: "status",
                Cell: ({ row }) => {
                    const status = row.original?.status || "DEFAULT";
                    return (
                        <span className={`ekyc-status-tag ${status}`}>
                            {t(`EKYC_STATUS_${status}`)}
                        </span>
                    );
                },
            },
        ],
        [t, parentRoute]
    );

    const tableData = useMemo(() => {
        return data?.items || [];
    }, [data]);

    return (
        <div className="inbox-wrapper">
            {/* Top Bar: Header + Action Button */}
            <div className="ekyc-header-container module-header">
                <Header className="title">{t("EKYC_INBOX_HEADER")}</Header>
                <Link to={`${parentRoute}/create-kyc`}>
                    <SubmitBar label={t("EKYC_CREATE_KYC")} style={{ borderRadius: "8px" }} />
                </Link>
            </div>

            {/* Metrics Section */}
            <div className="ekyc-metrics-section">
                <StatusCards countData={countData} />
            </div>

            {/* Search Section */}
            <Card className="ekyc-search-card">
                <SearchApplication
                    onSearch={onSearch}
                    searchFields={searchFields}
                    searchParams={searchParams}
                />
            </Card>

            {/* Table Section */}
            <Card className="ekyc-table-card">
                <Table
                    t={t}
                    data={tableData}
                    columns={columns}
                    isLoading={isLoading}
                    onSort={onSort}
                    sortParams={sortParams}
                    totalRecords={totalRecords}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                    currentPage={currentPage}
                    pageSizeLimit={pageSizeLimit}
                    onPageSizeChange={onPageSizeChange}
                    getCellProps={(cellInfo) => {
                        return {
                            className: "ekyc-table-cell"
                        };
                    }}
                />
            </Card>
        </div>
    );
};

export default DesktopInbox;