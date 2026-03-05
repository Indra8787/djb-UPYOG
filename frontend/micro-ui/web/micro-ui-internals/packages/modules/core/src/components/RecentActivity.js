import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// Pure SVG Icons - No dependencies required
const Icons = {
    PlusCircle: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
    ),
    CheckCircle: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
    Rupee: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12" /><path d="M6 8h12" /><path d="m6 13 8.5 8" /><path d="M6 13h3" /><path d="M9 13c6.667 0 6.667-10 0-10" /></svg>
    ),
    Receipt: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
    ),
    XCircle: ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
    ),
    History: ({ size = 16, className }) => (
        <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
    ),
    ChevronLeft: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
    ),
    ChevronRight: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
    ),
    ArrowRight: ({ size = 14 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )
};

const RecentActivity = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const activities = [
        {
            id: 1, user: "Naveen", action: "Created a new Water Connection Application",
            moduleId: "WS-APP-2026-03-01-001", time: "2h ago",
            bgHex: "#ecfdf5", iconHex: "#10b981", Icon: Icons.PlusCircle
        },
        {
            id: 2, user: "Aarti", action: "Approved Building Plan",
            moduleId: "BPA-2026-02-28-092", time: "4h ago",
            bgHex: "#eff6ff", iconHex: "#3b82f6", Icon: Icons.CheckCircle
        },
        {
            id: 3, user: "Suresh", action: "Paid Property Tax",
            moduleId: "PT-109-2026", time: "Yesterday",
            bgHex: "#fefce8", iconHex: "#eab308", Icon: Icons.Rupee
        },
        {
            id: 4, user: "System", action: "Generated Demand for Trade License",
            moduleId: "TL-2026-003", time: "Yesterday",
            bgHex: "#faf5ff", iconHex: "#a855f7", Icon: Icons.Receipt
        },
        {
            id: 5, user: "Meera", action: "Rejected Grievance",
            moduleId: "PGR-2026-928", time: "2 days ago",
            bgHex: "#fef2f2", iconHex: "#ef4444", Icon: Icons.XCircle
        },
    ];

    const togglePanel = () => setIsOpen(!isOpen);

    return (
        <div className="ra-wrapper">
            <div className={`ra-container ${isOpen ? "open" : "closed"}`}>
                
                {/* The "Sliding Door" that hides/shows the content by animating its width */}
                <div className="ra-content-door">
                    {/* Fixed-width content inside ensures text doesn't squish during animation */}
                    <div className="ra-content-inner">
                        <div className="ra-header">
                            <div>
                                <h3>{t("Recent Activity")}</h3>
                                <p className="ra-subtitle">{t("Latest updates and actions")}</p>
                            </div>
                            <button className="ra-view-all">
                                {t("View All")} <Icons.ArrowRight size={14} />
                            </button>
                        </div>

                        <div className="ra-timeline">
                            {activities.map((activity, index) => {
                                const IconComponent = activity.Icon;
                                return (
                                    <div key={activity.id} className="ra-item">
                                        <div className="ra-indicator">
                                            <div 
                                                className="ra-icon-wrapper" 
                                                style={{ backgroundColor: activity.bgHex, color: activity.iconHex }}
                                            >
                                                <IconComponent size={18} />
                                            </div>
                                            {/* Line perfectly centered under the icon */}
                                            {index !== activities.length - 1 && <div className="ra-line"></div>}
                                        </div>

                                        <div className="ra-details">
                                            <p className="ra-text">
                                                <span className="ra-user">{activity.user}</span> {activity.action}
                                            </p>
                                            <div className="ra-meta">
                                                <span className="ra-module">{activity.moduleId}</span>
                                                <span className="ra-time">{activity.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* The beautifully integrated toggle strip fixed on the right */}
                <div className="ra-strip" onClick={togglePanel}>
                    <div className="ra-chevron-icon">
                        {isOpen ? <Icons.ChevronRight size={24} /> : <Icons.ChevronLeft size={24} />}
                    </div>
                    
                    <div className="ra-strip-text">
                        <Icons.History size={16} className="ra-history-icon" />
                        <span>{t("Recent Activity")}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RecentActivity;