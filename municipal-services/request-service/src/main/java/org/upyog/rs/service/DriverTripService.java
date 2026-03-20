package org.upyog.rs.service;

import org.upyog.rs.web.models.DriverTrip;
import org.upyog.rs.web.models.DriverTripRequest;

public interface DriverTripService {

     DriverTrip startTrip(DriverTripRequest request);
     DriverTrip completeTrip(DriverTripRequest request) ;

}
