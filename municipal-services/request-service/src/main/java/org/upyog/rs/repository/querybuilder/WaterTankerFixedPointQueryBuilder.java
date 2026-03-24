package org.upyog.rs.repository.querybuilder;

import org.springframework.stereotype.Component;
import org.upyog.rs.web.models.waterTanker.WaterTankerFixedPointBookingSearchCriteria;

import java.util.List;

@Component
public class WaterTankerFixedPointQueryBuilder {

        private static final String BASE_QUERY =
                "SELECT " +
                        "ad.applicant_id, " +
                        "ad.booking_id, " +
                        "ad.name, " +
                        "ad.mobile_number AS applicant_mobile_number, " +
                        "ad.email_id, " +
                        "ad.alternate_number, " +
                        "ad.type AS applicant_type, " +
                        "ad.createdby AS ad_createdby, " +
                        "ad.lastmodifiedby AS ad_lastmodifiedby, " +
                        "ad.createdtime AS ad_createdtime, " +
                        "ad.lastmodifiedtime AS ad_lastmodifiedtime, " +
                        "addr.address_id, " +
                        "addr.house_no, " +
                        "addr.address_line_1, " +
                        "addr.address_line_2, " +
                        "addr.street_name, " +
                        "addr.landmark, " +
                        "addr.city, " +
                        "addr.city_code, " +
                        "addr.locality, " +
                        "addr.locality_code AS addr_locality_code, " +
                        "addr.pincode, " +
                        "addr.latitude AS addr_latitude, " +
                        "addr.longitude AS addr_longitude, " +
                        "addr.type AS addr_type, " +
                        "fp.id AS fp_id, " +
                        "fp.tenant_id AS fp_tenant_id, " +
                        "fp.filling_point_name AS fp_filling_point_name, " +
                        "fp.emergency_name AS fp_emergency_name, " +
                        "fp.ee_name AS fp_ee_name, " +
                        "fp.ee_email AS fp_ee_email, " +
                        "fp.ee_mobile AS fp_ee_mobile, " +
                        "fp.ae_name AS fp_ae_name, " +
                        "fp.ae_email AS fp_ae_email, " +
                        "fp.ae_mobile AS fp_ae_mobile, " +
                        "fp.je_name AS fp_je_name, " +
                        "fp.je_email AS fp_je_email, " +
                        "fp.je_mobile AS fp_je_mobile, " +
                        "fp.createdby AS fp_createdby, " +
                        "fp.lastmodifiedby AS fp_lastmodifiedby, " +
                        "fp.createdtime AS fp_createdtime, " +
                        "fp.lastmodifiedtime AS fp_lastmodifiedtime, " +
                        "fpa.address_id AS fp_address_id, " +
                        "fpa.applicant_id AS fp_address_applicant_id, " +
                        "fpa.house_no AS fp_house_no, " +
                        "fpa.address_line_1 AS fp_address_line_1, " +
                        "fpa.address_line_2 AS fp_address_line_2, " +
                        "fpa.street_name AS fp_street_name, " +
                        "fpa.landmark AS fp_landmark, " +
                        "fpa.city AS fp_city, " +
                        "fpa.city_code AS fp_city_code, " +
                        "fpa.locality AS fp_locality, " +
                        "fpa.locality_code AS fp_locality_code, " +
                        "fpa.pincode AS fp_pincode, " +
                        "fpa.latitude AS fp_addr_latitude, " +
                        "fpa.longitude AS fp_addr_longitude, " +
                        "fpa.type AS fp_addr_type " +
                        "FROM public.upyog_rs_water_tanker_applicant_details ad " +
                        "LEFT JOIN public.upyog_rs_water_tanker_address_details addr " +
                        "ON ad.applicant_id = addr.applicant_id " +
                        "LEFT JOIN public.upyog_rs_water_tanker_filling_point_fixed_point_mapping m " +
                        "ON ad.applicant_id = m.fixed_pt_name " +
                        "LEFT JOIN public.upyog_rs_water_tanker_filling_point fp " +
                        "ON m.filling_pt_name = fp.id " +
                        "LEFT JOIN public.upyog_rs_water_tanker_address_details fpa " +
                        "ON fp.id = fpa.applicant_id AND fpa.type = 'FILLING-POINT' ";

        private static final String ORDER_BY = " ORDER BY ad.createdtime DESC ";

        public String getWaterTankerFixedPointQuery(
                WaterTankerFixedPointBookingSearchCriteria criteria,
                List<Object> preparedStmtList) {

            StringBuilder query = new StringBuilder(BASE_QUERY);

            query.append(" WHERE ad.type = ? ");
            preparedStmtList.add("FIXED-POINT");

            if (criteria.getMobileNumber() != null && !criteria.getMobileNumber().trim().isEmpty()) {
                query.append(" AND ad.mobile_number = ? ");
                preparedStmtList.add(criteria.getMobileNumber());
            }

            if (criteria.getName() != null && !criteria.getName().trim().isEmpty()) {
                query.append(" AND ad.name ILIKE ? ");
                preparedStmtList.add("%" + criteria.getName() + "%");
            }

            query.append(ORDER_BY);
            return query.toString();
        }

}