package org.upyog.rs.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestDetailsByDriverId {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("driverAdditionalDetails")
    private List<RequestDetailsInfo> requestDetailsInfo;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class RequestDetailsInfo {
        @JsonProperty("booking_id")
        private String bookingId;

        @JsonProperty("booking_no")
        private String bookingNo;

        @JsonProperty("tenant_id")

        private String tenantId;

        @JsonProperty("tanker_type")

        private String tankerType;



        @JsonProperty("tanker_quantity")

        private Integer tankerQuantity;



        @JsonProperty("water_quantity")

        private Integer waterQuantity;



        @JsonProperty("address_detail_id")

        private String addressDetailId;



        @JsonProperty("mobile_number")

        private String mobileNumber;



        @JsonProperty("locality_code")

        private String localityCode;



        @JsonProperty("payment_receipt_filestore_id")

        private String paymentReceiptFilestoreId;



        @JsonProperty("water_type")

        private String waterType;



        private String description;



        @JsonProperty("applicant_uuid")

        private String applicantUuid;



        @JsonProperty("delivery_date")

        private String deliveryDate;



        @JsonProperty("delivery_time")

        private String deliveryTime;



        @JsonProperty("extra_charge")

        private String extraCharge;



        @JsonProperty("vendor_id")

        private String vendorId;



        @JsonProperty("vehicle_id")

        private String vehicleId;



        @JsonProperty("driver_id")

        private String driverId;



        @JsonProperty("vehicle_type")

        private String vehicleType;



        @JsonProperty("vehicle_capacity")

        private String vehicleCapacity;



        @JsonProperty("booking_createdby")

        private String bookingCreatedBy;



        @JsonProperty("booking_status")

        private String bookingStatus;



        private String createdby;

        private String lastmodifiedby;

        private Long createdtime;

        private Long lastmodifiedtime;



        @JsonProperty("applicant_name")

        private String applicantName;



        @JsonProperty("applicant_mobile")

        private String applicantMobile;



        @JsonProperty("email_id")

        private String emailId;

        @JsonProperty("house_no")

        private String houseNo;



        @JsonProperty("address_line_1")

        private String addressLine1;

        @JsonProperty("street_name")

        private String streetName;

        private String landmark;

        private String city;

        private String pincode;

        private String latitude;

        @JsonProperty("address")
        private Address address;

        @JsonProperty("driverTripDetails")
        private DriverTrip driverTrip;

        private String longitude;
        @JsonProperty("registrationnumber")
        private String registrationNumber;

        @JsonProperty("vehicle_model")
        private String vehicleModel;
    }
}