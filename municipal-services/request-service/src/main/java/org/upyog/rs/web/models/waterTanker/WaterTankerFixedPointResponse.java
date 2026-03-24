package org.upyog.rs.web.models.waterTanker;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;
import org.upyog.rs.web.models.ResponseInfo;
import org.upyog.rs.web.models.fillingpoint.FillingPoint;

import javax.validation.Valid;

@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2024-04-19T11:17:29.419+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WaterTankerFixedPointResponse {

    private ResponseInfo responseInfo;

    @JsonProperty("waterTankerBookingDetail")
    @Valid
    private WaterTankerFixedPointDetail waterTankerFixedPointDetail;

}
