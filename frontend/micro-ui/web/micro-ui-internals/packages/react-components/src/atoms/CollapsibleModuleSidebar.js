import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const CollapsibleModuleSidebar = ({ links = [], moduleName = "Dashboard", Icon }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const renderNavLink = (linkItem, index, extraClass = "") => {
        const isActive = location.pathname === linkItem.link;
        const initials = linkItem.label.substring(0, 2).toUpperCase();

        const LinkContent = (
            <div className="nav-item-content">
                <div className="nav-icon-wrapper">
                    {linkItem.icon ? linkItem.icon : <span className="fallback-initial">{initials}</span>}
                </div>
                <span className="nav-text">{linkItem.label}</span>
            </div>
        );

        const className = `nav-item ${isActive ? "active" : ""} ${extraClass}`;

        return (
            <div key={index} className={className} title={isCollapsed ? linkItem.label : ""}>
                {linkItem.link ? (
                    linkItem.link.includes("digit-ui") ? (
                        <Link to={linkItem.link} className="nav-link">{LinkContent}</Link>
                    ) : (
                        <a href={linkItem.link} className="nav-link">{LinkContent}</a>
                    )
                ) : (
                    <div className="nav-link disabled">{LinkContent}</div>
                )}
            </div>
        );
    };

    // Mobile horizontal tab bar
    const renderMobileTab = (linkItem, index) => {
        const isActive = location.pathname === linkItem.link;
        const initials = linkItem.label.substring(0, 2).toUpperCase();

        const content = (
            <div className={`mobile-tab-item ${isActive ? "active" : ""}`}>
                <div className="mobile-tab-icon">
                    {linkItem.icon ? linkItem.icon : <span className="mobile-tab-initial">{initials}</span>}
                </div>
                <span className="mobile-tab-label">{linkItem.label}</span>
            </div>
        );

        if (!linkItem.link) return <div key={index} className="mobile-tab-wrapper disabled">{content}</div>;

        return (
            <div key={index} className="mobile-tab-wrapper">
                {linkItem.link.includes("digit-ui") ? (
                    <Link to={linkItem.link}>{content}</Link>
                ) : (
                    <a href={linkItem.link}>{content}</a>
                )}
            </div>
        );
    };

    return (
        <div className="module-sidebar-wrapper">
            {/* ── Mobile horizontal nav bar (visible only on mobile) ── */}
            {/* <nav className="mobile-tab-bar">
                {links.map((linkItem, index) => renderMobileTab(linkItem, index))}
            </nav> */}

            {/* ── Desktop sidebar (hidden on mobile) ── */}
            <aside
                id="module-sidebar"
                className={`premium-sidebar ${isCollapsed ? "collapsed" : "expanded"}`}
            >
                <div className="sidebar-header">
                    <div className="brand-container">
                        <div className="brand-icon">
                            {Icon || <div className="default-icon"></div>}
                        </div>
                        <h2 className="brand-name">{moduleName}</h2>
                    </div>
                    <button
                        className="collapse-toggle"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label="Toggle Sidebar"
                        type="button"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isCollapsed ? (
                                <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                            ) : (
                                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                            )}
                        </svg>
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {links.map((linkItem, index) => renderNavLink(linkItem, index))}
                </nav>
            </aside>
        </div>
    );
};

export default CollapsibleModuleSidebar;