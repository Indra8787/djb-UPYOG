package org.upyog.rs.fixedpoint.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.upyog.rs.fixedpoint.service.FixedPointDetailsService;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsRequest;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsResponse;
import org.upyog.rs.util.ResponseInfoFactory;

import javax.validation.Valid;

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

}
