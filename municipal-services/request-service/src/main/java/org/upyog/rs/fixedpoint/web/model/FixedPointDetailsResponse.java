package org.upyog.rs.fixedpoint.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import javax.validation.Valid;
import java.util.List;
import org.egov.common.contract.response.ResponseInfo;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixedPointDetailsResponse {

    @JsonProperty("responseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("fixedPointDetailsList")
    @Valid
    private List<FixedPointDetails> fixedPointDetailsList;
}