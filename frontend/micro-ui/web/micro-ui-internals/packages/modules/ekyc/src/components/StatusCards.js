import React from "react";
import { Card } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const StatusCards = ({ countData }) => {
    const { t } = useTranslation();

    const cardStyle = {
        flex: 1,
        textAlign: "center",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #EAECF0"
    };

    return (
        <div className="ekyc-status-container">
            <Card className="ekyc-status-card">
                <div className="count">{countData?.total || 0}</div>
                <div className="label">{t("EKYC_TOTAL")}</div>
            </Card>
            <Card className="ekyc-status-card">
                <div className="count pending">{countData?.pending || 0}</div>
                <div className="label">{t("EKYC_PENDING")}</div>
            </Card>
            <Card className="ekyc-status-card">
                <div className="count completed">{countData?.completed || 0}</div>
                <div className="label">{t("EKYC_COMPLETED")}</div>
            </Card>
        </div>
    );
};

export default StatusCards;
