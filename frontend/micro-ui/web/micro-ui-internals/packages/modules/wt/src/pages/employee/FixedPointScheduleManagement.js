import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, Table, Dropdown, TextInput, DatePicker, SubmitBar, FormStep, Toast, CardLabel } from "@djb25/digit-ui-react-components";

import AddTripModal from "../../components/AddTripModal";
import ApplicationTable from "../../components/inbox/ApplicationTable";

const FixedPointScheduleManagement = ({ ...props }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedDay, setSelectedDay] = useState("all");
  const [year, setYear] = useState({ label: "Year 2026", value: "2026" });
  const [fixedPoint, setFixedPoint] = useState({ label: "All Fixed Points", value: "all" });
  const [day, setDay] = useState({ label: "All Days", value: "all" });
  const [status, setStatus] = useState({ label: "All Status", value: "all" });
  const [vehicle, setVehicle] = useState({ label: "All Vehicles", value: "all" });
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const [filters, setFilters] = useState({});

  const { isLoading, data: scheduleData, refetch: reSearch } = Digit.Hooks.wt.useFixedPointScheduleSearch(tenantId, filters);

  const { mutate: createSchedule } = Digit.Hooks.wt.useCreateFixedPointSchedule(tenantId);

  const closeToast = () => {
    setToast(null);
  };

  const handleDelete = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  const handleDownload = (type) => {
    const filename = `FixedPointSchedule_${type.value}_${new Date().toLocaleDateString()}`;
    if (window.Digit && window.Digit.Download && window.Digit.Download.Excel) {
      window.Digit.Download.Excel(data, filename);
    } else {
      // Fallback to CSV if Digit.Download.Excel is not available
      const csvRows = [];
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(","));
        for (const row of data) {
          const values = headers.map((header) => {
            const escaped = ("" + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
          });
          csvRows.push(values.join(","));
        }
      }
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `${filename}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const [data, setData] = useState([]);

  React.useEffect(() => {
    if (scheduleData?.fixedPointTimeTableDetails) {
      const mappedData = scheduleData.fixedPointTimeTableDetails.map((item) => ({
        scheduleId: item.systemAssignedScheduleId,
        fixedPoint: item.fixedPointCode,
        day: item.day,
        freq: item.tripNo,
        arrToFpl: item.arrivalTimeToFpl,
        depFromFpl: item.departureTimeFromFpl,
        arrAtFixedPoint: item.arrivalTimeDeliveryPoint,
        depAtFixedPoint: item.departureTimeDeliveryPoint,
        returnToFpl: item.timeOfArrivingBackFplAfterDelivery,
        volume: item.volumeWaterTobeDelivery,
        vehicle: item.vehicleId,
        active: item.isEnable ? "Y" : "N",
      }));
      setData(mappedData);
    }
  }, [scheduleData]);

  const handleSearch = (customFilters = null) => {
    setFilters(
      customFilters || {
        fixedPointCode: fixedPoint?.value === "all" ? "" : fixedPoint?.value,
        day: day?.value === "all" ? "" : day?.value?.toUpperCase(),
        status: status?.value === "all" ? "" : status?.value,
        vehicleId: vehicle?.value === "all" ? "" : vehicle?.value,
      }
    );
  };

  const columns = React.useMemo(
    () => [
      { Header: t("WT_SCHEDULE_ID"), accessor: "scheduleId" },
      { Header: t("WT_FIXED_POINT"), accessor: "fixedPoint" },
      { Header: t("WT_DAY"), accessor: "day" },
      { Header: t("WT_FREQ"), accessor: "freq" },
      { Header: t("WT_ARR_TO_FPL"), accessor: "arrToFpl" },
      { Header: t("WT_DEP_FROM_FPL"), accessor: "depFromFpl" },
      { Header: t("WT_ARR_AT_FIXED_POINT"), accessor: "arrAtFixedPoint" },
      { Header: t("WT_DEP_AT_FIXED_POINT"), accessor: "depAtFixedPoint" },
      { Header: t("WT_RETURN_TO_FPL"), accessor: "returnToFpl" },
      { Header: t("WT_VOLUME"), accessor: "volume" },
      { Header: t("WT_VEHICLE"), accessor: "vehicle" },
      {
        Header: t("WT_ACTIVE"),
        accessor: "active",
        Cell: ({ value }) => (
          <span
            style={{
              background: value === "Y" ? "#E6F4EA" : "#FCE8E6",
              padding: "2px 8px",
              borderRadius: "10px",
              color: value === "Y" ? "#1E8E3E" : "#D93025",
            }}
          >
            {value}
          </span>
        ),
      },
      {
        Header: t("WT_ACTION"),
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={() => {
                setEditingRowIndex(row.index);
                setShowModal(true);
              }}
              style={{ color: "#1D4E7F", border: "1px solid #1D4E7F", background: "none", padding: "2px 8px", cursor: "pointer" }}
            >
              {t("WT_EDIT")}
            </button>
            <button
              onClick={() => handleDelete(row.index)}
              style={{ color: "#fff", border: "none", background: "#D93025", padding: "2px 8px", cursor: "pointer" }}
            >
              {t("WT_DELETE")}
            </button>
          </div>
        ),
      },
    ],
    [t]
  );

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  return (
    <div className="fixed-point-schedule-management">
      <Card style={{ padding: "20px" }}>
        <div className="finance-mainlayout" style={{ marginBottom: "20px" }}>
          <div className="finance-mainlayout-col1">
            <CardLabel>{t("WT_FIXED_POINT")}</CardLabel>
            <Dropdown
              option={[
                { label: t("WT_EXCEL_WEEKWISE"), value: "Weekwise" },
                { label: t("WT_EXCEL_MONTHWISE"), value: "Monthwise" },
                { label: t("WT_EXCEL_YEARWISE"), value: "Yearwise" },
              ]}
              optionKey="label"
              placeholder={t("WT_EXPORT")}
              t={t}
              select={handleDownload}
            />
            {/* <CardLabel>{t("WT_YEAR")}</CardLabel>
            <Dropdown
              option={[
                { label: "Year 2024", value: "2024" },
                { label: "Year 2025", value: "2025" },
                { label: "Year 2026", value: "2026" },
              ]}
              optionKey="label"
              selected={year}
              t={t}
              select={(val) => {
                setYear(val);
                handleSearch({
                  fixedPointCode: fixedPoint?.value === "all" ? "" : fixedPoint?.value,
                  day: day?.value === "all" ? "" : day?.value?.toUpperCase(),
                  status: status?.value === "all" ? "" : status?.value,
                  vehicleId: vehicle?.value === "all" ? "" : vehicle?.value,
                  // year: val.value // Include if backend supports it
                });
              }}
            /> */}
          </div>
          <div className="finance-mainlayout-col1">
            <CardLabel>{t("WT_FIXED_POINT")}</CardLabel>
            <Dropdown
              option={[
                { label: "All Fixed Points", value: "all" },
                { label: "FP01", value: "FP01" },
                { label: "FP02", value: "FP02" },
                { label: "FP03", value: "FP03" },
              ]}
              optionKey="label"
              selected={fixedPoint}
              t={t}
              select={(val) => {
                setFixedPoint(val);
                handleSearch({
                  fixedPointCode: val?.value === "all" ? "" : val?.value,
                  day: day?.value === "all" ? "" : day?.value?.toUpperCase(),
                  status: status?.value === "all" ? "" : status?.value,
                  vehicleId: vehicle?.value === "all" ? "" : vehicle?.value,
                });
              }}
              placeholder="All Fixed Points"
            />
          </div>
          <div className="finance-mainlayout-col1">
            <CardLabel>{t("WT_DAY")}</CardLabel>
            <Dropdown
              option={[
                { label: "All Days", value: "all" },
                { label: t("MONDAY"), value: "MONDAY" },
                { label: t("TUESDAY"), value: "TUESDAY" },
                { label: t("WEDNESDAY"), value: "WEDNESDAY" },
                { label: t("THURSDAY"), value: "THURSDAY" },
                { label: t("FRIDAY"), value: "FRIDAY" },
                { label: t("SATURDAY"), value: "SATURDAY" },
                { label: t("SUNDAY"), value: "SUNDAY" },
              ]}
              optionKey="label"
              selected={day}
              t={t}
              select={(val) => {
                setDay(val);
                setSelectedDay(val.value);
                handleSearch({
                  fixedPointCode: fixedPoint?.value === "all" ? "" : fixedPoint?.value,
                  day: val?.value === "all" ? "" : val?.value?.toUpperCase(),
                  status: status?.value === "all" ? "" : status?.value,
                  vehicleId: vehicle?.value === "all" ? "" : vehicle?.value,
                });
              }}
              placeholder="All Days"
            />
          </div>
          <div className="finance-mainlayout-col1">
            <CardLabel>{t("WT_STATUS")}</CardLabel>
            <Dropdown
              option={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              optionKey="label"
              selected={status}
              t={t}
              select={(val) => {
                setStatus(val);
                handleSearch({
                  fixedPointCode: fixedPoint?.value === "all" ? "" : fixedPoint?.value,
                  day: day?.value === "all" ? "" : day?.value?.toUpperCase(),
                  status: val?.value === "all" ? "" : val?.value,
                  vehicleId: vehicle?.value === "all" ? "" : vehicle?.value,
                });
              }}
              placeholder="All Status"
            />
          </div>
        </div>
        <div className="finance-mainlayout" style={{ marginBottom: "20px" }}>
          <div className="finance-mainlayout-col1"></div>
          {/* <div className="finance-mainlayout-col1">
            <CardLabel>{t("WT_VEHICLE")}</CardLabel>
            <Dropdown
              option={[
                { label: "All Vehicles", value: "all" },
                { label: "DL1LAG7729", value: "DL1LAG7729" },
                { label: "DL1LAG7730", value: "DL1LAG7730" },
                { label: "DL1LAG7731", value: "DL1LAG7731" },
              ]}
              optionKey="label"
              selected={vehicle}
              t={t}
              select={(val) => {
                setVehicle(val);
                handleSearch({
                  fixedPointCode: fixedPoint?.value === "all" ? "" : fixedPoint?.value,
                  day: day?.value === "all" ? "" : day?.value?.toUpperCase(),
                  status: status?.value === "all" ? "" : status?.value,
                  vehicleId: val?.value === "all" ? "" : val?.value,
                });
              }}
              placeholder="All Vehicles"
            />
          </div> */}
          <div className="finance-mainlayout-col1">{/* <DatePicker date={fromDate} onChange={setFromDate} placeholder="dd/mm/yyyy" /> */}</div>
          <div className="finance-mainlayout-col1">
            {/* <DatePicker date={toDate} onChange={setToDate} placeholder="dd/mm/yyyy" /> */}
            <Dropdown
              option={[
                { label: t("WT_EXCEL_WEEKWISE"), value: "Weekwise" },
                { label: t("WT_EXCEL_MONTHWISE"), value: "Monthwise" },
                { label: t("WT_EXCEL_YEARWISE"), value: "Yearwise" },
              ]}
              optionKey="label"
              placeholder={t("WT_EXPORT")}
              t={t}
              select={handleDownload}
            />
          </div>
          <div className="finance-mainlayout-col1">
            <SubmitBar label={t("ES_COMMON_SEARCH")} onSubmit={() => handleSearch()} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
          {days.map((dayItem) => (
            <button
              key={dayItem}
              onClick={() => {
                setSelectedDay(dayItem);
                const dayOption = { label: dayItem, value: dayItem };
                setDay(dayOption);
                handleSearch({
                  fixedPointCode: fixedPoint?.value === "all" ? "" : fixedPoint?.value,
                  day: dayItem.toUpperCase(),
                  status: status?.value === "all" ? "" : status?.value,
                  vehicleId: vehicle?.value === "all" ? "" : vehicle?.value,
                });
              }}
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: selectedDay === dayItem ? "#1D4E7F" : "#fff",
                color: selectedDay === dayItem ? "#fff" : "#333",
                cursor: "pointer",
              }}
            >
              {t(dayItem.toUpperCase())}
            </button>
          ))}
        </div>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <ApplicationTable
            t={t}
            data={data}
            columns={columns}
            getCellProps={(cellInfo) => ({})}
            styles={{ minWidth: "1200px" }}
            inboxStyles={{ overflowX: "auto" }}
            isLoading={isLoading}
            onPageSizeChange={props.onPageSizeChange}
            currentPage={props.currentPage}
            onNextPage={props.onNextPage}
            onPrevPage={props.onPrevPage}
            pageSizeLimit={props.pageSizeLimit}
            onSort={props.onSort}
            disableSort={props.disableSort}
            sortParams={props.sortParams}
            totalRecords={props.totalRecords}
          />
        </div>
        <span>
          <button
            onClick={() => {
              setEditingRowIndex(null);
              setShowModal(true);
            }}
            style={{
              background: "#1E8E3E",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "10px",
            }}
          >
            <span>+</span> {t("WT_ADD_TRIP")}
          </button>
        </span>
      </Card>
      {showModal && (
        <AddTripModal
          t={t}
          closeModal={() => {
            setShowModal(false);
            setEditingRowIndex(null);
          }}
          initialValues={
            editingRowIndex !== null
              ? {
                  scheduleId: data[editingRowIndex].scheduleId,
                  fixedPointCode: data[editingRowIndex].fixedPoint,
                  day: [{ label: t(data[editingRowIndex].day), value: data[editingRowIndex].day }],

                  frequencyNo: data[editingRowIndex].freq,
                  arrivalTimeFpl: data[editingRowIndex].arrToFpl,
                  departureTimeFpl: data[editingRowIndex].depFromFpl,
                  arrivalFixedPoint: data[editingRowIndex].arrAtFixedPoint,
                  departureFixedPoint: data[editingRowIndex].depAtFixedPoint,
                  returnFpl: data[editingRowIndex].returnToFpl,
                  volume: data[editingRowIndex].volume,
                  vehicleId: data[editingRowIndex].vehicle,
                  active: {
                    label: data[editingRowIndex].active === "Y" ? t("YES") : t("NO"),
                    value: data[editingRowIndex].active === "Y" ? "Yes" : "No",
                  },
                }
              : null
          }
          onSubmit={(formData) => {
            const formDataDay = formData?.day;
            let daysArr = [];
            if (Array.isArray(formDataDay)) {
              daysArr = formDataDay
                .map((d) => (typeof d === "string" ? d : d?.value || (Array.isArray(d) ? d[1] : d)))
                .filter((d) => typeof d === "string" && d !== "WT_SELECT_ALL");

              if (
                daysArr.length === 0 &&
                formDataDay.some((d) => (typeof d === "string" ? d : d?.value || (Array.isArray(d) ? d[1] : d)) === "WT_SELECT_ALL")
              ) {
                daysArr = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
              }
            } else if (formDataDay) {
              const dayVal = typeof formDataDay === "string" ? formDataDay : formDataDay?.value;
              if (dayVal && dayVal !== "WT_SELECT_ALL") daysArr = [dayVal];
            }

            const fixedPointTimeTableDetails = {
              tenantId,
              system_assigned_schedule_id: formData.scheduleId,
              fixed_point_code: formData.fixedPointCode,
              days: daysArr.map((d) => d.toUpperCase()),
              trip_no: formData.frequencyNo,
              arrival_time_to_fpl: formData.arrivalTimeFpl,
              departure_time_from_fpl: formData.departureTimeFpl,
              arrival_time_delivery_point: formData.arrivalFixedPoint,
              departure_time_delivery_point: formData.departureFixedPoint,
              time_of_arriving_back_fpl_after_delivery: formData.returnFpl,
              volume_water_tobe_delivery: formData.volume,
              active: formData.active?.value === "Yes" || formData.active === "Yes",
              is_enable: formData.active?.value === "Yes" || formData.active === "Yes",
              remarks: formData.remarks,
              vehicle_id: formData.vehicleId,
            };

            const payload = {
              fixedPointTimeTableDetails,
            };

            createSchedule(payload, {
              onError: (error, variables) => {
                setToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.message || "ERROR_WHILE_CREATING_SCHEDULE" });
                setTimeout(closeToast, 5000);
              },
              onSuccess: (data, variables) => {
                setToast({ label: t("WT_SCHEDULE_CREATE_SUCCESS") });
                setTimeout(closeToast, 5000);
                setShowModal(false);
                setEditingRowIndex(null);
                reSearch();
              },
            });
          }}
        />
      )}
      {toast && <Toast error={toast.key === "error"} label={toast.label} onClose={closeToast} />}
    </div>
  );
};

export default FixedPointScheduleManagement;
