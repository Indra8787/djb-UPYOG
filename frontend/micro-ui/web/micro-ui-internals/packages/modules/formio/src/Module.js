import React from "react";
import { useRouteMatch } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import FormList from "./components/FormList";
import FormRenderer from "./components/FormRenderer";
import ConfigFormRenderer from "./components/ConfigFormRenderer";
import FORMIOCard from "./components/FormioCard";
import FormioApp from "./pages";
import 'formiojs/dist/formio.full.min.css';

export const FormioModule = ({ stateCode, userType, tenants }) => {
    const { path, url } = useRouteMatch();
    const moduleCode = "FORMIO";
    const language = Digit.StoreData.getCurrentLanguage();
    const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
    Digit.SessionStorage.set("FORMIO_TENANTS", tenants);

    if (isLoading) {
        return null;
    }
    if (userType === "employee") {
        return <FormioApp path={path} url={url} />;
    } else return null;
};


const componentsToRegister = {
    FORMIOModule: FormioModule,
    FORMIOCard: FORMIOCard,
    FormioFormBuilder: FormBuilder,
    FormioFormList: FormList,
    FormioFormRenderer: FormRenderer,
    FormioConfigFormRenderer: ConfigFormRenderer
};

export const initFormioComponents = () => {
    Object.entries(componentsToRegister).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};

export default FormioModule;
