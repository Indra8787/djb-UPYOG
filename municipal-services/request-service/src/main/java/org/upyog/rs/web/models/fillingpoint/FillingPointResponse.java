package org.upyog.rs.web.models.fillingpoint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FillingPointResponse {

    private ResponseInfo responseInfo;
    private List<FillingPoint> fillingPoints;

}
