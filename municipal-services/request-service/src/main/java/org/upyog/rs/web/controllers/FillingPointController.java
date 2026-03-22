package org.upyog.rs.web.controllers;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.upyog.rs.service.FillingPointService;
import org.upyog.rs.util.ResponseInfoFactory;
import org.upyog.rs.web.models.fillingpoint.*;

import java.util.List;

@RestController
@RequestMapping("/wt/filling-point")
public class FillingPointController {

    @Autowired
    private FillingPointService service;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @PostMapping("/_create")
    public ResponseEntity<FillingPointResponse> create(
            @RequestBody FillingPointRequest request) {

        List<FillingPoint> result;

        // Frontend water tanker flow
        if (request.getWaterTankerBookingDetail() != null) {
            result = service.createFromWaterTankerRequest(request);
        } else {
            // Direct API call
            result = service.create(request);
        }

        ResponseInfo responseInfo = responseInfoFactory
                .createResponseInfoFromRequestInfo(request.getRequestInfo(), true);

        return ResponseEntity.ok(new FillingPointResponse(responseInfo, result));
    }

    @PostMapping("/_search")
    public ResponseEntity<FillingPointResponse> search(
            @RequestBody FillingPointSearchRequest request) {

        List<FillingPoint> result = service.search(request.getCriteria());

        ResponseInfo responseInfo = responseInfoFactory
                .createResponseInfoFromRequestInfo(request.getRequestInfo(), true);

        return ResponseEntity.ok(new FillingPointResponse(responseInfo, result));
    }

    @PostMapping("/_update")
    public ResponseEntity<FillingPointResponse> update(
            @RequestBody FillingPointRequest request) {

        List<FillingPoint> result = service.update(request);

        ResponseInfo responseInfo = responseInfoFactory
                .createResponseInfoFromRequestInfo(request.getRequestInfo(), true);

        return ResponseEntity.ok(
                new FillingPointResponse(responseInfo, result)
        );
    }
}
