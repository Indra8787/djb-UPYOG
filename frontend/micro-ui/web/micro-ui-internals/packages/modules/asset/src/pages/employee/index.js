import { PrivateRoute, BreadCrumb, AppContainer, BackButton, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import { ASSETLinks } from "../../Module";
import SearchApp from "./SearchApp";
import SearchReport from "./SearchReport";
import Inbox from "./Inbox";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  sessionStorage.removeItem("revalidateddone");
  const isMobile = window.Digit.Utils.browser.isMobile();

  const inboxInitialState = {
    searchParams: {
      uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
      services: ["asset-create"],
      applicationStatus: [],
      locality: [],
    },
  };

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

  const getBreadcrumbLabel = () => {
    const pathname = location.pathname;

    if (pathname.includes("/assetservice/inbox")) return "ES_COMMON_INBOX";
    if (pathname.includes("/assetservice/my-asset")) return "ASSET_APPLICATIONS";
    if (pathname.includes("/assetservice/search")) return "ASSET_SEARCH";
    if (pathname.includes("/assetservice/report")) return "AST_REPORTS_CHECK";
    if (pathname.includes("/assetservice/assign-assets")) return "ASSET_ASSIGN_ASSETS";
    if (pathname.includes("/assetservice/maintenance-assets")) return "ASSET_MAINTENANCE_ASSETS";
    if (pathname.includes("/assetservice/dispose-assets")) return "ASSET_DISPOSE_ASSETS";
    if (pathname.includes("/assetservice/return-assets")) return "ASSET_RETURN_ASSETS";
    if (pathname.includes("/assetservice/new-assets")) return "ASSET_NEW_ASSETS";
    if (pathname.includes("/assetservice/application-details")) return "ASSET_APPLICATION_DETAILS";
    if (pathname.includes("/assetservice/applicationsearch/application-details")) return "ASSET_APPLICATION_DETAILS";
    if (pathname.includes("/assetservice/assign-response")) return "ASSET_ASSIGN_RESPONSE";
    if (pathname.includes("/assetservice/maintenance")) return "ASSET_MAINTENANCE";
    if (pathname.includes("/assetservice/edit-maintenance")) return "ASSET_EDIT_MAINTENANCE";
    if (pathname.includes("/assetservice/maintenance-edit")) return "ASSET_MAINTENANCE_EDIT";
    if (pathname.includes("/assetservice/asset-dispose-response")) return "ASSET_DISPOSE_RESPONSE";
    if (pathname.includes("/assetservice/asset-process-depreciation-response")) return "ASSET_PROCESS_DEPRECIATION_RESPONSE";
    if (pathname.includes("/assetservice/return-response")) return "ASSET_RETURN_RESPONSE";
    if (pathname.includes("/assetservice/edit-response")) return "ASSET_EDIT_RESPONSE";
    if (pathname.includes("/assetservice/edit-asset")) return "ASSET_EDIT_ASSET";
    return "";
  };

  let moduleName = "ASSET";
  if (location.pathname.includes("/mt/")) moduleName = "MT";
  if (location.pathname.includes("/tp/")) moduleName = "TP";

  const breadcrumbs = [
    { icon: HomeIcon },
    { label: t("TITLE_ASSET_MANAGEMENT"), path: `/digit-ui/employee/module/details?moduleName=${moduleName}` },
    { label: t(getBreadcrumbLabel()) },
  ];

  const NewAssetAssignApplication = Digit?.ComponentRegistryService?.getComponent("AssignAssetApplication");
  const DisposeApplication = Digit?.ComponentRegistryService?.getComponent("DisposeApplication");
  const MaintenanceApplication = Digit?.ComponentRegistryService?.getComponent("MaintenanceApplication");
  const EditAssetMaintenance = Digit?.ComponentRegistryService?.getComponent("EditAssetMaintenance");
  const EditResponse = Digit?.ComponentRegistryService?.getComponent("editResponse");
  const EditAsset = Digit?.ComponentRegistryService?.getComponent("editAsset");
  const NewAssetReturnApplication = Digit?.ComponentRegistryService?.getComponent("returnAssets");
  const ApplicationDetails = Digit?.ComponentRegistryService?.getComponent("ApplicationDetails");
  const ASSETCreate = Digit?.ComponentRegistryService?.getComponent("AssetCreateNew");
  const Response = Digit?.ComponentRegistryService?.getComponent("AssetResponse");
  const Maintenance = Digit?.ComponentRegistryService?.getComponent("Maintenance");
  const EditMaintenance = Digit?.ComponentRegistryService?.getComponent("EditMaintenance");
  const DisposeResponse = Digit?.ComponentRegistryService?.getComponent("DisposeResponse");
  const ProcessDepreciationResponse = Digit?.ComponentRegistryService?.getComponent("ProcessDepreciationResponse");
  const ReturnResponse = Digit?.ComponentRegistryService?.getComponent("returnResponse");
  const isRes = window.location.href.includes("asset/response");
  const isNewRegistration = window.location.href.includes("new-assets") || window.location.href.includes("asset/assetservice/application-details");

  return (
    <Switch>
      <AppContainer>
        <React.Fragment>
          <div className="form-container">
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

            {/* {!isRes ? 
              <div style={isNewRegistration ? { marginLeft: "12px",display: "flex", alignItems: "center" } : { marginLeft: "-4px",display: "flex", alignItems: "center" }}>
                  <BackButton location={location} />
                  <span style={{ margin: "0 5px 16px", display: "inline-block" }}>|</span>
                  <AssetBreadCrumbs location={location} />
               
              </div>
          : null} */}
            <PrivateRoute exact path={`${path}/`} component={() => <ASSETLinks matchPath={path} userType={userType} />} />
            <PrivateRoute
              path={`${path}/assetservice/inbox`}
              component={() => (
                <Inbox
                  useNewInboxAPI={true}
                  parentRoute={path}
                  businessService="asset-create"
                  filterComponent="AST_INBOX_FILTER"
                  initialStates={inboxInitialState}
                  isInbox={true}
                />
              )}
            />

            <PrivateRoute path={`${path}/assetservice/assign-assets/:id`} component={() => <NewAssetAssignApplication parentUrl={url} />} />
            <PrivateRoute path={`${path}/assetservice/maintenance-assets/:id`} component={() => <MaintenanceApplication parentUrl={url} />} />
            <PrivateRoute path={`${path}/assetservice/dispose-assets/:id`} component={() => <DisposeApplication parentUrl={url} />} />
            <PrivateRoute path={`${path}/assetservice/return-assets/:id`} component={() => <NewAssetReturnApplication parentUrl={url} />} />
            <PrivateRoute path={`${path}/assetservice/edit/:id`} component={() => <EditAsset parentUrl={url} />} />
            <PrivateRoute path={`${path}/assetservice/new-assets`} component={() => <ASSETCreate parentUrl={url} />} />
            <PrivateRoute path={`${path}/assetservice/application-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
            <PrivateRoute
              path={`${path}/assetservice/applicationsearch/application-details/:id`}
              component={() => <ApplicationDetails parentRoute={path} />}
            />
            <PrivateRoute path={`${path}/assetservice/assign-response`} component={(props) => <Response {...props} parentRoute={path} />} />
            <PrivateRoute path={`${path}/assetservice/maintenance`} component={(props) => <Maintenance {...props} parentRoute={path} />} />
            <PrivateRoute path={`${path}/assetservice/edit-maintenance`} component={(props) => <EditMaintenance {...props} parentRoute={path} />} />
            <PrivateRoute path={`${path}/assetservice/maintenance-edit/:id`} component={() => <EditAssetMaintenance parentUrl={url} />} />
            <PrivateRoute
              path={`${path}/assetservice/asset-dispose-response`}
              component={(props) => <DisposeResponse {...props} parentRoute={path} />}
            />
            <PrivateRoute
              path={`${path}/assetservice/asset-process-depreciation-response`}
              component={(props) => <ProcessDepreciationResponse {...props} parentRoute={path} />}
            />
            <PrivateRoute path={`${path}/assetservice/return-response`} component={(props) => <ReturnResponse {...props} parentRoute={path} />} />
            <PrivateRoute path={`${path}/assetservice/search`} component={(props) => <Search {...props} t={t} parentRoute={path} />} />
            <PrivateRoute path={`${path}/assetservice/my-asset`} component={(props) => <SearchApp {...props} parentRoute={path} />} />
            <PrivateRoute path={`${path}/assetservice/report`} component={(props) => <SearchReport {...props} parentRoute={path} />} />
            <PrivateRoute path={`${path}/assetservice/edit-response`} component={(props) => <EditResponse {...props} parentRoute={path} />} />
          </div>
        </React.Fragment>
      </AppContainer>
    </Switch>
  );
};

export default EmployeeApp;
