import React, { useState } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader, ActionBar } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";

const Create = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { path } = useRouteMatch();
    const [kNumber, setKNumber] = useState("");
    const [kName, setKName] = useState("");

    const handleContinue = () => {
        // Redirect to K details page, passing the K number as state or param
        const parentPath = path.replace("/create-kyc", "");
        history.push(`${parentPath}/k-details`, { kNumber, kName });
    };

    return (
        <div className="ekyc-employee-container">
            <div className="ekyc-create-container" style={{ padding: "24px" }}>
                {/* <Header>{t("EKYC_CREATE_KYC_HEADER")}</Header> */}
                <Card className="ekyc-create-card">
                    <CardHeader>{t("EKYC_ENTER_DETAILS_HEADER")}</CardHeader>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_K_NUMBER")}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={kNumber}
                                onChange={(e) => setKNumber(e.target.value)}
                                placeholder={t("EKYC_K_NUMBER_PLACEHOLDER")}
                                style={{ borderRadius: "8px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_K_NAME")}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={kName}
                                onChange={(e) => setKName(e.target.value)}
                                placeholder={t("EKYC_K_NAME_PLACEHOLDER")}
                                style={{ borderRadius: "12px" }}
                            />
                        </div>
                    </LabelFieldPair>
                </Card>
                <ActionBar>
                    <SubmitBar label={t("ES_COMMON_CONTINUE")} onSubmit={handleContinue} style={{ borderRadius: "8px" }} />
                </ActionBar>
            </div>
        </div>
    );
};

export default Create;
