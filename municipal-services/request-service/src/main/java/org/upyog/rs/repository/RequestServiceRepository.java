package org.upyog.rs.repository;

import java.util.List;
import java.util.Map;

import org.upyog.rs.web.models.RequestDetailsByDriverId;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingDetail;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingRequest;
import org.upyog.rs.web.models.mobileToilet.MobileToiletBookingSearchCriteria;
import org.upyog.rs.web.models.waterTanker.*;

public interface RequestServiceRepository {

	void saveWaterTankerBooking(WaterTankerBookingRequest waterTankerRequest);

	void saveFixedPointWaterTanker(WaterTankerFixedPointRequest waterTankerFixedPointRequest);

	void updateFixedPointWaterTanker(WaterTankerFixedPointRequest waterTankerFixedPointRequest);

	List<WaterTankerBookingDetail> getWaterTankerBookingDetails(WaterTankerBookingSearchCriteria waterTankerBookingSearchCriteria);

	List<WaterTankerFixedPointDetail> getWaterTankerFixedPointBookingDetails(WaterTankerFixedPointBookingSearchCriteria waterTankerFixedPointBookingSearchCriteria);

	Integer getApplicationsCount(WaterTankerBookingSearchCriteria criteria);

	void updateWaterTankerBooking(WaterTankerBookingRequest waterTankerRequest);

	void saveMobileToiletBooking(MobileToiletBookingRequest mobileToiletRequest);

	List<MobileToiletBookingDetail> getMobileToiletBookingDetails(MobileToiletBookingSearchCriteria mobileToiletBookingSearchCriteria);

	Integer getApplicationsCount(MobileToiletBookingSearchCriteria criteria);

	void updateMobileToiletBooking(MobileToiletBookingRequest mobileToiletRequest);

	public List<RequestDetailsByDriverId.RequestDetailsInfo> getFullBookingDetailsByDriver(String driverId);
}
