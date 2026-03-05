import { PersonIcon, EmployeeModuleCard } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const EKYCCard = () => {
    const { t } = useTranslation();

    const propsForModuleCard = {
        Icon: <PersonIcon />,
        moduleName: t("ACTION_TEST_EKYC"),
        kpis: [
            {
                count: "-",
                label: t("TOTAL_EKYC"),
                link: `/digit-ui/employee/ekyc/dashboard`
            }
        ],
        links: [
            {
                label: t("EKYC_DASHBOARD"),
                link: `/digit-ui/employee/ekyc/dashboard`
            },
            {
                label: t("EKYC_CREATE_KYC"),
                link: `/digit-ui/employee/ekyc/create-kyc`
            },
        ]
    }

    return <EmployeeModuleCard {...propsForModuleCard} />
};

export default EKYCCard;
