import React, { Fragment, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { ArrowRightInbox } from "./svgindex";
import ExpandedViewContext from "./ExpandedViewContext";
import ModuleLinksView from "./ModuleLinksView";
import CollapsibleModuleSidebar from "./CollapsibleModuleSidebar";

const getNewButtonText = (moduleName, kpis, links) => {
  let path = "";
  if (kpis && kpis.length > 0 && kpis[0].link) {
    path = kpis[0].link;
  } else if (links && links.length > 0 && links[0].link) {
    path = links[0].link;
  }

  path = path.toLowerCase();
  const name = String(moduleName || "").toLowerCase();

  if (path.includes("/ws/") || path.includes("/sw/") || (name.includes("water") && (name.includes("sew") || name.includes("sw")))) return "New connection";
  if (path.includes("/wt/") || (name.includes("water") && name.includes("tanker"))) return "New application";
  if (path.includes("/ekyc/") || name.includes("kyc")) return "New Kyc";
  if (path.includes("/fsm/") || name.includes("fsm") || name.includes("sludge") || name.includes("faecal")) return "New";
  if (path.includes("/vendor/") || name.includes("vendor")) return "New vendor";
  if (path.includes("/hrms/") || name.includes("user management") || name.includes("employee")) return "New Employee";
  if (path.includes("/asset/") || name.includes("asset")) return "New Asset";

  return "New";
};

const EmployeeModuleCard = ({ Icon, moduleName, kpis = [], links = [], className, styles }) => {
  const history = useHistory();
  const { isExpandedView, isModuleSidebar } = useContext(ExpandedViewContext) || {};

  const handleDetailsClick = () => {
    history.push("/digit-ui/employee/module/details", {
      moduleName,
      links,
    });
  };

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
          <h2 className="module-title">{moduleName}</h2>
          <div className="module-icon-wrap">{Icon}</div>
        </div>

        {/* Body */}
        <div className="card-body-row">
          {/* Left: Main KPI */}
          <div className="main-kpi-section">
            {mainKpi && (
              <Fragment>
                <span className="main-kpi-number">{mainKpi.count || "0"}</span>
                <div className="main-kpi-label-wrap">
                  <div className="trend-icon">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </div>
                  <span className="main-kpi-label">{mainKpi.label}</span>
                </div>
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

        <div className="card-footer-row" style={{ marginTop: "auto" }}>
          <div className="footer-links">
            <span className="pill-link" style={{ cursor: "pointer" }}>View Reports</span>
            <span className="pill-link" style={{ cursor: "pointer" }}>+ {getNewButtonText(moduleName, kpis, links)}</span>
          </div>
          <button className="details-btn" onClick={handleDetailsClick}>
            Details
          </button>
        </div>
      </div>
    </Fragment>
  );
};


const ModuleCardFullWidth = ({
  Icon,
  moduleName,
  kpis = [],
  links = [],
  className,
  styles
}) => {
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
    <div
      className={`new-employee-card ${className || ""}`}
      style={styles || {}}
    >
      {/* Header */}
      <div className="card-header-row">
        <h2 className="module-title">{moduleName}</h2>
        {Icon && <div className="module-icon-wrap">{Icon}</div>}
      </div>

      {/* Body */}
      <div className="card-body-row">
        {/* Left: Main KPI */}
        <div className="main-kpi-section">
          {mainKpi && (
            <>
              <span className="main-kpi-number">
                {mainKpi.count || "0"}
              </span>
              <div className="main-kpi-label-wrap">
                <span className="main-kpi-label">
                  {mainKpi.label}
                </span>
              </div>
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
              const isHeader =
                !kpi.count && kpi.label === kpi.label?.toUpperCase();

              return (
                <div
                  key={index}
                  className={`secondary-kpi-item ${isHeader ? "sec-kpi-header" : ""
                    }`}
                >
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
                  {!isHeader && (
                    <span className="sec-kpi-value">
                      {kpi.count ? (
                        kpi.count
                      ) : (
                        <span className="sec-kpi-dot"></span>
                      )}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer */}
      <div
        className="card-footer-row"
        style={{ marginTop: "auto" }}
      >
        <div className="footer-links">
          <span className="pill-link" style={{ cursor: "pointer" }}>View Reports</span>
          <span className="pill-link" style={{ cursor: "pointer" }}>+ {getNewButtonText(moduleName, kpis, links)}</span>
        </div>
        <button className="details-btn" onClick={handleDetailsClick}>
          Details
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
