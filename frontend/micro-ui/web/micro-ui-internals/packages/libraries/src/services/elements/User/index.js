import Urls from "../../atoms/urls";
import { Request, ServiceRequest } from "../../atoms/Utils/Request";
import { Storage } from "../../atoms/Utils/Storage";

export const UserService = {
  authenticate: (details) => {
    const data = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => data.append(key, value));
    data.append("scope", "read");
    data.append("grant_type", "password");
    return ServiceRequest({
      serviceName: "authenticate",
      url: Urls.Authenticate,
      data,
      headers: {
        authorization: `Basic ${window?.globalConfigs?.getConfig("JWT_TOKEN") || "ZWdvdi11c2VyLWNsaWVudDo="}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },
  logoutUser: async () => {
    try {
      const user = UserService.getUser();
      const kc = window.keycloak;

      // 1️⃣ Call backend logout (optional but good practice)
      if (user?.access_token) {
        try {
          await ServiceRequest({
            serviceName: "logoutUser",
            url: Urls.UserLogout,
            data: { access_token: user.access_token },
            auth: true,
            params: {
              tenantId: user?.info?.type === "CITIZEN" ? Digit.ULBService.getStateId() : Digit.ULBService.getCurrentTenantId(),
            },
          });
        } catch (e) {
          console.warn("Backend logout failed (continuing):", e);
        }
      }

      // 2️⃣ Clear Digit session
      await Digit.SessionStorage.del();
      sessionStorage.clear();
      localStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("Employee.token");
      localStorage.removeItem("Employee.user-info");

      // 3️⃣ Logout from Keycloak (THIS IS IMPORTANT)
      if (kc) {
        kc.logout({
          // redirectUri: window.location.origin + "/digit-ui",
          idTokenHint: kc.idToken,
        });
      }

      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  },
  getType: () => {
    return Storage.get("userType") || "citizen";
  },
  setType: (userType) => {
    Storage.set("userType", userType);
    Storage.set("user_type", userType);
  },
  getUser: () => {
    return Digit.SessionStorage.get("User");
  },
  logout: async () => {
    const userType = UserService.getType();
    try {
      await UserService.logoutUser();
    } catch (e) {
    } finally {
      window.localStorage.clear();
      window.sessionStorage.clear();
      if (userType === "citizen") {
        window.location.replace("/digit-ui/citizen/login");
      } else {
        window.location.replace("/digit-ui/employee/user/login");
      }
    }
  },
  sendOtp: (details, stateCode) =>
    ServiceRequest({
      serviceName: "sendOtp",
      url: Urls.OTP_Send,
      data: details,
      auth: false,
      params: { tenantId: stateCode },
    }),
  setUser: (data) => {
    return Digit.SessionStorage.set("User", data);
  },
  setExtraRoleDetails: (data) => {
    const userDetails = Digit.SessionStorage.get("User");
    return Digit.SessionStorage.set("User", { ...userDetails, extraRoleInfo: data });
  },
  getExtraRoleDetails: () => {
    return Digit.SessionStorage.get("User")?.extraRoleInfo;
  },
  registerUser: (details, stateCode) =>
    ServiceRequest({
      serviceName: "registerUser",
      url: Urls.RegisterUser,
      data: {
        User: details,
      },
      params: { tenantId: stateCode },
    }),
  updateUser: async (details, stateCode) =>
    ServiceRequest({
      serviceName: "updateUser",
      url: Urls.UserProfileUpdate,
      auth: true,
      data: {
        user: details,
      },
      params: { tenantId: stateCode },
    }),

  //create address for user
  createAddressV2: async (details, stateCode, userUuid) =>
    ServiceRequest({
      serviceName: "createAddress",
      url: Urls.UserCreateAddressV2,
      auth: true,
      data: {
        address: details,
        userUuid: userUuid,
      },
      params: { tenantId: stateCode },
    }),
  hasAccess: (accessTo) => {
    const user = Digit.UserService.getUser();
    if (!user || !user.info) return false;
    const { roles } = user.info;
    return roles && Array.isArray(roles) && roles.filter((role) => accessTo.includes(role.code)).length;
  },

  changePassword: (details, stateCode) =>
    ServiceRequest({
      serviceName: "changePassword",
      url: Digit.SessionStorage.get("User")?.info ? Urls.ChangePassword1 : Urls.ChangePassword,
      data: {
        ...details,
      },
      auth: true,
      params: { tenantId: stateCode },
    }),

  employeeSearch: (tenantId, filters) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId, ...filters },
      auth: true,
    });
  },
  //GET captcha for user
  userCaptchaSearch: async (tenantId, data) => {
    return Request({
      url: Urls.UserCaptcha,
      method: "GET",
    });
  },
  userSearch: async (tenantId, data, filters) => {
    return Request({
      url: Urls.UserSearch,
      params: { ...filters },
      method: "POST",
      auth: true,
      userService: true,
      data: data.pageSize ? { tenantId, ...data } : { tenantId, ...data, pageSize: "100" },
    });
  },
  // user search for user profile
  userSearchNewV2: async (tenantId, data, filters) => {
    return Request({
      url: Urls.UserSearchNewV2,
      params: { ...filters },
      method: "POST",
      auth: true,
      userService: true,
      data: data.pageSize ? { tenantId, ...data } : { tenantId, ...data, pageSize: "100" },
    });
  },
  //update address for user
  updateAddressV2: async (details, stateCode) =>
    ServiceRequest({
      serviceName: "updateAddress",
      url: Urls.UserUpdateAddressV2,
      auth: true,
      data: {
        address: details,
      },
      params: { tenantId: stateCode },
    }),
};
