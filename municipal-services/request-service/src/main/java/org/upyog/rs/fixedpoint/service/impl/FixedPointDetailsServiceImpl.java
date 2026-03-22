package org.upyog.rs.fixedpoint.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.repository.querybuilder.FixedPointTimeTable;
import org.upyog.rs.fixedpoint.service.FixedPointDetailsService;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetails;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsRequest;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsResponse;
import org.upyog.rs.util.ResponseInfoFactory;
import org.upyog.rs.web.models.AuditDetails;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FixedPointDetailsServiceImpl implements FixedPointDetailsService {

    private static final List<String> DAYS_OF_WEEK = Arrays.asList(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    );

    @Autowired
    private FixedPointDetailsRepository fixedPointDetailsRepository;

    @Autowired
    private FixedPointTimeTable existsByFixedPointCode;

    @Override
    public FixedPointDetailsResponse saveFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest) {

        log.info("FixedPointDetailsServiceImpl :: saveFixedPointDetails :: Started");

        RequestInfo requestInfo = fixedPointDetailsRequest.getRequestInfo();
        FixedPointDetails inputDetail = fixedPointDetailsRequest.getFixedPointDetails();

        if (existsByFixedPointCode
                .existsByFixedPointCode(inputDetail.getFixedPointCode())) {
            throw new CustomException("DUPLICATE_FIXED_POINT_CODE",
                    "Timetable for fixed_point_code '" + inputDetail.getFixedPointCode() + "' already exists.");
        }

        if (inputDetail.getDay() == null || inputDetail.getDay().isEmpty()) {
            throw new CustomException("INVALID_REQUEST", "day is required");
        }

        String requestedDay = inputDetail.getDay().toUpperCase();

        if (!DAYS_OF_WEEK.contains(requestedDay)) {
            throw new CustomException("INVALID_DAY",
                    "Invalid day: " + requestedDay + ". Must be one of: " + DAYS_OF_WEEK);
        }

        AuditDetails auditDetails = buildAuditDetails(requestInfo);

        List<FixedPointDetails> fixedPointDetailsList = new ArrayList<>();

        for (String day : DAYS_OF_WEEK) {
            String uniqueScheduleId = UUID.randomUUID().toString();

            FixedPointDetails detail = FixedPointDetails.builder()
                    .systemAssignedScheduleId(uniqueScheduleId)
                    .fixedPointCode(inputDetail.getFixedPointCode())
                    .day(day)
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
                    .isEnable(day.equals(requestedDay))
                    .auditDetails(auditDetails)
                    .build();

            fixedPointDetailsList.add(detail);
        }

        log.info("FixedPointDetailsServiceImpl :: saveFixedPointDetails :: Generated {} rows for scheduleId: {}",
                fixedPointDetailsList.size(), inputDetail.getSystemAssignedScheduleId());

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
}