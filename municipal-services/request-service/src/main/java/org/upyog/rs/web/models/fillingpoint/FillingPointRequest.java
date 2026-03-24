package org.upyog.rs.web.models.fillingpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.egov.common.contract.request.RequestInfo;
import org.upyog.rs.web.models.waterTanker.WaterTankerBookingDetail;

import java.util.List;

@Data
public class FillingPointRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    private List<FillingPoint> fillingPoints;

    private WaterTankerBookingDetail waterTankerBookingDetail;
}
