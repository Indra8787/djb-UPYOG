package org.upyog.rs.repository.impl;

import java.util.*;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.upyog.rs.config.RequestServiceConfiguration;
import org.upyog.rs.kafka.Producer;
import org.upyog.rs.repository.RequestServiceRepository;
import org.upyog.rs.repository.querybuilder.RequestServiceQueryBuilder;
import org.upyog.rs.repository.rowMapper.GenericRowMapper;
import org.upyog.rs.web.models.PersisterWrapper;
import org.upyog.rs.web.models.RequestDetailsByDriverId;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingDetail;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingRequest;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingSearchCriteria;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingDetail;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingRequest;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingSearchCriteria;

import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class RequestServieRepositoryImpl implements RequestServiceRepository {

	@Autowired
	private Producer producer;

	@Autowired
	private RequestServiceQueryBuilder queryBuilder;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	RequestServiceConfiguration requestServiceConfiguration;

	@Override
	public void saveWaterTankerBooking(WaterTankerBookingRequest waterTankerRequest) {
		log.info("Saving water tanker booking request data for booking no : "
				+ waterTankerRequest.getWaterTankerBookingDetail().getBookingNo());
		WaterTankerBookingDetail waterTankerBookingDetail = waterTankerRequest.getWaterTankerBookingDetail();
		PersisterWrapper<WaterTankerBookingDetail> persisterWrapper = new PersisterWrapper<WaterTankerBookingDetail>(
				waterTankerBookingDetail);
		pushWaterTankerRequestToKafka(waterTankerRequest);
	}

	private void pushWaterTankerRequestToKafka(WaterTankerBookingRequest waterTankerRequest) {
		if(requestServiceConfiguration.getIsUserProfileEnabled()) {
			producer.push(requestServiceConfiguration.getWaterTankerApplicationWithProfileSaveTopic(), waterTankerRequest);
		}
		else {
			producer.push(requestServiceConfiguration.getWaterTankerApplicationSaveTopic(), waterTankerRequest);
		}


	}


	@Override
	public List<WaterTankerBookingDetail> getWaterTankerBookingDetails(
			WaterTankerBookingSearchCriteria waterTankerBookingSearchCriteria) {
		//create a list to hold the statement parameter and allow addition of parameter based on search criteria
		List<Object> preparedStmtList = new ArrayList<>();

		/*passed the preparedStmtList and search criteria inside the getWaterTankerQuery method
		 developed inside query builder to build and get the data as per search criteria*/
		String query = queryBuilder.getWaterTankerQuery(waterTankerBookingSearchCriteria, preparedStmtList);
		log.info("Final query for getWaterTankerBookingDetails {} and paramsList {} : ", query, preparedStmtList);

		/*
		*  Execute the query using JdbcTemplate with a generic row mapper
		*  Converts result set directly to a list of WaterTankerBookingDetail objects
		*  Uses custom GenericRowMapper for flexible and recursive object mapping
		* */
		return jdbcTemplate.query(query, preparedStmtList.toArray(), new GenericRowMapper<>(WaterTankerBookingDetail.class));
	}

	@Override
	public Integer getApplicationsCount(WaterTankerBookingSearchCriteria criteria) {
		List<Object> preparedStatement = new ArrayList<>();
		String query = queryBuilder.getWaterTankerQuery(criteria, preparedStatement);

		if (query == null)
			return 0;

		log.info("Final query for getWaterTankerBookingDetails {} and paramsList {} : ", query, preparedStatement);

		Integer count = jdbcTemplate.queryForObject(query, preparedStatement.toArray(), Integer.class);
		return count;
	}
	
	@Override
	public void updateWaterTankerBooking(WaterTankerBookingRequest waterTankerRequest) {
		log.info("Updating water tanker request data for booking no : "
				+ waterTankerRequest.getWaterTankerBookingDetail().getBookingNo());
		producer.push(requestServiceConfiguration.getWaterTankerApplicationUpdateTopic(), waterTankerRequest);

	}

	@Override
	public void saveMobileToiletBooking(MobileToiletBookingRequest mobileToiletRequest) {
		log.info("Saving mobile Toilet booking request data for booking no : "
				+ mobileToiletRequest.getMobileToiletBookingDetail().getBookingNo());
		MobileToiletBookingDetail mobileToiletBookingDetail = mobileToiletRequest.getMobileToiletBookingDetail();
		PersisterWrapper<MobileToiletBookingDetail> persisterWrapper = new PersisterWrapper<MobileToiletBookingDetail>(
				mobileToiletBookingDetail);
		pushMobileToiletRequestToKafka(mobileToiletRequest);
	}

	private void pushMobileToiletRequestToKafka(MobileToiletBookingRequest mobileToiletRequest) {
		if(requestServiceConfiguration.getIsUserProfileEnabled()) {
			producer.push(requestServiceConfiguration.getMobileToiletApplicationWithProfileSaveTopic(), mobileToiletRequest);
		}
		else {
			producer.push(requestServiceConfiguration.getMobileToiletApplicationSaveTopic(), mobileToiletRequest);
		}
	}
	
	@Override
	public List<MobileToiletBookingDetail> getMobileToiletBookingDetails(
			MobileToiletBookingSearchCriteria mobileToiletBookingSearchCriteria) {
		//create a list to hold the statement parameter and allow addition of parameter based on search criteria
		List<Object> preparedStmtList = new ArrayList<>();

		/*passed the preparedStmtList and search criteria inside the getWaterTankerQuery method
		 developed inside query builder to build and get the data as per search criteria*/
		String query = queryBuilder.getMobileToiletQuery(mobileToiletBookingSearchCriteria, preparedStmtList);
		log.info("Final query for getMobileToiletBookingDetails {} and paramsList {} : " ,mobileToiletBookingSearchCriteria, preparedStmtList);
		/*
		 *  Execute the query using JdbcTemplate with a generic row mapper
		 *  Converts result set directly to a list of WaterTankerBookingDetail objects
		 *  Uses custom GenericRowMapper for flexible and recursive object mapping
		 * */
		return jdbcTemplate.query(query, preparedStmtList.toArray(), new GenericRowMapper<>(MobileToiletBookingDetail.class));
	}

	@Override
	public Integer getApplicationsCount(MobileToiletBookingSearchCriteria criteria) {
		List<Object> preparedStatement = new ArrayList<>();
		String query = queryBuilder.getMobileToiletQuery(criteria, preparedStatement);

		if (query == null)
			return 0;

		log.info("Final query for getMobileToiletBookingDetails {} and paramsList {} : " , preparedStatement);

		Integer count = jdbcTemplate.queryForObject(query, preparedStatement.toArray(), Integer.class);
		return count;
	}

	@Override
	public void updateMobileToiletBooking(MobileToiletBookingRequest mobileToiletRequest) {
		log.info("Updating mobile toilet request data for booking no : "
				+ mobileToiletRequest.getMobileToiletBookingDetail().getBookingNo());
		producer.push(requestServiceConfiguration.getMobileToiletApplicationUpdateTopic(),mobileToiletRequest);

	}

	private static final String BOOKING_BY_DRIVER_QUERY =
			"SELECT ursbd.*, urad.name as applicant_name, uraddr.latitude, uraddr.longitude, " +
					"uraddr.city, uraddr.pincode, ev.registrationnumber as registrationNumber, " +
					"ev.model as vehicle_model " +
					"FROM upyog_rs_water_tanker_booking_details ursbd " +
					"INNER JOIN upyog_rs_water_tanker_applicant_details urad ON ursbd.booking_id = urad.booking_id " +
					"INNER JOIN upyog_rs_water_tanker_address_details uraddr ON urad.applicant_id = uraddr.applicant_id " +
					"LEFT JOIN eg_vehicle ev ON ursbd.vehicle_id = ev.id " +
					"WHERE ursbd.driver_id = ?";

	@Override
	public List<RequestDetailsByDriverId.RequestDetailsInfo> getFullBookingDetailsByDriver(String driverId) {
		log.info("Fetching details for driverId: {}", driverId);
		return jdbcTemplate.query(BOOKING_BY_DRIVER_QUERY,
				new Object[]{driverId},
				new BeanPropertyRowMapper<>(RequestDetailsByDriverId.RequestDetailsInfo.class));
	}



}
