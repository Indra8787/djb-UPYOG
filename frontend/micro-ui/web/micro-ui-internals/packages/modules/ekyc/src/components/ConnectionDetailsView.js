import React, { useState } from "react";
import { Card, CardHeader, StatusTable, Row, ActionBar, Modal, RadioButtons, Loader, CardLabel, SubmitBar } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";

const ConnectionDetailsView = ({ kNumber, kName, connectionDetails, isLoading }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { path } = useRouteMatch();

    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState({ code: "SELF", name: "EKYC_SELF" });

    const options = [
        { code: "SELF", name: "EKYC_SELF" },
        { code: "OTHER", name: "EKYC_OTHER" }
    ];

    const handleStartVerification = () => {
        setShowModal(true);
    };

    const onModalConfirm = () => {
        // Correctly handle redirection from create-kyc or dashboard
        const parentPath = path.includes("/create-kyc") ? path.replace("/create-kyc", "") : path.replace("/k-details", "");
        history.push(`${parentPath}/aadhaar-verification`, { kNumber, selectedOption, connectionDetails });
        setShowModal(false);
    };

    const handleRaiseCorrection = () => {
        console.log("Raise Correction clicked");
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!connectionDetails) {
        return null;
    }

    return (
        <React.Fragment>
            <Card className="ekyc-create-card" style={{ padding: "24px" }}>
                <CardHeader>{t("EKYC_K_NUMBER_DETAILS")}</CardHeader>
                <StatusTable>
                    <Row label={t("EKYC_K_NUMBER")} text={kNumber || t("CS_NA")} />
                    <Row label={t("EKYC_K_NAME")} text={kName || t("CS_NA")} />
                </StatusTable>

                <CardHeader style={{ marginTop: "24px" }}>{t("EKYC_CONNECTION_DETAILS")}</CardHeader>
                {connectionDetails?.connectionDetailsInfo ? (
                    <StatusTable>
                        <Row label={t("EKYC_CONSUMER_NAME")} text={connectionDetails.connectionDetailsInfo.consumerName || t("CS_NA")} />
                        <Row label={t("EKYC_ADDRESS")} text={connectionDetails.connectionDetailsInfo.address || t("CS_NA")} />
                        <Row label={t("EKYC_CONNECTION_TYPE")} text={connectionDetails.connectionDetailsInfo.connectionType || t("CS_NA")} />
                        <Row label={t("EKYC_METER_NO")} text={connectionDetails.connectionDetailsInfo.meterNumber || t("CS_NA")} />
                        <Row label={t("EKYC_PHONE_NO")} text={connectionDetails.connectionDetailsInfo.phoneNumber || t("CS_NA")} />
                        <Row label={t("EKYC_EMAIL")} text={connectionDetails.connectionDetailsInfo.email || t("CS_NA")} />
                        <Row label={t("EKYC_STATUS")} text={connectionDetails.connectionDetailsInfo.statusflag || t("CS_NA")} />
                    </StatusTable>
                ) : (
                    <CardLabel>{t("EKYC_NO_CONNECTION_DETAILS_FOUND")}</CardLabel>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                    <SubmitBar label={t("EKYC_START_VERIFICATION")} onSubmit={handleStartVerification} style={{ borderRadius: "12px", margin: 0 }} />
                </div>
                {/* <button
                    className="submit-bar"
                    style={{
                        marginLeft: "10px",
                        background: "#f47738",
                        border: "none",
                        color: "#fff",
                        padding: "10px 24px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                    onClick={handleRaiseCorrection}
                >
                    {t("EKYC_RAISE_CORRECTION")}
                </button> */}
            </Card>

            {showModal && (
                <Modal
                    headerBarMain={t("EKYC_SELECT_VERIFICATION_TYPE")}
                    headerBarEnd={<span onClick={() => setShowModal(false)} style={{ cursor: "pointer", padding: "8px" }}>X</span>}
                    actionSaveLabel={t("ES_COMMON_CONFIRM")}
                    actionSaveOnSubmit={onModalConfirm}
                    actionCancelLabel={t("ES_COMMON_CANCEL")}
                    actionCancelOnSubmit={() => setShowModal(false)}
                    style={{ borderRadius: "12px" }}
                >
                    <div style={{ padding: "24px" }}>
                        <RadioButtons
                            options={options}
                            optionsKey="name"
                            selectedOption={selectedOption}
                            onSelect={setSelectedOption}
                            style={{ display: "flex", flexDirection: "column", gap: "12px", buttonStyle: { borderRadius: "5px" } }}
                            t={t}
                        />
                    </div>
                </Modal>
            )}
        </React.Fragment>
    );
};

export default ConnectionDetailsView;
