import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, CHBIcon } from "@djb25/digit-ui-react-components";
import { APPLICATION_PATH } from "../utils";

/**
 * `WTCard` component is a module card that displays information related to the Water Tanker (WT) service.
 * It fetches data for the general inbox, displaying the total count and nearing SLA count for water tanker requests.
 * The component provides links for navigating to various WT-related pages such as the inbox, request tanker, and application search.
 * It conditionally renders the links based on the user's role (WT_CEMP). If the user doesn't have access to the WT service, the component returns null.
 * The component uses React's `useEffect` hook to update the total count once data is successfully fetched.
 *
 * @returns {JSX.Element} A module card displaying WT-related KPIs and links.
 */
const WTCard = () => {
  const { t } = useTranslation();

  const [total, setTotal] = useState("-");
  const { data, isLoading, isFetching, isSuccess } = Digit.Hooks.useNewInboxGeneral({
    tenantId: Digit.ULBService.getCurrentTenantId(),
    ModuleCode: "WT",
    filters: { limit: 10, offset: 0, services: ["watertanker"] },

    config: {
      select: (data) => {
        return { totalCount: data?.totalCount, nearingSlaCount: data?.nearingSlaCount } || "-";
      },
      enabled: Digit.Utils.wtAccess(),
    },
  });

  useEffect(() => {
    if (!isFetching && isSuccess) setTotal(data);
  }, [isFetching]);

  const links = [
    {
      count: isLoading ? "-" : total?.totalCount,
      label: t("ES_COMMON_INBOX"),
      link: `${APPLICATION_PATH}/employee/wt/inbox`,
    },
    {
      label: t("ES_COMMON_APPLICATION_SEARCH"),
      link: `${APPLICATION_PATH}/employee/wt/my-bookings`,
    },
    {
      label: t("WT_APPLICATION_CREATE"),
      link: `${APPLICATION_PATH}/employee/wt/request-service`,
    },
    {
      label: t("WT_FIXED_POINT_SCHEDULE_MANAGEMENT"),
      link: `${APPLICATION_PATH}/employee/wt/fixed-point-schedule`,
    },
    {
      label: t("WT_LIVE_TRACKING_SYSTEM"),
      link: `${APPLICATION_PATH}/employee/wt/live-tracking`,
    },
    {
      label: t("WT_SEARCH_FIX_POINT"),
      link: `${APPLICATION_PATH}/employee/wt/search-filling-fix-point`,
    },
    {
      label: t("Vendor_Assign"),
      link: `${APPLICATION_PATH}/employee/wt/vendor-assignment`,
    }
  ];
  const WT_CEMP = Digit.UserService.hasAccess(["WT_CEMP"]) || false;

  const propsForModuleCard = {
    Icon: <CHBIcon />,
    moduleName: t("WT_MODULE_NAME"),
    kpis: [
      {
        count: total?.totalCount,
        label: t("ES_TITLE_INBOX"),
        link: `${APPLICATION_PATH}/employee/wt/inbox`,
      },
    ],
    links: links.filter((link) => !link?.role || WT_CEMP),
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default WTCard;
