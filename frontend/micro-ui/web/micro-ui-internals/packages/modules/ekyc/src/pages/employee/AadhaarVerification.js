import React, { useState, useRef, Fragment } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader, RadioButtons, ActionBar, TickMark, HomeIcon, StatusTable, Row, ConnectingCheckPoints, CheckPoint } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import AddressDetails from "./AddressDetails";

// ─── Icons ──────────────────────────────────────────────────────────────────

const FingerprintIcon = ({ size = 22, color = "#6366f1" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.67-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.96.46 5.57 1.41.24.13.33.43.2.67-.09.13-.24.39-.39.39zM12 21c-.28 0-.5-.22-.5-.5v-4.42c-2.33-.21-4.44-1.35-5.94-3.21-1.5-1.86-2.22-4.18-2.02-6.52.05-.59.55-1.03 1.14-.98s1.03.55.98 1.14c-.15 1.76.39 3.51 1.52 4.91 1.12 1.4 2.7 2.26 4.45 2.42.21.02.37.19.37.4v6.26c0 .28-.22.5-.5.5z" fill={color} />
        <path d="M12 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill={color} />
    </svg>
);

const UserIcon = ({ size = 16, color = "#64748b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
    </svg>
);

const PhoneIcon = ({ size = 16, color = "#64748b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.6 19.79 19.79 0 0 0 3 1.82C3 .72 3.72 0 4.82 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const WhatsappIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#25D366" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MailIcon = ({ size = 16, color = "#64748b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M22 6l-10 7L2 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const UsersIcon = ({ size = 16, color = "#64748b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const AadhaarVerification = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const addressSectionRef = useRef(null);
    const { kNumber, selectedOption, connectionDetails } = location.state || {
        kNumber: "EKYC-1234567890",
        selectedOption: { code: "SELF", name: "EKYC_SELF" },
        connectionDetails: { connectionDetailsInfo: { consumerName: "Rajesh Kumar Singh", address: "House No. 45, Sector 12, New Delhi - 110001", phoneNumber: "9876543210", email: "rajesh.singh@example.com" } }
    };

    const [aadhaarLastFour, setAadhaarLastFour] = useState("");
    const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [nameCorrect, setNameCorrect] = useState({ code: "NO", name: "CORE_COMMON_NO" });
    const [userName, setUserName] = useState(connectionDetails?.connectionDetailsInfo?.consumerName || "");
    const [mobileChange, setMobileChange] = useState({ code: "NO", name: "CORE_COMMON_NO" });
    const [mobileNumber, setMobileNumber] = useState(connectionDetails?.connectionDetailsInfo?.phoneNumber || "");
    const [whatsappNumber, setWhatsappNumber] = useState(connectionDetails?.connectionDetailsInfo?.phoneNumber || "");
    const [email, setEmail] = useState(connectionDetails?.connectionDetailsInfo?.email || "");
    const [noOfPersons, setNoOfPersons] = useState("");

    // New states for single-page flow
    const [showAddressSection, setShowAddressSection] = useState(false);
    const [addressData, setAddressData] = useState(null);

    const yesNoOptions = [
        { code: "YES", name: "CORE_COMMON_YES" },
        { code: "NO", name: "CORE_COMMON_NO" }
    ];

    const handleVerifyAadhaar = () => {
        if (aadhaarLastFour.length === 4) {
            setIsVerifying(true);
            setTimeout(() => {
                setIsVerifying(false);
                setIsAadhaarVerified(true);
            }, 1200);
        }
    };

    const handleSaveAndContinueAadhaar = () => {
        setShowAddressSection(true);
        setTimeout(() => {
            addressSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleCompleteAll = (addressDetails) => {
        setAddressData(addressDetails);
        history.push("/digit-ui/employee/ekyc/property-info", {
            kNumber,
            selectedOption,
            connectionDetails,
            aadhaarDetails: { aadhaarLastFour, isAadhaarVerified, userName, mobileNumber, whatsappNumber, email, noOfPersons },
            addressDetails
        });
    };

    return (
        <div className="inbox-container">
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                @keyframes pulseGreen { 0%,100% { box-shadow:0 0 0 0 rgba(22,163,74,0.4); } 50% { box-shadow:0 0 0 8px rgba(22,163,74,0); } }
            `}</style>

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
                <div style={{ padding: "8px 16px" }}>
                    <ConnectingCheckPoints>
                        <CheckPoint label={t("EKYC_STEP_AADHAAR") || "Aadhaar"} isCompleted={showAddressSection} />
                        <CheckPoint label={t("EKYC_STEP_ADDRESS") || "Address"} isCompleted={addressData !== null} />
                        <CheckPoint label={t("EKYC_STEP_REVIEW") || "Review"} />
                    </ConnectingCheckPoints>
                </div>
            </div>

            <div style={{ flex: 1, marginLeft: "16px" }}>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <Header>{t("EKYC_AADHAAR_VERIFICATION_HEADER") || "Aadhaar Verification"}</Header>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#505A5F" }}>
                            {t("EKYC_K_NUMBER")}: <span style={{ color: "#0B0C0C" }}>{kNumber}</span>
                        </div>
                    </div>

                    {/* Section 1: Aadhaar Number */}
                    <CardHeader style={{ fontSize: "20px", marginBottom: "16px" }}>{t("EKYC_AADHAAR_NUMBER_HEADER") || "Aadhaar Number"}</CardHeader>

                    <LabelFieldPair>
                        <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_LAST_4_DIGIT_AADHAAR") || "Last 4-digit Aadhaar Number"}</CardLabel>
                        <div className="field" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                <FingerprintIcon size={20} />
                            </div>
                            <TextInput
                                value={aadhaarLastFour}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length <= 4 && /^\d*$/.test(val)) setAadhaarLastFour(val);
                                }}
                                placeholder={t("EKYC_ENTER_LAST_4_DIGIT") || "Enter last 4 digits"}
                                textInputStyle={{ paddingLeft: "40px" }}
                                maxLength={4}
                            />
                            {isAadhaarVerified && (
                                <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
                                    <TickMark fillColor="#00703C" />
                                </div>
                            )}
                        </div>
                    </LabelFieldPair>

                    {!isAadhaarVerified && (
                        <SubmitBar
                            label={isVerifying ? t("EKYC_VERIFYING") || "Verifying..." : t("EKYC_VERIFY_AADHAAR_BTN") || "Verify Aadhaar"}
                            onSubmit={handleVerifyAadhaar}
                            disabled={aadhaarLastFour.length !== 4 || isVerifying}
                            style={{ marginTop: "16px", opacity: aadhaarLastFour.length !== 4 ? 0.6 : 1 }}
                        />
                    )}

                    {isAadhaarVerified && (
                        <div style={{ backgroundColor: "#E7F4EE", padding: "20px", borderRadius: "8px", marginTop: "24px", marginBottom: "24px", border: "1px solid #D1E9DB", animation: "fadeSlideIn 0.4s ease" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                                <div style={{ backgroundColor: "#D1E9DB", padding: "4px", borderRadius: "50%", display: "flex", animation: "pulseGreen 2s ease infinite" }}>
                                    <TickMark fillColor="#00703C" />
                                </div>
                                <span style={{ fontWeight: "700", color: "#00703C", fontSize: "18px" }}>{t("EKYC_AADHAAR_VERIFIED_SUCCESS") || "Aadhaar Verified Successfully"}</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ color: "#667085", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>{t("EKYC_NAME")}</span>
                                    <span style={{ fontWeight: "700", fontSize: "16px", color: "#101828" }}>Rajesh Kumar Singh</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ color: "#667085", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>{t("EKYC_AADHAAR")}</span>
                                    <span style={{ fontWeight: "700", fontSize: "16px", color: "#101828" }}>XXXX XXXX {aadhaarLastFour}</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gridColumn: "span 2" }}>
                                    <span style={{ color: "#667085", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>{t("EKYC_ADDRESS")}</span>
                                    <span style={{ fontWeight: "500", fontSize: "15px", color: "#344054" }}>House No. 45, Sector 12, New Delhi - 110001</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <hr style={{ margin: "32px 0", border: "0", borderTop: "1px solid #EAECF0" }} />

                    {/* Section 2: Contact Details */}
                    <CardHeader style={{ fontSize: "20px", marginBottom: "16px" }}>{t("EKYC_CONTACT_DETAILS_HEADER") || "Contact Details"}</CardHeader>
                    <LabelFieldPair style={{ animation: "fadeSlideIn 0.3s ease" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <CardLabel style={{ fontWeight: "600", marginBottom: "0" }}>
                                {t("EKYC_USER_NAME") || "Corrected Name"}
                            </CardLabel>

                            <RadioButtons
                                options={yesNoOptions}
                                optionsKey="name"
                                selectedOption={nameCorrect}
                                onSelect={setNameCorrect}
                                t={t}
                                innerStyles={{ display: "flex", gap: "24px" }}
                                style={{ display: "flex", gap: "50px", marginBottom: "0" }}
                            />
                        </div>
                        <div className="field" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: nameCorrect.code === "YES" ? 0.6 : 0.3 }}>
                                <UserIcon size={18} color={nameCorrect.code === "YES" ? "#64748b" : "#94a3b8"} />
                            </div>
                            <TextInput
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder={t("EKYC_ENTER_NAME_PLACEHOLDER") || "Enter full name"}
                                textInputStyle={{ paddingLeft: "40px" }}
                                disabled={nameCorrect.code !== "YES"}
                            />
                        </div>
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "10px" }}>
                            <CardLabel style={{ fontWeight: "600", marginBottom: "0" }}>
                                {t("EKYC_USER_MOBILE_NUMBER") || "User Mobile Number"}
                            </CardLabel>

                            <RadioButtons
                                options={yesNoOptions}
                                optionsKey="name"
                                selectedOption={mobileChange}
                                onSelect={setMobileChange}
                                t={t}
                                innerStyles={{ display: "flex", gap: "24px" }}
                                style={{ display: "flex", gap: "50px", marginBottom: "0" }}
                            />
                        </div>
                        <div className="field" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: mobileChange.code === "YES" ? 0.6 : 0.3 }}>
                                <PhoneIcon size={18} color={mobileChange.code === "YES" ? "#64748b" : "#94a3b8"} />
                            </div>
                            <TextInput
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="+91 XXXXX XXXXX"
                                textInputStyle={{ paddingLeft: "40px" }}
                                disabled={mobileChange.code !== "YES"}
                            />
                        </div>
                    </LabelFieldPair>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
                        <LabelFieldPair>
                            <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_WHATSAPP_NUMBER") || "WhatsApp Number"}</CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                    <WhatsappIcon size={18} />
                                </div>
                                <TextInput
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    placeholder="+91 XXXXX XXXXX"
                                    textInputStyle={{ paddingLeft: "40px" }}
                                />
                            </div>
                        </LabelFieldPair>
                        <LabelFieldPair>
                            <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_EMAIL_ADDRESS") || "Email Address"} <span style={{ fontWeight: "400", color: "#667085" }}>({t("EKYC_OPTIONAL") || "Optional"})</span></CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                    <MailIcon size={18} />
                                </div>
                                <TextInput
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("EKYC_EMAIL_ADDRESS_PLACEHOLDER") || "example@email.com"}
                                    textInputStyle={{ paddingLeft: "40px" }}
                                />
                            </div>
                        </LabelFieldPair>
                    </div>

                    <hr style={{ margin: "32px 0", border: "0", borderTop: "1px solid #EAECF0" }} />

                    {/* Section 3: Family Details */}
                    <CardHeader style={{ fontSize: "20px", marginBottom: "16px" }}>{t("EKYC_FAMILY_DETAILS_HEADER") || "Family Details"}</CardHeader>

                    <LabelFieldPair>
                        <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_NO_OF_PERSONS") || "Number of Family Members"}</CardLabel>
                        <div className="field" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                <UsersIcon size={18} />
                            </div>
                            <TextInput
                                value={noOfPersons}
                                onChange={(e) => { if (/^\d*$/.test(e.target.value)) setNoOfPersons(e.target.value); }}
                                placeholder={t("EKYC_ENTER_NO_OF_PERSONS") || "Enter total number of persons"}
                                textInputStyle={{ paddingLeft: "40px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    {!showAddressSection && (
                        <ActionBar>
                            <SubmitBar label={t("ES_COMMON_SAVE_CONTINUE") || "Save & Continue"} onSubmit={handleSaveAndContinueAadhaar} />
                        </ActionBar>
                    )}

                    {showAddressSection && (
                        <div ref={addressSectionRef}>
                            <AddressDetails
                                isSection={true}
                                onComplete={handleCompleteAll}
                                parentState={{ kNumber, selectedOption, connectionDetails }}
                            />
                        </div>
                    )}

                    <div style={{ textAlign: "center", marginTop: "24px" }}>
                        <p style={{ fontSize: "12px", color: "#667085", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                                <path d="M12 11V17M12 7H12.01" strokeLinecap="round" />
                            </svg>
                            {t("EKYC_SECURE_DATA_NOTICE") || "Your data is encrypted and secure"}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AadhaarVerification;