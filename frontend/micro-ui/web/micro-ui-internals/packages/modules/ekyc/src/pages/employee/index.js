import { AppContainer, PrivateRoute, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import Inbox from "./Inbox";
import Create from "./Create";
import KDetails from "./KDetails";
import AadhaarVerification from "./AadhaarVerification";
import AddressDetails from "./AddressDetails";

const EmployeeApp = ({ path }) => {
    const { t } = useTranslation();
    const location = useLocation();

    sessionStorage.removeItem("revalidateddone");

    const getBreadcrumbLabel = () => {
        const pathname = location.pathname;
        if (pathname.includes("/dashboard")) return "ES_COMMON_INBOX";
        if (pathname.includes("/create-kyc")) return "EKYC_CREATE_KYC";
        if (pathname.includes("/k-details")) return "EKYC_K_DETAILS";
        if (pathname.includes("/aadhaar-verification")) return "EKYC_AADHAAR_VERIFICATION";
        if (pathname.includes("/address-details")) return "EKYC_ADDRESS_DETAILS";
        return "ES_COMMON_INBOX";
    };

    const breadcrumbs = [
        { icon: HomeIcon, path: "/digit-ui/employee" },
        { label: t(getBreadcrumbLabel()) }
    ];

    return (
        <AppContainer>
            <div className="ground-container employee-app-container">
                <ModuleHeader
                    leftContent={
                        <React.Fragment>
                            <ArrowLeft className="icon" />
                            Back
                        </React.Fragment>
                    }
                    onLeftClick={() => window.history.back()}
                    breadcrumbs={breadcrumbs}
                />

                <Switch>
                    <PrivateRoute
                        path={`${path}/dashboard`}
                        component={() => (
                            <Inbox
                                parentRoute={path}
                                businessService="EKYC"
                                moduleCode="EKYC"
                                isInbox={true}
                            />
                        )}
                    />

                    <PrivateRoute
                        path={`${path}/create-kyc`}
                        component={() => <Create />}
                    />

                    <PrivateRoute
                        path={`${path}/k-details`}
                        component={() => <KDetails />}
                    />

                    <PrivateRoute
                        path={`${path}/aadhaar-verification`}
                        component={() => <AadhaarVerification />}
                    />

                    <PrivateRoute
                        path={`${path}/address-details`}
                        component={() => <AddressDetails />}
                    />

                    <PrivateRoute
                        path={`${path}/`}
                        component={() => (
                            <Inbox
                                parentRoute={path}
                                businessService="EKYC"
                                moduleCode="EKYC"
                                isInbox={true}
                            />
                        )}
                    />
                </Switch>
            </div>
        </AppContainer>
    );
};

export default EmployeeApp;
