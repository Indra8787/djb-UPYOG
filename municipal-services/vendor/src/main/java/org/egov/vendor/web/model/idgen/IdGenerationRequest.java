package org.egov.vendor.web.model.idgen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IdGenerationRequest {
    
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    private List<IdRequest> idRequests;
}