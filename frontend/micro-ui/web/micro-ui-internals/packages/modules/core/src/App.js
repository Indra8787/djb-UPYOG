// import React, { useEffect } from "react";
// import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
// import EmployeeApp from "./pages/employee";
// import CitizenApp from "./pages/citizen";

// export const DigitApp = ({ stateCode, modules, appTenants, logoUrl, initData }) => {
//   const history = useHistory();
//   const { pathname } = useLocation();
//   const innerWidth = window.innerWidth;
//   const cityDetails = Digit.ULBService.getCurrentUlb();
//   const userDetails = Digit.UserService.getUser();
//   const { data: storeData } = Digit.Hooks.useStore.getInitData();
//   const { stateInfo } = storeData || {};
//   const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
//   let CITIZEN = userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;

//   if (window.location.pathname.split("/").includes("employee")) CITIZEN = false;

//   useEffect(() => {
//     if (!pathname?.includes("application-details")) {
//       if (!pathname?.includes("inbox")) {
//         Digit.SessionStorage.del("fsm/inbox/searchParams");
//       }
//       if (pathname?.includes("search")) {
//         Digit.SessionStorage.del("fsm/search/searchParams");
//       }
//     }
//     if (!pathname?.includes("dss")) {
//       Digit.SessionStorage.del("DSS_FILTERS");
//     }
//     if (pathname?.toString() === "/digit-ui/employee") {
//       Digit.SessionStorage.del("SEARCH_APPLICATION_DETAIL");
//       Digit.SessionStorage.del("WS_EDIT_APPLICATION_DETAILS");
//     }
//     if (pathname?.toString() === "/digit-ui/employee" || pathname?.toString() === "/digit-ui/employee") {
//       Digit.SessionStorage.del("WS_DISCONNECTION");
//     }
//   }, [pathname]);

//   history.listen(() => {
//     window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   });

//   const handleUserDropdownSelection = (option) => {
//     option.func();
//   };

//   const mobileView = innerWidth <= 640;
//   let sourceUrl = `${window.location.origin}/employee`;
//   const commonProps = {
//     stateInfo,
//     userDetails,
//     CITIZEN,
//     cityDetails,
//     mobileView,
//     handleUserDropdownSelection,
//     logoUrl,
//     DSO,
//     stateCode,
//     modules,
//     appTenants,
//     sourceUrl,
//     pathname,
//     initData,
//   };
//   return (
//     <Switch>
//       <Route path="/digit-ui/employee">
//         <EmployeeApp {...commonProps} />
//       </Route>
//       <Route path="/digit-ui/citizen">
//         <CitizenApp {...commonProps} />
//       </Route>
//       {/* <Route>
//         <Redirect to="/digit-ui/employee" />
//       </Route> */}
//     </Switch>
//   );
// };



import React, { useEffect } from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import CitizenApp from "./pages/citizen";

export const DigitApp = ({ stateCode, modules, appTenants, logoUrl, initData }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const innerWidth = window.innerWidth;
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const userDetails = Digit.UserService.getUser();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);

  // ✅ Derive CITIZEN flag from actual user type in session
  const userType = (userDetails?.info?.type || "").toUpperCase();
  let CITIZEN = userType === "CITIZEN";

  // Fallback: if no user type yet, infer from URL
  if (!userType) {
    CITIZEN = !window.location.pathname.split("/").includes("employee");
  }

  // Explicit employee URL always overrides
  if (window.location.pathname.split("/").includes("employee")) {
    CITIZEN = false;
  }

  useEffect(() => {
    if (!pathname?.includes("application-details")) {
      if (!pathname?.includes("inbox")) {
        Digit.SessionStorage.del("fsm/inbox/searchParams");
      }
      if (pathname?.includes("search")) {
        Digit.SessionStorage.del("fsm/search/searchParams");
      }
    }
    if (!pathname?.includes("dss")) {
      Digit.SessionStorage.del("DSS_FILTERS");
    }
    if (pathname?.toString() === "/digit-ui/employee") {
      Digit.SessionStorage.del("SEARCH_APPLICATION_DETAIL");
      Digit.SessionStorage.del("WS_EDIT_APPLICATION_DETAILS");
      Digit.SessionStorage.del("WS_DISCONNECTION");
    }
  }, [pathname]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
    // ✅ Cleanup listener on unmount to prevent memory leaks
    return () => unlisten();
  }, [history]);

  const handleUserDropdownSelection = (option) => {
    option.func();
  };

  const mobileView = innerWidth <= 640;
  const sourceUrl = `${window.location.origin}/employee`;

  const commonProps = {
    stateInfo,
    userDetails,
    CITIZEN,
    cityDetails,
    mobileView,
    handleUserDropdownSelection,
    logoUrl,
    DSO,
    stateCode,
    modules,
    appTenants,
    sourceUrl,
    pathname,
    initData,
  };

  // ✅ Determine default redirect path based on logged-in user type
  const getDefaultRedirect = () => {
    if (!userDetails?.info) {
      // No user in session yet — Keycloak login pages will handle auth
      // Default to employee login as entry point
      return "/digit-ui/employee";
    }
    return userType === "CITIZEN" ? "/digit-ui/citizen" : "/digit-ui/employee";
  };

  return (
    <Switch>
      <Route path="/digit-ui/employee">
        <EmployeeApp {...commonProps} />
      </Route>
      <Route path="/digit-ui/citizen">
        <CitizenApp {...commonProps} />
      </Route>
      {/* ✅ Smart default redirect based on user type */}
      <Route>
        <Redirect to={getDefaultRedirect()} />
      </Route>
    </Switch>
  );
};