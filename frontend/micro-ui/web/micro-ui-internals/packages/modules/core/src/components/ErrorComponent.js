import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ErrorConfig = {
  error: {
    imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/error-image.png`,
    infoMessage: "CORE_SOMETHING_WENT_WRONG",
    buttonInfo: "ACTION_TEST_HOME",
  },
  maintenance: {
    imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/maintainence-image.png`,
    infoMessage: "CORE_UNDER_MAINTENANCE",
    buttonInfo: "ACTION_TEST_HOME",
  },
  notfound: {
    imgUrl: `https://s3.ap-south-1.amazonaws.com/egov-qa-assets/PageNotFound.png`,
    infoMessage: "CORE_NOT_FOUND",
    buttonInfo: "ACTION_TEST_HOME",
  },
};

const ErrorComponent = (props) => {
  const { type = "error" } = Digit.Hooks.useQueryParams();
  const config = ErrorConfig[type] || ErrorConfig.error;
  const { t } = useTranslation();

  const kc = window.keycloak;

  useEffect(() => {
    const isEmployee = window.location.pathname.split("/").includes("employee");
    if (!kc)
      window.location.href =
        (isEmployee ? "/digit-ui/employee/user/login" : "/digit-ui/citizen/select-language") +
        `?from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    if (kc && !kc.authenticated) {
      kc.login();
    }
    kc.logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="error-boundary">
      <div className="error-container">
        <img src={config.imgUrl} alt="error" />
        <h1>{t(config.infoMessage)}</h1>
        <button
          onClick={() => {
            props.goToHome();
          }}
        >
          {t(config.buttonInfo)}
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
