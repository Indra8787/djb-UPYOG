import React from "react";
import { Header, Card, CardHeader, StatusTable, Row, SubmitBar, HomeIcon, ConnectingCheckPoints, CheckPoint, ActionBar } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const Review = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();

    // Catch data from previous steps via the router state
    const {
        kNumber = "NA",
        aadhaarDetails = {},
        addressDetails = {},
        propertyDetails = {}
    } = location.state || {};

    const handleSubmit = () => {
        // Here to mimic final submit and go to dashboard/inbox
        history.push("/digit-ui/employee/ekyc/dashboard");
    };

    const handleEditAadhaar = () => {
        history.push("/digit-ui/employee/ekyc/aadhaar-verification", location.state);
    };

    const handleEditAddress = () => {
        history.push("/digit-ui/employee/ekyc/address-details", location.state);
    };

    const handleEditProperty = () => {
        history.push("/digit-ui/employee/ekyc/property-info", location.state);
    };

    return (
        <div className="inbox-container">
            <div className="filters-container">
                {/* Sidebar Title Card */}
                <Card className="sidebar-title-card" style={{ display: "flex", alignItems: "center", padding: "16px", marginBottom: "16px", borderRadius: "4px" }}>
                    <div className="icon-container" style={{ color: "#0068faff", marginRight: "12px" }}>
                        <HomeIcon style={{ width: "24px", height: "24px" }} />
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "18px", color: "#0B0C0C" }}>
                        {t("EKYC_PROCESS")}
                    </div>
                </Card>

                {/* Progress Steps Sidebar */}
                <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "8px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                    <ConnectingCheckPoints>
                        <CheckPoint label={t("EKYC_STEP_AADHAAR") || "Aadhaar"} isCompleted={true} />
                        <CheckPoint label={t("EKYC_STEP_ADDRESS") || "Address"} isCompleted={true} />
                        <CheckPoint label={t("EKYC_STEP_PROPERTY") || "Property"} isCompleted={true} />
                        <CheckPoint label={t("EKYC_STEP_REVIEW") || "Review"} isCompleted={false} />
                    </ConnectingCheckPoints>
                </div>
            </div>

            <div style={{ flex: 1, marginLeft: "16px" }}>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <Header>{t("EKYC_REVIEW_DETAILS") || "Review Details"}</Header>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#505A5F" }}>
                            {t("EKYC_K_NUMBER")}: <span style={{ color: "#0B0C0C" }}>{kNumber}</span>
                        </div>
                    </div>

                    {/* Aadhaar Details Card */}
                    <Card style={{ padding: "24px", marginBottom: "24px", borderRadius: "12px", border: "1px solid #EAECF0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <CardHeader style={{ margin: 0, fontSize: "18px", color: "#0B0C0C" }}>{t("EKYC_AADHAAR_VERIFICATION_HEADER") || "Aadhaar Details"}</CardHeader>
                            <span onClick={handleEditAadhaar} style={{ color: "#F47738", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>{t("CS_COMMON_EDIT")}</span>
                        </div>
                        <StatusTable>
                            <Row label={t("EKYC_NAME")} text={aadhaarDetails.userName || "Rajesh Kumar Singh"} />
                            <Row label={t("EKYC_AADHAAR")} text={aadhaarDetails.aadhaarLastFour ? `XXXX XXXX ${aadhaarDetails.aadhaarLastFour}` : t("CS_NA")} />
                            <Row label={t("EKYC_MOBILE_NO")} text={aadhaarDetails.mobileNumber || t("CS_NA")} />
                            <Row label={t("EKYC_EMAIL_ADDRESS")} text={aadhaarDetails.email || t("CS_NA")} />
                        </StatusTable>
                    </Card>

                    {/* Address Details Card */}
                    <Card style={{ padding: "24px", marginBottom: "24px", borderRadius: "12px", border: "1px solid #EAECF0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <CardHeader style={{ margin: 0, fontSize: "18px", color: "#0B0C0C" }}>{t("EKYC_ADDRESS_DETAILS_HEADER") || "Address Details"}</CardHeader>
                            <span onClick={handleEditAddress} style={{ color: "#F47738", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>{t("CS_COMMON_EDIT")}</span>
                        </div>
                        <StatusTable>
                            <Row label={t("EKYC_FULL_ADDRESS")} text={addressDetails.fullAddress || "H.No. 123, Sector 15, Rohini"} />
                            <Row label={t("EKYC_PINCODE")} text={addressDetails.pincode || "110085"} />
                        </StatusTable>
                    </Card>

                    {/* Property Details Card */}
                    <Card style={{ padding: "24px", marginBottom: "24px", borderRadius: "12px", border: "1px solid #EAECF0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <CardHeader style={{ margin: 0, fontSize: "18px", color: "#0B0C0C" }}>{t("EKYC_PROPERTY_INFO") || "Property Information"}</CardHeader>
                            <span onClick={handleEditProperty} style={{ color: "#F47738", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>{t("CS_COMMON_EDIT")}</span>
                        </div>
                        <StatusTable>
                            <Row label={t("Property_Owner")} text={propertyDetails.ownerType || "OWNER"} />
                            <Row label={t("PID_Number")} text={propertyDetails.pidNumber || t("CS_NA")} />
                            <Row label={t("Type_of_Connection")} text={propertyDetails.connectionType?.label || t("CS_NA")} />
                            <Row label={t("Connection_Category")} text={propertyDetails.connectionCategory?.label || t("CS_NA")} />
                        </StatusTable>
                    </Card>

                    <ActionBar>
                        <SubmitBar label={t("ES_COMMON_SUBMIT") || "Submit"} onSubmit={handleSubmit} />
                    </ActionBar>
                </Card>
            </div>
        </div>
    );
};

export default Review;
