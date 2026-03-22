package org.upyog.rs.fixedpoint.repository;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.stereotype.Repository;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetails;

import java.util.List;

@Repository
public interface FixedPointDetailsRepository  {

void saveFixedPointDetails(List<FixedPointDetails> fixedPointDetailsList, RequestInfo requestInfo);

}
