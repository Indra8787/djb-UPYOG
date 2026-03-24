package org.upyog.rs.fixedpoint.web.controller;

import digit.models.coremodels.RequestInfoWrapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.service.FixedPointDetailsService;
import org.upyog.rs.fixedpoint.web.model.*;
import org.upyog.rs.util.ResponseInfoFactory;

import javax.validation.Valid;
import java.util.List;

@RestController
@Slf4j
public class FixedPointDetailsController {


    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    private FixedPointDetailsService fixedPointDetailsService;

    @PostMapping("/water-tanked/fixed/time/v1/_create")
    public ResponseEntity<FixedPointDetailsResponse> saveFixedPointDetails(
            @Valid @RequestBody FixedPointDetailsRequest fixedPointDetailsRequest) {

        log.info("FixedPointDetailsController :: saveFixedPointDetails :: Request received");

        ResponseInfo responseInfo = responseInfoFactory
                .createResponseInfoFromRequestInfo(fixedPointDetailsRequest.getRequestInfo(), true);

        FixedPointDetailsResponse response = fixedPointDetailsService
                .saveFixedPointDetails(fixedPointDetailsRequest);

        response.setResponseInfo(responseInfo);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/water-tanked/fixed/time/v1/_search")
    public ResponseEntity<FixedPointSearchResponse> search(
            @Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
            @ModelAttribute FixedPointSearchCriteria criteria) {

        List<FixedPointTimeTableDetail> details = fixedPointDetailsService
                .getFixedPointDetails(requestInfoWrapper.getRequestInfo(), criteria);
        Integer count = fixedPointDetailsService
                .getApplicationsCount(criteria, requestInfoWrapper.getRequestInfo());

        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(
                requestInfoWrapper.getRequestInfo(), true);

        FixedPointSearchResponse response = FixedPointSearchResponse.builder()
                .fixedPointTimeTableDetails(details)
                .count(count)
                .responseInfo(responseInfo)
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/request-service/water-tanked/fixed/time/v1/_update")
    public ResponseEntity<FixedPointDetailsResponse> updateFixedPointDetails(
            @Valid @RequestBody FixedPointDetailsRequest fixedPointDetailsRequest) {

        log.info("FixedPointDetailsController :: updateFixedPointDetails :: Request received");

        ResponseInfo responseInfo = responseInfoFactory
                .createResponseInfoFromRequestInfo(fixedPointDetailsRequest.getRequestInfo(), true);

        FixedPointDetailsResponse response = fixedPointDetailsService
                .updateFixedPointDetails(fixedPointDetailsRequest);

        response.setResponseInfo(responseInfo);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
