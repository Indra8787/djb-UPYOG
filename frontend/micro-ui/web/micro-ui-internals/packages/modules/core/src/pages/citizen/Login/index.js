// // import React, { useEffect, useMemo, useState } from "react";
// // import { useTranslation } from "react-i18next";
// // import { AppContainer, BackButton, Toast } from "@djb25/digit-ui-react-components";
// // import { Route, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
// // import { loginSteps } from "./config";
// // import SelectMobileNumber from "./SelectMobileNumber";
// // import SelectOtp from "./SelectOtp";
// // import SelectName from "./SelectName";
// // import { subYears, format } from "date-fns";
// // const TYPE_REGISTER = { type: "register" };
// // const TYPE_LOGIN = { type: "login" };
// // const DEFAULT_USER = "digit-user";
// // const DEFAULT_REDIRECT_URL = "/digit-ui/citizen";

// // /* set citizen details to enable backward compatiable */
// // const setCitizenDetail = (userObject, token, tenantId) => {
// //   let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
// //   localStorage.setItem("Citizen.tenant-id", tenantId);
// //   localStorage.setItem("tenant-id", tenantId);
// //   localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
// //   localStorage.setItem("locale", locale);
// //   localStorage.setItem("Citizen.locale", locale);
// //   localStorage.setItem("token", token);
// //   localStorage.setItem("Citizen.token", token);
// //   localStorage.setItem("user-info", JSON.stringify(userObject));
// //   localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
// // };

// // const getFromLocation = (state, searchParams) => {
// //   return state?.from || searchParams?.from || DEFAULT_REDIRECT_URL;
// // };

// // const Login = ({ stateCode, isUserRegistered = true }) => {
// //   const { t } = useTranslation();
// //   const location = useLocation();
// //   const { path, url } = useRouteMatch();
// //   const history = useHistory();
// //   const [user, setUser] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [isOtpValid, setIsOtpValid] = useState(true);
// //   const [tokens, setTokens] = useState(null);
// //   const [params, setParmas] = useState(isUserRegistered ? {} : location?.state?.data);
// //   const [errorTO, setErrorTO] = useState(null);
// //   const searchParams = Digit.Hooks.useQueryParams();
// //   const [canSubmitName, setCanSubmitName] = useState(false);
// //   const [canSubmitOtp, setCanSubmitOtp] = useState(true);
// //   const [canSubmitNo, setCanSubmitNo] = useState(true);

// //   useEffect(() => {
// //     let errorTimeout;
// //     if (error) {
// //       if (errorTO) {
// //         clearTimeout(errorTO);
// //         setErrorTO(null);
// //       }
// //       errorTimeout = setTimeout(() => {
// //         setError("");
// //       }, 5000);
// //       setErrorTO(errorTimeout);
// //     }
// //     return () => {
// //       errorTimeout && clearTimeout(errorTimeout);
// //     };
// //   }, [error]);

// //   useEffect(() => {
// //     if (!user) {
// //       return;
// //     }
// //     Digit.SessionStorage.set("citizen.userRequestObject", user);
// //     Digit.UserService.setUser(user);
// //     setCitizenDetail(user?.info, user?.access_token, stateCode);
// //     const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
// //     if (!Digit.ULBService.getCitizenCurrentTenant(true)) {
// //       history.replace("/digit-ui/citizen/select-location", {
// //         redirectBackTo: redirectPath,
// //       });
// //     } else {
// //       history.replace(redirectPath);
// //     }
// //   }, [user]);

// //   const stepItems = useMemo(() =>
// //     loginSteps.map(
// //       (step) => {
// //         const texts = {};
// //         for (const key in step.texts) {
// //           texts[key] = t(step.texts[key]);
// //         }
// //         return { ...step, texts };
// //       },
// //       [loginSteps]
// //     )
// //   );

// //   const getUserType = () => "citizen";

// //   const handleOtpChange = (otp) => {
// //     setParmas({ ...params, otp });
// //   };

// //   const handleMobileChange = (event) => {
// //     const { value } = event.target;
// //     setParmas({ ...params, mobileNumber: value });
// //   };

// //   const selectMobileNumber = async (mobileNumber) => {
// //     setCanSubmitNo(false);
// //     setParmas({ ...params, ...mobileNumber });
// //     const data = {
// //       ...mobileNumber,
// //       tenantId: stateCode,
// //       userType: "citizen",
// //     };
// //     if (isUserRegistered) {
// //       const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
// //       if (!err) {
// //         setCanSubmitNo(true);
// //         history.replace(`${path}/otp`, { from: getFromLocation(location.state, searchParams), role: location.state?.role });
// //         return;
// //       } else {
// //         setCanSubmitNo(true);
// //         if (!(location.state && location.state.role === ("FSM_DSO" || "WT_VENDOR"))) {
// //           history.push(`/digit-ui/citizen/register/name`, { from: getFromLocation(location.state, searchParams), data: data });
// //         }
// //       }
// //       if (location.state?.role) {
// //         setCanSubmitNo(true);
// //         setError(location.state?.role === "FSM_DSO" ? t("ES_ERROR_DSO_LOGIN") : "User not registered.");
// //       }
// //       if (location.state?.role) {
// //         setCanSubmitNo(true);
// //         setError(location.state?.role === "WT_VENDOR" ? t("ES_ERROR_WT_VENDOR_LOGIN") : "User not registered.");
// //       }
// //     } else {
// //       const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
// //       if (!err) {
// //         setCanSubmitNo(true);
// //         history.replace(`${path}/otp`, { from: getFromLocation(location.state, searchParams) });
// //         return;
// //       }
// //       setCanSubmitNo(true);
// //     }
// //   };
// //   function selectCommencementDate(value) {
// //     const appDate = new Date();
// //     const proposedDate = format(subYears(appDate, 18), 'yyyy-MM-dd').toString();

// //     if (convertDateToEpoch(proposedDate) <= convertDateToEpoch(value)) {
// //       return true
// //     }
// //     else {
// //       return false;
// //     }
// //   }
// //   const selectName = async (name) => {
// //     const data = {
// //       ...params,
// //       tenantId: stateCode,
// //       userType: getUserType(),
// //       ...name,
// //     };
// //     console.log("name", name)
// //     if (selectCommencementDate(name.dob)) {
// //       setError("Minimum age should be 18 years");
// //       setTimeout(() => {
// //         setError(false);
// //       }, 3000);
// //     }
// //     else {
// //       setParmas({ ...params, ...name });
// //       setCanSubmitName(true);
// //       const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
// //       if (res) {
// //         setCanSubmitName(false);
// //         history.replace(`${path}/otp`, { from: getFromLocation(location.state, searchParams) });
// //       } else {
// //         setCanSubmitName(false);
// //       }
// //     }


// //   };

// //   const selectOtp = async () => {
// //     try {
// //       setIsOtpValid(true);
// //       setCanSubmitOtp(false);
// //       const { mobileNumber, otp, name } = params;
// //       if (isUserRegistered) {
// //         const requestData = {
// //           username: mobileNumber ? mobileNumber : sessionStorage.getItem("userName"),
// //           password: otp,
// //           tenantId: stateCode,
// //           userType: getUserType(),
// //         };
// //         const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);

// //         if (location.state?.role) {
// //           const roleInfo = info.roles.find((userRole) => userRole.code === location.state.role);
// //           if (!roleInfo || !roleInfo.code) {
// //             setError(t("ES_ERROR_USER_NOT_PERMITTED"));
// //             setTimeout(() => history.replace(DEFAULT_REDIRECT_URL), 5000);
// //             return;
// //           }
// //         }
// //         if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
// //           info.tenantId = Digit.ULBService.getStateId();
// //         }

// //         setUser({ info, ...tokens });
// //       } else if (!isUserRegistered) {
// //         const requestData = {
// //           name,
// //           username: mobileNumber,
// //           otpReference: otp,
// //           tenantId: stateCode,
// //         };

// //         const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.registerUser(requestData, stateCode);

// //         if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
// //           info.tenantId = Digit.ULBService.getStateId();
// //         }

// //         setUser({ info, ...tokens });
// //       }
// //     } catch (err) {
// //       setCanSubmitOtp(true);
// //       setIsOtpValid(false);
// //     }
// //   };

// //   const resendOtp = async () => {
// //     const { mobileNumber } = params;
// //     const data = {
// //       mobileNumber,
// //       tenantId: stateCode,
// //       userType: getUserType(),
// //     };
// //     if (!isUserRegistered) {
// //       const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
// //     } else if (isUserRegistered) {
// //       const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
// //     }
// //   };

// //   const sendOtp = async (data) => {
// //     try {
// //       const res = await Digit.UserService.sendOtp(data, stateCode);
// //       return [res, null];
// //     } catch (err) {
// //       return [null, err];
// //     }
// //   };

// //   return (
// //     <div className="citizen-form-wrapper">
// //       <Switch>
// //         <AppContainer>
// //           <BackButton />
// //           <Route path={`${path}`} exact>
// //             <SelectMobileNumber
// //               onSelect={selectMobileNumber}
// //               config={stepItems[0]}
// //               mobileNumber={params.mobileNumber || ""}
// //               onMobileChange={handleMobileChange}
// //               canSubmit={canSubmitNo}
// //               showRegisterLink={isUserRegistered && !location.state?.role}
// //               t={t}
// //             />
// //           </Route>
// //           <Route path={`${path}/otp`}>
// //             <SelectOtp
// //               config={{ ...stepItems[1], texts: { ...stepItems[1].texts, cardText: `${stepItems[1].texts.cardText} ${params.mobileNumber || ""}` } }}
// //               onOtpChange={handleOtpChange}
// //               onResend={resendOtp}
// //               onSelect={selectOtp}
// //               otp={params.otp}
// //               error={isOtpValid}
// //               canSubmit={canSubmitOtp}
// //               t={t}
// //             />
// //           </Route>
// //           <Route path={`${path}/name`}>
// //             <SelectName config={stepItems[2]} onSelect={selectName} t={t} isDisabled={canSubmitName} />
// //           </Route>
// //           {error && <Toast error={true} label={error} onClose={() => setError(null)} />}
// //         </AppContainer>
// //       </Switch>
// //     </div>
// //   );
// // };

// // export default Login;
// // export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
// //   //example input format : "2018-10-02"
// //   try {
// //     const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
// //     const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
// //     DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
// //     if (dayStartOrEnd === "dayend") {
// //       DateObj.setHours(DateObj.getHours() + 24);
// //       DateObj.setSeconds(DateObj.getSeconds() - 1);
// //     }
// //     return DateObj.getTime();
// //   } catch (e) {
// //     return dateString;
// //   }
// // };

// // // import React, { useEffect, useState } from "react";
// // // import { useHistory } from "react-router-dom";
// // // import { initKeycloak, getKeycloak } from "../../employee/Login/keyCloak";
// // // import { fetchUserDetails } from "../../../../../../libraries/src/services/elements/UserDetails";

// // // const Login = () => {
// // //   const history = useHistory();
// // //   const [ready, setReady] = useState(false);
// // //   const [authenticated, setAuthenticated] = useState(false);
// // //   const [user, setUser] = useState(null);
// // //   const [error, setError] = useState(null);

// // //   // Helper to set citizen details in localStorage
// // //   const setCitizenDetail = (userObject, token) => {
// // //     const locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";

// // //     localStorage.setItem("Citizen.tenant-id", userObject?.tenantId);
// // //     localStorage.setItem("tenant-id", userObject?.tenantId);
// // //     localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
// // //     localStorage.setItem("locale", locale);
// // //     localStorage.setItem("Citizen.locale", locale);
// // //     localStorage.setItem("token", token);
// // //     localStorage.setItem("Citizen.token", token);
// // //     localStorage.setItem("user-info", JSON.stringify(userObject));
// // //     localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
// // //   };

// // //   // Step 1: Initialize Keycloak
// // //   useEffect(() => {
// // //     initKeycloak(() => {
// // //       const kc = getKeycloak();
// // //       if (kc?.authenticated) setAuthenticated(true);
// // //       setReady(true);
// // //     });
// // //   }, []);

// // //   // Step 2: Fetch user details using new fetchUserDetails
// // //   useEffect(() => {
// // //     if (!ready || !authenticated) return;

// // //     const loadUser = async () => {
// // //       try {
// // //         const kc = getKeycloak();
// // //         if (!kc?.token) throw new Error("Keycloak token missing");

// // //         const userDetailsResponse = await fetchUserDetails(kc);
// // //         const userInfo = userDetailsResponse?.user?.[0] || userDetailsResponse || {};

// // //         setUser({ access_token: kc.token, info: userInfo });
// // //       } catch (err) {
// // //         console.error("Failed to fetch user details:", err);
// // //         setError("Failed to load user details");
// // //       }
// // //     };

// // //     loadUser();
// // //   }, [ready, authenticated]);

// // //   // Step 3: Setup Digit session & redirect
// // //   useEffect(() => {
// // //     if (!user?.info) return;

// // //     try {
// // //       Digit.SessionStorage.set("User", user);
// // //       Digit.UserService.setUser(user);
// // //       setCitizenDetail(user.info, user.access_token);

// // //       const userType = (user.info.type || "").toUpperCase();
// // //       let redirectPath = userType === "EMPLOYEE" ? "/digit-ui/employee" : "/digit-ui/citizen";

// // //       if (window.location.href.includes("from=")) {
// // //         redirectPath = decodeURIComponent(window.location.href.split("from=")[1]) || redirectPath;
// // //       }

// // //       history.replace(redirectPath);
// // //     } catch (err) {
// // //       console.error("Citizen session setup failed:", err);
// // //       setError("Failed to setup user session");
// // //     }
// // //   }, [user, history]);

// // //   // Render UI states
// // //   if (!ready) return <div style={{ padding: 20, textAlign: "center" }}>Authenticating with Keycloak...</div>;
// // //   if (!authenticated) return <div style={{ padding: 20, textAlign: "center" }}>Authentication failed. Please login again.</div>;
// // //   if (error) return <div style={{ padding: 20, textAlign: "center", color: "red" }}>{error}</div>;
// // //   if (!user) return <div style={{ padding: 20, textAlign: "center" }}>Loading user details...</div>;

// // //   return null; // redirect happens automatically
// // // };

// // // export default Login;



// // // // const Login = () => {
// // // //   return (
// // // //     <div>
// // // //       <h1>Login citizen login</h1>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Login;



// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { initKeycloak, getKeycloak } from "../../employee/Login/keyCloak";
// import { fetchUserDetails } from "../../../../../../libraries/src/services/elements/UserDetails";
// import axios from "axios";
// import { CloseSvg } from "@djb25/digit-ui-react-components";

// // Helper to set user details in localStorage
// const setUserDetail = (userObject, token, userType) => {
//   const locale =
//     JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";

//   const prefix = userType === "CITIZEN" ? "Citizen" : "Employee";

//   localStorage.setItem(`${prefix}.tenant-id`, userObject?.tenantId);
//   localStorage.setItem("tenant-id", userObject?.tenantId);
//   localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
//   localStorage.setItem("locale", locale);
//   localStorage.setItem(`${prefix}.locale`, locale);
//   localStorage.setItem("token", token);
//   localStorage.setItem(`${prefix}.token`, token);
//   localStorage.setItem("user-info", JSON.stringify(userObject));
//   localStorage.setItem(`${prefix}.user-info`, JSON.stringify(userObject));
// };

// const Login = () => {
//   const history = useHistory();

//   const [ready, setReady] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   // API call to fetch user details by UUID
//   const fetchUserDetailsByUUID = async (uuid, authToken, tenantId, userInfo) => {
//     try {
//       if (!uuid || !authToken || !tenantId) {
//         throw new Error("Missing required parameters (UUID, AuthToken, TenantId)");
//       }

//       const requestPayload = {
//         tenantId,
//         uuid: [uuid],
//         pageSize: "100",
//         RequestInfo: {
//           apiId: "Rainmaker",
//           authToken,
//           userInfo,
//           msgId: `${Date.now()}|en_IN`,
//           plainAccessRequest: {},
//         },
//       };

//       const response = await axios.post("/user/_search", requestPayload, {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (response.status !== 200) {
//         throw new Error(`Failed to fetch user details: ${response.statusText}`);
//       }

//       return response.data;
//     } catch (err) {
//       console.error("Error fetching user details by UUID:", err);
//       throw err;
//     }
//   };

//   // Step 1: Initialize Keycloak
//   useEffect(() => {
//     initKeycloak(() => {
//       const kc = getKeycloak();
//       if (kc?.authenticated) {
//         setAuthenticated(true);
//       }
//       setReady(true);
//     });
//   }, []);

//   // Step 2: Fetch user details from both APIs
//   useEffect(() => {
//     if (!ready || !authenticated) return;

//     const loadUser = async () => {
//       try {
//         const kc = getKeycloak();

//         if (!kc?.token) {
//           throw new Error("Keycloak token missing");
//         }

//         const tenantId = "dl.djb";

//         // API Call 1: Fetch user details using fetchUserDetails
//         const userDetailsResponse = await fetchUserDetails(kc);

//         // Extract user info from first API response
//         const userInfoFromFirstCall =
//           userDetailsResponse?.user ||
//           userDetailsResponse?.UserRequest ||
//           userDetailsResponse ||
//           {};

//         // Build complete userInfo for second API call
//         const userInfoPayload = {
//           id: userInfoFromFirstCall.id || null,
//           authToken: kc.token,
//           uuid:
//             userInfoFromFirstCall.uuid || kc.tokenParsed?.sub || kc.subject,
//           userName: userInfoFromFirstCall.userName || null,
//           name: userInfoFromFirstCall.name || null,
//           mobileNumber: userInfoFromFirstCall.mobileNumber || null,
//           emailId: userInfoFromFirstCall.emailId || null,
//           locale: userInfoFromFirstCall.locale || "en_IN",
//           type: userInfoFromFirstCall.type,
//           roles: userInfoFromFirstCall.roles || [],
//           active:
//             userInfoFromFirstCall.active !== undefined
//               ? userInfoFromFirstCall.active
//               : true,
//           tenantId: userInfoFromFirstCall.tenantId || tenantId,
//           permanentCity: userInfoFromFirstCall.permanentCity || null,
//         };


//         console.log(userInfoPayload, "userInfoPayloadCitizen")

//         // API Call 2: Fetch user by UUID
//         const userByUUIDResponse = await fetchUserDetailsByUUID(
//           userInfoFromFirstCall.uuid || kc.tokenParsed?.sub || kc.subject,
//           kc.token,
//           tenantId,
//           userInfoPayload
//         );

//         // Use the response from second API call as final user info
//         const userInfo =
//           userByUUIDResponse?.user?.[0] || userInfoFromFirstCall || {};

//         setUser({
//           access_token: kc.token,
//           info: userInfo,
//         });
//       } catch (err) {
//         console.error("User details fetch failed:", err);
//         setError("Failed to load user details");
//       }
//     };

//     loadUser();
//   }, [ready, authenticated]);

//   // Step 3: Setup Digit session & redirect based on user type
//   useEffect(() => {
//     if (!user?.info) return;

//     try {
//       Digit.SessionStorage.set("User", user);

//       const tenantId =
//         user.info.tenantId || Digit.ULBService.getCurrentTenantId();

//       if (user.info.roles?.length) {
//         user.info.roles = user.info.roles.filter(
//           (r) => r.tenantId === tenantId
//         );
//       }

//       Digit.UserService.setUser(user);
//       setUserDetail(user.info, user.access_token, user.info.type);

//       // ✅ Redirect based on user type from API response
//       const userType = (user.info.type || "").toUpperCase();
//       let redirectPath =
//         userType === "CITIZEN" ? "/digit-ui/citizen" : "/digit-ui/employee";

//       // Override with "from" query param if present
//       if (window.location.href.includes("from=")) {
//         redirectPath =
//           decodeURIComponent(window.location.href.split("from=")[1]) ||
//           redirectPath;
//       }

//       // National Admin override
//       if (
//         user.info.roles?.length &&
//         user.info.roles.every((r) => r.code === "NATADMIN")
//       ) {
//         redirectPath = "/digit-ui/employee/dss/landing/NURT_DASHBOARD";
//       }

//       // State Admin override
//       if (
//         user.info.roles?.length &&
//         user.info.roles.every((r) => r.code === "STADMIN")
//       ) {
//         redirectPath = "/digit-ui/employee/dss/landing/home";
//       }

//       history.replace(redirectPath);
//     } catch (err) {
//       console.error("Citizen session setup failed:", err);
//       setError("Failed to setup user session");
//     }
//   }, [user, history]);

//   // UI states
//   if (!ready) {
//     return (
//       <div style={{ padding: 20, textAlign: "center" }}>
//         <p>Authenticating with Keycloak...</p>
//       </div>
//     );
//   }

//   if (!authenticated) {
//     return (
//       <div style={{ padding: 20, textAlign: "center" }}>
//         <p>Authentication failed. Please login again.</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: 20, textAlign: "center", color: "red" }}>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div style={{ padding: 20, textAlign: "center" }}>
//         <p>Loading user details...</p>
//       </div>
//     );
//   }

//   return null;
// };

// export default Login;


import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { initKeycloak, getKeycloak } from "../../employee/Login/keyCloak";
import { fetchUserDetails } from "../../../../../../libraries/src/services/elements/UserDetails";

// Helper to set user details in localStorage
const setUserDetail = (userObject, token, userType) => {
  const locale =
    JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";

  const prefix = userType === "CITIZEN" ? "Citizen" : "Employee";

  localStorage.setItem(`${prefix}.tenant-id`, userObject?.tenantId);
  localStorage.setItem("tenant-id", userObject?.tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem(`${prefix}.locale`, locale);
  localStorage.setItem("token", token);
  localStorage.setItem(`${prefix}.token`, token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem(`${prefix}.user-info`, JSON.stringify(userObject));
};

const Login = () => {
  const history = useHistory();

  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Step 1: Initialize Keycloak
  useEffect(() => {
    initKeycloak(() => {
      const kc = getKeycloak();
      if (kc?.authenticated) {
        setAuthenticated(true);
      }
      setReady(true);
    });
  }, []);

  // Step 2: Fetch user details
  useEffect(() => {
    if (!ready || !authenticated) return;

    const loadUser = async () => {
      try {
        const kc = getKeycloak();

        if (!kc?.token) {
          throw new Error("Keycloak token missing");
        }

        // Single API call: Fetch user details using fetchUserDetails
        const userDetailsResponse = await fetchUserDetails(kc);

        // Extract user info from API response
        const userInfo =
          userDetailsResponse?.user ||
          userDetailsResponse?.UserRequest ||
          userDetailsResponse ||
          {};

        setUser({
          access_token: kc.token,
          info: userInfo,
        });
      } catch (err) {
        console.error("User details fetch failed:", err);
        setError("Failed to load user details");
      }
    };

    loadUser();
  }, [ready, authenticated]);

  // Step 3: Setup Digit session & redirect based on user type
  useEffect(() => {
    if (!user?.info) return;

    try {
      Digit.SessionStorage.set("User", user);

      const tenantId =
        user.info.tenantId || Digit.ULBService.getCurrentTenantId();

      if (user.info.roles?.length) {
        user.info.roles = user.info.roles.filter(
          (r) => r.tenantId === tenantId
        );
      }

      setUserDetail(user.info, user.access_token, user.info.type);

      // Redirect based on user type from API response
      const userType = (user.info.type || "").toUpperCase();
      let redirectPath =
        userType === "CITIZEN" ? "/digit-ui/citizen" : "/digit-ui/employee";

      // Override with "from" query param if present
      if (window.location.href.includes("from=")) {
        redirectPath =
          decodeURIComponent(window.location.href.split("from=")[1]) ||
          redirectPath;
      }

      // National Admin override
      if (
        user.info.roles?.length &&
        user.info.roles.every((r) => r.code === "NATADMIN")
      ) {
        redirectPath = "/digit-ui/employee/dss/landing/NURT_DASHBOARD";
      }

      // State Admin override
      if (
        user.info.roles?.length &&
        user.info.roles.every((r) => r.code === "STADMIN")
      ) {
        redirectPath = "/digit-ui/employee/dss/landing/home";
      }

      history.replace(redirectPath);
    } catch (err) {
      console.error("Citizen session setup failed:", err);
      setError("Failed to setup user session");
    }
  }, [user, history]);

  // UI states
  if (!ready) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Authenticating with Keycloak...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Authentication failed. Please login again.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "red" }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading user details...</p>
      </div>
    );
  }

  return null;
};

export default Login;