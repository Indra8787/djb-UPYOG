package org.upyog.rs.fixedpoint.web.model;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FixedPointSearchCriteria {
    private String tenantId;
    private String scheduleId;
    private String fixedPointCode;
    private String day;
    private String vehicleId;

    private Integer offset;
    private Integer limit;
    private boolean isCountCall;
}
