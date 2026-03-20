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
                    "addr.type AS addr_type " +
                    "FROM public.upyog_rs_water_tanker_applicant_details ad " +
                    "LEFT JOIN public.upyog_rs_water_tanker_address_details addr " +
                    "ON ad.applicant_id = addr.applicant_id ";

    private static final String ORDER_BY = " ORDER BY ad.createdtime DESC ";

    public String getWaterTankerFixedPointQuery(
            WaterTankerFixedPointBookingSearchCriteria criteria,
            List<Object> preparedStmtList) {

        StringBuilder query = new StringBuilder(BASE_QUERY);

        query.append(" WHERE ad.type = ? ");
        preparedStmtList.add("FIXED-POINT");

        // Since we already added WHERE for the type, subsequent conditions use AND
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
//        boolean isWhereAdded = false;
//
//        if (criteria.getMobileNumber() != null && !criteria.getMobileNumber().trim().isEmpty()) {
//            query.append(isWhereAdded ? " AND " : " WHERE ");
//            query.append("ad.mobile_number = ? ");
//            preparedStmtList.add(criteria.getMobileNumber());
//            isWhereAdded = true;
//        }
//
//        if (criteria.getName() != null && !criteria.getName().trim().isEmpty()) {
//            query.append(isWhereAdded ? " AND " : " WHERE ");
//            query.append("ad.name ILIKE ? ");
//            preparedStmtList.add("%" + criteria.getName() + "%");
//            isWhereAdded = true;
//        }
//
//        query.append(ORDER_BY);
//        return query.toString();
//    }
}