package org.upyog.rs.repository.rowMapper;

import org.springframework.jdbc.core.RowMapper;
import org.upyog.rs.web.models.Address;
import org.upyog.rs.web.models.AuditDetails;
import org.upyog.rs.web.models.DriverTrip;
import org.upyog.rs.web.models.RequestDetailsByDriverId;

import java.sql.ResultSet;
import java.sql.SQLException;

public class DriverDetailsRowMapper implements RowMapper<RequestDetailsByDriverId.RequestDetailsInfo> {

    @Override
    public RequestDetailsByDriverId.RequestDetailsInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
        RequestDetailsByDriverId.RequestDetailsInfo details = new RequestDetailsByDriverId.RequestDetailsInfo();
        details.setBookingId(rs.getString("booking_id"));
        details.setBookingNo(rs.getString("booking_no"));
        details.setTenantId(rs.getString("tenant_id"));
        details.setTankerType(rs.getString("tanker_type"));
        details.setTankerQuantity(rs.getInt("tanker_quantity"));
        details.setWaterQuantity(rs.getInt("water_quantity"));
        details.setAddressDetailId(rs.getString("address_detail_id"));
        details.setMobileNumber(rs.getString("mobile_number"));
        details.setLocalityCode(rs.getString("locality_code"));
        details.setPaymentReceiptFilestoreId(rs.getString("payment_receipt_filestore_id"));
        details.setWaterType(rs.getString("water_type"));
        details.setDescription(rs.getString("description"));
        details.setApplicantUuid(rs.getString("applicant_uuid"));
        details.setDeliveryDate(rs.getString("delivery_date"));
        details.setDeliveryTime(rs.getString("delivery_time"));

        details.setExtraCharge(rs.getString("extra_charge"));
        details.setVendorId(rs.getString("vendor_id"));
        details.setVehicleId(rs.getString("vehicle_id"));
        details.setDriverId(rs.getString("driver_id"));
        details.setVehicleType(rs.getString("vehicle_type"));
        details.setVehicleCapacity(rs.getString("vehicle_capacity"));
        details.setBookingCreatedBy(rs.getString("booking_createdby"));
        details.setBookingStatus(rs.getString("booking_status"));
        details.setCreatedby(rs.getString("createdby"));
        details.setLastmodifiedby(rs.getString("lastmodifiedby"));
        details.setCreatedtime(rs.getLong("createdtime"));
        details.setLastmodifiedtime(rs.getLong("lastmodifiedtime"));

        // Applicant Details Mapping
        details.setApplicantName(rs.getString("applicant_name"));
        details.setApplicantMobile(rs.getString("applicant_mobile"));
        details.setEmailId(rs.getString("applicant_email"));

        Address address = new Address();
        address.setAddressId(rs.getString("address_detail_id"));
        address.setHouseNo(rs.getString("house_no"));
        address.setAddressLine1(rs.getString("address_line_1"));
        address.setAddressLine2(rs.getString("address_line_2"));
        address.setStreetName(rs.getString("street_name"));
        address.setLandmark(rs.getString("landmark"));
        address.setCity(rs.getString("city"));
        address.setPincode(rs.getString("pincode"));
        address.setLatitude(rs.getString("latitude"));
        address.setLongitude(rs.getString("longitude"));
        address.setLocalityCode(rs.getString("locality_code"));
        details.setAddress(address);
        address.setLocalityCode(rs.getString("address_locality_code"));

        details.setRegistrationNumber(rs.getString("registrationNumber"));
        details.setVehicleModel(rs.getString("vehicle_model"));


        if (rs.getString("trip_booking_id") != null) {

            DriverTrip trip = new DriverTrip();

            trip.setId(rs.getString("trip_id"));
            trip.setBookingId(rs.getString("trip_booking_id"));
            trip.setBookingNo(rs.getString("trip_booking_no"));
            trip.setTenantId(rs.getString("tenant_id")); // from main table OK

            trip.setTankerType(rs.getString("trip_tanker_type"));
            trip.setVendorId(rs.getString("trip_vendor_id"));
            trip.setVehicleId(rs.getString("trip_vehicle_id"));
            trip.setDriverId(rs.getString("trip_driver_id"));
            trip.setCurrentStatus(rs.getString("trip_current_status"));

            trip.setStartLatitude(rs.getBigDecimal("trip_start_latitude"));
            trip.setStartLongitude(rs.getBigDecimal("trip_start_longitude"));
            trip.setStartFileStoreId(rs.getString("trip_start_file_store_id"));

            trip.setEndLatitude(rs.getBigDecimal("trip_end_latitude"));
            trip.setEndLongitude(rs.getBigDecimal("trip_end_longitude"));
            trip.setEndFileStoreId(rs.getString("trip_end_file_store_id"));

            trip.setRemark(rs.getString("trip_remark"));

            AuditDetails audit = AuditDetails.builder()
                    .createdBy(rs.getString("trip_created_by"))
                    .lastModifiedBy(rs.getString("trip_last_modified_by"))
                    .createdTime(rs.getLong("trip_created_time"))
                    .lastModifiedTime(rs.getLong("trip_last_modified_time"))
                    .build();

            trip.setAuditDetails(audit);

            details.setDriverTrip(trip);
         }
        return details;
    }
}