import React from "react";
import { useHistory, Link } from "react-router-dom";
import RecentActivity from "../../../modules/core/src/components/RecentActivity";

const ModuleHeader = ({
  leftContent,
  breadcrumbs = [],
  rightContent, // ✅ NEW PROP
  onLeftClick,
  wrapperClass = "",
  containerClass = "",
}) => {
  const history = useHistory();

  return (
    <div className={`module-header ${wrapperClass}`}>

      <div className={`header-bottom-section ${containerClass}`}>
        {/* Left Section */}
        {leftContent && (
          <div className="left-section" onClick={onLeftClick} style={{ cursor: onLeftClick ? "pointer" : "default" }}>
            {leftContent}
          </div>
        )}

        {/* Right Section */}
        <div className="right-section">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            {breadcrumbs.map((item, index) => {
              const Icon = item.icon;

              const handleClick = () => {
                if (item.path) history.push(item.path);
                else if (item.onClick) item.onClick();
              };

              return (
                <React.Fragment key={index}>
                  {Icon && item.path ? (
                    <Link to={item.path} style={{ display: "inline-flex" }}>
                      <Icon className="icon home-icon" />
                    </Link>
                  ) : Icon ? (
                    <Icon className="icon home-icon" />
                  ) : null}

                  {item.label && (
                    <span
                      onClick={handleClick}
                      style={{
                        cursor: item.path || item.onClick ? "pointer" : "default",
                        marginLeft: "4px",
                      }}
                    >
                      {item.label}
                    </span>
                  )}

                  {index !== breadcrumbs.length - 1 && <span className="iconn"> &gt; </span>}
                </React.Fragment>
              );
            })}
          </div>

          {/* ✅ Extra Right Side Content */}
          {rightContent && <div className="extra-right-content">
            {rightContent}

          </div>}
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
