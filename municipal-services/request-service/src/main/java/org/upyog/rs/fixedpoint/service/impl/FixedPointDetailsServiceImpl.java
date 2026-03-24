package org.upyog.rs.fixedpoint.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.repository.querybuilder.FixedPointTimeTableQueryBuilder;
import org.upyog.rs.fixedpoint.service.FixedPointEnrichmentService;
import org.upyog.rs.fixedpoint.service.FixedPointDetailsService;
import org.upyog.rs.fixedpoint.web.model.*;
import org.upyog.rs.web.models.AuditDetails;

import java.util.*;

@Slf4j
@Service
public class FixedPointDetailsServiceImpl implements FixedPointDetailsService {

    @Autowired
    private FixedPointEnrichmentService fixedPointEnrichmentService;

    private static final List<String> DAYS_OF_WEEK = Arrays.asList(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    );

    @Autowired
    private FixedPointDetailsRepository fixedPointDetailsRepository;

    @Autowired
    private FixedPointTimeTableQueryBuilder existsByFixedPointCode;

    @Override
    public FixedPointDetailsResponse saveFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest) {

        log.info("FixedPointDetailsServiceImpl :: saveFixedPointDetails :: Started");

        RequestInfo requestInfo = fixedPointDetailsRequest.getRequestInfo();
        FixedPointDetails inputDetail = fixedPointDetailsRequest.getFixedPointDetails();

        // Duplicate check
        if (existsByFixedPointCode.existsByFixedPointCode(inputDetail.getFixedPointCode())) {
            throw new CustomException("DUPLICATE_FIXED_POINT_CODE",
                    "Timetable for fixed_point_code '" + inputDetail.getFixedPointCode() + "' already exists.");
        }

        // Validate day list
        if (inputDetail.getDay() == null || inputDetail.getDay().isEmpty()) {
            throw new CustomException("INVALID_REQUEST", "At least one day is required");
        }

        List<String> requestedDays = inputDetail.getDay().stream()
                .map(String::toUpperCase)
                .collect(java.util.stream.Collectors.toList());

        // Validate each day value
        for (String day : requestedDays) {
            if (!DAYS_OF_WEEK.contains(day)) {
                throw new CustomException("INVALID_DAY",
                        "Invalid day: " + day + ". Must be one of: " + DAYS_OF_WEEK);
            }
        }

        AuditDetails auditDetails = buildAuditDetails(requestInfo);
        List<FixedPointDetails> fixedPointDetailsList = new ArrayList<>();

        for (String day : DAYS_OF_WEEK) {
            FixedPointDetails detail = FixedPointDetails.builder()
                    .systemAssignedScheduleId(UUID.randomUUID().toString())
                    .fixedPointCode(inputDetail.getFixedPointCode())
                    .day(Collections.singletonList(day))  // keep list structure in response
                    .dayValue(day)                         // plain String for DB persistence ✅
                    .tripNo(inputDetail.getTripNo())
                    .arrivalTimeToFpl(inputDetail.getArrivalTimeToFpl())
                    .departureTimeFromFpl(inputDetail.getDepartureTimeFromFpl())
                    .arrivalTimeDeliveryPoint(inputDetail.getArrivalTimeDeliveryPoint())
                    .departureTimeDeliveryPoint(inputDetail.getDepartureTimeDeliveryPoint())
                    .timeOfArrivingBackFplAfterDelivery(inputDetail.getTimeOfArrivingBackFplAfterDelivery())
                    .volumeWaterTobeDelivery(inputDetail.getVolumeWaterTobeDelivery())
                    .vehicleId(inputDetail.getVehicleId())
                    .remarks(inputDetail.getRemarks())
                    .active(true)
                    .isEnable(requestedDays.contains(day))  // true if in requested list ✅
                    .tenantId("dl.djb")
                    .auditDetails(auditDetails)
                    .build();

            fixedPointDetailsList.add(detail);
        }

        fixedPointDetailsRepository.saveFixedPointDetails(fixedPointDetailsList, requestInfo);

        log.info("FixedPointDetailsServiceImpl :: saveFixedPointDetails :: Completed");

        return FixedPointDetailsResponse.builder()
                .fixedPointDetailsList(fixedPointDetailsList)
                .build();
    }

    private AuditDetails buildAuditDetails(RequestInfo requestInfo) {
        String userId = (requestInfo.getUserInfo() != null)
                ? requestInfo.getUserInfo().getUuid()
                : "SYSTEM";
        long currentTime = System.currentTimeMillis();

        return AuditDetails.builder()
                .createdBy(userId)
                .lastModifiedBy(userId)
                .createdTime(currentTime)
                .lastModifiedTime(currentTime)
                .build();
    }

    @Override
    public List<FixedPointTimeTableDetail> getFixedPointDetails(RequestInfo requestInfo, FixedPointSearchCriteria criteria) {
        List<FixedPointTimeTableDetail> details = fixedPointDetailsRepository.getDetails(criteria);
        if (CollectionUtils.isEmpty(details)) {
            return new ArrayList<>();
        }
        return details;
    }

    @Override
    public Integer getApplicationsCount(FixedPointSearchCriteria criteria, RequestInfo requestInfo) {
        criteria.setCountCall(true);
        return fixedPointDetailsRepository.getCount(criteria);
    }


    @Override
    public FixedPointDetailsResponse updateFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest) {
        FixedPointDetails fixedPointDetails = fixedPointDetailsRequest.getFixedPointDetailsList().get(0);
        fixedPointEnrichmentService.enrichUpdateFixedPointDetails(fixedPointDetailsRequest);

        fixedPointDetailsRepository.updateFixedPointDetails(
                fixedPointDetails,
                fixedPointDetailsRequest.getRequestInfo()
        );

        return FixedPointDetailsResponse.builder()
                .fixedPointDetailsList(Collections.singletonList(fixedPointDetails))
                .build();
    }

}