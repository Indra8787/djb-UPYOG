package org.upyog.rs.repository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.upyog.rs.repository.rowMapper.DriverRowMapper;
import org.upyog.rs.util.RequestServiceUtil;
import org.upyog.rs.web.models.DriverTrip;

import java.util.List;

@Repository
public class DriverTripRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

        public void save(DriverTrip trip) {
            String sql = "INSERT INTO eg_driver_trip " +
                    "(id, booking_id, booking_no, tenant_id, tanker_type, vendor_id, vehicle_id, driver_id, " +
                    "current_status, start_latitude, start_longitude, start_file_store_id, " +
                    "created_by, created_time, last_modified_by, last_modified_time) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            jdbcTemplate.update(sql,
                    trip.getId(),
                    trip.getBookingId(),
                    trip.getBookingNo(),
                    trip.getTenantId(),
                    trip.getTankerType(),
                    trip.getVendorId(),
                    trip.getVehicleId(),
                    trip.getDriverId(),
                    trip.getCurrentStatus(),
                    trip.getStartLatitude(),
                    trip.getStartLongitude(),
                    trip.getStartFileStoreId(),
                    trip.getAuditDetails().getCreatedBy(),
                    trip.getAuditDetails().getCreatedTime(),
                    trip.getAuditDetails().getLastModifiedBy(),
                    trip.getAuditDetails().getLastModifiedTime());
        }

        public void update(DriverTrip trip) {
            String sql = "UPDATE eg_driver_trip " +
                    "SET current_status = ?, end_latitude = ?, end_longitude = ?, end_file_store_id = ?, " +
                    "last_modified_by = ?, last_modified_time = ? , remark = ? " +
                    "WHERE booking_no = ?";

            jdbcTemplate.update(sql,
                    trip.getCurrentStatus(),
                    trip.getEndLatitude(),
                    trip.getEndLongitude(),
                    trip.getEndFileStoreId(),
                    trip.getAuditDetails().getLastModifiedBy(),
                    trip.getAuditDetails().getLastModifiedTime(),
                    trip.getRemark(),
                    trip.getBookingNo());
        }

        public DriverTrip findByBookingNo(String bookingNo) {
            String sql = "SELECT * FROM eg_driver_trip WHERE booking_no = ?";

            return jdbcTemplate.queryForObject(sql, new DriverRowMapper(), bookingNo);
        }

    public void saveTripHistory(DriverTrip trip) {
        String sql = "INSERT INTO eg_driver_trip_history " +
                "(history_id, booking_no, tenant_id, vendor_id, vehicle_id, driver_id, " +
                "completion_time, remark, start_latitude, end_latitude, start_longitude, " +
                "end_longitude, created_time, created_by,lastmodifiedby,lastmodifiedtime) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                RequestServiceUtil.getRandonUUID(),
                trip.getBookingNo(),
                trip.getTenantId(),
                trip.getVendorId(),
                trip.getVehicleId(),
                trip.getDriverId(),
                System.currentTimeMillis(),
                trip.getRemark(),
                trip.getStartLatitude(),
                trip.getEndLatitude(),
                trip.getStartLongitude(),
                trip.getEndLongitude(),
                trip.getAuditDetails().getCreatedTime(),
                trip.getAuditDetails().getCreatedBy(),
                trip.getAuditDetails().getLastModifiedBy(),
                trip.getAuditDetails().getLastModifiedTime());
    }

    public List<DriverTrip> getHistoryByDriver(String driverId) {
        String sql = "SELECT * FROM eg_driver_trip_history WHERE driver_id = ? ORDER BY completion_time DESC";
        return jdbcTemplate.query(sql, new Object[]{driverId}, new DriverRowMapper());
    }
}
