import React, { useState } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader, RadioButtons, ActionBar, TickMark } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";

const AadhaarVerification = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const { kNumber, selectedOption } = location.state || { kNumber: "EKYC-1234567890", selectedOption: { code: "SELF", name: "EKYC_SELF" } };

    const [aadhaarLastFour, setAadhaarLastFour] = useState("");
    const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
    const [nameCorrect, setNameCorrect] = useState({ code: "NO", name: "CORE_COMMON_NO" });
    const [userName, setUserName] = useState("");
    const [mobileChange, setMobileChange] = useState({ code: "NO", name: "CORE_COMMON_NO" });
    const [mobileNumber, setMobileNumber] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [email, setEmail] = useState("");
    const [noOfPersons, setNoOfPersons] = useState("");

    const yesNoOptions = [
        { code: "YES", name: "CORE_COMMON_YES" },
        { code: "NO", name: "CORE_COMMON_NO" }
    ];

    const handleVerifyAadhaar = () => {
        // Simulating verification logic
        if (aadhaarLastFour.length === 4) {
            setIsAadhaarVerified(true);
        }
    };

    const handleSaveAndContinue = () => {
        history.push("/digit-ui/employee/ekyc/address-details");
    };

    const FingerprintIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.67-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.96.46 5.57 1.41.24.13.33.43.2.67-.09.13-.24.39-.39.39zM12 21c-.28 0-.5-.22-.5-.5v-4.42c-2.33-.21-4.44-1.35-5.94-3.21-1.5-1.86-2.22-4.18-2.02-6.52.05-.59.55-1.03 1.14-.98s1.03.55.98 1.14c-.15 1.76.39 3.51 1.52 4.91 1.12 1.4 2.7 2.26 4.45 2.42.21.02.37.19.37.4v6.26c0 .28-.22.5-.5.5zm4.83-9.17c-.59.05-1.03-.55-.98-1.14.39-4.59-2.03-8.86-6.17-10.87-.25-.12-.35-.43-.23-.68s.42-.36.67-.24c4.61 2.24 7.31 7 6.87 12.1-.05.27-.27.48-.54.5v.33z" fill="#505A5F" />
            <path d="M12 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-5.17-3.66c-.15 1.76.39 3.51 1.52 4.91 1.13 1.4 2.71 2.26 4.45 2.42.06 0 .11.01.17.01.24 0 .44-.17.48-.41.04-.27-.14-.53-.41-.58-1.46-.14-2.77-.85-3.71-2.01-.94-1.17-1.39-2.63-1.27-4.11.02-.28-.19-.51-.47-.53-.28-.02-.53.18-.55.46-.01.28.01.55.21.84z" fill="#505A5F" />
        </svg>
    );

    return (
        <div className="ekyc-employee-container">
            <div className="ekyc-aadhaar-verification-container" style={{ padding: "24px" }}>
                {/* <Header>{t("EKYC_AADHAAR_VERIFICATION_HEADER") || "Aadhaar Verification"}</Header> */}
                <Card className="ekyc-create-card">
                    <CardHeader>{t("EKYC_AADHAAR_NUMBER_HEADER") || "Aadhaar Number"}</CardHeader>
                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_LAST_4_DIGIT_AADHAAR") || "Last 4-Digit Aadhaar Number"}</CardLabel>
                        <div className="field" style={{ position: "relative" }}>
                            <TextInput
                                value={aadhaarLastFour}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length <= 4 && /^\d*$/.test(val)) {
                                        setAadhaarLastFour(val);
                                    }
                                }}
                                placeholder={t("EKYC_ENTER_LAST_4_DIGIT") || "Enter Last 4-digit Aadhaar number"}
                                textInputStyle={{ paddingLeft: "40px", borderRadius: "12px" }}
                                style={{ borderRadius: "12px" }}
                            />
                            <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                <FingerprintIcon />
                            </div>
                            {isAadhaarVerified && (
                                <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                    <TickMark fillColor="#00703C" />
                                </div>
                            )}
                        </div>
                    </LabelFieldPair>
                    {!isAadhaarVerified && (
                        <SubmitBar label={t("EKYC_VERIFY_AADHAAR_BTN") || "Verify Aadhaar"} onSubmit={handleVerifyAadhaar} style={{ borderRadius: "12px" }} />
                    )}

                    {isAadhaarVerified && (
                        <div style={{ backgroundColor: "#E7F4EE", padding: "20px", borderRadius: "12px", marginTop: "16px", marginBottom: "24px", border: "1px solid #D1E9DB" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                                <div style={{ backgroundColor: "#D1E9DB", padding: "4px", borderRadius: "50%", display: "flex" }}>
                                    <TickMark fillColor="#00703C" />
                                </div>
                                <span style={{ fontWeight: "700", color: "#00703C", fontSize: "18px" }}>{t("EKYC_AADHAAR_VERIFIED") || "Aadhaar Verified"}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ color: "#667085", fontSize: "14px", fontWeight: "500" }}>{t("EKYC_NAME") || "Name"}</span>
                                    <span style={{ fontWeight: "700", fontSize: "16px", color: "#101828" }}>Rajesh Kumar Singh</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ color: "#667085", fontSize: "14px", fontWeight: "500" }}>{t("EKYC_ADDRESS") || "Address"}</span>
                                    <span style={{ fontWeight: "400", fontSize: "16px", color: "#344054" }}>House No. 45, Sector 12, New Delhi - 110001</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <CardHeader style={{ marginTop: "24px" }}>{t("EKYC_CONTACT_DETAILS_HEADER") || "Contact Details"}</CardHeader>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_NAME_CORRECTION_PROMPT") || "Do you want to correct the Name?"}</CardLabel>
                        <RadioButtons
                            options={yesNoOptions}
                            optionsKey="name"
                            selectedOption={nameCorrect}
                            onSelect={setNameCorrect}
                            t={t}
                            innerStyles={{ display: "flex", gap: "24px", marginTop: "8px" }}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_ENTER_NAME") || "Enter Name"}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder={t("EKYC_ENTER_NAME_PLACEHOLDER") || "Enter Enter name"}
                                style={{ borderRadius: "12px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_MOBILE_CHANGE_PROMPT") || "Change your mobile number?"}</CardLabel>
                        <RadioButtons
                            options={yesNoOptions}
                            optionsKey="name"
                            selectedOption={mobileChange}
                            onSelect={setMobileChange}
                            t={t}
                            innerStyles={{ display: "flex", gap: "24px", marginTop: "8px" }}
                        />
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_MOBILE_NUMBER") || "Mobile Number"}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder={t("EKYC_ENTER_MOBILE_NUMBER") || "Enter Mobile number"}
                                style={{ borderRadius: "12px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_WHATSAPP_NUMBER") || "Whatsapp Number"}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                placeholder={t("EKYC_ENTER_WHATSAPP_NUMBER") || "Enter Whatsapp Number"}
                                style={{ borderRadius: "12px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_EMAIL_ADDRESS") || "Email address (Optional)"}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("EKYC_EMAIL_ADDRESS_PLACEHOLDER") || "Email address"}
                                style={{ borderRadius: "12px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <CardHeader style={{ marginTop: "24px" }}>{t("EKYC_FAMILY_DETAILS_HEADER") || "Family Details"}</CardHeader>
                    <LabelFieldPair>
                        <CardLabel style={{ marginBottom: "8px", fontWeight: "600" }}>{t("EKYC_NO_OF_PERSONS") || "No Of Persons"}</CardLabel>
                        <div className="field">
                            <TextInput
                                value={noOfPersons}
                                onChange={(e) => setNoOfPersons(e.target.value)}
                                placeholder={t("EKYC_ENTER_NO_OF_PERSONS") || "Enter No of Persons"}
                                style={{ borderRadius: "12px" }}
                            />
                        </div>
                    </LabelFieldPair>
                </Card>
            </div>

            <ActionBar>
                <SubmitBar label={t("ES_COMMON_SAVE_CONTINUE") || "Save & Continue"} onSubmit={handleSaveAndContinue} style={{ borderRadius: "12px" }} />
            </ActionBar>
        </div>
    );
};

export default AadhaarVerification;
