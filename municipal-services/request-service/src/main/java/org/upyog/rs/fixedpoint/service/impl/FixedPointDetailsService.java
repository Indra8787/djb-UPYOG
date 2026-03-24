package org.upyog.rs.fixedpoint.service;

import org.egov.common.contract.request.RequestInfo;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsRequest;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsResponse;
import org.upyog.rs.fixedpoint.web.model.FixedPointSearchCriteria;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;

import java.util.List;

public interface FixedPointDetailsService {

    FixedPointDetailsResponse saveFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest);

    public List<FixedPointTimeTableDetail> getFixedPointDetails(RequestInfo requestInfo, FixedPointSearchCriteria criteria);
    public Integer getApplicationsCount(FixedPointSearchCriteria criteria, RequestInfo requestInfo);

    }
