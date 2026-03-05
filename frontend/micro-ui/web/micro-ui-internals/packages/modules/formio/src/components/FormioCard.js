import { PersonIcon, EmployeeModuleCard } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const FORMIOCard = () => {
    const { t } = useTranslation();

    const propsForModuleCard = {
        Icon: <PersonIcon />,
        moduleName: t("ACTION_TEST_FORMIO") || "Form.io",
        kpis: [
            // Add KPIs if needed in the future
        ],
        links: [
            {
                label: t("FORMIO_FORM_BUILDER") || "Form Builder",
                link: `/digit-ui/employee/formio/formio`
            },
            {
                label: t("FORMIO_FORM_LIST") || "Form List",
                link: `/digit-ui/employee/formio/formlist`
            },
            // {
            //     label: t("FORMIO_FORM_RENDERER") || "Form Renderer",
            //     link: `/digit-ui/employee/formio/form-fill`
            // }
        ]
    }


    return <EmployeeModuleCard {...propsForModuleCard} />
};

export default FORMIOCard;
