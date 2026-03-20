import React, { useEffect, useState } from "react";
import {
  StandaloneSearchBar,
  Loader,
  CardBasedOptions,
  ComplaintIcon,
  PTIcon,
  CaseIcon,
  DropIcon,
  HomeIcon,
  Calender,
  DocumentIcon,
  HelpIcon,
  WhatsNewCard,
  OBPSIcon,
  WSICon,
  CHBIcon,
} from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CitizenSideBar } from "../../../components/TopBarSideBar/SideBar/CitizenSideBar";
import StaticCitizenSideBar from "../../../components/TopBarSideBar/SideBar/StaticCitizenSideBar";
import ChatBot from "./ChatBot";
// const Home = () => {
//   const { t } = useTranslation();
//   const history = useHistory();
//   const tenantId = Digit.ULBService.getCitizenCurrentTenant(true);
//   const { data: { stateInfo, uiHomePage } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
//   let isMobile = window.Digit.Utils.browser.isMobile();
//   if(window.Digit.SessionStorage.get("TL_CREATE_TRADE")) window.Digit.SessionStorage.set("TL_CREATE_TRADE",{})

//   const conditionsToDisableNotificationCountTrigger = () => {
//     if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
//     if (!Digit.UserService?.getUser()?.access_token) return false;
//     return true;
//   };

//   const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({
//     tenantId,
//     variant: "whats-new",
//     config: {
//       enabled: conditionsToDisableNotificationCountTrigger(),
//     },
//   });

//   if (!tenantId) {
//     Digit.SessionStorage.get("locale") === null
//       ? history.push(`/digit-ui/employee/select-language`)
//       : history.push(`/digit-ui/employee/select-location`);
//   }

//   const appBannerWebObj = uiHomePage?.appBannerDesktop;
//   const appBannerMobObj = uiHomePage?.appBannerMobile;
//   const citizenServicesObj = uiHomePage?.citizenServicesCard;
//   const infoAndUpdatesObj = uiHomePage?.informationAndUpdatesCard;
//   const whatsAppBannerWebObj = uiHomePage?.whatsAppBannerDesktop;
//   const whatsAppBannerMobObj = uiHomePage?.whatsAppBannerMobile;
//   const whatsNewSectionObj = uiHomePage?.whatsNewSection;

//   const handleClickOnWhatsAppBanner = (obj) => {
//     window.open(obj?.navigationUrl);
//   };

//   const allCitizenServicesProps = {
//     header: t(citizenServicesObj?.headerLabel),
//     sideOption: {
//       name: t(citizenServicesObj?.sideOption?.name),
//       onClick: () => history.push(citizenServicesObj?.sideOption?.navigationUrl),
//     },
//     options: [
//       {
//         name: t(citizenServicesObj?.props?.[0]?.label),
//         Icon: <ComplaintIcon />,
//         onClick: () => history.push(citizenServicesObj?.props?.[0]?.navigationUrl),
//       },
//       {
//         name: t(citizenServicesObj?.props?.[1]?.label),
//         Icon: <PTIcon className="fill-path-primary-main" />,
//         onClick: () => history.push(citizenServicesObj?.props?.[1]?.navigationUrl),
//       },
//       {
//         name: t(citizenServicesObj?.props?.[2]?.label),
//         Icon: <CaseIcon className="fill-path-primary-main" />,
//         onClick: () => history.push(citizenServicesObj?.props?.[2]?.navigationUrl),
//       },
//       // {
//       //     name: t("ACTION_TEST_WATER_AND_SEWERAGE"),
//       //     Icon: <DropIcon/>,
//       //     onClick: () => history.push("/digit-ui/citizen")
//       // },
//       {
//         name: t(citizenServicesObj?.props?.[3]?.label),
//         Icon: <CHBIcon />,
//         onClick: () => history.push(citizenServicesObj?.props?.[3]?.navigationUrl),
//       },
//     ],
//     styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
//   };
//   const allInfoAndUpdatesProps = {
//     header: t(infoAndUpdatesObj?.headerLabel),
//     sideOption: {
//       name: t(infoAndUpdatesObj?.sideOption?.name),
//       onClick: () => history.push(infoAndUpdatesObj?.sideOption?.navigationUrl),
//     },
//     options: [
//       {
//         name: t(infoAndUpdatesObj?.props?.[0]?.label),
//         Icon: <HomeIcon />,
//         onClick: () => history.push(infoAndUpdatesObj?.props?.[0]?.navigationUrl),
//       },
//       {
//         name: t(infoAndUpdatesObj?.props?.[1]?.label),
//         Icon: <Calender />,
//         onClick: () => history.push(infoAndUpdatesObj?.props?.[1]?.navigationUrl),
//       },
//       {
//         name: t(infoAndUpdatesObj?.props?.[2]?.label),
//         Icon: <DocumentIcon />,
//         onClick: () => history.push(infoAndUpdatesObj?.props?.[2]?.navigationUrl),
//       },
//       {
//         name: t(infoAndUpdatesObj?.props?.[3]?.label),
//         Icon: <DocumentIcon />,
//         onClick: () => history.push(infoAndUpdatesObj?.props?.[3]?.navigationUrl),
//       },
//       // {
//       //     name: t("CS_COMMON_HELP"),
//       //     Icon: <HelpIcon/>
//       // }
//     ],
//     styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
//   };
//   sessionStorage.removeItem("type" );
//   sessionStorage.removeItem("pincode");
//   sessionStorage.removeItem("tenantId");
//   sessionStorage.removeItem("localityCode");
//   sessionStorage.removeItem("landmark");
//   sessionStorage.removeItem("propertyid");

//   return isLoading ? (
//     <Loader />
//   ) : (
//     <div className="HomePageContainer" style={{width:"100%"}}>
//       {/* <div className="SideBarStatic">
//         <StaticCitizenSideBar />
//       </div> */}
//       <div className="HomePageWrapper">
//         {<div className="BannerWithSearch">
//           {isMobile ? <img src={"https://nugp-assets.s3.ap-south-1.amazonaws.com/nugp+asset/Banner+UPYOG+%281920x500%29B+%282%29.jpg"} /> : <img src={"https://nugp-assets.s3.ap-south-1.amazonaws.com/nugp+asset/Banner+UPYOG+%281920x500%29A.jpg"} />}
//           {/* <div className="Search">
//             <StandaloneSearchBar placeholder={t("CS_COMMON_SEARCH_PLACEHOLDER")} />
//           </div> */}
//           <div className="ServicesSection">
//           <CardBasedOptions style={{marginTop:"-30px"}} {...allCitizenServicesProps} />
//           <CardBasedOptions style={isMobile ? {marginTop:"-30px"} : {marginTop:"-30px"}} {...allInfoAndUpdatesProps} />
//         </div>
//         </div>}

//         {(whatsAppBannerMobObj || whatsAppBannerWebObj) && (
//           <div className="WhatsAppBanner">
//             {isMobile ? (
//               <img src={"https://nugp-assets.s3.ap-south-1.amazonaws.com/nugp+asset/Banner+UPYOG+%281920x500%29B+%282%29.jpg"} onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerMobObj)} style={{"width":"100%"}}/>
//             ) : (
//               <img src={"https://nugp-assets.s3.ap-south-1.amazonaws.com/nugp+asset/Banner+UPYOG+%281920x500%29B+%282%29.jpg"} onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerWebObj)} style={{"width":"100%"}}/>
//             )}
//           </div>
//         )}

//         {conditionsToDisableNotificationCountTrigger() ? (
//           EventsDataLoading ? (
//             <Loader />
//           ) : (
//             <div className="WhatsNewSection">
//               <div className="headSection">
//                 <h2>{t(whatsNewSectionObj?.headerLabel)}</h2>
//                 <p onClick={() => history.push(whatsNewSectionObj?.sideOption?.navigationUrl)}>{t(whatsNewSectionObj?.sideOption?.name)}</p>
//               </div>
//               <WhatsNewCard {...EventsData?.[0]} />
//             </div>
//           )
//         ) : null}
//         <ChatBot/>
//       </div>
//     </div>
//   );
// };

// export default Home;

// import React, { useEffect, useState } from "react";
// import {
//   StandaloneSearchBar,
//   Loader,
//   CardBasedOptions,
//   ComplaintIcon,
//   PTIcon,
//   CaseIcon,
//   DropIcon,
//   HomeIcon,
//   Calender,
//   DocumentIcon,
//   HelpIcon,
//   WhatsNewCard,
//   OBPSIcon,
//   WSICon,
// } from "@djb25/digit-ui-react-components";
// import { useTranslation } from "react-i18next";
// import { useHistory } from "react-router-dom";
// import { CitizenSideBar } from "../../../components/TopBarSideBar/SideBar/CitizenSideBar";
// import StaticCitizenSideBar from "../../../components/TopBarSideBar/SideBar/StaticCitizenSideBar";
// import ChatBot from "./ChatBot";
const Home = () => {
  const history = useHistory();

  //   useEffect(() => {
  //   const kc = window.keycloak;

  //   if (!kc?.authenticated) {
  //     history.replace("/digit-ui/citizen/login");
  //     return;
  //   }
  // }, []);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant(true);
  const [user, setUser] = useState(null);
  const DEFAULT_REDIRECT_URL = "/digit-ui/citizen";
  const { data: { stateInfo, uiHomePage } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
  const userInfo = Digit.UserService.getUser();
  const name = userInfo?.info?.name;
  let isMobile = window.Digit.Utils.browser.isMobile();
  if (window.Digit.SessionStorage.get("TL_CREATE_TRADE")) window.Digit.SessionStorage.set("TL_CREATE_TRADE", {});

  const conditionsToDisableNotificationCountTrigger = () => {
    if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
    if (!Digit.UserService?.getUser()?.access_token) return false;
    return true;
  };

  const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({
    tenantId,
    variant: "whats-new",
    config: {
      enabled: conditionsToDisableNotificationCountTrigger(),
    },
  });

  if (!tenantId) {
    Digit.SessionStorage.get("locale") === null
      ? history.push(`/digit-ui/citizen/select-language`)
      : history.push(`/digit-ui/citizen/select-location`);
  }

  const appBannerWebObj = uiHomePage?.appBannerDesktop;
  const appBannerMobObj = uiHomePage?.appBannerMobile;
  const citizenServicesObj = uiHomePage?.citizenServicesCard;
  const infoAndUpdatesObj = uiHomePage?.informationAndUpdatesCard;
  const whatsAppBannerWebObj = uiHomePage?.whatsAppBannerDesktop;
  const whatsAppBannerMobObj = uiHomePage?.whatsAppBannerMobile;
  const whatsNewSectionObj = uiHomePage?.whatsNewSection;

  const handleClickOnWhatsAppBanner = (obj) => {
    window.open(obj?.navigationUrl);
  };
  /* set citizen details to enable backward compatiable */
  const setCitizenDetail = (userObject, token, tenantId) => {
    let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
    localStorage.setItem("Citizen.tenant-id", tenantId);
    localStorage.setItem("tenant-id", tenantId);
    localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
    localStorage.setItem("locale", locale);
    localStorage.setItem("Citizen.locale", locale);
    localStorage.setItem("token", token);
    localStorage.setItem("Citizen.token", token);
    localStorage.setItem("user-info", JSON.stringify(userObject));
    localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
  };

  useEffect(async () => {
    //sessionStorage.setItem("DigiLocker.token1","cf87055822e4aa49b0ba74778518dc400a0277e5")
    if (window.location.href.includes("code")) {
      let code = window.location.href.split("=")[1].split("&")[0];
      let TokenReq = {
        dlReqRef: localStorage.getItem("code_verfier_register"),
        code: code,
        module: "SSO",
      };
      const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.DigiLockerService.token({ TokenReq });
      setUser({ info, ...tokens });
      setCitizenDetail(info, tokens?.access_token, info?.tenantId);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.info, user?.access_token, "pg");
    const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
    if (!Digit.ULBService.getCitizenCurrentTenant(true)) {
      history.replace("/digit-ui/citizen/select-location", {
        redirectBackTo: redirectPath,
      });
    } else {
      history.replace(redirectPath);
    }
  }, [user]);

  const allCitizenServicesProps = {
    header: t(citizenServicesObj?.headerLabel),
    sideOption: {
      name: t(citizenServicesObj?.sideOption?.name),
      onClick: () => history.push(citizenServicesObj?.sideOption?.navigationUrl),
    },
    options: [
      {
        name: t(citizenServicesObj?.props?.[0]?.label),
        description: t("File and track your grievances and complaints"),
        Icon: <ComplaintIcon className="fill-path-primary-main" width="40" height="40" />,
        onClick: () => history.push(citizenServicesObj?.props?.[0]?.navigationUrl),
      },
      {
        name: t(citizenServicesObj?.props?.[1]?.label),
        description: t("Pay your property tax and register property"),
        Icon: <PTIcon className="fill-path-primary-main" />,
        onClick: () => history.push(citizenServicesObj?.props?.[1]?.navigationUrl),
      },
      {
        name: t(citizenServicesObj?.props?.[2]?.label),
        description: t("View and manage your pending applications"),
        Icon: <CaseIcon className="fill-path-primary-main" />,
        onClick: () => history.push(citizenServicesObj?.props?.[2]?.navigationUrl),
      },
      // {
      //     name: t("ACTION_TEST_WATER_AND_SEWERAGE"),
      //     description: t("Apply for new water connection"),
      //     Icon: <DropIcon/>,
      //     onClick: () => history.push("/digit-ui/citizen")
      // },
      {
        name: t(citizenServicesObj?.props?.[3]?.label) === "ACTION_TEST_CHB" ? t("Community Halls") : t(citizenServicesObj?.props?.[3]?.label),
        description: t("Book community halls for your events and functions"),
        Icon: <CHBIcon className="fill-path-primary-main" />,
        onClick: () => history.push(citizenServicesObj?.props?.[3]?.navigationUrl),
      },
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };
  const allInfoAndUpdatesProps = {
    header: t(infoAndUpdatesObj?.headerLabel),
    sideOption: {
      name: t(infoAndUpdatesObj?.sideOption?.name),
      onClick: () => history.push(infoAndUpdatesObj?.sideOption?.navigationUrl),
    },
    options: [
      {
        name: t(infoAndUpdatesObj?.props?.[0]?.label),
        description: t("Return to the main dashboard"),
        Icon: <HomeIcon className="fill-path-primary-main" width="40" height="40" />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[0]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[1]?.label),
        description: t("View events, holidays, and important dates"),
        Icon: <Calender className="fill-path-primary-main" width="40" height="40" />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[1]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[2]?.label),
        description: t("Access your uploaded documents and certificates"),
        Icon: <DocumentIcon className="fill-path-primary-main" />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[2]?.navigationUrl),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[3]?.label),
        description: t("Get assistance and find answers to questions"),
        Icon: <HelpIcon className="fill-path-primary-main" />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[3]?.navigationUrl),
      },
      // {
      //     name: t("CS_COMMON_HELP"),
      //     Icon: <HelpIcon/>
      // }
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };
  sessionStorage.removeItem("type");
  sessionStorage.removeItem("pincode");
  sessionStorage.removeItem("tenantId");
  sessionStorage.removeItem("localityCode");
  sessionStorage.removeItem("landmark");
  sessionStorage.removeItem("propertyid");

  // Add these helpers at the top of your Home component (same pattern as EmployeeHome)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", emoji: "☀️", icon: "sun" };
    if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️", icon: "cloud-sun" };
    return { text: "Good Evening", emoji: "🌙", icon: "moon" };
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const greetingIcons = {
    sun: (
      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" width="32" height="32">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    "cloud-sun": (
      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" width="32" height="32">
        <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M19.07 4.93l-1.41 1.41" />
        <path d="M17 12a5 5 0 00-9.9-1H6a4 4 0 000 8h11a3 3 0 000-6z" />
      </svg>
    ),
    moon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" width="32" height="32">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    ),
  };
  // Add this component inside Home.jsx, above the return
  const AnalogClock = () => {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours() % 12;

    const sDeg = s * 6;
    const mDeg = m * 6 + s * 0.1;
    const hDeg = h * 30 + m * 0.5;

    const hh = time.getHours();
    const mm = String(time.getMinutes()).padStart(2, "0");
    const ss = String(time.getSeconds()).padStart(2, "0");
    const ampm = hh >= 12 ? "PM" : "AM";
    const h12 = hh % 12 || 12;

    const ticks = Array.from({ length: 60 }, (_, i) => i);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {ticks.map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: i % 5 === 0 ? "2px" : "1px",
                height: i % 5 === 0 ? "6px" : "4px",
                background: i % 5 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                top: i % 5 === 0 ? "2px" : "3px",
                left: "50%",
                transformOrigin: "bottom center",
                transform: `translateX(-50%) rotate(${i * 6}deg)`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              bottom: "50%",
              left: "50%",
              width: "2.5px",
              height: "18px",
              background: "rgba(255,255,255,0.95)",
              borderRadius: "4px",
              marginLeft: "-1.25px",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${hDeg}deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "50%",
              left: "50%",
              width: "2px",
              height: "23px",
              background: "rgba(255,255,255,0.85)",
              borderRadius: "4px",
              marginLeft: "-1px",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${mDeg}deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "50%",
              left: "50%",
              width: "1.5px",
              height: "25px",
              background: "#93c5fd",
              borderRadius: "4px",
              marginLeft: "-0.75px",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${sDeg}deg)`,
            }}
          />
          <div
            style={{
              width: "5px",
              height: "5px",
              background: "#fff",
              borderRadius: "50%",
              position: "absolute",
              zIndex: 4,
            }}
          />
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "1px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {h12}:{mm}:{ss} {ampm}
        </span>
      </div>
    );
  };
  const greeting = getGreeting();
  return isLoading ? (
    <Loader />
  ) : (
    <div className="HomePageContainer" style={{ width: "100%" }}>
      {/* <div className="SideBarStatic">
        <StaticCitizenSideBar />
      </div> */}
      <div className="HomePageWrapper">
        <div className="citizen-app-container">
          {/* Blue Header Bar */}
          <div className="citizen-module-header">
            <div className="citizen-header-top-section">
              <div style={{ position: "relative", zIndex: 1 }}>
                <p className="citizen-header-title">
                  <span style={{ marginRight: "8px" }}>{greeting.emoji}</span>
                  {t(greeting.text)}! {name}
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "5px" }}>{getFormattedDate()}</p>
              </div>
              <AnalogClock />
            </div>
          </div>

          {/* Service Cards Grid - Redesigned */}
          <div className="citizen-module-grid">
            {allCitizenServicesProps.options.map((opt, idx) => (
              <div
                className="citizen-service-card"
                key={`svc-${idx}`}
                onClick={opt.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector(".slide-label").style.transform = "translateY(-110%)";
                  e.currentTarget.querySelector(".slide-label").style.opacity = "0";
                  e.currentTarget.querySelector(".slide-desc").style.transform = "translateY(0)";
                  e.currentTarget.querySelector(".slide-desc").style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector(".slide-label").style.transform = "translateY(0)";
                  e.currentTarget.querySelector(".slide-label").style.opacity = "1";
                  e.currentTarget.querySelector(".slide-desc").style.transform = "translateY(110%)";
                  e.currentTarget.querySelector(".slide-desc").style.opacity = "0";
                }}
              >
                <div className="citizen-service-card__icon">{opt.Icon}</div>
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    height: "40px",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  <p
                    className="slide-label"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                      lineHeight: 1.35,
                      transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                      transform: "translateY(0)",
                      opacity: 1,
                    }}
                  >
                    {opt.name}
                  </p>
                  <p
                    className="slide-desc"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      margin: 0,
                      fontSize: "12.5px",
                      fontWeight: 400,
                      color: "#2563eb",
                      lineHeight: 1.4,
                      transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                      transform: "translateY(110%)",
                      opacity: 0,
                    }}
                  >
                    {opt.description}
                  </p>
                </div>
              </div>
            ))}
            {allInfoAndUpdatesProps.options.map((opt, idx) => (
              <div
                className="citizen-service-card"
                key={`info-${idx}`}
                onClick={opt.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector(".slide-label").style.transform = "translateY(-110%)";
                  e.currentTarget.querySelector(".slide-label").style.opacity = "0";
                  e.currentTarget.querySelector(".slide-desc").style.transform = "translateY(0)";
                  e.currentTarget.querySelector(".slide-desc").style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector(".slide-label").style.transform = "translateY(0)";
                  e.currentTarget.querySelector(".slide-label").style.opacity = "1";
                  e.currentTarget.querySelector(".slide-desc").style.transform = "translateY(110%)";
                  e.currentTarget.querySelector(".slide-desc").style.opacity = "0";
                }}
              >
                <div className="citizen-service-card__icon">{opt.Icon}</div>
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    height: "40px",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  <p
                    className="slide-label"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                      lineHeight: 1.35,
                      transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                      transform: "translateY(0)",
                      opacity: 1,
                    }}
                  >
                    {opt.name}
                  </p>
                  <p
                    className="slide-desc"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      margin: 0,
                      fontSize: "12.5px",
                      fontWeight: 400,
                      color: "#2563eb",
                      lineHeight: 1.4,
                      transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                      transform: "translateY(110%)",
                      opacity: 0,
                    }}
                  >
                    {opt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {conditionsToDisableNotificationCountTrigger() ? (
          EventsDataLoading ? (
            <Loader />
          ) : (
            <div className="WhatsNewSection">
              <div className="headSection">
                <h2>{t(whatsNewSectionObj?.headerLabel)}</h2>
                <p onClick={() => history.push(whatsNewSectionObj?.sideOption?.navigationUrl)}>{t(whatsNewSectionObj?.sideOption?.name)}</p>
              </div>
              <WhatsNewCard {...EventsData?.[0]} />
            </div>
          )
        ) : null}
        <ChatBot />
      </div>
    </div>
  );
};

export default Home;
