package org.upyog.rs.web.controllers;


import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.upyog.rs.constant.RequestServiceConstants;
import org.upyog.rs.service.MobileToiletService;
import org.upyog.rs.service.WaterTankerService;
import org.upyog.rs.util.RequestServiceUtil;
import org.upyog.rs.util.ResponseInfoFactory;
import org.upyog.rs.validator.ValidatorService;
import org.upyog.rs.web.models.CriteriyaSearchDto;
import org.upyog.rs.web.models.RequestDetailsByDriverId;
import org.upyog.rs.web.models.ResponseInfo;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingDetail;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingRequest;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingResponse;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingSearchCriteria;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingSearchResponse;
import org.upyog.rs.web.models.waterTanker.*;
import org.upyog.rs.web.models.ResponseInfo.StatusEnum;

import digit.models.coremodels.RequestInfoWrapper;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2025-01-16T15:46:56.897+05:30")

@Controller
@Slf4j
public class RequestServiceController {
	
	@Autowired
	private WaterTankerService waterTankerService;

	@Autowired
	private MobileToiletService mobileToiletService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@Autowired
	private ValidatorService validatorService;

	@PostMapping("/water-tanker/v1/_create")
	public ResponseEntity<WaterTankerBookingResponse> createWaterTankerBooking(
			@ApiParam(value = "Details for the water tanker booking time, payment and documents", required = true)
			@RequestBody WaterTankerBookingRequest waterTankerbookingRequest) {
		log.info("waterTankerbookingRequest : {}" , waterTankerbookingRequest);
        validatorService.validateRequest(waterTankerbookingRequest);
		WaterTankerBookingDetail waterTankerDetail = waterTankerService.createNewWaterTankerBookingRequest(waterTankerbookingRequest);
		ResponseInfo info = RequestServiceUtil.createReponseInfo(waterTankerbookingRequest.getRequestInfo(),
				RequestServiceConstants.BOOKING_CREATED, StatusEnum.SUCCESSFUL);
		WaterTankerBookingResponse response = WaterTankerBookingResponse.builder()
				.waterTankerBookingApplication(waterTankerDetail)
				.responseInfo(info).build();
		return new ResponseEntity<WaterTankerBookingResponse>(response, HttpStatus.OK);
	}


	@PostMapping("/water-tanker/fixed-point/v1/_create")
	public ResponseEntity<WaterTankerFixedPointResponse> createWaterTankerBookingFixedPOint(
			@RequestBody WaterTankerFixedPointRequest waterTankerFixedPointRequest) {
		log.info("waterTankerbookingRequest : {}" , waterTankerFixedPointRequest);
		WaterTankerFixedPointDetail waterTankerFixedPointDetail = waterTankerService.createFixedPointWaterTankerBookingRequest(waterTankerFixedPointRequest);
		ResponseInfo info = RequestServiceUtil.createReponseInfo(waterTankerFixedPointRequest.getRequestInfo(),
				RequestServiceConstants.BOOKING_CREATED, StatusEnum.SUCCESSFUL);
		WaterTankerFixedPointResponse response = WaterTankerFixedPointResponse.builder()
				.waterTankerFixedPointDetail(waterTankerFixedPointDetail)
				.responseInfo(info).build();
		return new ResponseEntity<WaterTankerFixedPointResponse>(response, HttpStatus.OK);
	}

	@PostMapping("/water-tanker/v1/_search")
	public ResponseEntity<WaterTankerBookingSearchResponse> searchWaterTankerBookingDetails(
			@ApiParam(value = "Details for the water tanker booking time, payment and documents", required = true) @Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute WaterTankerBookingSearchCriteria waterTankerBookingSearchCriteria) {

		List<WaterTankerBookingDetail> applications = null;
		Integer count = 0;

		applications = waterTankerService.getWaterTankerBookingDetails(requestInfoWrapper.getRequestInfo(),
				waterTankerBookingSearchCriteria);

		count = waterTankerService.getApplicationsCount(waterTankerBookingSearchCriteria,
				requestInfoWrapper.getRequestInfo());

		/*
		 * Create Response Info with success status and used utilize method to generate
		 * standardized response
		 */
		ResponseInfo responseInfo = RequestServiceUtil.createReponseInfo(requestInfoWrapper.getRequestInfo(),
				RequestServiceConstants.BOOKING_DETAIL_FOUND, StatusEnum.SUCCESSFUL);
		/*
		 * Build search response using builder and retrieve booking details and response
		 * metadata
		 */
		WaterTankerBookingSearchResponse response = WaterTankerBookingSearchResponse.builder()
				.waterTankerBookingDetails(applications).responseInfo(responseInfo).count(count).build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}


	// Fixed Point Water Tanked Search

	@PostMapping("/water-tanker/fixed-point/v1/_search")
	public ResponseEntity<WaterTankerFixedPointBookingSearchResponse> searchWaterTankerFixedPointBookingDetails(
			@ApiParam(value = "Details for the water tanker booking time, payment and documents", required = true) @Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute WaterTankerFixedPointBookingSearchCriteria waterTankerFixedPointBookingSearchCriteria) {

		List<WaterTankerFixedPointDetail> applications = null;
		Integer count = 0;

		applications = waterTankerService.getWaterTankerFixedPointBookingDetails(requestInfoWrapper.getRequestInfo(),
				waterTankerFixedPointBookingSearchCriteria);

		ResponseInfo responseInfo = RequestServiceUtil.createReponseInfo(requestInfoWrapper.getRequestInfo(),
				RequestServiceConstants.BOOKING_DETAIL_FOUND, StatusEnum.SUCCESSFUL);

		WaterTankerFixedPointBookingSearchResponse response = WaterTankerFixedPointBookingSearchResponse.builder()
				.waterTankerFixedPointDetails(applications).responseInfo(responseInfo).count(count).build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/water-tanker/v1/_update")
	public ResponseEntity<WaterTankerBookingResponse> waterTankerUpdate(
			@ApiParam(value = "Updated water tanker details and RequestInfo meta data.", required = true)
			@RequestBody WaterTankerBookingRequest waterTankerRequest) {
		
		WaterTankerBookingDetail waterTankerDetail = waterTankerService.updateWaterTankerBooking(waterTankerRequest, null);

		WaterTankerBookingResponse response = WaterTankerBookingResponse.builder().waterTankerBookingApplication(waterTankerDetail)
				.responseInfo(RequestServiceUtil.createReponseInfo(waterTankerRequest.getRequestInfo(),
						RequestServiceConstants.APPLICATION_UPDATED, StatusEnum.SUCCESSFUL))
				.build();
		return new ResponseEntity<WaterTankerBookingResponse>(response, HttpStatus.OK);
	}

	@PostMapping("/mobile-toilet/v1/_create")
	public ResponseEntity<MobileToiletBookingResponse> createMobileToiletBooking(
			@ApiParam(value = "Details for the mobile Toilet booking time, payment and documents", required = true)
			@RequestBody MobileToiletBookingRequest mobileToiletbookingRequest) {
		log.info("mobileToiletbookingRequest : {}" , mobileToiletbookingRequest);
		validatorService.validateRequest(mobileToiletbookingRequest);
		MobileToiletBookingDetail mobileToiletDetail = mobileToiletService.createNewMobileToiletBookingRequest(mobileToiletbookingRequest);
		ResponseInfo info = RequestServiceUtil.createReponseInfo(mobileToiletbookingRequest.getRequestInfo(),
				RequestServiceConstants.MT_BOOKING_CREATED, StatusEnum.SUCCESSFUL);
		MobileToiletBookingResponse response = MobileToiletBookingResponse.builder()
				.mobileToiletBookingApplication(mobileToiletDetail)
				.responseInfo(info).build();
		return new ResponseEntity<MobileToiletBookingResponse>(response, HttpStatus.OK);
	}

	@PostMapping("/mobile-toilet/v1/_search")
	public ResponseEntity<MobileToiletBookingSearchResponse> searchMobileToiletBookingDetails(
			@ApiParam(value = "Details for the Mobile Toilet booking time, payment and documents", required = true) @Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute MobileToiletBookingSearchCriteria mobileToiletBookingSearchCriteria) {

		List<MobileToiletBookingDetail> applications = null;
		Integer count = 0;

		applications =mobileToiletService.getMobileToiletBookingDetails(requestInfoWrapper.getRequestInfo(),
				mobileToiletBookingSearchCriteria);

		count = mobileToiletService.getApplicationsCount(mobileToiletBookingSearchCriteria,
				requestInfoWrapper.getRequestInfo());

		/*
		 * Create Response Info with success status and used utilize method to generate
		 * standardized response
		 */
		ResponseInfo responseInfo = RequestServiceUtil.createReponseInfo(requestInfoWrapper.getRequestInfo(),
				RequestServiceConstants.MOBILE_TOILET_BOOKING_DETAIL_FOUND, StatusEnum.SUCCESSFUL);
		/*
		 * Build search response using builder and retrieve booking details and response
		 * metadata
		 */
		MobileToiletBookingSearchResponse response = MobileToiletBookingSearchResponse.builder()
				.mobileToiletBookingDetails(applications).responseInfo(responseInfo).count(count).build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/mobile-toilet/v1/_update")
	public ResponseEntity<MobileToiletBookingResponse> mobileToiletUpdate(
			@ApiParam(value = "Updated water tanker details and RequestInfo meta data.", required = true)
			@RequestBody MobileToiletBookingRequest mobileToiletRequest) {

		MobileToiletBookingDetail mobileToiletDetail = mobileToiletService.updateMobileToiletBooking(mobileToiletRequest, null);

		MobileToiletBookingResponse response = MobileToiletBookingResponse.builder().mobileToiletBookingApplication(mobileToiletDetail)
				.responseInfo(RequestServiceUtil.createReponseInfo(mobileToiletRequest.getRequestInfo(),
						RequestServiceConstants.APPLICATION_UPDATED, StatusEnum.SUCCESSFUL))
				.build();
		return new ResponseEntity<MobileToiletBookingResponse>(response, HttpStatus.OK);
	}

	@PostMapping("/water-tanker/v1/_driver_assignments")
	public ResponseEntity<RequestDetailsByDriverId> getDriverAssignments(
			@RequestBody @Valid CriteriyaSearchDto searchDto) {

		List<RequestDetailsByDriverId.RequestDetailsInfo> details =
				waterTankerService.getBookingAndAssignmentDetails(searchDto.getCriteriyaSearch().getDriverId());

		RequestDetailsByDriverId response = RequestDetailsByDriverId.builder()
				.requestDetailsInfo(details)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(searchDto.getRequestInfo(), true))
				.build();

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/water-tanker/v1/_driverSearch")
	public ResponseEntity<WaterTankerBookingSearchResponse> searchDriverBookings(
			@Valid @RequestBody CriteriyaSearchDto criteriyaSearchDto) {

		// Pass the entire DTO to the service
		List<WaterTankerBookingDetail> applications = waterTankerService.getDriverAssignedBookings(criteriyaSearchDto);

		// Use the requestInfo from the DTO
		ResponseInfo responseInfo = RequestServiceUtil.createReponseInfo(
				criteriyaSearchDto.getRequestInfo(),
				"Driver applications fetched successfully",
				StatusEnum.SUCCESSFUL);

		WaterTankerBookingSearchResponse response = WaterTankerBookingSearchResponse.builder()
				.waterTankerBookingDetails(applications)
				.responseInfo(responseInfo)
				.count(applications.size()).build();

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/water-tanker/v1/_updatestatus")
	public ResponseEntity<WaterTankerBookingResponse> updateLifecycle(
			@RequestBody WaterTankerBookingRequest waterTankerRequest) {

		WaterTankerBookingDetail waterTankerDetail = waterTankerService.updateBookingLifecycle(waterTankerRequest);

		WaterTankerBookingResponse response = WaterTankerBookingResponse.builder()
				.waterTankerBookingApplication(waterTankerDetail)
				.responseInfo(RequestServiceUtil.createReponseInfo(waterTankerRequest.getRequestInfo(),
						"Booking status updated successfully", StatusEnum.SUCCESSFUL))
				.build();

		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
