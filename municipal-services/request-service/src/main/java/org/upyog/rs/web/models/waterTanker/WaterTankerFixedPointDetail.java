package org.upyog.rs.web.models.waterTanker;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.upyog.rs.validator.CreateApplicationGroup;
import org.upyog.rs.web.models.Address;
import org.upyog.rs.web.models.ApplicantDetail;
import org.upyog.rs.web.models.AuditDetails;
import org.upyog.rs.web.models.fillingpoint.FillingPoint;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2024-04-19T11:17:29.419+05:30")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class WaterTankerFixedPointDetail {

    @Valid
    @NotNull
    private ApplicantDetail applicantDetail;

    @NotBlank(groups = CreateApplicationGroup.class)
    private String tenantId;

    @Valid
    @NotNull
    private Address address;

    private AuditDetails auditDetails;

    @JsonProperty("fillingPoint")
    private FillingPoint fillingPoint;

    private String bookingId;
    private String mobileNumber;
    private String bookingNo;
}
