import React, { Fragment, useEffect, useState, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ModuleHeader from "./ModuleHeader";
import { ArrowLeft, HomeIcon } from "./svgindex";
import { useTranslation } from "react-i18next";
import ExpandedViewContext from "./ExpandedViewContext";
import ModuleLinksView from "./ModuleLinksView";

const ExpandedViewPage = ({ modules = [] }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const locationState = location.state || {};
  const { moduleName, links = [] } = locationState;

  const [activeModuleCode, setActiveModuleCode] = useState(null);

  // 🔹 Initial Load Logic
  useEffect(() => {
    if (!location.state) {
      history.push("/digit-ui/employee");
      return;
    }

    if (moduleName) {
      const found = modules.find(
        (m) =>
          m.code === moduleName ||
          t(`ACTION_TEST_${m.code}`) === moduleName ||
          m.name === moduleName
      );

      if (found) {
        setActiveModuleCode(found.code);
      } else {
        setActiveModuleCode(moduleName);
      }
    }
  }, [location.state, history, modules, moduleName, t]);

  // 🔹 Sidebar Module List
  const sidebarList = modules.filter((m) =>
    Digit.ComponentRegistryService.getComponent(`${m.code}Card`)
  );

  // 🔹 Dynamic Breadcrumb Label
  const activeModuleLabel = useMemo(() => {
    if (!activeModuleCode) return "";

    const foundModule = modules.find((m) => m.code === activeModuleCode);

    if (foundModule) {
      return t(`ACTION_TEST_${foundModule.code}`);
    }

    return moduleName || activeModuleCode;
  }, [activeModuleCode, modules, moduleName, t]);

  const breadcrumbs = [
    { icon: HomeIcon, path: "/digit-ui/employee" },
    { label: activeModuleLabel },
  ];

  // 🔹 Render Right Side Content
  const renderContent = () => {
    if (!activeModuleCode) return null;

    const CardComponent =
      Digit.ComponentRegistryService.getComponent(
        `${activeModuleCode}Card`
      );

    if (CardComponent) {
      return (
        <ExpandedViewContext.Provider value={{ isExpandedView: true }}>
          <CardComponent />
        </ExpandedViewContext.Provider>
      );
    }

    if (
      (activeModuleCode === moduleName ||
        t(`ACTION_TEST_${activeModuleCode}`) === moduleName) &&
      links.length > 0
    ) {
      return <ModuleLinksView links={links} moduleName={moduleName} />;
    }

    return (
      <div className="no-links-msg">
        Module content not found for {activeModuleCode}.
      </div>
    );
  };

  if (!location.state) return null;

  return (
    <Fragment>
      <div className="ground-container employee-app-container employee-app-homepage-container">
        <ModuleHeader
          leftContent={
            <>
              <ArrowLeft className="icon" />
              Back
            </>
          }
          onLeftClick={() => window.history.back()}
          breadcrumbs={breadcrumbs}
        />

        <div className="expanded-page-container">
          {/* 🔹 LEFT SIDEBAR */}
          <div className="expanded-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">All Modules</span>
            </div>

            <div className="sidebar-menu">
              {sidebarList.map((mod, idx) => {
                const displayName = t(`ACTION_TEST_${mod.code}`);
                const isActive = mod.code === activeModuleCode;

                return (
                  <div
                    key={idx}
                    className={`sidebar-item ${isActive ? "active" : ""}`}
                    onClick={() => setActiveModuleCode(mod.code)}
                  >
                    <div className="sidebar-icon-placeholder">
                      <svg
                        className="sidebar-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" />
                        <path d="M12 22v-9.5" />
                        <path d="M20 6.5l-8 4.5-8-4.5" />
                      </svg>
                    </div>
                    <span className="sidebar-text">{displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔹 RIGHT CONTENT */}
          <div style={{ flex: 1 }}>{renderContent()}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default ExpandedViewPage;