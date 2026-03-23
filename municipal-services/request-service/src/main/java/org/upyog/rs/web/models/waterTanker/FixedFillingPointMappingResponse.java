package org.upyog.rs.web.models.waterTanker;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixedFillingPointMappingResponse {

    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("fixedFillingPointMappings")
    private List<FixedFillingPointMapping> fixedFillingPointMappings;

    private String message;
}
