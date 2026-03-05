import { PrivateRoute, AppContainer, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = window.innerWidth <= 640;
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const inboxInitialState = {
    searchParams: {
      tenantId: tenantId,
    },
  };

  const HRMSResponse = Digit?.ComponentRegistryService?.getComponent("HRMSResponse");
  const HRMSDetails = Digit?.ComponentRegistryService?.getComponent("HRMSDetails");
  const Inbox = Digit?.ComponentRegistryService?.getComponent("HRInbox");
  const CreateEmployee = Digit?.ComponentRegistryService?.getComponent("HRCreateEmployee");
  const EditEmpolyee = Digit?.ComponentRegistryService?.getComponent("HREditEmpolyee");

  // Dynamic Breadcrumb Generator
  const getDynamicBreadcrumbs = () => {
    // 1. Base steps that are always present
    let crumbs = [
      { icon: HomeIcon, path: "/digit-ui/employee" },
      { label: t("ACTION_TEST_HRMS"), path: "/digit-ui/employee/module/details?moduleName=HRMS" },
    ];

    const currentPath = location.pathname;

    // 2. Build the history based on the current route
    if (currentPath.includes("/inbox")) {
      crumbs.push({ label: t("HR_HOME_SEARCH_RESULTS_HEADING") }); // No path = current location (unclickable)
    } else if (currentPath.includes("/create")) {
      crumbs.push({ label: t("HR_HOME_SEARCH_RESULTS_HEADING"), path: `${path}/inbox` }); // Where I came from
      crumbs.push({ label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER") }); // Where I am currently
    } else if (currentPath.includes("/details")) {
      crumbs.push({ label: t("HR_HOME_SEARCH_RESULTS_HEADING"), path: `${path}/inbox` });
      crumbs.push({ label: t("HR_NEW_EMPLOYEE_FORM_HEADER") });
    } else if (currentPath.includes("/edit")) {
      crumbs.push({ label: t("HR_HOME_SEARCH_RESULTS_HEADING"), path: `${path}/inbox` });

      // Extract IDs from the URL to create a functional "Back to Details" link
      const pathSegments = currentPath.split("/");
      const editIndex = pathSegments.indexOf("edit");

      if (editIndex !== -1 && pathSegments.length >= editIndex + 3) {
        const urlTenantId = pathSegments[editIndex + 1];
        const urlId = pathSegments[editIndex + 2];
        // Add details page as the previous step
        crumbs.push({
          label: t("HR_COMMON_EDIT_EMPLOYEE_HEADER"),
          path: `${path}/details/${urlTenantId}/${urlId}`,
        });
      }

      crumbs.push({ label: t("HR_EDIT_EMPLOYEE") }); // Where I am currently
    } else if (currentPath.includes("/response")) {
      crumbs.push({ label: t("HR_INBOX"), path: `${path}/inbox` });
      crumbs.push({ label: t("HR_RESPONSE") });
    } else {
      // Fallback
      crumbs.push({ label: t("HR_COMMON_HEADER") });
    }

    return crumbs;
  };

  return (
    <Switch>
      <AppContainer>
        <div className="ground-container employee-app-container form-container">
          <ModuleHeader
            leftContent={
              <React.Fragment>
                <ArrowLeft className="icon" />
                Back
              </React.Fragment>
            }
            onLeftClick={() => window.history.back()}
            breadcrumbs={getDynamicBreadcrumbs()} // Use the dynamic function here
          />
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox parentRoute={path} businessService="hrms" filterComponent="HRMS_INBOX_FILTER" initialStates={inboxInitialState} isInbox={true} />
            )}
          />
          <PrivateRoute path={`${path}/create`} component={() => <CreateEmployee />} />
          <PrivateRoute path={`${path}/response`} component={(props) => <HRMSResponse {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/details/:tenantId/:id`} component={() => <HRMSDetails />} />
          <PrivateRoute path={`${path}/edit/:tenantId/:id`} component={() => <EditEmpolyee />} />
        </div>
      </AppContainer>
    </Switch>
  );
};

export default EmployeeApp;
