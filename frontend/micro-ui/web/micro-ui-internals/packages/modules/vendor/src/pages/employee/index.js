import { PrivateRoute, AppContainer, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import SearchApp from "./SearchApp";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  sessionStorage.removeItem("revalidateddone");
  // const isMobile = window.Digit.Utils.browser.isMobile();

  // const inboxInitialState = {
  //   searchParams: {
  //     uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
  //     services: ["asset-create"],
  //     applicationStatus: [],
  //     locality: [],

  //   },
  // };

  // const AssetBreadCrumbs = ({ location }) => {
  //   const { t } = useTranslation();
  //   const search = useLocation().search;
  //   const fromScreen = new URLSearchParams(search).get("from") || null;
  //   const { from : fromScreen2 } = Digit.Hooks.useQueryParams();
  //   const crumbs = [
  //     {
  //       path: "/digit-ui/employee",
  //       content: t("ES_COMMON_HOME"),
  //       show: true,
  //     },
  //     {
  //       path: "/digit-ui/employee/asset/assetservice/inbox",
  //       content: t("ES_TITLE_INBOX"),
  //       show: location.pathname.includes("asset/assetservice/inbox") ? false : false,
  //     },
  //   ];
  //   return <BreadCrumb style={isMobile?{display:"flex"}:{margin: "0 0 4px", color:"#000000" }}  spanStyle={{maxWidth:"min-content"}} crumbs={crumbs} />;
  // }

  //const Create = Digit?.ComponentRegistryService?.getComponent("VENDOREMPCreate");
  const AddVendor = Digit.ComponentRegistryService.getComponent("AddVendor");
  const SearchVendor = Digit.ComponentRegistryService.getComponent("SearchVendor");
  //const SearchApp = Digit.ComponentRegistryService.getComponent("SearchApp");
  const AddDriver = Digit.ComponentRegistryService.getComponent("AddDriver");
  const EditVendorDetails = Digit.ComponentRegistryService.getComponent("EditVendorDetails");
  const AddVehicle = Digit.ComponentRegistryService.getComponent("AddVehicle");
  const VendorCreate = Digit.ComponentRegistryService.getComponent("VENDORCreate");
  const DriverDetails = Digit.ComponentRegistryService.getComponent("DriverDetails");
  const VehicleDetails = Digit.ComponentRegistryService.getComponent("VehicleDetails");

  const getDynamicBreadcrumbs = () => {
    const pathname = location.pathname;

    let crumbs = [
      { icon: HomeIcon, path: "/digit-ui/employee" },
      { label: t("TITLE_VENDOR_MANAGEMENT"), path: `/digit-ui/employee/vendor/search-vendor` },
    ];

    if (pathname.includes("/registry/new-vendor")) {
      crumbs.push({ label: t("ES_FSM_REGISTRY_TITLE_NEW_VENDOR") });
    } else if (pathname.includes("/search-vendor")) {
      crumbs.push({ label: t("SEARCH_VENDOR") });
    } else if (pathname.includes("/registry/new-driver")) {
      crumbs.push({ label: t("ES_FSM_REGISTRY_TITLE_NEW_DRIVER") });
    } else if (pathname.includes("/registry/vendor-details") || pathname.includes("/registry/modify-vendor/")) {
      crumbs.push({ label: t("VENDOR_VENDOR_DETAILS") });
    } else if (pathname.includes("/registry/vehicle-details") || pathname.includes("/registry/modify-vehicle/")) {
      crumbs.push({ label: t("VENDOR_VEHICLE_DETAILS") });
    } else if (pathname.includes("/registry/new-vehicle")) {
      crumbs.push({ label: t("ES_FSM_REGISTRY_TITLE_NEW_VEHICLE") });
    } else if (pathname.includes("/registry/driver-details") || pathname.includes("/registry/modify-driver/")) {
      crumbs.push({ label: t("VENDOR_DRIVER_DETAILS") });
    } else if (pathname.includes("/registry/additionaldetails")) {
      crumbs.push({ label: t("VENDOR_ADDITIONAL_DETAILS") });
    }

    return crumbs;
  };

  return (
    <Switch>
      <AppContainer>
        <React.Fragment>
          <div className="ground-container employee-app-container form-container">
            <ModuleHeader
              leftContent={
                <React.Fragment>
                  <ArrowLeft className="icon" />
                  Back
                </React.Fragment>
              }
              onLeftClick={() => window.history.back()}
              breadcrumbs={getDynamicBreadcrumbs()}
            />
            {/* {!isRes ?
                <div style={isNewRegistration ? { marginLeft: "12px", display: "flex", alignItems: "center" } : { marginLeft: "-4px", display: "flex", alignItems: "center" }}>
                  <BackButton location={location} />
                  <span style={{ margin: "0 5px 16px", display: "inline-block" }}>|</span>
                  <AssetBreadCrumbs location={location} />
                </div>
                : null}
              <PrivateRoute exact path={`${path}/`} component={() => <ASSETLinks matchPath={path} userType={userType} />} /> */}

            {/* <PrivateRoute path={`${path}/additional`} component={Create} /> */}
            {/* <PrivateRoute path={`${path}/new-application`} component={(props) => <Create {...props} parentRoute={path} />} /> */}

            <PrivateRoute
              path={`${path}/search-vendor`}
              component={renderWithLayout(
                (props) => (
                  <SearchVendor {...props} parentRoute={path} />
                ),
                layouts.normal
              )}
            />

            <PrivateRoute
              path={`${path}/registry/new-driver`}
              component={renderWithLayout(
                (props) => (
                  <AddDriver {...props} parentRoute={path} />
                ),
                layouts.normal
              )}
            />

            <PrivateRoute
              path={`${path}/registry/new-vehicle`}
              component={renderWithLayout(
                (props) => (
                  <AddVehicle {...props} parentRoute={path} />
                ),
                layouts.normal
              )}
            />

            <PrivateRoute
              path={`${path}/registry/additionaldetails`}
              component={renderWithLayout(
                (props) => (
                  <VendorCreate {...props} parentRoute={path} />
                ),
                layouts.normal
              )}
            />

            <PrivateRoute
              path={`${path}/registry/driver-details/:id`}
              component={renderWithLayout(
                (props) => (
                  <DriverDetails {...props} parentRoute={path} />
                ),
                layouts.action
              )}
            />

            <PrivateRoute
              path={`${path}/common-search/:id`}
              component={renderWithLayout(
                (props) => (
                  <SearchApp {...props} parentRoute={path} />
                ),
                layouts.normal
              )}
            />

            {/* ACTION BAR LAYOUT */}
            <PrivateRoute
              path={`${path}/registry/new-vendor`}
              component={renderWithLayout(
                (props) => (
                  <AddVendor {...props} parentRoute={path} />
                ),
                layouts.action
              )}
            />

            <PrivateRoute
              path={`${path}/registry/vendor-details/:id`}
              component={renderWithLayout(
                (props) => (
                  <EditVendorDetails {...props} parentRoute={path} />
                ),
                layouts.action
              )}
            />

            <PrivateRoute
              path={`${path}/registry/vehicle-details/:id`}
              component={renderWithLayout(
                (props) => (
                  <VehicleDetails {...props} parentRoute={path} />
                ),
                layouts.action
              )}
            />
          </div>
        </React.Fragment>
      </AppContainer>
    </Switch>
  );
};

export default EmployeeApp;

const renderWithLayout = (Component, layoutClass) => (routeProps) => (
  <div className={layoutClass}>
    <Component {...routeProps} />
  </div>
);

const layouts = {
  normal: "employee-form",
  action: "employee-form employee-form-content-with-action-bar",
};
