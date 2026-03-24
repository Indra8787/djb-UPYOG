package org.upyog.rs.fixedpoint.repository;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.stereotype.Repository;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetails;
import org.upyog.rs.fixedpoint.web.model.FixedPointSearchCriteria;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;

import java.util.List;

@Repository
public interface FixedPointDetailsRepository  {

    void saveFixedPointDetails(List<FixedPointDetails> fixedPointDetailsList, RequestInfo requestInfo);

     Integer getCount(FixedPointSearchCriteria criteria);
     List<FixedPointTimeTableDetail> getDetails(FixedPointSearchCriteria criteria);
}
