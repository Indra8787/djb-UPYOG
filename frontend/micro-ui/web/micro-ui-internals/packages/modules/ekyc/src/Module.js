import React from "react";
import { useRouteMatch } from "react-router-dom";
import EKYCCard from "./components/EKYCCard";
import Inbox from "./pages/employee/Inbox";
import DesktopInbox from "./components/DesktopInbox";
import MobileInbox from "./components/MobileInbox";
import EmployeeApp from "./pages/employee";

export const EkycModule = ({ stateCode, userType, tenants }) => {
    const { path, url } = useRouteMatch();
    const moduleCode = "EKYC";
    const language = Digit.StoreData.getCurrentLanguage();
    const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
    Digit.SessionStorage.set("EKYC_TENANTS", tenants);

    if (isLoading) {
        return null;
    }
    if (userType === "employee") {
        return <EmployeeApp path={path} url={url} userType={userType} tenants={tenants} />;
    } else return null;
};

const componentsToRegister = {
    EKYCModule: EkycModule,
    EKYCCard,
    EKYCInbox: Inbox,
    EKYCDesktopInbox: DesktopInbox,
    EKYCMobileInbox: MobileInbox,
};

export const initEkycComponents = () => {
    Object.entries(componentsToRegister).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};

export default EkycModule;
