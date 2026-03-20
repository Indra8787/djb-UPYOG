package org.upyog.rs.web.models.waterTanker;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class WaterTankerFixedPointBookingSearchCriteria {

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("name")
    private String name;


}
