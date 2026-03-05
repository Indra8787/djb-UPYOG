import { AppContainer, PrivateRoute, ModuleHeader, ArrowLeft, HomeIcon } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import Inbox from "./Inbox";
import SearchApp from "./SearchApp";

const EmployeeApp = ({ path }) => {
  const { t } = useTranslation();
  const location = useLocation();

  sessionStorage.removeItem("revalidateddone");

  /* -------------------------------------------------------------------------- */
  /*                            DYNAMIC BREADCRUMBS                             */
  /* -------------------------------------------------------------------------- */

  const getDynamicBreadcrumbs = () => {
    const pathname = location.pathname;

    let moduleName = "WT";
    if (pathname.includes("/mt/")) moduleName = "MT";
    if (pathname.includes("/tp/")) moduleName = "TP";

    let crumbs = [
      { icon: HomeIcon, path: "/digit-ui/employee" },
      { label: t("WT_MODULE_NAME"), path: `/digit-ui/employee/module/details?moduleName=${moduleName}` },
    ];

    if (pathname.includes("/inbox")) {
      let label = "ES_COMMON_INBOX";
      if (pathname.includes("/tp/inbox")) label = "TP_INBOX";
      crumbs.push({ label: t(label) });
    } else if (pathname.includes("/my-bookings")) {
      let label = "WT_SEARCH_BOOKINGS";
      if (pathname.includes("/mt/my-bookings")) label = "MT_SEARCH_BOOKINGS";
      if (pathname.includes("/tp/my-bookings")) label = "TP_SEARCH_BOOKINGS";
      crumbs.push({ label: t(label) });
    } else if (pathname.includes("/request-service")) {
      crumbs.push({ label: t("WT_REQUEST_SERVICE") });
    } else if (pathname.includes("/booking-details") || pathname.includes("/bookingsearch/booking-details")) {
      const isSearch = pathname.includes("/bookingsearch");
      if (isSearch) {
        crumbs.push({ label: t("WT_SEARCH_BOOKINGS"), path: `${path}/my-bookings` });
      } else {
        crumbs.push({ label: t("ES_COMMON_INBOX"), path: `${path}/inbox` });
      }
      crumbs.push({ label: t("WT_BOOKING_DETAILS") });
    }

    return crumbs;
  };

  /* -------------------------------------------------------------------------- */
  /*                               INBOX STATES                                 */
  /* -------------------------------------------------------------------------- */

  const inboxInitialState = {
    searchParams: {
      uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
      services: ["watertanker"],
      applicationStatus: [],
      locality: [],
    },
  };

  const inboxInitialStateMt = {
    searchParams: {
      uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
      services: ["mobileToilet"],
      applicationStatus: [],
      locality: [],
    },
  };

  const inboxInitialStateTp = {
    searchParams: {
      uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
      services: ["treePruning"],
      applicationStatus: [],
      locality: [],
    },
  };

  const ApplicationDetails = Digit?.ComponentRegistryService?.getComponent("ApplicationDetails");

  const WTCreate = Digit?.ComponentRegistryService?.getComponent("WTCreate");

  /* -------------------------------------------------------------------------- */
  /*                                   RETURN                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Switch>
      <AppContainer>
        <div className="form-container">
          {/* -------------------------- MODULE HEADER -------------------------- */}
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
          {/* ----------------------------- ROUTES ----------------------------- */}
          {/* WT Inbox */}
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox
                useNewInboxAPI={true}
                parentRoute={path}
                businessService="watertanker"
                moduleCode="WT"
                filterComponent="WT_INBOX_FILTER"
                initialStates={inboxInitialState}
                isInbox={true}
              />
            )}
          />
          {/* MT Inbox */}
          <PrivateRoute
            path={`${path}/mt/inbox`}
            component={() => (
              <Inbox
                useNewInboxAPI={true}
                parentRoute={path}
                moduleCode="MT"
                businessService="mobileToilet"
                filterComponent="WT_INBOX_FILTER"
                initialStates={inboxInitialStateMt}
                isInbox={true}
              />
            )}
          />
          {/* TP Inbox */}
          <PrivateRoute
            path={`${path}/tp/inbox`}
            component={() => (
              <Inbox
                useNewInboxAPI={true}
                parentRoute={path}
                moduleCode="TP"
                businessService="treePruning"
                filterComponent="WT_INBOX_FILTER"
                initialStates={inboxInitialStateTp}
                isInbox={true}
              />
            )}
          />
          {/* Request Service */}
          <PrivateRoute path={`${path}/request-service`} component={WTCreate} />
          <PrivateRoute path={`${path}/mt/request-service`} component={WTCreate} />
          <PrivateRoute path={`${path}/tp/request-service`} component={WTCreate} />
          {/* Booking Details */}
          <PrivateRoute path={`${path}/booking-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/bookingsearch/booking-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
          {/* My Bookings */}
          <PrivateRoute path={`${path}/my-bookings`} component={(props) => <SearchApp {...props} parentRoute={path} moduleCode="WT" />} />
          <PrivateRoute path={`${path}/mt/my-bookings`} component={(props) => <SearchApp {...props} parentRoute={path} moduleCode="MT" />} />
          <PrivateRoute path={`${path}/tp/my-bookings`} component={(props) => <SearchApp {...props} parentRoute={path} moduleCode="TP" />} />
        </div>
      </AppContainer>
    </Switch>
  );
};

export default EmployeeApp;
