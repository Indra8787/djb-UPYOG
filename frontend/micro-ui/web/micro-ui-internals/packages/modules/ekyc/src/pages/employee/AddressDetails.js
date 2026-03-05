import React, { useState } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader, RadioButtons, ActionBar, InfoBannerIcon, PropertyHouse, LocationIcon } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const AddressDetails = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const [addressType, setAddressType] = useState({ code: "AADHAAR", name: "EKYC_AADHAAR_ADDRESS" });
    const [correctAddress, setCorrectAddress] = useState({ code: "NO", name: "CORE_COMMON_NO" });
    const [fullAddress, setFullAddress] = useState("");
    const [flatNo, setFlatNo] = useState("");
    const [building, setBuilding] = useState("");
    const [landmark, setLandmark] = useState("");
    const [pincode, setPincode] = useState("");

    const addressOptions = [
        { code: "AADHAAR", name: "EKYC_AADHAAR_ADDRESS" },
        { code: "OLD", name: "EKYC_OLD_ADDRESS" }
    ];

    const yesNoOptions = [
        { code: "YES", name: "CORE_COMMON_YES" },
        { code: "NO", name: "CORE_COMMON_NO" }
    ];

    const handleCompleteVerification = () => {
        console.log("Verification Completed");
        // Logic for completion
    };

    const FlagIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4 6L13.6 4H5V21H7V14H12.6L13.4 16H20V6H14.4Z" fill="#00703C" />
        </svg>
    );

    const IdCardIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5H4C2.9 5 2 5.9 2 7ZM12 11H14V13H12V11ZM12 7H14V9H12V7ZM16 11H20V13H16V11ZM16 7H20V9H16V7ZM4 7H10V15H4V7ZM20 17H4V16H20V17Z" fill="#3D51B0" />
        </svg>
    );

    const CameraIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#3D51B0" />
        </svg>
    );

    const TargetIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="#3D51B0" />
        </svg>
    );

    const PincodeIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 13V11H15V13H13ZM13 9V7H15V9H13ZM17 13V11H19V13H17ZM17 9V7H19V9H17ZM11 13V11H9V13H11ZM11 9V7H9V9H11ZM7 13V11H5V13H7ZM7 9V7H5V9H7ZM21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="#3D51B0" />
        </svg>
    );

    return (
        <div className="ekyc-address-details-container">
            <Header>{t("EKYC_ADDRESS_DETAILS_HEADER") || "Address Details"}</Header>
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <RadioButtons
                        options={addressOptions}
                        optionsKey="name"
                        selectedOption={addressType}
                        onSelect={setAddressType}
                        t={t}
                        innerStyles={{ display: "flex", gap: "10px", width: "100%" }}
                        style={{ width: "48%" }}
                    />
                </div>

                {addressType.code === "AADHAAR" && (
                    <div style={{ backgroundColor: "#E7F4EE", padding: "16px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #C4E1D1" }}>
                        <div style={{ fontSize: "16px", lineHeight: "1.5" }}>
                            H.No. 123, Sector 15, Rohini<br />
                            Delhi - 110085
                        </div>
                    </div>
                )}

                {addressType.code === "OLD" && (
                    <>
                        <LabelFieldPair>
                            <CardLabel>{t("EKYC_ADDRESS_CORRECTION_PROMPT") || "Do you want to correct the address?"}</CardLabel>
                            <RadioButtons
                                options={yesNoOptions}
                                optionsKey="name"
                                selectedOption={correctAddress}
                                onSelect={setCorrectAddress}
                                t={t}
                                innerStyles={{ display: "flex", gap: "20px" }}
                            />
                        </LabelFieldPair>
                        <div style={{ border: "1px solid #E0E0E0", borderRadius: "8px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", cursor: "pointer" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <TargetIcon />
                                <span style={{ fontWeight: "bold" }}>{t("EKYC_USE_CURRENT_LOCATION") || "Use Current Location"}</span>
                            </div>
                            <span style={{ fontSize: "20px" }}>›</span>
                        </div>
                        <LabelFieldPair>
                            <CardLabel>{t("EKYC_FULL_ADDRESS") || "Full Address"}</CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <TextInput
                                    value={fullAddress}
                                    onChange={(e) => setFullAddress(e.target.value)}
                                    placeholder={t("EKYC_ENTER_FULL_ADDRESS") || "Enter Full Address"}
                                    textInputStyle={{ paddingLeft: "40px", height: "80px" }}
                                />
                                <div style={{ position: "absolute", left: "10px", top: "20px" }}>
                                    <PropertyHouse styles={{ fill: "#3D51B0" }} />
                                </div>
                            </div>
                        </LabelFieldPair>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <LabelFieldPair style={{ flex: 1 }}>
                                <CardLabel>{t("EKYC_FLAT_HOUSE_NUMBER") || "Flat/House Number"}</CardLabel>
                                <div className="field" style={{ position: "relative" }}>
                                    <TextInput
                                        value={flatNo}
                                        onChange={(e) => setFlatNo(e.target.value)}
                                        placeholder={t("EKYC_ENTER_FLAT_NO") || "Enter Flat/..."}
                                        textInputStyle={{ paddingLeft: "40px" }}
                                    />
                                    <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                        <PropertyHouse styles={{ fill: "#3D51B0", width: "20px", height: "20px" }} />
                                    </div>
                                </div>
                            </LabelFieldPair>
                            <LabelFieldPair style={{ flex: 1 }}>
                                <CardLabel>{t("EKYC_BUILDING_TOWER") || "Building/Tower"}</CardLabel>
                                <div className="field" style={{ position: "relative" }}>
                                    <TextInput
                                        value={building}
                                        onChange={(e) => setBuilding(e.target.value)}
                                        placeholder={t("EKYC_ENTER_BUILDING") || "Enter Build..."}
                                        textInputStyle={{ paddingLeft: "40px" }}
                                    />
                                    <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                        <PropertyHouse styles={{ fill: "#3D51B0", width: "20px", height: "20px" }} />
                                    </div>
                                </div>
                            </LabelFieldPair>
                        </div>
                        <LabelFieldPair>
                            <CardLabel>{t("EKYC_LANDMARK") || "Landmark (Optional)"}</CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <TextInput
                                    value={landmark}
                                    onChange={(e) => setLandmark(e.target.value)}
                                    placeholder={t("EKYC_ENTER_LANDMARK") || "Enter Landmark (Optional)"}
                                    textInputStyle={{ paddingLeft: "40px" }}
                                />
                                <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                    <LocationIcon className="icon" styles={{ fill: "#3D51B0" }} />
                                </div>
                            </div>
                        </LabelFieldPair>
                        <LabelFieldPair>
                            <CardLabel>{t("EKYC_PINCODE") || "Pincode"}</CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <TextInput
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    placeholder={t("EKYC_ENTER_PINCODE") || "Enter Pincode"}
                                    textInputStyle={{ paddingLeft: "40px" }}
                                />
                                <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                    <PincodeIcon />
                                </div>
                            </div>
                        </LabelFieldPair>
                    </>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#E8EAF6", padding: "8px", borderRadius: "8px" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V9H20V19ZM18 11H14V13H18V11ZM18 15H14V17H18V15Z" fill="#3D51B0" />
                        </svg>
                    </div>
                    <CardHeader style={{ margin: 0 }}>{t("EKYC_ADMINISTRATIVE_DIVISION") || "Administrative Division"}</CardHeader>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ backgroundColor: "#F1F8F4", padding: "16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid #C4E1D1" }}>
                        <div style={{ backgroundColor: "#D0E7D8", padding: "8px", borderRadius: "8px" }}>
                            <FlagIcon />
                        </div>
                        <div>
                            <div style={{ color: "#00703C", fontSize: "12px", fontWeight: "bold" }}>{t("EKYC_ASSEMBLY") || "ASSEMBLY"}</div>
                            <div style={{ fontSize: "16px", fontWeight: "bold" }}>AC-12 Chandni Chowk</div>
                        </div>
                    </div>
                    <div style={{ backgroundColor: "#F1F3F9", padding: "16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid #D1D8E5" }}>
                        <div style={{ backgroundColor: "#D1D8E5", padding: "8px", borderRadius: "8px" }}>
                            <IdCardIcon />
                        </div>
                        <div>
                            <div style={{ color: "#3D51B0", fontSize: "12px", fontWeight: "bold" }}>{t("EKYC_WARD") || "WARD"}</div>
                            <div style={{ fontSize: "16px", fontWeight: "bold" }}>WARD-45 Civil Lines</div>
                        </div>
                    </div>
                </div>

                <CardHeader style={{ marginTop: "24px" }}>{t("EKYC_DOOR_PHOTO_HEADER") || "Door Photo with GPS Stamp"}</CardHeader>
                <div style={{ color: "#707070", fontSize: "14px", marginBottom: "16px" }}>{t("EKYC_REQUIRED_FOR_VERIFICATION") || "Required for verification"}</div>

                <div style={{ backgroundColor: "#FFF4E5", padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", border: "1px solid #FFD180" }}>
                    <InfoBannerIcon fill="#EF6C00" />
                    <div style={{ color: "#EF6C00" }}>
                        <div style={{ fontWeight: "bold" }}>{t("EKYC_IMPORTANT") || "Important"}</div>
                        <div style={{ fontSize: "13px" }}>{t("EKYC_CAPTURE_LIVE_CAMERA") || "Capture with live camera for GPS metadata"}</div>
                    </div>
                </div>

                <div style={{ border: "2px dashed #D1D8E5", borderRadius: "12px", padding: "40px 20px", textAlign: "center", cursor: "pointer" }}>
                    <div style={{ backgroundColor: "#F1F3F9", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <CameraIcon />
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>{t("EKYC_TAP_TO_CAPTURE") || "Tap to Capture"}</div>
                    <div style={{ color: "#707070", fontSize: "14px" }}>{t("EKYC_CAPTURE_DOOR_IMAGE") || "Capture Door Image"}</div>
                </div>
            </Card>

            <ActionBar>
                <SubmitBar label={t("EKYC_COMPLETE_VERIFICATION") || "Complete Verification"} onSubmit={handleCompleteVerification} />
            </ActionBar>
        </div>
    );
};

export default AddressDetails;
