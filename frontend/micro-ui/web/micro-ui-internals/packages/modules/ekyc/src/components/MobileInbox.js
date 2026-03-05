import React from "react";
import { useTranslation } from "react-i18next";
import { Header, Card, SubmitBar, DetailsCard, Loader } from "@djb25/digit-ui-react-components";
import { Link } from "react-router-dom";
import SearchApplication from "./Search";
import StatusCards from "./StatusCards";

const MobileInbox = ({
    data,
    isLoading,
    onSearch,
    searchFields,
    searchParams,
    parentRoute,
    countData,
}) => {
    const { t } = useTranslation();

    const mobileData = data?.items?.map((item) => ({
        [t("EKYC_APPLICATION_NO")]: item.applicationNumber,
        [t("EKYC_CITIZEN_NAME")]: item.citizenName,
        [t("EKYC_MOBILE_NO")]: item.mobileNumber,
        [t("EKYC_STATUS")]: (
            <span className={`ekyc-status-tag ${item.status}`}>
                {t(`EKYC_STATUS_${item.status}`)}
            </span>
        ),
    })) || [];

    return (
        <div className="inbox-wrapper">
            <div className="ekyc-header-container module-header">
                <Header className="title">{t("EKYC_INBOX_HEADER")}</Header>
                <Link to={`${parentRoute}/create-kyc`}>
                    <SubmitBar label={t("EKYC_CREATE_KYC")} />
                </Link>
            </div>

            <div className="ekyc-metrics-section">
                <StatusCards countData={countData} />
            </div>

            <Card className="ekyc-search-card">
                <SearchApplication
                    onSearch={onSearch}
                    searchFields={searchFields}
                    searchParams={searchParams}
                />
            </Card>

            <div className="mobile-data-container">
                {isLoading ? (
                    <Loader />
                ) : mobileData?.length > 0 ? (
                    <DetailsCard
                        data={mobileData}
                        t={t}
                        serviceRequestIdKey={t("EKYC_APPLICATION_NO")}
                        linkPrefix={`${parentRoute}/application-details/`}
                    />
                ) : (
                    <Card>
                        {t("ES_COMMON_NO_DATA")
                            .split("\\n")
                            .map((text, index) => (
                                <p key={index} style={{ textAlign: "center" }}>
                                    {text}
                                </p>
                            ))}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default MobileInbox;
