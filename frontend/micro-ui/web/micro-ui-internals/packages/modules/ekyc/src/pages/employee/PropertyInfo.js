import React, { useState, useRef } from "react";
import { Header, Card, LabelFieldPair, CardLabel, TextInput, SubmitBar, CardHeader, ActionBar, Dropdown, PropertyHouse, InfoBannerIcon, RemoveableTag, HomeIcon, ConnectingCheckPoints, CheckPoint } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const PropertyInfo = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();

    const { kNumber } = location.state || { kNumber: "EKYC-1234567890" };
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { data: dataV0, isLoading: isLoadingV0 } = Digit.Hooks.ekyc.useGetPropertyType(tenantId);
    const { data, isLoading } = Digit.Hooks.ekyc.useGetConnectionTypeV2(tenantId);
    const { data: dataV1, isLoading: isLoadingV1 } = Digit.Hooks.ekyc.useGetUserType(tenantId);
    const { data: dataV2, isLoading: isLoadingV2 } = Digit.Hooks.ekyc.useGetFloorCount(tenantId);

    const [ownerType, setOwnerType] = useState("OWNER");
    const [pidNumber, setPidNumber] = useState("");
    const [connectionType, setConnectionType] = useState(null);
    const [connectionCategory, setConnectionCategory] = useState(null);
    const [userType, setUserType] = useState(null);
    const [noOfFloors, setNoOfFloors] = useState(null);
    const [propertyDocument, setPropertyDocument] = useState(null);
    const [buildingPhoto, setBuildingPhoto] = useState(null);
    const fileRef = useRef(null);
    const cameraRef = useRef(null);

    const handleSaveAndContinue = () => {
        history.push("/digit-ui/employee/ekyc/review", {
            ...location.state,
            propertyDetails: {
                ownerType,
                pidNumber,
                connectionType,
                connectionCategory,
                userType,
                noOfFloors,
                propertyDocument,
                buildingPhoto
            }
        });
    };

    const SuitcaseIcon = () => (
        <div style={{ backgroundColor: "#E8EAF6", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19ZM13 13V10H11V13H8L12 17L16 13H13Z" fill="#3D51B0" />
            </svg>
        </div>
    );

    const BuildingIcon = () => (
        <div style={{ backgroundColor: "#E8EAF6", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V9H20V19ZM18 11H14V13H18V11ZM18 15H14V17H18V15Z" fill="#3D51B0" />
            </svg>
        </div>
    );

    const PdfIcon = () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM13 9V3.5L18.5 9H13Z" fill="#1976D2" />
            <path d="M11 14H13V18H11V14ZM11 12H13V13H11V12Z" fill="white" />
            <path d="M8 16H9V17H8V16Z" fill="white" />
            <path d="M15 16H16V17H15V16Z" fill="white" />
            <path d="M12 15.5L14 13.5H10L12 15.5Z" fill="white" />
            {/* Simple representation of upload arrow on document */}
            <path d="M12 18V14M12 14L10 16M12 14L14 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    const CameraIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#3D51B0" />
        </svg>
    );

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
                        <CheckPoint label={t("EKYC_STEP_PROPERTY") || "Property"} isCompleted={false} />
                        <CheckPoint label={t("EKYC_STEP_REVIEW") || "Review"} />
                    </ConnectingCheckPoints>
                </div>
            </div>

            <div style={{ flex: 1, marginLeft: "16px" }}>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <Header>{t("Property Details")}</Header>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#505A5F" }}>
                            {t("EKYC_K_NUMBER")}: <span style={{ color: "#0B0C0C" }}>{kNumber}</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                        <SuitcaseIcon />
                        <span style={{ fontSize: "20px", fontWeight: "700", color: "#101828" }}>{t("Property Details")}</span>
                    </div>

                    <Card style={{ padding: "20px", borderRadius: "16px", border: "1px solid #EAECF0", marginBottom: "24px" }}>
                        {/* Property Owner Selection */}
                        <div style={{ marginBottom: "24px" }}>
                            <CardLabel style={{ fontSize: "14px", fontWeight: "600", color: "#667085", marginBottom: "12px" }}>{t("Property_Owner")}</CardLabel>
                            <div style={{ display: "flex", backgroundColor: "#F2F4F7", padding: "4px", borderRadius: "12px" }}>
                                <button
                                    onClick={() => setOwnerType("OWNER")}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        borderRadius: "10px",
                                        border: "none",
                                        backgroundColor: ownerType === "OWNER" ? "#3D51B0" : "transparent",
                                        color: ownerType === "OWNER" ? "#FFFFFF" : "#667085",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {t("Owner")}
                                </button>
                                <button
                                    onClick={() => setOwnerType("TENANT")}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        borderRadius: "10px",
                                        border: "none",
                                        backgroundColor: ownerType === "TENANT" ? "#3D51B0" : "transparent",
                                        color: ownerType === "TENANT" ? "#FFFFFF" : "#667085",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {t("Tenant")}
                                </button>
                            </div>
                        </div>

                        {/* PID Number Section */}
                        <div style={{ marginBottom: "8px" }}>
                            <CardLabel style={{ fontSize: "14px", fontWeight: "600", color: "#667085", marginBottom: "12px" }}>
                                {t("PID_Number")} <span style={{ fontStyle: "italic", fontWeight: "400", color: "#98A2B3" }}>{t("Optional")}</span>
                            </CardLabel>
                            <div className="field" style={{ position: "relative" }}>
                                <TextInput
                                    value={pidNumber}
                                    onChange={(e) => setPidNumber(e.target.value)}
                                    placeholder={t("Enter_PID_Number")}
                                    textInputStyle={{ paddingLeft: "44px", borderRadius: "12px", border: "1px solid #D0D5DD", height: "56px" }}
                                />
                                <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#3D51B0", fontSize: "20px", fontWeight: "600" }}>#</div>
                            </div>
                        </div>
                    </Card>

                    {/* Building Info Section */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                        <BuildingIcon />
                        <span style={{ fontSize: "20px", fontWeight: "700", color: "#101828" }}>{t("Building_Info")}</span>
                    </div>

                    <Card style={{ padding: "20px", borderRadius: "16px", border: "1px solid #EAECF0", marginBottom: "24px" }}>

                        {/* Dropdowns */}
                        {[
                            {
                                label: "Type_of_Connection",
                                state: connectionCategory,
                                setState: setConnectionCategory,
                                options: dataV0?.["ws-services-calculation"]?.propertyTypeV2?.map(item => ({
                                    label: t(item.code),
                                    value: item.code
                                })) || []
                            },
                            {
                                label: "Connection_Category",
                                state: connectionType,
                                setState: setConnectionType,
                                options: data?.["ws-services-calculation"]?.connectionTypeV2?.map(item => ({
                                    label: t(item.code),
                                    value: item.code
                                })) || []
                            },
                            // { label: "User_Type", state: userType, setState: setUserType },
                            {
                                label: "User_Type",
                                state: userType,
                                setState: setUserType,
                                options: dataV1?.["ws-services-calculation"]?.userTypeV2?.map(item => ({
                                    label: t(item.code),
                                    value: item.code
                                })) || []
                            },
                            {
                                label: "No_of_Floor",
                                state: noOfFloors,
                                setState: setNoOfFloors,
                                options: dataV2?.["ws-services-calculation"]?.floorCount?.map(item => ({
                                    label: t(item.code),
                                    value: item.code
                                })) || []
                            }
                        ].map((item, idx) => (
                            <div key={idx} style={{ marginBottom: "20px" }}>
                                <CardLabel style={{ fontSize: "14px", fontWeight: "600", color: "#344054", marginBottom: "8px" }}>{t(item.label)}</CardLabel>
                                <Dropdown
                                    selected={item.state}
                                    select={item.setState}
                                    option={item.options || [{ label: `Select ${item.label}`, value: "" }]}
                                    optionKey="label"
                                    t={t}
                                    style={{ borderRadius: "12px", border: "1px solid #D0D5DD", height: "48px" }}
                                />
                            </div>
                        ))}
                        <div
                            style={{
                                display: "flex",
                                gap: "24px",
                                alignItems: "stretch", // important
                                flexWrap: "wrap"
                            }}
                        >
                            {/* PDF Upload Box */}
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: "300px",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <CardLabel
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#344054",
                                        marginBottom: "8px"
                                    }}
                                >
                                    {t("Upload_Property_Document")}
                                </CardLabel>

                                <div
                                    style={{
                                        flex: 1, // important for equal height
                                        backgroundColor: "#EBF5FF",
                                        border: "1px solid #B2DDFF",
                                        borderRadius: "16px",
                                        padding: "32px 24px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center"
                                    }}
                                    onClick={() => fileRef.current.click()}
                                >
                                    <input type="file" ref={fileRef} style={{ display: "none" }} accept=".pdf" />

                                    <div
                                        style={{
                                            color: "#1570EF",
                                            fontWeight: "600",
                                            fontSize: "16px",
                                            marginBottom: "20px",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {t("Upload_your_property_document_in_PDF_Only")}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <div
                                            style={{
                                                backgroundColor: "#FFFFFF",
                                                padding: "12px",
                                                borderRadius: "12px",
                                                boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)"
                                            }}
                                        >
                                            <PdfIcon />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Capture Building Image */}
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: "300px",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <CardLabel
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#344054",
                                        marginBottom: "8px"
                                    }}
                                >
                                    {t("Capture_Building_Image")}
                                </CardLabel>

                                <div
                                    style={{
                                        flex: 1, // important
                                        border: "1px solid #D0D5DD",
                                        borderRadius: "16px",
                                        padding: "40px 24px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        backgroundColor: "#FFFFFF",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center"
                                    }}
                                    onClick={() => cameraRef.current.click()}
                                >
                                    <input
                                        type="file"
                                        ref={cameraRef}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        capture="environment"
                                    />

                                    <div
                                        style={{
                                            backgroundColor: "#EEF4FF",
                                            width: "56px",
                                            height: "56px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto 16px"
                                        }}
                                    >
                                        <CameraIcon />
                                    </div>

                                    <div
                                        style={{
                                            fontWeight: "600",
                                            color: "#101828",
                                            fontSize: "16px",
                                            marginBottom: "4px"
                                        }}
                                    >
                                        {t("Tap_to_Capture")}
                                    </div>

                                    <div style={{ color: "#667085", fontSize: "14px" }}>
                                        {t("Building_Photo")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div style={{ marginTop: "24px", backgroundColor: "#EFF8FF", padding: "16px", borderRadius: "12px", display: "flex", gap: "12px", border: "1px solid #B2DDFF" }}>
                            <div style={{ color: "#1570EF" }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div style={{ color: "#175CD3", fontSize: "14px", fontWeight: "500", lineHeight: "1.4" }}>
                                {t("This_section_is_enabled_only_if_user_is_not_the_owner.")}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "24px" }}>
                            <SubmitBar label={t("Save_&_Continue")} onSubmit={handleSaveAndContinue} style={{ borderRadius: "8px", height: "48px", margin: 0 }} />
                        </div>
                    </Card>


                </Card>
            </div>
        </div>
    );
};

export default PropertyInfo;