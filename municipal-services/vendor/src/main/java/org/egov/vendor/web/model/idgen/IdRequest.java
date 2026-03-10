package org.egov.vendor.web.model.idgen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IdRequest {
    private String idName;
    private String tenantId;
    private String format;
}
