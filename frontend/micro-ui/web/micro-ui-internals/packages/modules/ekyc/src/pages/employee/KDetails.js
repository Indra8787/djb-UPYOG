import React, { useState } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader, StatusTable, Row, ActionBar, Modal, RadioButtons } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";

const KDetails = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const { path } = useRouteMatch();
    const { kNumber, kName } = location.state || { kNumber: "EKYC-12345", kName: "Mock Name" };

    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState({ code: "SELF", name: "EKYC_SELF" });

    const options = [
        { code: "SELF", name: "EKYC_SELF" },
        { code: "OTHER", name: "EKYC_OTHER" }
    ];

    // Mock connection details
    const connectionDetails = {
        consumerName: "Rahul Sharma",
        address: "123, Street Name, City",
        connectionType: "Domestic",
        meterNo: "MTR-987654",
        phoneNo: "9876543210",
        email: "rahul@example.com",
        status: "ACTIVE"
    };

    const handleStartVerification = () => {
        setShowModal(true);
    };

    const onModalConfirm = () => {
        const parentPath = path.replace("/k-details", "");
        history.push(`${parentPath}/aadhaar-verification`, { kNumber, selectedOption });
        setShowModal(false);
    };

    const handleRaiseCorrection = () => {
        console.log("Raise Correction clicked");
    };

    return (
        <div className="ekyc-employee-container">
            <div className="ekyc-kdetails-container" style={{ padding: "24px" }}>
                {/* <Header>{t("EKYC_K_DETAILS_HEADER")}</Header> */}
                <Card className="ekyc-create-card">
                    <CardHeader>{t("EKYC_K_NUMBER_DETAILS")}</CardHeader>
                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_K_NUMBER")}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={kNumber}
                                disable={true}
                                style={{ borderRadius: "12px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <CardHeader style={{ marginTop: "24px" }}>{t("EKYC_CONNECTION_DETAILS")}</CardHeader>
                    <StatusTable>
                        <Row label={t("EKYC_CONSUMER_NAME")} text={connectionDetails.consumerName} />
                        <Row label={t("EKYC_ADDRESS")} text={connectionDetails.address} />
                        <Row label={t("EKYC_CONNECTION_TYPE")} text={connectionDetails.connectionType} />
                        <Row label={t("EKYC_METER_NO")} text={connectionDetails.meterNo} />
                        <Row label={t("EKYC_PHONE_NO")} text={connectionDetails.phoneNo} />
                        <Row label={t("EKYC_EMAIL")} text={connectionDetails.email} />
                        <Row label={t("EKYC_STATUS")} text={connectionDetails.status} />
                    </StatusTable>
                </Card>
            </div>

            <ActionBar>
                <SubmitBar label={t("EKYC_START_VERIFICATION")} onSubmit={handleStartVerification} style={{ borderRadius: "12px" }} />
                <button
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
                </button>
            </ActionBar>

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
                            t={t}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default KDetails;
