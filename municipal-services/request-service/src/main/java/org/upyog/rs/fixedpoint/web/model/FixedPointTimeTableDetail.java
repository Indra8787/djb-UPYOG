package org.upyog.rs.fixedpoint.web.model;

import org.upyog.rs.web.models.AuditDetails;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@ApiModel(description = "Details of the fixed point time table schedule")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixedPointTimeTableDetail {

    @JsonProperty("systemAssignedScheduleId")
    private String systemAssignedScheduleId;

    @JsonProperty("fixedPointCode")
    private String fixedPointCode;

    @JsonProperty("day")
    private String day;

    @JsonProperty("tripNo")
    private Integer tripNo;

    @JsonProperty("arrivalTimeToFpl")
    private String arrivalTimeToFpl;

    @JsonProperty("departureTimeFromFpl")
    private String departureTimeFromFpl;

    @JsonProperty("arrivalTimeDeliveryPoint")
    private String arrivalTimeDeliveryPoint;

    @JsonProperty("departureTimeDeliveryPoint")
    private String departureTimeDeliveryPoint;

    @JsonProperty("timeOfArrivingBackFplAfterDelivery")
    private String timeOfArrivingBackFplAfterDelivery;

    @JsonProperty("volumeWaterTobeDelivery")
    private String volumeWaterTobeDelivery;

    @JsonProperty("active")
    private Boolean active;

    @JsonProperty("isEnable")
    private Boolean isEnable;

    @JsonProperty("remarks")
    private String remarks;

    @JsonProperty("vehicleId")
    private String vehicleId;

    @JsonProperty("tenant_id")
    private String tenantId;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;
}