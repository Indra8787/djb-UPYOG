import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@djb25/digit-ui-react-components";

const Icons = {
  Calendar: ({ size = 16 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  XCircle: ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  ),
  Eye: ({ size = 24, fill = "currentColor", ...props }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  User: ({ size = 16 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const NewsAndEvents = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("documents");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDocTitle, setPreviewDocTitle] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDocLoading, setIsDocLoading] = useState(false);

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const handleEventClick = (item) => {
    setSelectedEvent(item);
    setIsEventModalOpen(true);
  };

  const handlePreviewClick = async (item) => {
    try {
      setPreviewDocUrl(null);
      setPreviewDocTitle(item.title);
      setIsPreviewModalOpen(true);
      setIsDocLoading(true);
      const res = await Digit.UploadServices.Filefetch([item.filestoreId], Digit.ULBService.getStateId());
      if (res?.data?.fileStoreIds?.length > 0) {
        let url = res.data.fileStoreIds[0]?.url;
        if (url.includes(",")) url = url.split(",")[0];
        setPreviewDocUrl(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDocLoading(false);
    }
  };

  const { isLoading: isEventsLoading, data: eventsData } = Digit.Hooks.events.useInbox(tenantId, {}, {});

  const { isLoading: isDocsLoading, data: docsData } = Digit.Hooks.engagement.useDocSearch({ tenantIds: tenantId, offset: 0, limit: 50 }, {});

  const { isLoading: isSurveysLoading, data: surveysData } = Digit.Hooks.survey.useCfdefinitionsearch(
    {
      ServiceDefinitionCriteria: { tenantId, code: [], module: ["Engagement"] },
      Pagination: { limit: 50, offSet: 0, sortBy: "string", order: "asc" },
    },
    {}
  );

  const isLoading = isEventsLoading || isDocsLoading || isSurveysLoading;

  const formatDate = (epoch, endEpoch) => {
    if (!epoch) return "";
    const date = new Date(epoch);
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const startStr = `${day} ${monthNames[date.getMonth()]}`;

    if (endEpoch && endEpoch !== epoch) {
      const endDate = new Date(endEpoch);
      const endDay = endDate.getDate();
      return `${startStr} - ${endDay} ${monthNames[endDate.getMonth()]}`;
    }

    return startStr;
  };

  const colors = ["#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#10b981", "#0ea5e9", "#64748b"];

  const tabData = useMemo(() => {
    const events = (eventsData?.events || [])
      .filter((e) => e.eventType === "EVENTSONGROUND")
      .map((e, index) => ({
        id: e.id || `event-${index}`,
        title: e.name || e.header,
        description: e.description,
        location: e.eventDetails?.location,
        category: e.eventCategory,
        postedBy: e.user?.name,
        startDate: e.eventDetails?.fromDate,
        endDate: e.eventDetails?.toDate,
        rightText: formatDate(e.eventDetails?.fromDate, e.eventDetails?.toDate) || formatDate(e.auditDetails?.lastModifiedTime),
        color: colors[index % colors.length],
      }));

    const documents = (docsData?.Documents || []).map((d, index) => ({
      id: d.id || `doc-${index}`,
      title: d.name,
      category: d.category,
      rightText: d.documentType || "Doc",
      color: colors[index % colors.length],
      filestoreId: d.filestoreId,
    }));

    const surveys = (surveysData?.ServiceDefinition || []).map((s, index) => ({
      id: s.id || s.code || `survey-${index}`,
      title: s.code || s.additionalDetails?.title,
      count: 0,
      rightText: s.isActive ? "ACTIVE" : "INACTIVE",
      rightTextDanger: !s.isActive,
      color: colors[index % colors.length],
    }));

    return { documents, events, surveys };
  }, [eventsData, docsData, surveysData]);

  const currentData = tabData[activeTab] || [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div className="recent-activity-wrapper static-card" style={{ padding: "16px 0 0 0" }}>
        <div className="ra-header" style={{ padding: "0 16px", borderBottom: "none", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <div className="ra-header-square-icon" style={{ backgroundColor: "#0ea5e9" }}></div>
            <h3 style={{ fontSize: "16px", margin: 0, color: "#0f172a" }}>{t("Upcoming Events & Latest Updates")}</h3>
          </div>
          <div className="ra-footer" style={{ padding: "12px 0" }}>
            <button className="ra-view-all" onClick={() => setIsModalOpen(true)} style={{ color: "#2563eb" }}>
              <Icons.Calendar size={16} /> <span style={{ marginLeft: "6px" }}>{t("View All")}</span>
            </button>
          </div>
        </div>

        <div className="custom-tabs-header">
          <button className={`custom-tab-btn ${activeTab === "documents" ? "active" : ""}`} onClick={() => setActiveTab("documents")}>
            {t("Documents")}
          </button>
          <button className={`custom-tab-btn ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
            {t("Events")}
          </button>
          <button className={`custom-tab-btn ${activeTab === "surveys" ? "active" : ""}`} onClick={() => setActiveTab("surveys")}>
            {t("Surveys")}
          </button>
        </div>

        <div className="compact-list">
          {currentData.length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>{t("ES_COMMON_NO_DATA")}</div>
          ) : (
            currentData.slice(0, 3).map((item) => (
              <div key={item.id} className="compact-list-item">
                <div className="dot-indicator" style={{ backgroundColor: item.color }}></div>
                <span className="compact-title">
                  {item.title}
                  {item.category && (
                    <span style={{ color: "#64748b", fontSize: "12px", marginLeft: "6px", fontWeight: "normal" }}>({t(item.category)})</span>
                  )}
                  {activeTab === "events" && item.postedBy && (
                    <div style={{ display: "flex", alignItems: "center", marginTop: "4px", fontSize: "11px", color: "#64748b" }}>
                      <Icons.User size={12} style={{ marginRight: "4px" }} /> {t("Posted By")}: {item.postedBy}
                    </div>
                  )}
                </span>
                {item.count !== undefined && <span className="compact-badge">{item.count}</span>}
                <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                  <span className={`compact-right-text ${item.rightTextDanger ? "danger" : ""}`}>{item.rightText}</span>
                  {activeTab === "documents" && item.filestoreId && (
                    <span
                      style={{ marginLeft: "12px", cursor: "pointer", display: "flex", alignItems: "center" }}
                      onClick={() => handlePreviewClick(item)}
                      title={t("CS_COMMON_VIEW")}
                    >
                      <Icons.Eye size={18} fill="#64748b" />
                    </span>
                  )}
                  {activeTab === "events" && (
                    <span
                      style={{ marginLeft: "12px", cursor: "pointer", display: "flex", alignItems: "center" }}
                      onClick={() => handleEventClick(item)}
                      title={t("CS_COMMON_VIEW")}
                    >
                      <Icons.Eye size={18} fill="#64748b" />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="ra-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="ra-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ra-modal-header">
              <h3>{t(`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`)}</h3>
              <button className="ra-modal-close" onClick={() => setIsModalOpen(false)}>
                <Icons.XCircle size={24} />
              </button>
            </div>
            <div className="custom-modal-body" style={{ padding: 0 }}>
              {currentData.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>{t("ES_COMMON_NO_DATA")}</div>
              ) : (
                currentData.map((item) => (
                  <div key={item.id} className="compact-list-item" style={{ padding: "16px" }}>
                    <div className="dot-indicator" style={{ backgroundColor: item.color }}></div>
                    <span className="compact-title">
                      {item.title}
                      {item.category && (
                        <span style={{ color: "#64748b", fontSize: "12px", marginLeft: "6px", fontWeight: "normal" }}>({t(item.category)})</span>
                      )}
                      {activeTab === "events" && item.postedBy && (
                        <div style={{ display: "flex", alignItems: "center", marginTop: "4px", fontSize: "11px", color: "#64748b" }}>
                          <Icons.User size={12} style={{ marginRight: "4px" }} /> {t("Posted By")}: {item.postedBy}
                        </div>
                      )}
                    </span>
                    {item.count !== undefined && <span className="compact-badge">{item.count}</span>}
                    <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                      <span className={`compact-right-text ${item.rightTextDanger ? "danger" : ""}`}>{item.rightText}</span>
                      {activeTab === "documents" && item.filestoreId && (
                        <span
                          style={{ marginLeft: "12px", cursor: "pointer", display: "flex", alignItems: "center" }}
                          onClick={() => handlePreviewClick(item)}
                          title={t("CS_COMMON_VIEW")}
                        >
                          <Icons.Eye size={18} fill="#64748b" />
                        </span>
                      )}
                      {activeTab === "events" && (
                        <span
                          style={{ marginLeft: "12px", cursor: "pointer", display: "flex", alignItems: "center" }}
                          onClick={() => handleEventClick(item)}
                          title={t("CS_COMMON_VIEW")}
                        >
                          <Icons.Eye size={18} fill="#64748b" />
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {isPreviewModalOpen && (
        <div className="ra-modal-overlay" onClick={() => setIsPreviewModalOpen(false)}>
          <div
            className="ra-modal-content"
            style={{ width: "80%", maxWidth: "800px", height: "80vh", padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ra-modal-header" style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
              <h3 style={{ margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{previewDocTitle}</h3>
              <button className="ra-modal-close" onClick={() => setIsPreviewModalOpen(false)}>
                <Icons.XCircle size={24} />
              </button>
            </div>
            <div
              className="custom-modal-body"
              style={{ height: "calc(100% - 62px)", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f1f5f9" }}
            >
              {isDocLoading && !previewDocUrl ? (
                <Loader />
              ) : previewDocUrl ? (
                <iframe src={previewDocUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Document Preview" />
              ) : (
                <div style={{ color: "#64748b" }}>{t("ES_COMMON_NO_DATA")}</div>
              )}
            </div>
          </div>
        </div>
      )}
      {isEventModalOpen && selectedEvent && (
        <div className="ra-modal-overlay" onClick={() => setIsEventModalOpen(false)}>
          <div className="ra-modal-content" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div className="ra-modal-header" style={{ padding: "16px", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: 0 }}>{t("Event Details")}</h3>
              <button className="ra-modal-close" onClick={() => setIsEventModalOpen(false)}>
                <Icons.XCircle size={24} />
              </button>
            </div>
            <div className="custom-modal-body" style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{t("Event Name")}</span>
                <span style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>{selectedEvent.title}</span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{t("Category")}</span>
                <span style={{ fontSize: "14px", color: "#334155" }}>{t(`MSEVA_EVENTCATEGORIES_${selectedEvent.category}`)}</span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{t("Description")}</span>
                <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: "1.5" }}>
                  {selectedEvent.description || t("No description provided")}
                </p>
              </div>
              <div style={{ display: "flex", gap: "24px", marginBottom: "16px" }}>
                <div>
                  <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{t("Date")}</span>
                  <div style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#334155" }}>
                    <Icons.Calendar size={14} style={{ marginRight: "6px" }} /> {formatDate(selectedEvent.startDate, selectedEvent.endDate)}
                  </div>
                </div>
                {selectedEvent.postedBy && (
                  <div>
                    <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{t("Posted By")}</span>
                    <div style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#334155" }}>
                      <Icons.User size={14} style={{ marginRight: "6px" }} /> {selectedEvent.postedBy}
                    </div>
                  </div>
                )}
              </div>
              {selectedEvent.location && (
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{t("Location")}</span>
                  <span style={{ fontSize: "14px", color: "#334155" }}>{selectedEvent.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default NewsAndEvents;
