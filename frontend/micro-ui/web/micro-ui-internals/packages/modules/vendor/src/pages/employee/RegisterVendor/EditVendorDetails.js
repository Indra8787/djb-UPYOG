import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  StatusTable,
  Row,
  SubmitBar,
  Loader,
  CardSectionHeader,
  ActionBar,
  Menu,
  Toast,
  EditIcon,
  DeleteIcon,
  Modal,
  CardText,
  Dropdown,
} from "@djb25/digit-ui-react-components";

import { useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import ConfirmationBox from "../../../components/Confirmation";

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

// Helper function to convert camelCase to Title Case for UI labels
const formatLabel = (key) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const EditVendorDetails = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  let { id: dsoId } = useParams();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});

  const { data: dsoData, isLoading: isLoading, refetch: refetchDso } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    { ids: dsoId },
    { staleTime: Infinity }
  );

  const { data: vehicleData, refetch: refetchVehicle } = Digit.Hooks.fsm.useVehiclesSearch({
    tenantId,
    filters: {
      status: "ACTIVE",
      sortBy: "registrationNumber",
      sortOrder: "ASC",
      vehicleWithNoVendor: true,
    },
  });

  const { data: driverData, refetch: refetchDriver } = Digit.Hooks.fsm.useDriverSearch({
    tenantId,
    filters: {
      sortBy: "name",
      sortOrder: "ASC",
      status: "ACTIVE",
      driverWithNoVendor: true,
    },
  });

  const { data: vendorAdditionalData, isLoading: isVendorAdditionalLoading } = Digit.Hooks.vendor.useEmpvendorCommonSearch(
    { tenantId, filters: { vendorId: dsoId } },
    { enabled: !!dsoId }
  );

  const { mutate } = Digit.Hooks.fsm.useVendorUpdate(tenantId);

  function onActionSelect(action) {
    setDisplayMenu(false);
    setSelectedAction(action);
  }

  useEffect(() => {
    switch (selectedAction) {
      case "DELETE":
      case "ADD_VEHICLE":
      case "ADD_DRIVER":
        return setShowModal(true);
      case "EDIT":
        return history.push("/digit-ui/employee/fsm/registry/modify-vendor/" + dsoId);
      case "HOME":
        return history.push("/digit-ui/employee/fsm/registry?selectedTabs=VENDOR");
      default:
        break;
    }
  }, [selectedAction]);

  useEffect(() => {
    if (vehicleData) setVehicles(vehicleData?.vehicle || []);
  }, [vehicleData]);

  useEffect(() => {
    if (driverData) setDrivers(driverData?.driver || []);
  }, [driverData]);

  const closeToast = () => {
    setShowToast(null);
  };

  const closeModal = () => {
    setSelectedAction(null);
    setSelectedOption({});
    setShowModal(false);
  };

  const handleVendorUpdate = () => {
    let dsoDetails = dsoData?.[0]?.dsoDetails;
    let formData = {};
    if (selectedAction === "DELETE") {
      formData = {
        vendor: {
          ...dsoDetails,
          status: "INACTIVE",
        },
      };
    }
    if (selectedAction === "ADD_VEHICLE") {
      let selectedVehicle = selectedOption;
      selectedVehicle.vendorVehicleStatus = "ACTIVE";
      formData = {
        vendor: {
          ...dsoDetails,
          owner: {
            ...dsoDetails.owner,
            gender: dsoDetails.owner?.gender || "OTHERS",
          },
          vehicles: dsoDetails.vehicles ? [...dsoDetails.vehicles, selectedVehicle] : [selectedVehicle],
        },
      };
    }
    if (selectedAction === "ADD_DRIVER") {
      let selectedDriver = selectedOption;
      selectedDriver.vendorDriverStatus = "ACTIVE";
      formData = {
        vendor: {
          ...dsoDetails,
          owner: {
            ...dsoDetails.owner,
            gender: dsoDetails.owner?.gender || "OTHERS",
          },
          drivers: dsoDetails.drivers ? [...dsoDetails.drivers, selectedDriver] : [selectedDriver],
        },
      };
    }

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: selectedAction === "DELETE" ? "DELETE_VENDOR" : selectedAction });
        queryClient.invalidateQueries("DSO_SEARCH");
        refetchDso();
        refetchVehicle();
        refetchDriver();
        setTimeout(() => {
          closeToast();
          if (selectedAction === "DELETE") history.push(`/digit-ui/employee/fsm/registry`);
        }, 5000);
      },
    });
    setShowModal(false);
    setSelectedAction(null);
  };

  const onEdit = (details, type, id) => {
    if (type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER") {
      history.push("/digit-ui/employee/fsm/registry/modify-driver/" + id);
    } else {
      let registrationNumber = details?.values?.find((ele) => ele.title === "ES_FSM_REGISTRY_VEHICLE_NUMBER")?.value;
      history.push("/digit-ui/employee/fsm/registry/modify-vehicle/" + registrationNumber);
    }
  };

  const onDelete = (details, type, id) => {
    let formData = {};
    if (type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER") {
      let dsoDetails = dsoData?.[0]?.dsoDetails;
      let drivers = dsoDetails?.drivers;

      drivers = drivers.map((data) => {
        if (data.id === id) {
          data.vendorDriverStatus = "INACTIVE";
        }
        return data;
      });
      formData = {
        vendor: {
          ...dsoDetails,
          owner: {
            ...dsoDetails.owner,
            gender: dsoDetails.owner?.gender || "OTHERS",
          },
          drivers: drivers,
        },
      };
    } else {
      let dsoDetails = dsoData?.[0]?.dsoDetails;
      let vehicles = dsoDetails?.vehicles;
      let registrationNumber = details?.values?.find((ele) => ele.title === "ES_FSM_REGISTRY_VEHICLE_NUMBER")?.value;
      vehicles = vehicles.map((data) => {
        if (data.registrationNumber === registrationNumber) {
          data.vendorVehicleStatus = "INACTIVE";
        }
        return data;
      });
      formData = {
        vendor: {
          ...dsoDetails,
          owner: {
            ...dsoDetails.owner,
            gender: dsoDetails.owner?.gender || "OTHERS",
          },
          vehicles: vehicles,
        },
      };
    }
    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER" ? "DELETE_DRIVER" : "DELETE_VEHICLE" });
        queryClient.invalidateQueries("DSO_SEARCH");
        refetchDso();
        refetchVehicle();
        refetchDriver();
        setTimeout(() => {
          closeToast();
        }, 5000);
      },
    });
  };

  const renderModalContent = () => {
    if (selectedAction === "DELETE") {
      return <ConfirmationBox t={t} title={"ES_FSM_REGISTRY_DELETE_TEXT"} />;
    }
    if (selectedAction === "ADD_VEHICLE") {
      return (
        <React.Fragment>
          <CardText>{t(`ES_FSM_REGISTRY_SELECT_VEHICLE`)}</CardText>
          <Dropdown
            t={t}
            option={vehicles}
            value={selectedOption}
            selected={selectedOption}
            select={setSelectedOption}
            optionKey={"registrationNumber"}
          />
        </React.Fragment>
      );
    }
    if (selectedAction === "ADD_DRIVER") {
      return (
        <React.Fragment>
          <CardText>{t(`ES_FSM_REGISTRY_SELECT_DRIVER`)}</CardText>
          <Dropdown t={t} option={drivers} value={selectedOption} selected={selectedOption} select={setSelectedOption} optionKey={"name"} />
        </React.Fragment>
      );
    }
  };

  const isMobile = window.Digit.Utils.browser.isMobile();

  if (isLoading) {
    return <Loader />;
  }

  // Fields to exclude from the Additional Details UI rendering
  const excludedKeys = [
    "vendorAdditionalDetailsId",
    "vendorId", // Hiding this as it's an internal ID
    "tenantId",
    "code",
    "lastModifiedTime",
    "createdTime",
    "lastModifiedBy",
    "createdBy",
    "active",
    "status",
    "vendorType",
    "vendorGroup",
    "narration",
    "documents", // Complex array handled separately if needed
  ];

  return (
    <div className="employee-form-content">
      {!isLoading ? (
        <React.Fragment>
          <Card style={{ position: "relative", paddingLeft: "30px" }}>
            {dsoData?.[0]?.employeeResponse?.map((detail, index) => (
              <React.Fragment key={index}>
                {index > 0 && <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{t(detail.title)}</CardSectionHeader>}
                <div style={!isMobile ? { marginLeft: "-15px" } : {}}>
                  <StatusTable>
                    {detail?.values?.map((value, index) => {
                      // ADDITIONAL DETAILS LOGIC
                      if (value.title === "ES_FSM_REGISTRY_DETAILS_ADDITIONAL_DETAILS") {
                        const additionalDetails = vendorAdditionalData?.VendorDetails?.[0]?.vendorAdditionalDetails;

                        const entries = Object.entries(additionalDetails || {}).filter(([key]) => !excludedKeys.includes(key));

                        return (
                          <React.Fragment key={value.title}>
                            {/* Additional Details Title */}
                            <Row label={t(value.title)} text="" className="border-none" />

                            {/* Additional Details Card */}
                            {isVendorAdditionalLoading ? (
                              <Loader />
                            ) : additionalDetails ? (
                              <Card
                                className="card-with-background"
                                style={{
                                  margin: "10px 16px",
                                  padding: "20px",
                                }}
                              >
                                <div className="additional-grid">
                                  {entries.map(([key, val]) => {
                                    if (typeof val === "object" && val !== null) return null;

                                    const safeKey = String(key);
                                    let safeVal = val !== null && val !== undefined && val !== "" ? String(val) : "N/A";

                                    if (key === "name" && (!val || val === "")) {
                                      safeVal = dsoData?.[0]?.dsoDetails?.name || "N/A";
                                    }
                                    return (
                                      <React.Fragment key={safeKey}>
                                        <div className="additional-label">{t(formatLabel(safeKey))}</div>

                                        <div className="additional-value">{safeVal}</div>
                                      </React.Fragment>
                                    );
                                  })}
                                </div>

                                <div
                                  style={{
                                    marginTop: "16px",
                                    color: "#a82227",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => history.push(`/digit-ui/employee/vendor/registry/additionaldetails/info?vendorId=${dsoId}`)}
                                >
                                  {t("Edit Details")}
                                </div>
                              </Card>
                            ) : (
                              <div
                                style={{
                                  marginLeft: "16px",
                                  color: "#a82227",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                                onClick={() => history.push(`/digit-ui/employee/vendor/registry/additionaldetails/vendor-details?vendorId=${dsoId}`)}
                              >
                                {t("Add Additional Details")}
                              </div>
                            )}
                          </React.Fragment>
                        );
                      }

                      // DEFAULT ROW LOGIC
                      return (
                        <Row
                          key={t(String(value.title))}
                          label={t(String(value.title))}
                          text={value.value ? t(String(value.value)) : "N/A"}
                          last={index === detail?.values?.length - 1}
                          caption={value.caption}
                          className={`border-none ${!isMobile ? "vendor-details-row" : ""}`}
                        />
                      );
                    })}
                    {detail?.child?.map((data, index) => {
                      return (
                        <Card className="card-with-background" key={data.id || index}>
                          <div className="card-head">
                            <h2>
                              {t(detail.type)} {index + 1}
                            </h2>
                            <div style={{ display: "flex" }}>
                              <span onClick={() => onEdit(data, detail.type, data.id)}>
                                <EditIcon style={{ cursor: "pointer", marginRight: "20px" }} className="edit" fill="#a82227" />
                              </span>
                              <span onClick={() => onDelete(data, detail.type, data.id)}>
                                <DeleteIcon style={{ cursor: "pointer" }} className="delete" fill="#a82227" />
                              </span>
                            </div>
                          </div>
                          {data?.values?.map((value, index) => (
                            <Row
                              key={t(String(value.title))}
                              label={t(String(value.title))}
                              text={value.value ? t(String(value.value)) : "N/A"}
                              last={index === detail?.values?.length - 1}
                              caption={value.caption}
                              className="border-none"
                              textStyle={value.value === "ACTIVE" ? { color: "green" } : {}}
                            />
                          ))}
                        </Card>
                      );
                    })}
                    {detail.type && (
                      <div
                        style={{ color: "#a82227", cursor: "pointer", marginLeft: "16px" }}
                        onClick={() => onActionSelect(detail.type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER" ? "ADD_DRIVER" : "ADD_VEHICLE")}
                      >
                        {t(`${detail.type}_ADD`)}
                      </div>
                    )}
                  </StatusTable>
                </div>
              </React.Fragment>
            ))}
          </Card>

          {showModal && (
            <Modal
              headerBarMain={
                <Heading
                  label={t(
                    selectedAction === "DELETE"
                      ? "ES_FSM_REGISTRY_DELETE_POPUP_HEADER"
                      : selectedAction === "ADD_VEHICLE"
                      ? "ES_FSM_REGISTRY_ADD_VEHICLE_POPUP_HEADER"
                      : "ES_FSM_REGISTRY_ADD_DRIVER_POPUP_HEADER"
                  )}
                />
              }
              headerBarEnd={<CloseBtn onClick={closeModal} />}
              actionCancelLabel={t("CS_COMMON_CANCEL")}
              actionCancelOnSubmit={closeModal}
              actionSaveLabel={t(selectedAction === "DELETE" ? "ES_EVENT_DELETE" : "CS_COMMON_SUBMIT")}
              actionSaveOnSubmit={handleVendorUpdate}
            >
              <Card style={{ boxShadow: "none" }}>{renderModalContent()}</Card>
            </Modal>
          )}
          {showToast && (
            <Toast
              error={showToast.key === "error" ? true : false}
              label={t(showToast.key === "success" ? `ES_FSM_REGISTRY_${showToast.action}_SUCCESS` : showToast.action)}
              onClose={closeToast}
            />
          )}
          <ActionBar style={{ zIndex: "19" }}>
            {displayMenu ? (
              <Menu localeKeyPrefix={"ES_FSM_REGISTRY_ACTION"} options={["EDIT", "DELETE", "HOME"]} t={t} onSelect={onActionSelect} />
            ) : null}
            <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
          </ActionBar>
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default EditVendorDetails;
