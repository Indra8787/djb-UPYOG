import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, Table, Dropdown, TextInput, DatePicker, SubmitBar, FormStep } from "@djb25/digit-ui-react-components";
import AddTripModal from "../../components/AddTripModal";

const FixedPointScheduleManagement = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [year, setYear] = useState({ label: "Year 2026", value: "2026" });
  const [fixedPoint, setFixedPoint] = useState({ label: "FP01", value: "FP01" });
  const [day, setDay] = useState({ label: "Mon", value: "Mon" });
  const [status, setStatus] = useState({ label: "All Status", value: "all" });
  const [vehicle, setVehicle] = useState({ label: "DL1LAG7729", value: "DL1LAG7729" });
  const [editingRowIndex, setEditingRowIndex] = useState(null);

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
      const headers = Object.keys(data[0]);
      csvRows.push(headers.join(","));
      for (const row of data) {
        const values = headers.map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
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

  const [data, setData] = useState([
    {
      scheduleId: "SASID-0001",
      fixedPoint: "FP01",
      day: "Mon",
      freq: "1",
      arrToFpl: "06:00",
      depFromFpl: "06:10",
      arrAtFixedPoint: "06:40",
      depAtFixedPoint: "06:55",
      returnToFpl: "07:20",
      volume: "3 KL",
      vehicle: "DL1LAG7729",
      active: "Y",
    },
    {
      scheduleId: "SASID-0002",
      fixedPoint: "FP01",
      day: "Mon",
      freq: "2",
      arrToFpl: "07:20",
      depFromFpl: "07:30",
      arrAtFixedPoint: "08:00",
      depAtFixedPoint: "08:15",
      returnToFpl: "08:40",
      volume: "3 KL",
      vehicle: "DL1LAG7729",
      active: "Y",
    },
    {
      scheduleId: "SASID-0003",
      fixedPoint: "FP02",
      day: "Tue",
      freq: "3",
      arrToFpl: "08:40",
      depFromFpl: "08:50",
      arrAtFixedPoint: "09:20",
      depAtFixedPoint: "09:35",
      returnToFpl: "10:00",
      volume: "3 KL",
      vehicle: "DL1LAG7730",
      active: "Y",
    },
    {
      scheduleId: "SASID-0004",
      fixedPoint: "FP03",
      day: "Wed",
      freq: "1",
      arrToFpl: "09:00",
      depFromFpl: "09:10",
      arrAtFixedPoint: "09:40",
      depAtFixedPoint: "09:55",
      returnToFpl: "10:20",
      volume: "5 KL",
      vehicle: "DL1LAG7731",
      active: "N",
    },
  ]);

  const [masterData] = useState(data);

  const handleSearch = () => {
    let filteredData = [...masterData];

    if (year?.value) {
      // Logic for year filtering if applicable in real data
    }
    if (fixedPoint?.value && fixedPoint.value !== "all") {
      filteredData = filteredData.filter((item) => item.fixedPoint === fixedPoint.value);
    }
    if (day?.value && day.value !== "all") {
      filteredData = filteredData.filter((item) => item.day === day.value);
    }
    if (status?.value && status.value !== "all") {
      const activeStatus = status.value === "Active" ? "Y" : "N";
      filteredData = filteredData.filter((item) => item.active === activeStatus);
    }
    if (vehicle?.value && vehicle.value !== "all") {
      filteredData = filteredData.filter((item) => item.vehicle === vehicle.value);
    }

    setData(filteredData);
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

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="fixed-point-schedule-management">
      <Card style={{ padding: "20px" }}>
        <div className="finance-mainlayout" style={{ marginBottom: "20px" }}>
          <div className="finance-mainlayout-col1">
            <Dropdown
              option={[
                { label: "Year 2024", value: "2024" },
                { label: "Year 2025", value: "2025" },
                { label: "Year 2026", value: "2026" },
              ]}
              optionKey="label"
              selected={year}
              t={t}
              select={setYear}
            />
          </div>
          <div className="finance-mainlayout-col1">
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
              select={setFixedPoint}
              placeholder="All Fixed Points"
            />
          </div>
          <div className="finance-mainlayout-col1">
            <Dropdown
              option={[
                { label: "All Days", value: "all" },
                { label: "Mon", value: "Mon" },
                { label: "Tue", value: "Tue" },
                { label: "Wed", value: "Wed" },
                { label: "Thu", value: "Thu" },
                { label: "Fri", value: "Fri" },
                { label: "Sat", value: "Sat" },
                { label: "Sun", value: "Sun" },
              ]}
              optionKey="label"
              selected={day}
              t={t}
              select={setDay}
              placeholder="All Days"
            />
          </div>
          <div className="finance-mainlayout-col1">
            <Dropdown
              option={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              optionKey="label"
              selected={status}
              t={t}
              select={setStatus}
              placeholder="All Status"
            />
          </div>
        </div>
        <div className="finance-mainlayout" style={{ marginBottom: "20px" }}>
          <div className="finance-mainlayout-col1">
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
              select={setVehicle}
              placeholder="All Vehicles"
            />
          </div>
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
            <SubmitBar label={t("ES_COMMON_SEARCH")} onSubmit={handleSearch} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: selectedDay === day ? "#1D4E7F" : "#fff",
                color: selectedDay === day ? "#fff" : "#333",
                cursor: "pointer",
              }}
            >
              {t(day.toUpperCase())}
            </button>
          ))}
        </div>

        <Table
          t={t}
          data={data}
          columns={columns}
          getCellProps={(cellInfo) => ({})}
          styles={{ minWidth: "1200px" }}
          inboxStyles={{ overflowX: "auto" }}
        />
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
                  day: { label: t(data[editingRowIndex].day.toUpperCase()), value: data[editingRowIndex].day },
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
            const rowData = {
              scheduleId: formData.scheduleId || `SASID-000${data.length + 1}`,
              fixedPoint: formData.fixedPointCode || "FP01",
              day: formData.day?.value || "Mon",
              freq: formData.frequencyNo || "1",
              arrToFpl: formData.arrivalTimeFpl || "--:--",
              depFromFpl: formData.departureTimeFpl || "--:--",
              arrAtFixedPoint: formData.arrivalFixedPoint || "--:--",
              depAtFixedPoint: formData.departureFixedPoint || "--:--",
              returnToFpl: formData.returnFpl || "--:--",
              volume: formData.volume || "0 KL",
              vehicle: formData.vehicleId || "NA",
              active: formData.active?.value === "Yes" ? "Y" : "N",
            };

            if (editingRowIndex !== null) {
              const updatedData = [...data];
              updatedData[editingRowIndex] = rowData;
              setData(updatedData);
            } else {
              setData([...data, rowData]);
            }
            setShowModal(false);
            setEditingRowIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default FixedPointScheduleManagement;
