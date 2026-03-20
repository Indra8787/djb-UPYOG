package org.upyog.rs.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.upyog.rs.constant.RequestServiceConstants;
import org.upyog.rs.kafka.Producer;
import org.upyog.rs.repository.DriverTripRepository;
import org.upyog.rs.service.DriverTripService;
import org.upyog.rs.util.RequestServiceUtil;
import org.upyog.rs.web.models.DriverTrip;
import org.upyog.rs.web.models.DriverTripRequest;

@Service
public class DriverTripServiceImpl implements DriverTripService {

    @Autowired
    private Producer producer;

    @Autowired
    private DriverTripRepository repository;

    @Override
    public DriverTrip startTrip(DriverTripRequest request) {
        DriverTrip trip = request.getDriverTrip();
        String userUuid = request.getRequestInfo().getUserInfo().getUuid();

        trip.setId(RequestServiceUtil.getRandonUUID());
        trip.setAuditDetails(RequestServiceUtil.getAuditDetails(userUuid, true));
        trip.setCurrentStatus("STARTED");

        producer.push(RequestServiceConstants.KAFKA_SAVE_DRIVER_TRIP_TOPIC, request);
        return trip;
    }

    @Override
    public DriverTrip completeTrip(DriverTripRequest request) {
        DriverTrip updateReq = request.getDriverTrip();
        String userUuid = request.getRequestInfo().getUserInfo().getUuid();

        DriverTrip existingTrip = repository.findByBookingNo(updateReq.getBookingNo());

        existingTrip.setCurrentStatus("COMPLETED");
        existingTrip.setEndLatitude(updateReq.getEndLatitude());
        existingTrip.setEndLongitude(updateReq.getEndLongitude());
        existingTrip.setEndFileStoreId(updateReq.getEndFileStoreId());
        existingTrip.setRemark(updateReq.getRemark());
        existingTrip.setAuditDetails(RequestServiceUtil.getAuditDetails(userUuid, false));

        repository.update(existingTrip);
        repository.saveTripHistory(existingTrip);

        request.setDriverTrip(existingTrip);
        producer.push(RequestServiceConstants.KAFKA_UPDATE_DRIVER_TRIP_TOPIC, request);

        return existingTrip;
    }
}