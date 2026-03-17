import React, { Fragment, useContext, useCallback, memo } from "react";
import { useHistory, Link } from "react-router-dom";
import { ArrowRightInbox } from "./svgindex";
import ExpandedViewContext from "./ExpandedViewContext";
import ModuleLinksView from "./ModuleLinksView";
import CollapsibleModuleSidebar from "./CollapsibleModuleSidebar";
import { useTranslation } from "react-i18next";

const getNewButtonText = (moduleName, kpis, links) => {
  let path = "";
  if (kpis && kpis.length > 0 && kpis[0].link) {
    path = kpis[0].link;
  } else if (links && links.length > 0 && links[0].link) {
    path = links[0].link;
  }

  path = path.toLowerCase();
  const name = String(moduleName || "").toLowerCase();

  if (path.includes("/ws/") || path.includes("/sw/") || (name.includes("water") && (name.includes("sew") || name.includes("sw"))))
    return "New connection";
  if (path.includes("/wt/") || (name.includes("water") && name.includes("tanker"))) return "New application";
  if (path.includes("/ekyc/") || name.includes("kyc")) return "New Kyc";
  if (path.includes("/fsm/") || name.includes("fsm") || name.includes("sludge") || name.includes("faecal")) return "New";
  if (path.includes("/vendor/") || name.includes("vendor")) return "New vendor";
  if (path.includes("/hrms/") || name.includes("user management") || name.includes("employee")) return "New Employee";
  if (path.includes("/asset/") || name.includes("asset")) return "New Asset";

  return "New";
};

const WaterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="water-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.69l5.66 5.66c1.55 1.55 2.34 3.61 2.34 5.66s-.79 4.11-2.34 5.66c-1.55 1.55-3.61 2.34-5.66 2.34s-4.11-.79-5.66-2.34c-1.55-1.55-2.34-3.61-2.34-5.66s.79-4.11 2.34-5.66L12 2.69z"
      fill="url(#water-grad)"
    />
  </svg>
);

const AssetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="#8b5cf6" />
  </svg>
);

const TankerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="tanker-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path
      d="M18 11h-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
      fill="url(#tanker-grad)"
    />
  </svg>
);

const KycIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="kyc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="url(#kyc-grad)"
    />
  </svg>
);

const VendorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="vendor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#5b21b6" />
      </linearGradient>
    </defs>
    <path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill="url(#vendor-grad)"
    />
  </svg>
);

const HrmsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="hrms-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#0f766e" />
      </linearGradient>
    </defs>
    <path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill="url(#hrms-grad)"
    />
  </svg>
);

const BillsIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="bills-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <path
      d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2l-1.5 1.5L6 2l-1.5 1.5L3 2v20z"
      fill="url(#bills-grad)"
    />
  </svg>
);

const FsmIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="fsm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>
    <path
      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
      fill="url(#fsm-grad)"
    />
  </svg>
);

const TLIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="tl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <path
      d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
      fill="url(#tl-grad)"
    />
  </svg>
);

const MCollectIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="mcollect-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      fill="url(#mcollect-grad)"
    />
  </svg>
);

const ReceiptsIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="receipts-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#0d9488" />
      </linearGradient>
    </defs>
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"
      fill="url(#receipts-grad)"
    />
  </svg>
);

const OBPSIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="obps-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path
      d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-8h8v8zm-2-6h-4v4h4v-4z"
      fill="url(#obps-grad)"
    />
  </svg>
);

const PGRIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="pgr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
    </defs>
    <path
      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"
      fill="url(#pgr-grad)"
    />
  </svg>
);

const PTRIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ptr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 13c-.83 0-1.5-.67-1.5-1.5S16.67 12 17.5 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-5.5-2c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
      fill="url(#ptr-grad)"
    />
  </svg>
);

const CHBIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="chb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#5b21b6" />
      </linearGradient>
    </defs>
    <path
      d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"
      fill="url(#chb-grad)"
    />
  </svg>
);

const DSSIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="dss-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
      fill="url(#dss-grad)"
    />
  </svg>
);

const EngagementIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="eng-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill="url(#eng-grad)"
    />
  </svg>
);

const PTIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="pt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
    <path
      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
      fill="url(#pt-grad)"
    />
  </svg>
);

const ADSIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="ads-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14b8a6" />
        <stop offset="100%" stopColor="#0f766e" />
      </linearGradient>
    </defs>
    <path
      d="M18 11V7l4 3-4 3v-2h-3v-3h3zM12 9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3-4l4 3-4 3V5zM3 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2v4h2v-4h1l5 3V6L8 9H3z"
      fill="url(#ads-grad)"
    />
  </svg>
);

const SurveyIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="survey-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 15H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"
      fill="url(#survey-grad)"
    />
  </svg>
);

const EventsIconComp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="event-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path
      d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
      fill="url(#event-grad)"
    />
  </svg>
);

const getModuleIcon = (moduleName, kpis, links, originalIcon) => {
  let path = "";
  if (kpis && kpis.length > 0 && kpis[0].link) {
    path = kpis[0].link;
  } else if (links && links.length > 0 && links[0].link) {
    path = links[0].link;
  }

  path = path.toLowerCase();
  const name = String(moduleName || "").toLowerCase();

  if (path.includes("/ws/") || path.includes("/sw/") || (name.includes("water") && (name.includes("sew") || name.includes("sw"))))
    return <WaterIcon />;
  if (path.includes("/wt/") || (name.includes("water") && name.includes("tanker"))) return <TankerIcon />;
  if (path.includes("/ekyc/") || name.includes("kyc")) return <KycIcon />;
  if (path.includes("/vendor/") || name.includes("vendor")) return <VendorIcon />;
  if (path.includes("/hrms/") || name.includes("user management") || name.includes("employee")) return <HrmsIcon />;
  if (path.includes("/asset/") || name.includes("asset")) return <AssetIcon />;
  if (path.includes("/pt/") || name.includes("property")) return <PTIconComp />;
  if (path.includes("/bills/") || name.includes("bill") || name.includes("payment")) return <BillsIconComp />;
  if (path.includes("/fsm/") || name.includes("fsm") || name.includes("sludge")) return <FsmIconComp />;
  if (path.includes("/tl/") || name.includes("trade")) return <TLIconComp />;
  if (path.includes("/mcollect/") || name.includes("collect")) return <MCollectIconComp />;
  if (path.includes("/receipts/") || name.includes("receipt")) return <ReceiptsIconComp />;
  if (path.includes("/obps/") || name.includes("obps") || name.includes("building")) return <OBPSIconComp />;
  if (path.includes("/pgr/") || name.includes("pgr") || name.includes("complaint")) return <PGRIconComp />;
  if (path.includes("/ptr/") || name.includes("ptr") || name.includes("pet")) return <PTRIconComp />;
  if (path.includes("/chb/") || name.includes("chb") || name.includes("hall")) return <CHBIconComp />;
  if (path.includes("/ads/") || name.includes("ads") || name.includes("advertisement")) return <ADSIconComp />;
  if (path.includes("/dss/") || name.includes("dss") || name.includes("dashboard")) return <DSSIconComp />;
  if (path.includes("/engagement/") || name.includes("engagement")) return <EngagementIconComp />;
  if (name.includes("survey")) return <SurveyIconComp />;
  if (name.includes("event")) return <EventsIconComp />;

  return originalIcon;
};

const getIconColorClass = (moduleName, kpis, links) => {
  let path = "";
  if (kpis && kpis.length > 0 && kpis[0].link) {
    path = kpis[0].link;
  } else if (links && links.length > 0 && links[0].link) {
    path = links[0].link;
  }

  path = path.toLowerCase();
  const name = String(moduleName || "").toLowerCase();

  let result = "icon-default";

  if (path.includes("/ws/") || path.includes("/sw/") || (name.includes("water") && (name.includes("sew") || name.includes("sw"))))
    result = "icon-blue";
  else if (path.includes("/wt/") || (name.includes("water") && name.includes("tanker"))) result = "icon-orange";
  else if (path.includes("/ekyc/") || name.includes("kyc")) result = "icon-green";
  else if (path.includes("/fsm/") || name.includes("fsm") || name.includes("sludge") || name.includes("faecal")) result = "icon-brown";
  else if (path.includes("/vendor/") || name.includes("vendor")) result = "icon-violet";
  else if (path.includes("/hrms/") || name.includes("user management") || name.includes("employee")) result = "icon-teal";
  else if (path.includes("/asset/") || name.includes("asset")) result = "icon-purple";
  else if (path.includes("/pt/") || name.includes("property")) result = "icon-purple";
  else if (path.includes("/tl/") || name.includes("trade")) result = "icon-orange";
  else if (path.includes("/mcollect/") || name.includes("collect")) result = "icon-violet";
  else if (path.includes("/receipts/") || name.includes("receipt")) result = "icon-teal";
  else if (path.includes("/obps/") || name.includes("obps") || name.includes("building")) result = "icon-blue";
  else if (path.includes("/pgr/") || name.includes("pgr") || name.includes("complaint")) result = "icon-brown";
  else if (path.includes("/ptr/") || name.includes("ptr") || name.includes("pet")) result = "icon-green";
  else if (path.includes("/bills/") || name.includes("bill") || name.includes("payment")) result = "icon-orange";
  else if (path.includes("/chb/") || name.includes("chb") || name.includes("hall")) result = "icon-violet";
  else if (path.includes("/ads/") || name.includes("ads") || name.includes("advertisement")) result = "icon-teal";
  else if (path.includes("/dss/") || name.includes("dss") || name.includes("dashboard")) result = "icon-purple";
  else if (path.includes("/engagement/") || name.includes("engagement")) result = "icon-blue";
  else if (path.includes("/fsm/") || name.includes("fsm")) result = "icon-brown";

  return result;
};

const EmployeeModuleCard = ({ Icon, moduleName, kpis = [], links = [], className, styles }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { isExpandedView, isModuleSidebar } = useContext(ExpandedViewContext) || {};

  const handleDetailsClick = useCallback(() => {
    history.push("/digit-ui/employee/module/details", {
      moduleName,
      links,
    });
  }, [history, moduleName, links]);

  if (isExpandedView) {
    return <ModuleLinksView links={links} moduleName={moduleName} />;
  }

  if (isModuleSidebar) {
    return <CollapsibleModuleSidebar links={links} moduleName={moduleName} Icon={Icon} />;
  }

  const mainKpi = kpis.length > 0 ? kpis[0] : null;
  const secondaryKpis = kpis.length > 1 ? kpis.slice(1) : [];

  return (
    <Fragment>
      {/* Card */}
      <div className={`new-employee-card  card-home ${className || ""}`}>
        {/* Header */}
        <div className="card-header-row">
          <div className={`module-icon-wrap ${getIconColorClass(moduleName, kpis, links)}`}>{getModuleIcon(moduleName, kpis, links, Icon)}</div>
          <h2 className="module-title">{moduleName}</h2>
        </div>

        {/* Body */}
        <div className="card-body-row">
          {/* Left: Main KPI */}
          <div className="main-kpi-section">
            {mainKpi && (
              <Fragment>
                <span className="main-kpi-number">{mainKpi.count || "0"}</span>
                <span className="main-kpi-label">{mainKpi.label}</span>
              </Fragment>
            )}
          </div>

          {/* Right: Secondary KPIs & Links */}
          <div className="secondary-kpi-section">
            {secondaryKpis
              .filter((kpi) => {
                const label = String(kpi.label || "").toLowerCase();
                return label.includes("nearing sla") || label.includes("active employee");
              })
              .map((kpi, index) => {
                const isHeader = !kpi.count && kpi.label === kpi.label?.toUpperCase();
                return (
                  <div key={index} className={`secondary-kpi-item ${isHeader ? "sec-kpi-header" : ""}`}>
                    <span className="sec-kpi-label">
                      {kpi.link ? (
                        kpi.link.includes("digit-ui/") ? (
                          <Link to={kpi.link} style={{ color: "inherit", textDecoration: "none" }}>
                            {kpi.label}
                          </Link>
                        ) : (
                          <a href={kpi.link} style={{ color: "inherit", textDecoration: "none" }}>
                            {kpi.label}
                          </a>
                        )
                      ) : (
                        kpi.label
                      )}
                    </span>
                    {!isHeader && <span className="sec-kpi-value">{kpi.count ? kpi.count : <span className="sec-kpi-dot"></span>}</span>}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="card-footer-row">
          <div className="footer-links">
            <span className="pill-link" style={{ cursor: "pointer" }}>
             {t('View Reports')}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: "4px" }}
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
            <span className="pill-link" style={{ cursor: "pointer" }}>
              +
            </span>
          </div>
          <button className="details-btn" onClick={handleDetailsClick}>
            {t('Details')}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

const ModuleCardFullWidth = ({ Icon, moduleName, kpis = [], links = [], className, styles }) => {
  const history = useHistory();

  const handleDetailsClick = () => {
    history.push("/digit-ui/employee/module/details", {
      moduleName,
      links,
    });
  };

  const mainKpi = kpis.length > 0 ? kpis[0] : null;
  const secondaryKpis = kpis.length > 1 ? kpis.slice(1) : [];

  return (
    <div className={`new-employee-card ${className || ""}`} style={styles || {}}>
      {/* Header */}
      <div className="card-header-row">
        {Icon && (
          <div className={`module-icon-wrap ${getIconColorClass(moduleName, kpis, links)}`}>{getModuleIcon(moduleName, kpis, links, Icon)}</div>
        )}
        <h2 className="module-title">{moduleName}</h2>
      </div>

      {/* Body */}
      <div className="card-body-row">
        {/* Left: Main KPI */}
        <div className="main-kpi-section">
          {mainKpi && (
            <>
              <span className="main-kpi-number">{mainKpi.count || "0"}</span>
              <span className="main-kpi-label">{mainKpi.label}</span>
            </>
          )}
        </div>

        {/* Right: Secondary KPIs & Links */}
        <div className="secondary-kpi-section">
          {secondaryKpis
            .filter((kpi) => {
              const label = String(kpi.label || "").toLowerCase();
              return label.includes("nearing sla") || label.includes("active employee");
            })
            .map((kpi, index) => {
              const isHeader = !kpi.count && kpi.label === kpi.label?.toUpperCase();

              return (
                <div key={index} className={`secondary-kpi-item ${isHeader ? "sec-kpi-header" : ""}`}>
                  <span className="sec-kpi-label">
                    {kpi.link ? (
                      kpi.link.includes("digit-ui/") ? (
                        <Link to={kpi.link} style={{ color: "inherit", textDecoration: "none" }}>
                          {kpi.label}
                        </Link>
                      ) : (
                        <a href={kpi.link} style={{ color: "inherit", textDecoration: "none" }}>
                          {kpi.label}
                        </a>
                      )
                    ) : (
                      kpi.label
                    )}
                  </span>
                  {!isHeader && <span className="sec-kpi-value">{kpi.count ? kpi.count : <span className="sec-kpi-dot"></span>}</span>}
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer-row">
        <div className="footer-links">
          <span className="pill-link" style={{ cursor: "pointer" }}>
            {t('View Reports')}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: "4px" }}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
          <span className="pill-link" style={{ cursor: "pointer" }}>
            + {getNewButtonText(moduleName, kpis, links)}
          </span>
        </div>
        <button className="details-btn" onClick={handleDetailsClick}>
          {t('Details')}
        </button>
      </div>
    </div>
  );
};

// const ModuleCardFullWidth = ({ moduleName, links = [], isCitizen = false, className, styles, headerStyle, subHeader, subHeaderLink }) => {
//   const history = useHistory();

//   const handleDetailsClick = () => {
//     history.push("/digit-ui/employee/module/details", {
//       moduleName,
//       links,
//     });
//   };

//   return (
//     <div className={className ? className : "employeeCard card-home customEmployeeCard home-action-cards"} style={styles ? styles : {}}>
//       <div className="complaint-links-container" style={{ padding: "10px" }}>
//         <div className="header" style={isCitizen ? { padding: "0px" } : headerStyle}>
//           <span className="text removeHeight">{moduleName}</span>
//           <span className="link">
//             <a href={subHeaderLink}>
//               <span className={"inbox-total"} style={{ display: "flex", alignItems: "center", color: "#a82227", fontWeight: "bold" }}>
//                 {subHeader || "-"}
//                 <span style={{ marginLeft: "10px" }}>
//                   {" "}
//                   <ArrowRightInbox />
//                 </span>
//               </span>
//             </a>
//           </span>
//         </div>
//         <div className="body" style={{ margin: "0px", padding: "0px" }}>
//           <div className="links-wrapper" style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
//             {links.map(({ count, label, link }, index) => (
//               <span className="link full-employee-card-link" key={index}>
//                 {link ? link?.includes("digit-ui/") ? <Link to={link}>{label}</Link> : <a href={link}>{label}</a> : null}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export { EmployeeModuleCard, ModuleCardFullWidth };
