package org.egov.vendor.util;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.repository.ServiceRequestRepository;
import org.egov.vendor.web.model.idgen.IdGenerationRequest;
import org.egov.vendor.web.model.idgen.IdGenerationResponse;
import org.egov.vendor.web.model.idgen.IdRequest;
import org.egov.vendor.web.model.idgen.IdResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class IdgenUtil {

    @Value("${egov.idgen.host}")
    private String idGenHost;

    @Value("${egov.idgen.path}")
    private String idGenPath;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository restRepo;

    public List<String> getIdList(RequestInfo requestInfo, String tenantId,
            String idName, String idformat,
            Integer count) {
        List<IdRequest> reqList = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            reqList.add(IdRequest.builder().idName(idName).format(idformat).tenantId(tenantId).build());
        }

        IdGenerationRequest idGenerationRequest = IdGenerationRequest.builder()
                .requestInfo(requestInfo)
                .idRequests(reqList)
                .build();

        StringBuilder uri = new StringBuilder(idGenHost).append(idGenPath);
        IdGenerationResponse response = mapper.convertValue(
                restRepo.fetchResult(uri, idGenerationRequest),
                IdGenerationResponse.class);

        List<IdResponse> idResponses = response.getIdResponses();

        if (CollectionUtils.isEmpty(idResponses)) {
            log.info("No IDs returned from IDGEN. TenantId: {}, idName: {}, format: {}", tenantId, idName, idformat);
            throw new CustomException("IDGEN ERROR", "No ids returned from idgen Service");
        }
        return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
    }
}