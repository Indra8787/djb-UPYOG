import {
  BackButton,
  BillsIcon,
  CitizenHomeCard,
  CitizenInfoLabel,
  FSMIcon,
  Loader,
  MCollectIcon,
  OBPSIcon,
  PGRIcon,
  PTIcon,
  TLIcon,
  WSICon,
  PTRIcon,
  CHBIcon,
  FinanceChartIcon,
  Toast,
} from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EmployeeDashboard from "./EmployeeDashboard";
import RecentActivity from "./RecentActivity";
import NewsAndEvents from "./NewsAndEvents";

/* Feature :: Citizen All service screen cards
 */
export const processLinkData = (newData, code, t) => {
  const obj = newData?.[`${code}`];
  if (obj) {
    obj.map((link) => {
      link.link = link["navigationURL"];
      link.i18nKey = t(link["name"]);
      return link;
    });
  }
  const newObj = {
    links: obj?.reverse(),
    header: Digit.Utils.locale.getTransformedLocale(`ACTION_TEST_${code}`),
    iconName: `CITIZEN_${code}_ICON`,
  };
  if (code === "FSM") {
    const roleBasedLoginRoutes = [
      {
        role: "FSM_DSO",
        from: "/digit-ui/citizen/fsm/dso-dashboard",
        dashoardLink: "CS_LINK_DSO_DASHBOARD",
        loginLink: "CS_LINK_LOGIN_DSO",
      },
    ];
    roleBasedLoginRoutes.map(({ role, from, loginLink, dashoardLink }) => {
      if (Digit.UserService.hasAccess(role))
        newObj?.links?.push({
          link: from,
          i18nKey: t(dashoardLink),
        });
      else
        newObj?.links?.push({
          link: `/digit-ui/citizen/login`,
          state: { role: "FSM_DSO", from },
          i18nKey: t(loginLink),
        });
    });
  }
  if (code === "WT" || code === "MT") {
    const fallbackLinks =
      code === "WT"
        ? [
            { link: "/digit-ui/citizen/wt/request-service", i18nKey: t("WT_REQUEST_TANKER") },
            { link: "/digit-ui/citizen/wt/status", i18nKey: t("WT_VIEW_APPLICATIONS") },
          ]
        : [
            { link: "/digit-ui/citizen/wt/request-service", i18nKey: t("MT_REQUEST_TANKER") },
            { link: "/digit-ui/citizen/wt/status", i18nKey: t("MT_VIEW_APPLICATIONS") },
          ];

    const role = code === "WT" ? "WT_VENDOR" : "MT_VENDOR";
    const from = code === "WT" ? "/digit-ui/citizen/wt/wt-Vendor" : "/digit-ui/citizen/wt/mt-Vendor";
    const loginLink = code === "WT" ? "WT_VENDOR_LOGIN" : "MT_VENDOR_LOGIN";

    if (Digit.UserService.hasAccess(role))
      fallbackLinks.push({
        link: from,
        i18nKey: t(loginLink),
      });
    else
      fallbackLinks.push({
        link: `/digit-ui/citizen/login`,
        state: { role: role, from },
        i18nKey: t(loginLink),
      });

    return {
      links: fallbackLinks,
      header: t(Digit.Utils.locale.getTransformedLocale(`ACTION_TEST_${code}`)),
      iconName: `CITIZEN_${code}_ICON`,
    };
  }

  return newObj;
};

const iconSelector = (code) => {
  switch (code) {
    case "PT":
      return <PTIcon className="fill-path-primary-main" />;
    case "WS":
      return <WSICon className="fill-path-primary-main" />;
    case "FSM":
      return <FSMIcon className="fill-path-primary-main" />;
    case "MCollect":
      return <MCollectIcon className="fill-path-primary-main" />;
    case "PGR":
      return <PGRIcon className="fill-path-primary-main" />;
    case "TL":
      return <TLIcon className="fill-path-primary-main" />;
    case "OBPS":
      return <OBPSIcon className="fill-path-primary-main" />;
    case "Bills":
      return <BillsIcon className="fill-path-primary-main" />;
    case "PTR":
      return <PTRIcon className="fill-path-primary-main" />;
    case "CHB":
      return <CHBIcon className="fill-path-primary-main" />;
    case "ADS":
      return <CHBIcon className="fill-path-primary-main" />;
    case "WT":
    //   return <CHBIcon className="fill-path-primary-main" />;
    // case "MT":
      return <CHBIcon className="fill-path-primary-main" />;
    default:
      return <PTIcon className="fill-path-primary-main" />;
  }
};

const CitizenHome = ({ modules, getCitizenMenu, fetchedCitizen, isLoading }) => {
  const paymentModule = modules.filter(({ code }) => code === "Payment")[0];
  const moduleArr = modules.filter(({ code }) => code !== "Payment");
  const moduleArray = [paymentModule, ...moduleArr];
  const { t } = useTranslation();
  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div className="citizen-all-services-wrapper">
        <BackButton />
        <div className="citizenAllServiceGrid" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {moduleArray
            .filter((mod) => mod)
            .map(({ code }, index) => {
              const isAuthWT = code === "WT" && Digit.Utils.wtAccess();
              // const isAuthMT = code === "MT" && Digit.Utils.mtAccess();
              // const isAuthTP = code === "TP" && Digit.Utils.tpAccess();
              const Card =
                (code === "WT" && !isAuthWT)
                  ? null
                  : Digit.ComponentRegistryService.getComponent(
                      code === "WT" ? "WTCitizenCard" : code === "MT" ? "MTCitizenCard" : code === "TP" ? "TPCitizenCard" : `${code}Card`
                    );
              if (Card) return <Card key={index} />;

              let mdmsDataObj;
              if (fetchedCitizen) mdmsDataObj = fetchedCitizen ? processLinkData(getCitizenMenu, code, t) : undefined;
              if (mdmsDataObj?.links?.length > 0) {
                return (
                  <CitizenHomeCard
                    key={index}
                    header={t(mdmsDataObj?.header)}
                    links={mdmsDataObj?.links?.filter((ele) => ele?.link)?.sort((x, y) => x?.orderNumber - y?.orderNumber)}
                    Icon={() => iconSelector(code)}
                    Info={
                      code === "OBPS"
                        ? () => (
                            <CitizenInfoLabel
                              style={{ margin: "0px", padding: "10px" }}
                              info={t("CS_FILE_APPLICATION_INFO_LABEL")}
                              text={t(`BPA_CITIZEN_HOME_STAKEHOLDER_INCLUDES_INFO_LABEL`)}
                            />
                          )
                        : null
                    }
                    isInfo={code === "OBPS" ? true : false}
                  />
                );
              } else return <React.Fragment key={index} />;
            })}
        </div>
      </div>
    </React.Fragment>
  );
};

const LeftArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const RightArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const PresentationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <rect x="8" y="38" width="14" height="32" rx="1" fill="#ffffff" opacity="0.4" />
    <rect x="5" y="30" width="8" height="8" rx="1" fill="#ffffff" opacity="0.4" />
    <rect x="25" y="26" width="20" height="44" rx="1" fill="#ffffff" opacity="0.6" />
    <circle cx="35" cy="12" r="2.5" fill="#ffffff" opacity="0.5" />

    <rect x="48" y="34" width="14" height="36" rx="1" fill="#ffffff" opacity="0.45" />
    <rect x="65" y="28" width="18" height="42" rx="1" fill="#ffffff" opacity="0.55" />
    <rect x="86" y="40" width="12" height="30" rx="1" fill="#ffffff" opacity="0.4" />

    <line x1="4" y1="70" x2="96" y2="70" stroke="#ffffff" strokeWidth="1" opacity="0.2" />

    <path
      d="M4 78 Q16 70 28 78 Q40 86 52 78 Q64 70 76 78 Q88 86 96 78"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path d="M4 86 Q18 80 32 86 Q46 92 60 86 Q74 80 88 86" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const ModuleCarousel = ({ modules, title }) => {
  const scrollContainerRef = React.useRef(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);

      if (clientWidth > 0) {
        // Cache layout values to avoid repeated getComputedStyle calls
        if (!scrollContainerRef.current._carouselGap) {
          const computedStyle = window.getComputedStyle(scrollContainerRef.current);
          scrollContainerRef.current._carouselGap = parseInt(computedStyle.columnGap) || 0;
        }
        const gap = scrollContainerRef.current._carouselGap;
        const total = Math.ceil((scrollWidth + gap) / (clientWidth + gap)) || 1;
        setTotalPages(total);
        const current = Math.round(scrollLeft / (clientWidth + gap)) + 1;
        setCurrentPage(Math.min(Math.max(current, 1), total));
      }
    }
  };

  React.useEffect(() => {
    let timeoutId;
    const debouncedScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 50);
    };

    // Initial call
    handleScroll();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", debouncedScroll);
    }
    window.addEventListener("resize", handleScroll);

    return () => {
      if (container) container.removeEventListener("scroll", debouncedScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [modules]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const gap = parseInt(window.getComputedStyle(scrollContainerRef.current).columnGap) || 0;
      const scrollAmount = direction === "left" ? -(scrollContainerRef.current.clientWidth + gap) : scrollContainerRef.current.clientWidth + gap;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!modules || modules.length === 0) return null;

  return (
    <div className="module-carousel-section" style={{ marginBottom: "20px", marginTop: "10px" }}>
      <div className="module-carousel-header" style={{ display: "flex", justifyContent: title ? "space-between" : "flex-end", alignItems: "center" }}>
        {title && <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>{title}</h3>}

        <div className="module-carousel-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button className="carousel-arrow left" onClick={() => scroll("left")} aria-label="Previous" disabled={!showLeftArrow}>
            <LeftArrowIcon />
          </button>
          <span className="carousel-pagination-text" style={{ fontSize: "14px", fontWeight: "500", color: "#505A5F" }}>
            {currentPage} / {totalPages}
          </span>
          <button className="carousel-arrow right" onClick={() => scroll("right")} aria-label="Next" disabled={!showRightArrow}>
            <RightArrowIcon />
          </button>
        </div>
      </div>

      <div className="module-carousel-wrapper">
        <div className="carousel-track" ref={scrollContainerRef} onScroll={handleScroll}>
          {modules.map(({ code }, index) => {
            const Card = Digit.ComponentRegistryService.getComponent(`${code}Card`);
            if (!Card) return null;
            return <Card key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

const EmployeeHome = ({ modules }) => {
  const { t } = useTranslation();
  const userInfo = JSON.parse(localStorage.getItem("Employee.user-info"));
  const name = userInfo?.name;
  const dashboardCemp = Digit.UserService.hasAccess(["DASHBOARD_EMPLOYEE"]) ? true : false;
  const [showToast, setShowToast] = React.useState(null);

  const clearToast = () => {
    setShowToast(null);
  };

  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (window.Digit.SessionStorage.get("PT_CREATE_EMP_TRADE_NEW_FORM")) window.Digit.SessionStorage.set("PT_CREATE_EMP_TRADE_NEW_FORM", {});

  const { data: dashboardConfig } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "common-masters", [{ name: "CommonConfig" }], {
    select: (data) => {
      const formattedData = data?.["common-masters"]?.["CommonConfig"];
      const cityDashboardObject = formattedData?.find((item) => item?.name === "cityDashboardEnabled");
      return cityDashboardObject?.isActive;
    },
  });

  const { data: dashboardUrl } = Digit.Hooks.useCustomMDMS(Digit.ULBService.getStateId(), "tenant", [{ name: "citymodule" }], {
    select: (data) => {
      const citymodules = data?.tenant?.citymodule || [];
      const dashboardModule = citymodules.find((item) => item?.dashboards);
      return dashboardModule?.dashboards;
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", emoji: "☀️" };
    if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
    return { text: "Good Evening", emoji: "🌙" };
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const greeting = getGreeting();

  const engagementModuleCodes = [
    "ENGAGEMENT",
    "Engagement",
    "PGR",
    "Events",
    "Documents",
    "Public Message broadcast",
    "MessageBroadcast",
    "Broadcast",
    "Surveys",
  ];
  const engagementModules = modules.filter((mod) => engagementModuleCodes.includes(mod?.code));
  const mainModules = modules.filter((mod) => !engagementModuleCodes.includes(mod?.code));

  return (
    <div className="employee-app-homepage-container">
      {dashboardConfig && dashboardCemp ? <EmployeeDashboard modules={modules} /> : null}

      <div className="home-header">
        <div className="header-top-section">
          <div className="header-greeting-area">
            <h1 className="greeting-title">
              <span className="greeting-emoji">{greeting.emoji}</span> {t(greeting.text)}, {name}
            </h1>
            <p className="greeting-date">{getFormattedDate()}</p>
          </div>
          <div className="header-right-area">
            <button
              onClick={() => {
                if (dashboardUrl) {
                  window.open(dashboardUrl, "_blank");
                } else {
                  setShowToast({ label: t("Dashboard URL not found") });
                }
              }}
              className="view-dashboard-btn"
            >
              <span className="btn-text">{t("View Analytics")}</span>
              <div className="btn-icon-bg">
                <FinanceChartIcon className="finance-chart-icon" />
              </div>
            </button>
            <div className="header-icon-area">
              <PresentationIcon />
            </div>
            <div className="header-actions-area"></div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          label={showToast.label}
          onClose={clearToast}
          className="coming-soon-toast"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 10001,
            background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "12px",
            maxWidth: "350px",
            minWidth: "200px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            transform: "translateY(0)",
            animation: "toastSlideUp 0.3s ease-out forwards",
          }}
        />
      )}

      <div className="employee-home-main-content">
        <div className="ground-container">
          <div className="top-info-cards-wrapper">
            <NewsAndEvents />
            <RecentActivity />
          </div>

          <ModuleCarousel modules={mainModules} title={t("Core Services")} />

          {engagementModules.length > 0 && <ModuleCarousel modules={engagementModules} title={t("Engagement Services")} />}
        </div>
      </div>
    </div>
  );
};

export const AppHome = ({ userType, modules, getCitizenMenu, fetchedCitizen, isLoading }) => {
  if (userType === "citizen") {
    return <CitizenHome modules={modules} getCitizenMenu={getCitizenMenu} fetchedCitizen={fetchedCitizen} isLoading={isLoading} />;
  }
  return <EmployeeHome modules={modules} />;
};
