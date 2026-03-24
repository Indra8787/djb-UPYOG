package org.upyog.rs.web.models.fillingpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.egov.common.contract.request.RequestInfo;
@Data
public class FillingPointKafkaRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    private FillingPoint fillingPoint;
}
