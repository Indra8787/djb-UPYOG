import { PrivateRoute } from "@djb25/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import FormBuilder from "../components/FormBuilder";
import FormList from "../components/FormList";
import FormRenderer from "../components/FormRenderer";
import ConfigFormRenderer from "../components/ConfigFormRenderer";

const FormioApp = ({ path, url, userType }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const mobileView = innerWidth <= 640;

    return (
        <div className="ground-container">
            <p className="breadcrumb" style={{ marginLeft: mobileView ? "1vw" : "15px" }}>
                <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
                    {t("HOME") || "Home"}
                </Link>{" "}
                / <span>{t("ACTION_TEST_FORMIO") || "Form.io"}</span>
            </p>
            <Switch>
                <PrivateRoute path={`${path}/formio`} component={FormBuilder} />
                <PrivateRoute path={`${path}/formlist`} component={FormList} />
                <PrivateRoute path={`${path}/form-fill`} component={FormRenderer} />
                <PrivateRoute path={`${path}/config-form`} component={ConfigFormRenderer} />
            </Switch>
        </div>
    );
};

export default FormioApp;
