import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Create custom icons
const onlineIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const offlineIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SOCKET_URL =  "http://localhost:3000";

// Component to handle map centering
const MapController = ({ selectedDriver }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedDriver?.lat && selectedDriver?.lng) {
      map.setView([selectedDriver.lat, selectedDriver.lng], 15, {
        animate: true,
        duration: 1,
      });
    }
  }, [selectedDriver, map]);

  return null;
};

// Custom hook for route fetching
const useRoute = (start, end) => {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!start || !end) return;

    const fetchRoute = async () => {
      setLoading(true);
      try {
        // Using OSRM public API
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`
        );

        if (!response.ok) throw new Error("Failed to fetch route");

        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
          const coordinates = route.geometry.coordinates.map((coord) => [coord[1], coord[0]]);

          setRouteData({
            coordinates,
            distance: route.distance,
            duration: route.duration,
            legs: route.legs,
          });
        }
      } catch (err) {
        console.error("Error fetching route:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [start?.lat, start?.lng, end?.lat, end?.lng]);

  return { routeData, loading, error };
};

// Component to display route on map
const RouteLayer = ({ start, end, color = "#2196f3", weight = 6 }) => {
  const { routeData, loading, error } = useRoute(start, end);
  const [showSteps, setShowSteps] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  if (loading) {
    return (
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        Loading route...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "#ffebee",
          color: "#c62828",
          padding: "8px 16px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        Error loading route: {error}
      </div>
    );
  }

  if (!routeData) return null;

  // Pipeline visualization with segments
  const renderRouteSegments = () => {
    if (!routeData.legs) return null;

    const segments = [];
    routeData.legs.forEach((leg, legIndex) => {
      leg.steps.forEach((step, stepIndex) => {
        const stepCoordinates = step.geometry.coordinates.map((coord) => [coord[1], coord[0]]);

        // Different colors for different maneuver types
        let segmentColor = color;

        if (step.maneuver.type === "turn") {
          segmentColor = "#ff9800"; // Orange for turns
        } else if (step.maneuver.type === "straight") {
          segmentColor = "#4caf50"; // Green for straight
        } else if (step.maneuver.type === "arrive") {
          segmentColor = "#f44336"; // Red for arrival
        }

        // Add pipeline effect with multiple lines
        segments.push(
          <React.Fragment key={`${legIndex}-${stepIndex}`}>
            {/* Outer glow effect */}
            <Polyline positions={stepCoordinates} color={segmentColor} weight={weight + 2} opacity={0.3} lineCap="round" />
            {/* Main route line */}
            <Polyline
              positions={stepCoordinates}
              color={segmentColor}
              weight={weight}
              opacity={0.9}
              lineCap="round"
              eventHandlers={{
                mouseover: () => setSelectedStep(step),
                mouseout: () => setSelectedStep(null),
                click: () => setShowSteps(!showSteps),
              }}
            />
            {/* Direction indicators (dots) */}
            {stepCoordinates.map((coord, idx) => {
              if (idx % 5 === 0 && idx < stepCoordinates.length - 1) {
                const nextCoord = stepCoordinates[idx + 1];
                const angle = (Math.atan2(nextCoord[0] - coord[0], nextCoord[1] - coord[1]) * 180) / Math.PI;

                return (
                  <Marker
                    key={`dot-${legIndex}-${stepIndex}-${idx}`}
                    position={coord}
                    icon={L.divIcon({
                      className: "direction-dot",
                      html: `<div style="
                        width: 6px;
                        height: 6px;
                        background: white;
                        border: 2px solid ${segmentColor};
                        border-radius: 50%;
                        transform: rotate(${angle}deg);
                      "></div>`,
                      iconSize: [10, 10],
                      iconAnchor: [5, 5],
                    })}
                  />
                );
              }
              return null;
            })}
          </React.Fragment>
        );
      });
    });

    return segments;
  };

  return (
    <React.Fragment>
      {/* Pipeline route with segments */}
      {renderRouteSegments()}

      {/* Route information panel */}
      {(selectedStep || showSteps) && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "10px",
            right: "10px",
            background: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            maxWidth: "calc(100% - 20px)",
            border: "1px solid #e0e0e0",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h4 style={{ margin: 0, color: "#667eea" }}>Route Information</h4>
            <button
              onClick={() => setShowSteps(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                color: "#666",
                padding: "0 8px",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div>
              <strong>Total Distance:</strong> {(routeData.distance / 1000).toFixed(2)} km
            </div>
            <div>
              <strong>Est. Time:</strong> {Math.round(routeData.duration / 60)} minutes
            </div>
          </div>

          {selectedStep && (
            <div
              style={{
                padding: "8px",
                background: "#f5f5f5",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            >
              <div>
                <strong>Current Step:</strong> {selectedStep.maneuver.type}
              </div>
              <div>
                <strong>Instruction:</strong> {selectedStep.maneuver.instruction || selectedStep.name}
              </div>
              <div>
                <strong>Distance:</strong> {(selectedStep.distance / 1000).toFixed(2)} km
              </div>
              <div>
                <strong>Duration:</strong> {Math.round(selectedStep.duration / 60)} min
              </div>
            </div>
          )}

          {showSteps && routeData.legs && (
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              <h5 style={{ margin: "8px 0", color: "#666" }}>Turn-by-turn directions:</h5>
              {routeData.legs[0].steps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    fontSize: "12px",
                    cursor: "pointer",
                    background: selectedStep === step ? "#e3f2fd" : "transparent",
                  }}
                  onMouseEnter={() => setSelectedStep(step)}
                  onMouseLeave={() => setSelectedStep(null)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#667eea",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: "500" }}>{step.maneuver.instruction || step.name}</div>
                      <div style={{ color: "#666" }}>
                        {(step.distance / 1000).toFixed(2)} km · {Math.round(step.duration / 60)} min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Distance markers along route */}
      {routeData.distance > 1000 && routeData.coordinates && <RouteMarkers coordinates={routeData.coordinates} totalDistance={routeData.distance} />}
    </React.Fragment>
  );
};

// Component to show distance markers along the route
const RouteMarkers = ({ coordinates, totalDistance }) => {
  const markers = [];
  const interval = 1000; // Show marker every 1km

  for (let i = interval; i < totalDistance; i += interval) {
    const fraction = i / totalDistance;
    const index = Math.floor(coordinates.length * fraction);
    if (index < coordinates.length) {
      markers.push(
        <Marker
          key={`dist-${i}`}
          position={coordinates[index]}
          icon={L.divIcon({
            className: "distance-marker",
            html: `<div style="
              background: white;
              border: 2px solid #667eea;
              border-radius: 12px;
              padding: 2px 6px;
              font-size: 10px;
              font-weight: bold;
              color: #667eea;
              white-space: nowrap;
            ">${(i / 1000).toFixed(0)} km</div>`,
            iconSize: [40, 20],
            iconAnchor: [20, 10],
          })}
        />
      );
    }
  }

  return <React.Fragment>{markers}</React.Fragment>;
};

const StatusBadge = ({ isOnline }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: isOnline ? "#e6f7e6" : "#ffe6e6",
      color: isOnline ? "#2e7d32" : "#c62828",
      border: `1px solid ${isOnline ? "#a5d6a7" : "#ef9a9a"}`,
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: isOnline ? "#4caf50" : "#f44336",
        marginRight: "6px",
      }}
    />
    {isOnline ? "ONLINE" : "OFFLINE"}
  </span>
);

const DriverCard = ({ driver, isSelected, onClick }) => {
  const calculateETA = () => {
    if (!driver.lat || !driver.lng || !driver.deliveryLat || !driver.deliveryLng) return null;

    const distance = calculateDistance(driver.lat, driver.lng, driver.deliveryLat, driver.deliveryLng);
    const minutes = Math.round((distance / 30) * 60);
    return minutes;
  };

  const eta = calculateETA();

  return (
    <div
      onClick={onClick}
      style={{
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "12px",
        background: isSelected ? "#e3f2fd" : "#ffffff",
        border: `2px solid ${isSelected ? "#2196f3" : "#e0e0e0"}`,
        boxShadow: isSelected ? "0 4px 12px rgba(33, 150, 243, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: driver.isOnline ? "linear-gradient(90deg, #4caf50, #81c784)" : "linear-gradient(90deg, #f44336, #e57373)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: driver.isOnline ? "linear-gradient(135deg, #4caf50, #81c784)" : "linear-gradient(135deg, #9e9e9e, #bdbdbd)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            marginRight: "12px",
            flexShrink: 0,
          }}
        >
          {driver.driverId.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: "600",
              fontSize: "16px",
              color: "#667eea",
              marginBottom: "4px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Driver #{driver.driverId.substring(0, 8)}...
          </div>
          <StatusBadge isOnline={driver.isOnline} />
        </div>
      </div>

      {driver.lat && driver.lng && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Current Location</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "#666" }}>Lat:</span>
            <span style={{ fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>{driver.lat.toFixed(4)}</span>
            <span style={{ color: "#666" }}>Lng:</span>
            <span style={{ fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>{driver.lng.toFixed(4)}</span>
          </div>
        </div>
      )}

      {driver.deliveryLat && driver.deliveryLng && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Delivery Destination</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px",
              fontSize: "11px",
            }}
          >
            <span style={{ color: "#666" }}>Lat:</span>
            <span style={{ fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>{driver.deliveryLat.toFixed(4)}</span>
            <span style={{ color: "#666" }}>Lng:</span>
            <span style={{ fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>{driver.deliveryLng.toFixed(4)}</span>
          </div>
        </div>
      )}

      {eta !== null && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px",
            background: "#f5f5f5",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "#666" }}>Est. Arrival</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#667eea" }}>{eta} min</div>
          </div>
          {driver.speed && (
            <div>
              <div style={{ fontSize: "11px", color: "#666" }}>Speed</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#4caf50" }}>{Math.round(driver.speed * 3.6)} km/h</div>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: "12px",
          fontSize: "11px",
          color: "#999",
          borderTop: "1px solid #eee",
          paddingTop: "8px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4px",
        }}
      >
        {driver.accuracy && (
          <React.Fragment>
            <span>Accuracy</span>
            <span>{Math.round(driver.accuracy)}m</span>
          </React.Fragment>
        )}
        {driver.heading && (
          <React.Fragment>
            <span>Heading</span>
            <span>{Math.round(driver.heading)}°</span>
          </React.Fragment>
        )}
        {driver.lastSeen && (
          <React.Fragment>
            <span>Last seen</span>
            <span>{new Date(driver.lastSeen).toLocaleTimeString()}</span>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LiveTrackingSystem() {
  const [drivers, setDrivers] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState("all");
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]);
  const [mapZoom, setMapZoom] = useState(12);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check for mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const socket = useMemo(() => {
    return io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Admin connected:", socket.id);
      setIsConnected(true);
      socket.emit("admin-join");
    });

    socket.on("disconnect", () => {
      console.log("Admin disconnected");
      setIsConnected(false);
    });

    socket.on("drivers-snapshot", (data) => {
      console.log("drivers-snapshot", data);

      if (!Array.isArray(data)) return;

      const mapped = {};
      data.forEach((driver) => {
        if (driver && driver.driverId) {
          mapped[driver.driverId] = {
            ...driver,
            lastUpdate: new Date().toISOString(),
          };
        }
      });

      setDrivers(mapped);
    });

    socket.on("driver-location-update", (driver) => {
      console.log("driver-location-update", driver);

      if (!driver || !driver.driverId) return;

      setDrivers((prev) => {
        const existingDriver = prev[driver.driverId] || {};
        return {
          ...prev,
          [driver.driverId]: {
            ...existingDriver,
            ...driver,
            lastUpdate: new Date().toISOString(),
          },
        };
      });
    });

    socket.on("driver-status", (driver) => {
      console.log("driver-status", driver);

      if (!driver || !driver.driverId) return;

      setDrivers((prev) => ({
        ...prev,
        [driver.driverId]: {
          ...prev[driver.driverId],
          ...driver,
          lastUpdate: new Date().toISOString(),
        },
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // When selected driver changes, update map center
  useEffect(() => {
    if (selectedDriver?.lat && selectedDriver?.lng) {
      setMapCenter([selectedDriver.lat, selectedDriver.lng]);
      setMapZoom(15);
    }
  }, [selectedDriver]);

  const filteredDrivers = Object.values(drivers).filter((driver) => {
    const matchesSearch = driver.driverId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterOnline === "all" || (filterOnline === "online" && driver.isOnline) || (filterOnline === "offline" && !driver.isOnline);
    return matchesSearch && matchesStatus;
  });

  const onlineCount = Object.values(drivers).filter((d) => d.isOnline).length;
  const offlineCount = Object.values(drivers).filter((d) => !d.isOnline).length;
  const activeDeliveries = Object.values(drivers).filter((d) => d.isOnline && d.deliveryLat && d.deliveryLng).length;

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 2000,
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "20px" }}>☰</span>
          {showSidebar ? "Hide List" : "Show Drivers"}
        </button>
      )}

      {/* Sidebar - with mobile responsive styles */}
      <div
        style={{
          width: isMobile ? (showSidebar ? "100%" : "0") : "380px",
          height: "100%",
          borderRight: isMobile ? "none" : "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          boxShadow: isMobile ? (showSidebar ? "0 0 20px rgba(0,0,0,0.2)" : "none") : "2px 0 8px rgba(0, 0, 0, 0.05)",
          position: isMobile ? "absolute" : "relative",
          top: 0,
          left: 0,
          zIndex: 1500,
          transition: "all 0.3s ease-in-out",
          overflow: showSidebar ? "visible" : "hidden",
          ...(isMobile &&
            !showSidebar && {
              width: "0",
              opacity: 0,
              pointerEvents: "none",
            }),
        }}
      >
        {showSidebar && (
          <React.Fragment>
            <div
              style={{
                padding: isMobile ? "16px" : "24px",
                background: "linear-gradient(135deg, #667eea, #0d47a1)",
                color: "white",
              }}
            >
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "white",
                    fontSize: "20px",
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              )}
              <h2
                style={{
                  margin: "0 0 8px 0",
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "600",
                  letterSpacing: "-0.5px",
                }}
              >
                Live Driver Tracking
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  opacity: 0.9,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: isConnected ? "#4caf50" : "#f44336",
                    animation: isConnected ? "pulse 2s infinite" : "none",
                  }}
                />
                <span>{isConnected ? "Connected to server" : "Disconnected"}</span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: isMobile ? "4px" : "8px",
                padding: isMobile ? "12px" : "16px",
                background: "#f5f5f5",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: isMobile ? "10px" : "11px", color: "#666" }}>Total</div>
                <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "bold", color: "#667eea" }}>{Object.keys(drivers).length}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: isMobile ? "10px" : "11px", color: "#666" }}>Online</div>
                <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "bold", color: "#4caf50" }}>{onlineCount}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: isMobile ? "10px" : "11px", color: "#666" }}>Offline</div>
                <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "bold", color: "#f44336" }}>{offlineCount}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: isMobile ? "10px" : "11px", color: "#666" }}>Active</div>
                <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: "bold", color: "#ff9800" }}>{activeDeliveries}</div>
              </div>
            </div>

            <div
              style={{
                padding: isMobile ? "12px" : "16px",
                borderBottom: "1px solid #e0e0e0",
                background: "#fafafa",
              }}
            >
              <input
                type="text"
                placeholder="Search by driver ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: isMobile ? "10px" : "12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: isMobile ? "14px" : "14px",
                  marginBottom: "12px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />

              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                {["all", "online", "offline"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterOnline(filter)}
                    style={{
                      flex: 1,
                      padding: isMobile ? "6px" : "8px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      background: filterOnline === filter ? "#667eea" : "white",
                      color: filterOnline === filter ? "white" : "#333",
                      cursor: "pointer",
                      fontSize: isMobile ? "11px" : "12px",
                      fontWeight: "500",
                      textTransform: "capitalize",
                      transition: "all 0.2s",
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="showRoutes"
                  checked={showRoutes}
                  onChange={(e) => setShowRoutes(e.target.checked)}
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                />
                <label htmlFor="showRoutes" style={{ fontSize: isMobile ? "12px" : "13px", color: "#333", cursor: "pointer" }}>
                  Show delivery routes
                </label>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: isMobile ? "12px" : "16px",
                background: "#f5f5f5",
              }}
            >
              {filteredDrivers.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: isMobile ? "20px" : "40px 20px",
                    color: "#999",
                    background: "white",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ fontSize: isMobile ? "36px" : "48px", marginBottom: "16px" }}>🚗</div>
                  <p style={{ fontSize: isMobile ? "14px" : "16px", margin: 0 }}>
                    {Object.keys(drivers).length === 0 ? "No drivers available" : "No drivers match your filters"}
                  </p>
                </div>
              ) : (
                filteredDrivers.map((driver) => (
                  <DriverCard
                    key={driver.driverId}
                    driver={driver}
                    isSelected={selectedDriver?.driverId === driver.driverId}
                    onClick={() => {
                      setSelectedDriver(driver);
                      if (isMobile) {
                        setShowSidebar(false); // Auto-hide sidebar on mobile after selection
                      }
                    }}
                  />
                ))
              )}
            </div>
          </React.Fragment>
        )}
      </div>

      <div
        style={{
          flex: 1,
          position: "relative",
          width: isMobile ? "100%" : "calc(100% - 380px)",
          height: "100%",
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Map controller for centering */}
          <MapController selectedDriver={selectedDriver} />

          {/* Show ONLY selected driver marker */}
          {selectedDriver && selectedDriver.lat != null && selectedDriver.lng != null && (
            <Marker
              key={selectedDriver.driverId}
              position={[Number(selectedDriver.lat), Number(selectedDriver.lng)]}
              icon={selectedDriver.isOnline ? onlineIcon : offlineIcon}
            >
              <Popup>
                <div style={{ minWidth: isMobile ? "200px" : "250px", padding: "8px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: isMobile ? "14px" : "16px",
                      color: "#667eea",
                      marginBottom: "8px",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "4px",
                    }}
                  >
                    Driver #{selectedDriver.driverId.substring(0, 8)}... (Selected)
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <StatusBadge isOnline={selectedDriver.isOnline} />
                  </div>

                  <div style={{ fontSize: isMobile ? "12px" : "13px" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>📍 Current Location</strong>
                      <div>Lat: {selectedDriver.lat?.toFixed(6)}</div>
                      <div>Lng: {selectedDriver.lng?.toFixed(6)}</div>
                    </div>

                    {selectedDriver.deliveryLat && selectedDriver.deliveryLng && (
                      <div style={{ marginBottom: "8px" }}>
                        <strong>🎯 Delivery Destination</strong>
                        <div>Lat: {selectedDriver.deliveryLat.toFixed(6)}</div>
                        <div>Lng: {selectedDriver.deliveryLng.toFixed(6)}</div>
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        background: "#f5f5f5",
                        padding: "8px",
                        borderRadius: "4px",
                        marginTop: "8px",
                      }}
                    >
                      {selectedDriver.speed && (
                        <React.Fragment>
                          <span>Speed:</span>
                          <span>{(selectedDriver.speed * 3.6).toFixed(1)} km/h</span>
                        </React.Fragment>
                      )}
                      {selectedDriver.heading && (
                        <React.Fragment>
                          <span>Heading:</span>
                          <span>{Math.round(selectedDriver.heading)}°</span>
                        </React.Fragment>
                      )}
                      {selectedDriver.accuracy && (
                        <React.Fragment>
                          <span>Accuracy:</span>
                          <span>{Math.round(selectedDriver.accuracy)}m</span>
                        </React.Fragment>
                      )}
                    </div>

                    {selectedDriver.lastUpdate && (
                      <div style={{ marginTop: "8px", color: "#666", fontSize: "10px" }}>
                        Last update: {new Date(selectedDriver.lastUpdate).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Show destination marker ONLY if selected driver has delivery location */}
          {selectedDriver && selectedDriver.deliveryLat != null && selectedDriver.deliveryLng != null && (
            <Marker
              key={`dest-${selectedDriver.driverId}`}
              position={[Number(selectedDriver.deliveryLat), Number(selectedDriver.deliveryLng)]}
              icon={destinationIcon}
            >
              <Popup>
                <div>
                  <strong>Delivery Destination</strong>
                  <div>Driver: #{selectedDriver.driverId.substring(0, 8)}...</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Routes - only for selected driver */}
          {showRoutes && selectedDriver && selectedDriver.lat && selectedDriver.lng && selectedDriver.deliveryLat && selectedDriver.deliveryLng && (
            <RouteLayer
              start={{ lat: selectedDriver.lat, lng: selectedDriver.lng }}
              end={{ lat: selectedDriver.deliveryLat, lng: selectedDriver.deliveryLng }}
              color="#2196f3"
              weight={6}
            />
          )}
        </MapContainer>

        {/* Map Controls - Mobile Responsive */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? "60px" : "20px",
            right: "10px",
            zIndex: 1000,
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            padding: "4px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "4px",
          }}
        >
          {selectedDriver && (
            <React.Fragment>
              <button
                onClick={() => {
                  if (selectedDriver?.lat && selectedDriver?.lng) {
                    setMapCenter([selectedDriver.lat, selectedDriver.lng]);
                    setMapZoom(15);
                  }
                }}
                style={{
                  padding: isMobile ? "10px 12px" : "8px 16px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                Center
              </button>
              <button
                onClick={() => setSelectedDriver(null)}
                style={{
                  padding: isMobile ? "10px 12px" : "8px 16px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                Clear
              </button>
            </React.Fragment>
          )}
          {!selectedDriver && (
            <div
              style={{
                padding: isMobile ? "10px 12px" : "8px 16px",
                background: "#f5f5f5",
                color: "#666",
                borderRadius: "4px",
                fontSize: isMobile ? "12px" : "14px",
              }}
            >
              {isMobile ? "Select driver" : "Select a driver from the list"}
            </div>
          )}
        </div>

        {/* Selected driver info panel - Mobile Responsive */}
        {selectedDriver && (
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "10px" : "20px",
              left: isMobile ? "10px" : "20px",
              right: isMobile ? "10px" : "auto",
              zIndex: 1000,
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: isMobile ? "12px" : "16px",
              maxWidth: isMobile ? "calc(100% - 20px)" : "300px",
              border: "2px solid #2196f3",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 style={{ margin: 0, color: "#667eea", fontSize: isMobile ? "14px" : "16px" }}>Selected Driver</h4>
              <span
                style={{
                  background: selectedDriver.isOnline ? "#4caf50" : "#f44336",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: isMobile ? "10px" : "11px",
                  fontWeight: "bold",
                }}
              >
                {selectedDriver.isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <div style={{ fontSize: isMobile ? "12px" : "13px" }}>
              <div>
                <strong>ID:</strong> {selectedDriver.driverId.substring(0, 12)}...
              </div>
              <div>
                <strong>Location:</strong> {selectedDriver.lat?.toFixed(4)}, {selectedDriver.lng?.toFixed(4)}
              </div>
              {selectedDriver.speed && (
                <div>
                  <strong>Speed:</strong> {Math.round(selectedDriver.speed * 3.6)} km/h
                </div>
              )}
              {selectedDriver.lastSeen && (
                <div>
                  <strong>Last seen:</strong> {new Date(selectedDriver.lastSeen).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
