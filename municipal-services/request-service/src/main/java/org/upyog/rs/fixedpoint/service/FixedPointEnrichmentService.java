package org.upyog.rs.fixedpoint.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.stereotype.Service;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsRequest;
import org.upyog.rs.web.models.AuditDetails;

@Service
@Slf4j
public class FixedPointEnrichmentService {

    public void enrichUpdateFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest) {

        RequestInfo requestInfo = fixedPointDetailsRequest.getRequestInfo();
        long currentTime = System.currentTimeMillis();
        String userId = requestInfo.getUserInfo().getUuid();

        fixedPointDetailsRequest.getFixedPointDetailsList().forEach(fixedPointDetails -> {
            AuditDetails auditDetails = fixedPointDetails.getAuditDetails();
            auditDetails.setLastModifiedBy(userId);
            auditDetails.setLastModifiedTime(currentTime);
            fixedPointDetails.setAuditDetails(auditDetails);
        });
    }
}
