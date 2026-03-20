package org.upyog.rs.repository.rowMapper;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.upyog.rs.web.models.Address;
import org.upyog.rs.web.models.ApplicantDetail;
import org.upyog.rs.web.models.AuditDetails;
import org.upyog.rs.web.models.waterTanker.WaterTankerFixedPointDetail;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class WaterTankerFixedPointRowMapper
        implements ResultSetExtractor<List<WaterTankerFixedPointDetail>> {

    @Override
    public List<WaterTankerFixedPointDetail> extractData(ResultSet rs)
            throws SQLException, DataAccessException {

        Map<String, WaterTankerFixedPointDetail> bookingMap = new LinkedHashMap<>();

        while (rs.next()) {
            String bookingId = rs.getString("booking_id");

            bookingMap.computeIfAbsent(bookingId, id -> {
                try {
                    return buildFixedPointDetail(rs);
                } catch (SQLException e) {
                    throw new RuntimeException("Error mapping WaterTankerFixedPointDetail", e);
                }
            });

            WaterTankerFixedPointDetail detail = bookingMap.get(bookingId);

            if (detail.getApplicantDetail() == null) {
                try {
                    detail.setApplicantDetail(buildApplicantDetail(rs));
                } catch (SQLException e) {
                    throw new RuntimeException("Error mapping ApplicantDetail", e);
                }
            }

            if (detail.getAddress() == null) {
                try {
                    detail.setAddress(buildAddress(rs));
                } catch (SQLException e) {
                    throw new RuntimeException("Error mapping Address", e);
                }
            }
        }

        return new ArrayList<>(bookingMap.values());
    }


    private WaterTankerFixedPointDetail buildFixedPointDetail(ResultSet rs) throws SQLException {

        AuditDetails auditDetails = AuditDetails.builder()
                .createdBy(rs.getString("ad_createdby"))
                .lastModifiedBy(rs.getString("ad_lastmodifiedby"))
                .createdTime(getLongValue(rs, "ad_createdtime"))
                .lastModifiedTime(getLongValue(rs, "ad_lastmodifiedtime"))
                .build();

        return WaterTankerFixedPointDetail.builder()
                .bookingId(rs.getString("booking_id"))
                .mobileNumber(rs.getString("applicant_mobile_number"))
                .auditDetails(auditDetails)
                .applicantDetail(buildApplicantDetail(rs))
                .address(buildAddress(rs))
                .build();
    }

    private ApplicantDetail buildApplicantDetail(ResultSet rs) throws SQLException {

        AuditDetails auditDetails = AuditDetails.builder()
                .createdBy(rs.getString("ad_createdby"))
                .lastModifiedBy(rs.getString("ad_lastmodifiedby"))
                .createdTime(getLongValue(rs, "ad_createdtime"))
                .lastModifiedTime(getLongValue(rs, "ad_lastmodifiedtime"))
                .build();

        return ApplicantDetail.builder()
                .applicantId(rs.getString("applicant_id"))
                .bookingId(rs.getString("booking_id"))
                .name(rs.getString("name"))
                .mobileNumber(rs.getString("applicant_mobile_number"))
                .emailId(rs.getString("email_id"))
                .alternateNumber(rs.getString("alternate_number"))
                .type(rs.getString("applicant_type"))
                .auditDetails(auditDetails)
                .build();
    }

    private Address buildAddress(ResultSet rs) throws SQLException {

        return Address.builder()
                .addressId(rs.getString("address_id"))
                .applicantId(rs.getString("applicant_id"))
                .houseNo(rs.getString("house_no"))
                .addressLine1(rs.getString("address_line_1"))
                .addressLine2(rs.getString("address_line_2"))
                .streetName(rs.getString("street_name"))
                .landmark(rs.getString("landmark"))
                .city(rs.getString("city"))
                .cityCode(rs.getString("city_code"))
                .locality(rs.getString("locality"))
                .localityCode(rs.getString("addr_locality_code"))
                .pincode(rs.getString("pincode"))
                .latitude(rs.getString("addr_latitude"))
                .longitude(rs.getString("addr_longitude"))
                .type(rs.getString("addr_type"))
                .build();
    }

    private Long getLongValue(ResultSet rs, String column) throws SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }
}