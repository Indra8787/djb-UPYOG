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
import org.upyog.rs.repository.querybuilder.DriverDetailsQueryBuilder;
import org.upyog.rs.repository.querybuilder.RequestServiceQueryBuilder;
import org.upyog.rs.repository.querybuilder.WaterTankerFixedPointQueryBuilder;
import org.upyog.rs.repository.rowMapper.DriverDetailsRowMapper;
import org.upyog.rs.repository.rowMapper.GenericRowMapper;
import org.upyog.rs.repository.rowMapper.WaterTankerFixedPointRowMapper;
import org.upyog.rs.web.models.PersisterWrapper;
import org.upyog.rs.web.models.RequestDetailsByDriverId;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingDetail;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingRequest;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingSearchCriteria;
import org.upyog.rs.web.models.waterTanker.*;

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

	@Autowired
	private WaterTankerFixedPointQueryBuilder waterTankerFixedPointQueryBuilder;

	@Autowired
	private WaterTankerFixedPointRowMapper waterTankerFixedPointRowMapper;

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
	public void saveFixedPointWaterTanker(WaterTankerFixedPointRequest waterTankerFixedPointRequest) {
		WaterTankerFixedPointDetail waterTankerFixedPointDetail = waterTankerFixedPointRequest.getWaterTankerFixedPointDetail();
		PersisterWrapper<WaterTankerFixedPointDetail> persisterWrapper = new PersisterWrapper<WaterTankerFixedPointDetail>(
				waterTankerFixedPointDetail);
		pushWaterTankerFixedPointRequestToKafka(waterTankerFixedPointRequest);
	}

	private void pushWaterTankerFixedPointRequestToKafka(WaterTankerFixedPointRequest waterTankerRequest) {
		if(requestServiceConfiguration.getIsUserProfileEnabled()) {
			producer.push(requestServiceConfiguration.getFixedPointWaterTankerApplicationWithProfileSaveTopic(), waterTankerRequest);
		}
		else {
			producer.push(requestServiceConfiguration.getFixedPointWaterTankerApplicationSaveTopic(), waterTankerRequest);
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
	public void updateFixedPointWaterTanker(WaterTankerFixedPointRequest waterTankerFixedPointRequest) {
		WaterTankerFixedPointDetail waterTankerFixedPointDetail =
				waterTankerFixedPointRequest.getWaterTankerFixedPointDetail();
		// Wrap for audit trail (mirrors create pattern)
		PersisterWrapper<WaterTankerFixedPointDetail> persisterWrapper =
				new PersisterWrapper<>(waterTankerFixedPointDetail);
		pushFixedPointWaterTankerUpdateToKafka(waterTankerFixedPointRequest);
	}

	private void pushFixedPointWaterTankerUpdateToKafka(WaterTankerFixedPointRequest waterTankerRequest) {
		if (requestServiceConfiguration.getIsUserProfileEnabled()) {
			producer.push(
					requestServiceConfiguration.getFixedPointWaterTankerApplicationWithProfileUpdateTopic(),
					waterTankerRequest);
		} else {
			producer.push(
					requestServiceConfiguration.getFixedPointWaterTankerApplicationUpdateTopic(),
					waterTankerRequest);
		}
	}

	@Override
	public List<WaterTankerFixedPointDetail> getWaterTankerFixedPointBookingDetails(
			WaterTankerFixedPointBookingSearchCriteria criteria) {

		List<Object> preparedStmtList = new ArrayList<>();
		String query = waterTankerFixedPointQueryBuilder.getWaterTankerFixedPointQuery(criteria, preparedStmtList);

		return jdbcTemplate.query(query, preparedStmtList.toArray(), waterTankerFixedPointRowMapper);
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


	public List<RequestDetailsByDriverId.RequestDetailsInfo> getFullBookingDetailsByDriver(String driverId) {
		log.info("Fetching details for driverId: {}", driverId);

		return jdbcTemplate.query(DriverDetailsQueryBuilder.DRIVER_QUERY,
				new Object[]{driverId},
				new DriverDetailsRowMapper());
	}

	private static final String INSERT_QUERY =
			"INSERT INTO upyog_rs_water_tanker_filling_point_fixed_point_mapping " +
					"(fixed_pt_name, filling_pt_name) VALUES (?, ?)";


	@Override
	public void save(FixedFillingPointMapping mapping) {
		log.info("Saving FixedFillingPointMapping: {}", mapping);
		jdbcTemplate.update(INSERT_QUERY,
				mapping.getFixed_pt_name(),
				mapping.getFilling_pt_name()
		);
	}


}
