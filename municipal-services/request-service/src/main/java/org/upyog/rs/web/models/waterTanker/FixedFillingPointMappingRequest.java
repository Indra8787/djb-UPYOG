package org.upyog.rs.web.models.waterTanker;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.Valid;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixedFillingPointMappingRequest {


    @Valid
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("fixedFillingPointMapping")
    private FixedFillingPointMapping fixedFillingPointMapping;
}
