package org.upyog.rs.fixedpoint.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.upyog.rs.web.models.AuditDetails;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class FixedPointDetails {

    @JsonProperty("system_assigned_schedule_id")
    private String systemAssignedScheduleId;
    @JsonProperty("fixed_point_code")
    private String fixedPointCode;
    @JsonProperty("day")
    private String day;
    @JsonProperty("trip_no")
    private Integer tripNo;

    @JsonProperty("arrival_time_to_fpl")
    private String arrivalTimeToFpl;
    @JsonProperty("departure_time_from_fpl")
    private String departureTimeFromFpl;
    @JsonProperty("arrival_time_delivery_point")
    private String arrivalTimeDeliveryPoint;
    @JsonProperty("departure_time_delivery_point")
    private String departureTimeDeliveryPoint;
    @JsonProperty("time_of_arriving_back_fpl_after_delivery")
    private String timeOfArrivingBackFplAfterDelivery;
    @JsonProperty("volume_water_tobe_delivery")
    private String volumeWaterTobeDelivery;
    @JsonProperty("active")
    private Boolean active;
    @JsonProperty("is_enable")
    private Boolean isEnable;
    @JsonProperty("remarks")
    private String remarks;
    @JsonProperty("vehicle_id")
    private String vehicleId;

    @JsonProperty("audit_details")
    private AuditDetails auditDetails;

}
