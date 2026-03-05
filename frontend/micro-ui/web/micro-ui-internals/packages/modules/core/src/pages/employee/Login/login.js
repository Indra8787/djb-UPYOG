// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { initKeycloak, getKeycloak } from "./keyCloak";
// import { fetchUserDetails } from "../../../../../../libraries/src/services/elements/UserDetails";
// import axios from 'axios';

// const Login = () => {
//   const history = useHistory();

//   const [ready, setReady] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   // Helper function to set user details in localStorage
//   const setUserDetail = (userObject, token, userType) => {
//     const locale =
//       JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";

//     const prefix = userType === "CITIZEN" ? "Citizen" : "Employee";

//     localStorage.setItem(`${prefix}.tenant-id`, userObject?.tenantId);
//     localStorage.setItem("tenant-id", userObject?.tenantId);

//     localStorage.setItem(
//       "citizen.userRequestObject",
//       JSON.stringify(userObject)
//     );

//     localStorage.setItem("locale", locale);
//     localStorage.setItem(`${prefix}.locale`, locale);

//     localStorage.setItem("token", token);
//     localStorage.setItem(`${prefix}.token`, token);

//     localStorage.setItem("user-info", JSON.stringify(userObject));
//     localStorage.setItem(`${prefix}.user-info`, JSON.stringify(userObject));
//   };

//   // New API call to fetch user details by UUID
//   const fetchUserDetailsByUUID = async (uuid, authToken, tenantId, userInfo) => {
//     try {
//       // Ensure we have the necessary information to make the request
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

//       // Making the API request using axios (can replace with your custom request function)
//       const response = await axios.post("/user/_search", requestPayload, {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       if (response.status !== 200) {
//         throw new Error(`Failed to fetch user details: ${response.statusText}`);
//       }

//       return response.data;  // Return the response data
//     } catch (error) {
//       console.error("Error fetching user details by UUID:", error);
//       throw error;  // Re-throw to be handled at the caller side
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
//         console.log("Fetching user details...");
//         const userDetailsResponse = await fetchUserDetails(kc);
//         console.log("User details response:", userDetailsResponse);

//         // Extract user info from first API response
//         const userInfoFromFirstCall = userDetailsResponse?.user ||
//           userDetailsResponse?.UserRequest ||
//           userDetailsResponse ||
//           {};

//         // Build complete userInfo for second API call
//         const userInfoPayload = {
//           id: userInfoFromFirstCall.id || null,
//           authToken: kc.token,
//           uuid: userInfoFromFirstCall.uuid || kc.tokenParsed?.sub || kc.subject,
//           userName: userInfoFromFirstCall.userName || null,
//           name: userInfoFromFirstCall.name || null,
//           mobileNumber: userInfoFromFirstCall.mobileNumber || null,
//           emailId: userInfoFromFirstCall.emailId || null,
//           locale: userInfoFromFirstCall.locale || "en_IN",
//           type: userInfoFromFirstCall.type,
//           roles: userInfoFromFirstCall.roles || [],
//           active: userInfoFromFirstCall.active !== undefined ? userInfoFromFirstCall.active : true,
//           tenantId: userInfoFromFirstCall.tenantId || tenantId,
//           permanentCity: userInfoFromFirstCall.permanentCity || null,
//         };

//         // API Call 2: Fetch user by UUID with complete userInfo from first call
//         console.log("Fetching user by UUID with userInfo:", userInfoPayload);
//         const userByUUIDResponse = await fetchUserDetailsByUUID(
//           userInfoFromFirstCall.uuid || kc.tokenParsed?.sub || kc.subject,
//           kc.token,  // ✅ Fixed: Pass the Keycloak instance, not kc.token
//           tenantId,
//           userInfoPayload // Pass complete userInfo from first API
//         );
//         console.log("User by UUID response:", userByUUIDResponse);

//         // Use the response from second API call as final user info
//         const userInfo = userByUUIDResponse?.user?.[0] ||
//           userInfoFromFirstCall ||
//           {};

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

//   // Step 3: Setup Digit session & redirect
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

//       const userType = user.info.type?.toUpperCase();
//       let redirectPath = userType === "CITIZEN" ? "/digit-ui/citizen" : "/digit-ui/employee";

//       if (window.location.href.includes("from=")) {
//         redirectPath =
//           decodeURIComponent(
//             window.location.href.split("from=")[1]
//           ) || redirectPath;
//       }

//       // National Admin
//       if (
//         user.info.roles?.length &&
//         user.info.roles.every((r) => r.code === "NATADMIN")
//       ) {
//         redirectPath =
//           "/digit-ui/employee/dss/landing/NURT_DASHBOARD";
//       }

//       // State Admin
//       if (
//         user.info.roles?.length &&
//         user.info.roles.every((r) => r.code === "STADMIN")
//       ) {
//         redirectPath =
//           "/digit-ui/employee/dss/landing/home";
//       }

//       history.replace(redirectPath);
//     } catch (err) {
//       console.error("User session setup failed:", err);
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

// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { getKeycloak } from "./keyCloak";
// import { fetchUserDetails } from "../../../../../../libraries/src/services/elements/UserDetails";
// import axios from "axios";

// const Login = () => {
//   const history = useHistory();

//   // const [ready, setReady] = useState(false);
//   // const [authenticated, setAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   // Helper function to set employee details in localStorage
//   const setEmployeeDetail = (userObject, token, userType) => {
//     const locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";

//     const prefix = userType === "CITIZEN" ? "Citizen" : "Employee";

//     localStorage.setItem(`${prefix}.tenant-id`, userObject?.tenantId);
//     localStorage.setItem("tenant-id", userObject?.tenantId);

//     localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));

//     localStorage.setItem("locale", locale);
//     localStorage.setItem("Employee.locale", locale);
//     // localStorage.setItem("token", token);
//     // localStorage.setItem(`${prefix}.token`, token);
//     localStorage.setItem("user-info", JSON.stringify(userObject));
//     localStorage.setItem(`${prefix}.user-info`, JSON.stringify(userObject));
//   };

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const kc = window.keycloak || getKeycloak();

//         if (!kc?.authenticated) {
//           kc.login({
//             redirectUri: window.location.origin + "/digit-ui/employee",
//           });
//           return;
//         }
//         const tenantId = "dl.djb";

//         // First API
//         const userDetailsResponse = await fetchUserDetails(kc);
//         const userInfoFromFirstCall = userDetailsResponse?.user || userDetailsResponse?.UserRequest || userDetailsResponse || {};

//         // Second API
//         const response = await axios.post(
//           "/user/_search",
//           {
//             tenantId,
//             uuid: [userInfoFromFirstCall.uuid || kc.tokenParsed?.sub],
//             pageSize: "100",
//             RequestInfo: {
//               apiId: "Rainmaker",
//               authToken: kc.token,
//               userInfo: userInfoFromFirstCall,
//               msgId: `${Date.now()}|en_IN`,
//             },
//           },
//           {
//             headers: { Authorization: `Bearer ${kc.token}` },
//           }
//         );

//         const finalUser = response?.data?.user?.[0] || userInfoFromFirstCall;

//         setUser({
//           access_token: kc.token,
//           info: finalUser,
//         });
//       } catch (err) {
//         console.error("User load failed:", err);
//         setError("Failed to load user details");
//       }
//     };

//     loadUser();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!user?.info) return;

//     try {
//       Digit.SessionStorage.set("User", user);
//       Digit.UserService.setUser(user);

//       setEmployeeDetail(user.info, user.access_token);

//       history.replace("/digit-ui/employee");
//     } catch (err) {
//       console.error("Session setup failed:", err);
//       setError("Failed to setup session");
//     }
//   }, [user, history]);

//   if (error) {
//     return (
//       <div style={{ padding: 20, textAlign: "center", color: "red" }}>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20, textAlign: "center" }}>
//       <p>Loading user details...</p>
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getKeycloak } from "./keyCloak";
import { fetchUserDetails } from "../../../../../../libraries/src/services/elements/UserDetails";
import axios from "axios";

const Login = () => {
  const history = useHistory();

  // const [ready, setReady] = useState(false);
  // const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Helper function to set employee details in localStorage
  const setEmployeeDetail = (userObject, token, userType) => {
    const locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || "en_IN";

    const prefix = userType === "CITIZEN" ? "Citizen" : "Employee";

    localStorage.setItem(`${prefix}.tenant-id`, userObject?.tenantId);
    localStorage.setItem("tenant-id", userObject?.tenantId);

    localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));

    localStorage.setItem("locale", locale);
    localStorage.setItem("Employee.locale", locale);
    localStorage.setItem("token", token);
    localStorage.setItem(`${prefix}.token`, token);
    localStorage.setItem("user-info", JSON.stringify(userObject));
    localStorage.setItem(`${prefix}.user-info`, JSON.stringify(userObject));
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const kc = window.keycloak || getKeycloak();

        if (!kc?.authenticated) {
          kc.login({
            redirectUri: window.location.origin + "/digit-ui/employee",
          });
          return;
        }
        const tenantId = "dl.djb";

        // First API
        const userDetailsResponse = await fetchUserDetails(kc);
        const userInfoFromFirstCall = userDetailsResponse?.user || userDetailsResponse?.UserRequest || userDetailsResponse || {};

        // Second API
        const response = await axios.post(
          "/user/_search",
          {
            tenantId,
            uuid: [userInfoFromFirstCall.uuid || kc.tokenParsed?.sub],
            pageSize: "100",
            RequestInfo: {
              apiId: "Rainmaker",
              authToken: kc.token,
              userInfo: userInfoFromFirstCall,
              msgId: `${Date.now()}|en_IN`,
            },
          },
          {
            headers: { Authorization: `Bearer ${kc.token}` },
          }
        );

        const finalUser = response?.data?.user?.[0] || userInfoFromFirstCall;

        setUser({
          access_token: kc.token,
          info: finalUser,
        });
      } catch (err) {
        console.error("User load failed:", err);
        setError("Failed to load user details");
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.info) return;

    try {
      Digit.SessionStorage.set("User", user);
      Digit.UserService.setUser(user);

      setEmployeeDetail(user?.info, user?.access_token, user?.info?.type);

      history.replace("/digit-ui/employee");
    } catch (err) {
      console.error("Session setup failed:", err);
      setError("Failed to setup session");
    }
  }, [user, history]);

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "red" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <p>Loading user details...</p>
    </div>
  );
};

export default Login;
