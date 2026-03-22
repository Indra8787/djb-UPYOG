package org.upyog.rs.fixedpoint.repository.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.upyog.rs.config.RequestServiceConfiguration;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetails;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsRequest;
import org.upyog.rs.kafka.Producer;
import org.egov.common.contract.request.RequestInfo;

import java.util.List;

@Slf4j
@Service
public class FixedPointDetailsRepositoryImpl implements FixedPointDetailsRepository {


    @Autowired
    private Producer producer;

    @Autowired
    private RequestServiceConfiguration config;

    @Override
    public void saveFixedPointDetails(List<FixedPointDetails> fixedPointDetailsList, RequestInfo requestInfo) {
        log.info("FixedPointDetailsRepositoryImpl :: saveFixedPointDetails :: Pushing {} records to topic: {}",
                fixedPointDetailsList.size(), fixedPointDetailsList);

        // UPYOG persister expects a Request wrapper on the Kafka topic
        FixedPointDetailsRequest kafkaRequest = FixedPointDetailsRequest.builder()
                .requestInfo(requestInfo)
                .fixedPointDetailsList(fixedPointDetailsList)
                .build();

        producer.push(config.getSaveFixedPointTimeTable(), kafkaRequest);

        log.info("FixedPointDetailsRepositoryImpl :: saveFixedPointDetails :: Successfully pushed to Kafka");
    }

}
