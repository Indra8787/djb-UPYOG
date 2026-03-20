package org.upyog.rs.fixedpoint.web.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.upyog.rs.web.models.ResponseInfo;

import javax.validation.Valid;

public class FixedPointDetailsResponse {

    @JsonProperty("responseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("fixedPointDetails")
    @Valid
    private FixedPointDetails fixedPointDetails;
}
