import React, { useState, useRef, Fragment } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader, RadioButtons, ActionBar, InfoBannerIcon, PropertyHouse, LocationIcon, RemoveableTag, HomeIcon, ConnectingCheckPoints, CheckPoint } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const AddressDetails = ({ isSection = false, onComplete, parentState }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();

    // Use parent state if provided, otherwise fallback to location state or defaults
    const flowState = parentState || location.state || {
        kNumber: "EKYC-1234567890",
        selectedOption: { code: "SELF", name: "EKYC_SELF" },
        connectionDetails: null
    };

    const [addressType, setAddressType] = useState({ code: "AADHAAR", name: "EKYC_AADHAAR_ADDRESS" });
    const [correctAddress, setCorrectAddress] = useState({ code: "NO", name: "CORE_COMMON_NO" });
    const [fullAddress, setFullAddress] = useState("");
    const [flatNo, setFlatNo] = useState("");
    const [building, setBuilding] = useState("");
    const [landmark, setLandmark] = useState("");
    const [pincode, setPincode] = useState("");
    const [doorPhoto, setDoorPhoto] = useState(null);
    const [isLocationFetching, setIsLocationFetching] = useState(false);
    const fileInputRef = useRef(null);

    const addressOptions = [
        { code: "AADHAAR", name: "EKYC_AADHAAR_ADDRESS" },
        { code: "OLD", name: "EKYC_OLD_ADDRESS" }
    ];

    const yesNoOptions = [
        { code: "YES", name: "CORE_COMMON_YES" },
        { code: "NO", name: "CORE_COMMON_NO" }
    ];

    const handleCompleteVerification = () => {
        if (onComplete) {
            onComplete({ addressType, fullAddress, flatNo, building, landmark, pincode, doorPhoto });
        } else {
            const { kNumber, selectedOption, connectionDetails } = flowState;
            history.push("/digit-ui/employee/ekyc/property-info", {
                kNumber,
                selectedOption,
                connectionDetails,
                addressDetails: { addressType, fullAddress, flatNo, building, landmark, pincode, doorPhoto }
            });
        }
    };

    const handleCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDoorPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openGallery = () => {
        fileInputRef.current.click();
    };

    const removePhoto = () => {
        setDoorPhoto(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUseCurrentLocation = () => {
        if (!("geolocation" in navigator)) {
            alert(t("GEOLOCATION_NOT_SUPPORTED") || "Geolocation is not supported by your browser");
            return;
        }

        setIsLocationFetching(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    if (!response.ok) throw new Error("Failed to fetch address");
                    const data = await response.json();

                    if (data && data.address) {
                        const addr = [
                            data.address?.amenity,
                            data.address?.road,
                            data.address?.neighbourhood,
                            data.address?.suburb,
                            data.address?.city,
                            data.address?.state,
                            data.address?.postcode
                        ].filter(Boolean).join(", ");

                        setFullAddress(addr || "");
                        setPincode(data.address?.postcode || "");
                        setLandmark(data.address?.suburb || data.address?.neighbourhood || "");
                        setFlatNo(data.address?.amenity || "");
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                } finally {
                    setIsLocationFetching(false);
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsLocationFetching(false);
                alert(t("LOCATION_FETCH_FAILED") || "Failed to fetch your current location. Please ensure location permissions are granted.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
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
            <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#0068faff" />
        </svg>
    );

    const TargetIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="#0068faff" />
        </svg>
    );

    const PincodeIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 13V11H15V13H13ZM13 9V7H15V9H13ZM17 13V11H19V13H17ZM17 9V7H19V9H17ZM11 13V11H9V13H11ZM11 9V7H9V9H11ZM7 13V11H5V13H7ZM7 9V7H5V9H7ZM21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="#0068faff" />
        </svg>
    );

    const renderContent = () => (
        <div style={{ animation: "fadeSlideIn 0.3s ease" }}>
            {isSection && <hr style={{ margin: "40px 0", border: "0", borderTop: "2px solid #EAECF0" }} />}
            <Header style={{ marginBottom: "24px" }}>{t("EKYC_ADDRESS_DETAILS_HEADER") || "Address Details"}</Header>
            <div style={{ marginBottom: "32px" }}>
                <RadioButtons
                    options={addressOptions}
                    optionsKey="name"
                    selectedOption={addressType}
                    onSelect={setAddressType}
                    t={t}
                    innerStyles={{ display: "flex", alignItems: "center" }}
                    style={{ display: "flex", gap: "50px", justifyContent: "flex-start" }}
                />
            </div>

            {addressType.code === "AADHAAR" && (
                <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #EAECF0", display: "flex", alignItems: "flex-start", gap: "12px", animation: "fadeSlideIn 0.3s ease" }}>
                    <div style={{ backgroundColor: "#E7F4EE", padding: "8px", borderRadius: "8px" }}>
                        <LocationIcon className="icon" styles={{ fill: "#00703C", width: "20px", height: "20px" }} />
                    </div>
                    <div style={{ fontSize: "16px", lineHeight: "1.6", color: "#344054", fontWeight: "500" }}>
                        H.No. 123, Sector 15, Rohini<br />
                        Delhi - 110085
                    </div>
                </div>
            )}

            {addressType.code === "OLD" && (
                <div style={{ animation: "fadeSlideIn 0.3s ease" }}>
                    <div style={{ marginBottom: "24px" }}>
                        <CardLabel style={{ marginBottom: "12px", fontWeight: "600", color: "#344054" }}>{t("EKYC_ADDRESS_CORRECTION_PROMPT") || "Do you want to correct the address?"}</CardLabel>
                        <RadioButtons
                            options={yesNoOptions}
                            optionsKey="name"
                            selectedOption={correctAddress}
                            onSelect={setCorrectAddress}
                            t={t}
                            innerStyles={{ display: "flex", alignItems: "center" }}
                            style={{ display: "flex", gap: "50px", justifyContent: "flex-start" }}
                        />
                    </div>

                    <div
                        style={{
                            border: "1px solid #D0D5DD",
                            borderRadius: "12px",
                            padding: "14px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "24px",
                            cursor: isLocationFetching ? "not-allowed" : "pointer",
                            backgroundColor: isLocationFetching ? "#F2F4F7" : "#FFFFFF",
                            transition: "all 0.2s ease",
                            opacity: isLocationFetching ? 0.7 : 1,
                            boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)"
                        }}
                        onClick={!isLocationFetching ? handleUseCurrentLocation : undefined}
                        onMouseOver={(e) => !isLocationFetching ? (e.currentTarget.style.backgroundColor = "#F9FAFB") : null}
                        onMouseOut={(e) => !isLocationFetching ? (e.currentTarget.style.backgroundColor = "#FFFFFF") : null}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ backgroundColor: "#EEF4FF", padding: "8px", borderRadius: "8px" }}>
                                {isLocationFetching ? (
                                    <div className="location-loader" style={{ width: "20px", height: "20px", border: "2px solid #0068faff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                                ) : (
                                    <TargetIcon />
                                )}
                            </div>
                            <span style={{ fontWeight: "600", color: "#344054" }}>
                                {isLocationFetching ? (t("EKYC_FETCHING_LOCATION") || "Fetching Location...") : (t("EKYC_USE_CURRENT_LOCATION") || "Use Current Location")}
                            </span>
                        </div>
                        {!isLocationFetching && <span style={{ fontSize: "20px", color: "#98A2B3" }}>›</span>}
                    </div>

                    <LabelFieldPair>
                        <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_FULL_ADDRESS") || "Full Address"}</CardLabel>
                        <div className="field" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "12px", top: "16px", zIndex: 1, opacity: 0.6 }}>
                                <PropertyHouse styles={{ fill: "#0068faff", width: "20px", height: "20px" }} />
                            </div>
                            <TextInput
                                value={fullAddress}
                                onChange={(e) => setFullAddress(e.target.value)}
                                placeholder={t("EKYC_ENTER_FULL_ADDRESS") || "Enter Full Address"}
                                textInputStyle={{ paddingLeft: "40px", minHeight: "80px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        <LabelFieldPair>
                            <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_FLAT_HOUSE_NUMBER") || "Flat/House Number"}</CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                    <PropertyHouse styles={{ fill: "#0068faff", width: "20px", height: "20px" }} />
                                </div>
                                <TextInput
                                    value={flatNo}
                                    onChange={(e) => setFlatNo(e.target.value)}
                                    placeholder={t("EKYC_ENTER_FLAT_NO") || "e.g. 45-B"}
                                    textInputStyle={{ paddingLeft: "40px" }}
                                />
                            </div>
                        </LabelFieldPair>
                        <LabelFieldPair>
                            <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_BUILDING_TOWER") || "Building/Tower"}</CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                    <PropertyHouse styles={{ fill: "#0068faff", width: "20px", height: "20px" }} />
                                </div>
                                <TextInput
                                    value={building}
                                    onChange={(e) => setBuilding(e.target.value)}
                                    placeholder={t("EKYC_ENTER_BUILDING") || "e.g. Tower 4"}
                                    textInputStyle={{ paddingLeft: "40px" }}
                                />
                            </div>
                        </LabelFieldPair>
                    </div>

                    <LabelFieldPair>
                        <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_LANDMARK") || "Landmark"}</CardLabel>
                        <div className="field" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                <LocationIcon className="icon" styles={{ fill: "#0068faff", width: "20px", height: "20px" }} />
                            </div>
                            <TextInput
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                                placeholder={t("EKYC_ENTER_LANDMARK") || "Near Central Park"}
                                textInputStyle={{ paddingLeft: "40px" }}
                            />
                        </div>
                    </LabelFieldPair>

                    <LabelFieldPair>
                        <CardLabel style={{ fontWeight: "600" }}>{t("EKYC_PINCODE") || "Pincode"}</CardLabel>
                        <div className="field" style={{ position: "relative" }}>
                            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 1, opacity: 0.6 }}>
                                <PincodeIcon />
                            </div>
                            <TextInput
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                placeholder={t("EKYC_ENTER_PINCODE") || "6-digit pincode"}
                                textInputStyle={{ paddingLeft: "40px" }}
                                maxLength={6}
                            />
                        </div>
                    </LabelFieldPair>
                </div>
            )}

            <hr style={{ margin: "32px 0", border: "0", borderTop: "1px solid #EAECF0" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ backgroundColor: "#EEF4FF", padding: "8px", borderRadius: "8px" }}>
                    <PropertyHouse styles={{ fill: "#0068faff", width: "24px", height: "24px" }} />
                </div>
                <CardHeader style={{ margin: 0, fontSize: "20px" }}>{t("EKYC_ADMINISTRATIVE_DIVISION") || "Administrative Division"}</CardHeader>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
                <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid #EAECF0" }}>
                    <div style={{ backgroundColor: "#E7F4EE", padding: "10px", borderRadius: "10px", display: "flex" }}>
                        <FlagIcon />
                    </div>
                    <div>
                        <div style={{ color: "#00703C", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("EKYC_ASSEMBLY") || "ASSEMBLY"}</div>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#101828", marginTop: "2px" }}>AC-12 Chandni Chowk</div>
                    </div>
                </div>
                <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "16px", border: "1px solid #EAECF0" }}>
                    <div style={{ backgroundColor: "#EEF4FF", padding: "10px", borderRadius: "10px", display: "flex" }}>
                        <IdCardIcon />
                    </div>
                    <div>
                        <div style={{ color: "#0068faff", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("EKYC_WARD") || "WARD"}</div>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#101828", marginTop: "2px" }}>WARD-45 Civil Lines</div>
                    </div>
                </div>
            </div>

            <CardHeader style={{ fontSize: "18px", color: "#101828", marginBottom: "4px" }}>{t("EKYC_DOOR_PHOTO_HEADER") || "Door Photo with GPS Stamp"}</CardHeader>
            <div style={{ color: "#667085", fontSize: "14px", marginBottom: "16px" }}>{t("EKYC_REQUIRED_FOR_VERIFICATION") || "Required for verification"}</div>

            <div style={{ backgroundColor: "#FFFAEB", padding: "14px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", border: "1px solid #FEDF89" }}>
                <InfoBannerIcon fill="#B54708" />
                <div>
                    <div style={{ fontWeight: "700", color: "#B54708", fontSize: "14px" }}>{t("EKYC_IMPORTANT") || "Important"}</div>
                    <div style={{ fontSize: "13px", color: "#B54708", marginTop: "2px" }}>{t("EKYC_CAPTURE_LIVE_CAMERA") || "Capture with live camera for GPS metadata"}</div>
                </div>
            </div>

            <div
                style={{
                    border: "2px dashed #D0D5DD",
                    borderRadius: "16px",
                    padding: doorPhoto ? "12px" : "40px 24px",
                    textAlign: "center",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "180px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F9FAFB",
                    transition: "all 0.2s ease",
                    boxShadow: "inset 0px 2px 4px rgba(0, 0, 0, 0.02)"
                }}
                onClick={!doorPhoto ? openGallery : undefined}
                onMouseOver={(e) => !doorPhoto ? e.currentTarget.style.borderColor = "#0068faff" : null}
                onMouseOut={(e) => !doorPhoto ? e.currentTarget.style.borderColor = "#D0D5DD" : null}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCapture}
                    accept="image/*"
                    style={{ display: "none" }}
                />
                {!doorPhoto ? (
                    <>
                        <div style={{ backgroundColor: "#FFFFFF", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.1)" }}>
                            <CameraIcon />
                        </div>
                        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px", color: "#101828" }}>{t("EKYC_TAP_TO_CAPTURE") || "Tap to Capture"}</div>
                        <div style={{ color: "#667085", fontSize: "14px" }}>{t("EKYC_CAPTURE_DOOR_IMAGE") || "Capture Door Image"}</div>
                    </>
                ) : (
                    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
                        <img src={doorPhoto} alt="Door" style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "12px", display: "block" }} />
                        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                                style={{ background: "#FFFFFF", border: "1px solid #EAECF0", borderRadius: "8px", padding: "8px", display: "flex", boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)", cursor: "pointer" }}
                            >
                                <RemoveableTag text="" onClick={() => { }} extraStyles={{ tagStyles: { margin: 0, padding: 0 } }} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ActionBar>
                <SubmitBar label={isSection ? t("EKYC_COMPLETE_VERIFICATION_AND_PROCEED") || "Complete & Proceed" : t("EKYC_COMPLETE_VERIFICATION") || "Complete Verification"} onSubmit={handleCompleteVerification} />
            </ActionBar>
        </div>
    );

    if (isSection) return renderContent();

    return (
        <div className="inbox-container">
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
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
                <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "8px", border: "1px solid #EAECF0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                    <ConnectingCheckPoints>
                        <CheckPoint label={t("EKYC_STEP_AADHAAR") || "Aadhaar"} isCompleted={true} />
                        <CheckPoint label={t("EKYC_STEP_ADDRESS") || "Address"} isCompleted={true} />
                        <CheckPoint label={t("EKYC_STEP_PROPERTY") || "Property"} isCompleted={false} />
                        <CheckPoint label={t("EKYC_STEP_REVIEW") || "Review"} />
                    </ConnectingCheckPoints>
                </div>
            </div>

            <div style={{ flex: 1, marginLeft: "16px" }}>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <Header>{t("EKYC_ADDRESS_DETAILS_HEADER") || "Address Details"}</Header>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#505A5F" }}>
                            {t("EKYC_K_NUMBER")}: <span style={{ color: "#0B0C0C" }}>{flowState?.kNumber}</span>
                        </div>
                    </div>
                    {renderContent()}
                </Card>
            </div>
        </div>
    );
};

export default AddressDetails;
