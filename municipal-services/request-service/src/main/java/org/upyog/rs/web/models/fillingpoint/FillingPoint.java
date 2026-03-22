package org.upyog.rs.web.models.fillingpoint;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.upyog.rs.web.models.Address;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FillingPoint {

    private String id;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("fillingPointName")  // ← add this
    private String fillingPointName;

    @JsonProperty("emergencyName")     // ← add this
    private String emergencyName;

    @JsonProperty("eeName")
    private String eeName;

    @JsonProperty("eeEmail")
    private String eeEmail;

    @JsonProperty("eeMobile")
    private String eeMobile;

    @JsonProperty("aeName")
    private String aeName;

    @JsonProperty("aeEmail")
    private String aeEmail;

    @JsonProperty("aeMobile")
    private String aeMobile;

    @JsonProperty("jeName")
    private String jeName;

    @JsonProperty("jeEmail")
    private String jeEmail;

    @JsonProperty("jeMobile")
    private String jeMobile;

    @JsonProperty("createdBy")
    private String createdBy;

    @JsonProperty("lastModifiedBy")
    private String lastModifiedBy;

    @JsonProperty("createdTime")
    private Long createdTime;

    @JsonProperty("lastModifiedTime")
    private Long lastModifiedTime;

    private Address address;
}
