import { CitizenHomeCard, PTIcon, ApplicantDetails, AddressDetails } from "@djb25/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import WTCreate from "./pages/citizen/Create";
import CitizenApp from "./pages/citizen";
import InfoPage from "./pageComponents/InfoPage";
import RequestDetails from "./pageComponents/RequestDetails";
import WTCheckPage from "./pages/citizen/Create/CheckPage";
import WTAcknowledgement from "./pages/citizen/Create/WTAcknowledgement";
import WTCard from "./components/WTCard";
import EmployeeApp from "./pages/employee";
import { WTMyApplications } from "./pages/citizen/MyApplications";
import WTApplicationDetails from "./pages/citizen/WTApplicationDetails";
import { TableConfig } from "./config/inbox-table-config";
import InboxFilter from "./components/inbox/NewInboxFilter";
import ApplicationDetails from "./pages/employee/ApplicationDetails";
import WFApplicationTimeline from "./pageComponents/WFApplicationTimeline";
import WFCaption from "./pageComponents/WFCaption";
import Inbox from "./pages/employee/Inbox";
import WTCitizenCard from "./components/WTCitizenCard";
import MTCard from "./components/MTCard";
import TPCard from "./components/TPCard";
import ServiceTypes from "./pageComponents/ServiceTypes";
import ToiletRequestDetails from "./pageComponents/ToiletRequestDetails";
import TreePruningRequestDetails from "./pageComponents/TreePruningRequestDetails";
import MTAcknowledgement from "./pages/citizen/Create/MTAcknowledgement";
import TPAcknowledgement from "./pages/citizen/Create/TPAcknowledgement";
import MTApplicationDetails from "./pages/citizen/MTApplicationDetails";
import TPApplicationDetails from "./pages/citizen/TPApplicationDetails";
import MTCitizenCard from "./components/MTCitizenCard";
import FixedPointScheduleManagement from "./pages/employee/FixedPointScheduleManagement";
import LiveTrackingSystem from "./components/LiveTrackingSystem";
import AddFillingPointAddress from "./components/AddFillingPointAddress";
import AddFixPointAddress from "./components/AddFixPointAddress";
import AddFillingPointMetaData from "./components/AddFillingPointMetaData";
import WTSearchPointAddress from "./components/SearchFillingPointAddress";
import VendorAssign from "./components/VendorAssign";

// Parent component of module
export const WTModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const moduleCode = "WT";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  Digit.SessionStorage.set("WT_TENANTS", tenants);
  useEffect(
    () =>
      userType === "employee" &&
      Digit.LocalizationService.getLocale({
        modules: [`rainmaker-${Digit.ULBService.getCurrentTenantId()}`],
        locale: Digit.StoreData.getCurrentLanguage(),
        tenantId: Digit.ULBService.getCurrentTenantId(),
      }),
    []
  );

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  } else return <CitizenApp />;
};

export const WTLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("WT", {});

  useEffect(() => {
    clearParams();
  }, []);

  const links = [
    // need to check the links, will be removed later if not needed

    {
      link: `${matchPath}/wt`,
      i18nKey: t("WT_REQUEST_TANKER"),
    },
    {
      link: `${matchPath}/wt/status`,
      i18nKey: t("WT_VIEW_APPLICATIONS"),
    },
    {
      link: `${matchPath}/wt/wt-Vendor`,
      i18nKey: t("WT_VENDOR_LOGIN"),
    },
  ];

  return <CitizenHomeCard header={t("WATER_TANKER_SERVICE")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

// export the components outside of module to enable and access of module
export const WTComponents = {
  WTCard,
  WTModule,
  MTCard,
  TPCard,
  WTLinks,
  WT_INBOX_FILTER: (props) => <InboxFilter {...props} />,
  WTInboxTableConfig: TableConfig,
};

const componentsToRegister = {
  ApplicantDetails,
  AddressDetails,
  WTCreate,
  InfoPage,
  RequestDetails,
  WTCheckPage,
  WTAcknowledgement,
  WTApplicationDetails: WTApplicationDetails,
  MTApplicationDetails: MTApplicationDetails,
  TPApplicationDetails: TPApplicationDetails,
  WTMyApplications: WTMyApplications,
  ApplicationDetails: ApplicationDetails,
  WFApplicationTimeline: WFApplicationTimeline,
  WFCaption,
  WTEmpInbox: Inbox,
  WTCitizenCard: WTCitizenCard,
  WTCard: WTCard,
  ServiceTypes,
  ToiletRequestDetails,
  TreePruningRequestDetails,
  MTAcknowledgement,
  TPAcknowledgement,
  MTCitizenCard: MTCitizenCard,
  FixedPointScheduleManagement,
  LiveTrackingSystem,
  AddFillingPointAddress,
  AddFixPointAddress,
  AddFillingPointMetaData,
  WTSearchPointAddress,
  VendorAssign,
};

export const initWTComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};