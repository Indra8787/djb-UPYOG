package org.upyog.rs.fixedpoint.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Data
@Builder
public class FixedPointDetailsRequest {


        @JsonProperty("RequestInfo")
        private RequestInfo requestInfo;

        @JsonProperty("fixedPointDetails")
        private FixedPointDetails fixedPointDetails;

        @JsonProperty("fixedPointDetailsList")
        private List<FixedPointDetails> fixedPointDetailsList;

}
