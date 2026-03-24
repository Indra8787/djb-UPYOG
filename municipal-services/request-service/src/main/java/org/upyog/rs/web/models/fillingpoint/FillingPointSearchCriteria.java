package org.upyog.rs.web.models.fillingpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FillingPointSearchCriteria {

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("id")
    private String id;

    @JsonProperty("fillingPointName")
    private String fillingPointName;

    @JsonProperty("designation")       // EE / AE / JE
    private String designation;

    @JsonProperty("name")              // JE/AE/EE ka naam
    private String name;

    @JsonProperty("mobileNo")          // JE/AE/EE ka mobile
    private String mobileNo;

}
