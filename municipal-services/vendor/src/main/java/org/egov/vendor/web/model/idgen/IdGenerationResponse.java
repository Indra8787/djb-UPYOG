package org.egov.vendor.web.model.idgen;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class IdGenerationResponse {

    @JsonProperty("idResponses")
    private List<IdResponse> idResponses;

    public List<IdResponse> getIdResponses() {
        return idResponses;
    }

    public void setIdResponses(List<IdResponse> idResponses) {
        this.idResponses = idResponses;
    }
}
