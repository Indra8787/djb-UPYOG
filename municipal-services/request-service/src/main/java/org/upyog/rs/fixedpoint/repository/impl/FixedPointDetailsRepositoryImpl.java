package org.upyog.rs.fixedpoint.repository.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.upyog.rs.config.RequestServiceConfiguration;
import org.upyog.rs.fixedpoint.repository.FixedPointDetailsRepository;
import org.upyog.rs.fixedpoint.repository.querybuilder.FixedPointTimeTableQueryBuilder;
import org.upyog.rs.fixedpoint.repository.rowMapper.FixedPointRowMapper;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetails;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsRequest;
import org.upyog.rs.fixedpoint.web.model.FixedPointSearchCriteria;
import org.upyog.rs.fixedpoint.web.model.FixedPointTimeTableDetail;
import org.upyog.rs.kafka.Producer;
import org.egov.common.contract.request.RequestInfo;
import org.upyog.rs.repository.rowMapper.GenericRowMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class FixedPointDetailsRepositoryImpl implements FixedPointDetailsRepository {

    @Autowired
    private FixedPointTimeTableQueryBuilder fixedPointTimeTableQueryBuilder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private Producer producer;

    @Autowired
    private FixedPointRowMapper fixedPointRowMapper;


    @Autowired
    private RequestServiceConfiguration config;

    @Override
    public List<FixedPointTimeTableDetail> getDetails(FixedPointSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = fixedPointTimeTableQueryBuilder.getSearchQuery(criteria, preparedStmtList);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), fixedPointRowMapper);
    }

    @Override
    public Integer getCount(FixedPointSearchCriteria criteria) {
        criteria.setCountCall(true);
        List<Object> preparedStmtList = new ArrayList<>();
        String query = fixedPointTimeTableQueryBuilder.getSearchQuery(criteria, preparedStmtList);

        return jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
    }


    @Override
    public void saveFixedPointDetails(List<FixedPointDetails> fixedPointDetailsList, RequestInfo requestInfo) {
        log.info("FixedPointDetailsRepositoryImpl :: saveFixedPointDetails :: Pushing {} records to topic: {}",
                fixedPointDetailsList.size(), fixedPointDetailsList);

        FixedPointDetailsRequest kafkaRequest = FixedPointDetailsRequest.builder()
                .requestInfo(requestInfo)
                .fixedPointDetailsList(fixedPointDetailsList)
                .build();

        producer.push(config.getSaveFixedPointTimeTable(), kafkaRequest);

        log.info("FixedPointDetailsRepositoryImpl :: saveFixedPointDetails :: Successfully pushed to Kafka");
    }

    @Override
    public void updateFixedPointDetails(FixedPointDetails fixedPointDetails, RequestInfo requestInfo) {
        log.info("FixedPointDetailsRepository :: updateFixedPointDetails :: Pushing to Kafka topic: {}", config.getUpdateFixedPointTimeTable());

        FixedPointDetailsRequest request = FixedPointDetailsRequest.builder()
                .requestInfo(requestInfo)
                .fixedPointDetailsList(Collections.singletonList(fixedPointDetails))
                .build();

        producer.push(config.getUpdateFixedPointTimeTable(), request);

        log.info("FixedPointDetailsRepository :: updateFixedPointDetails :: Successfully pushed to Kafka");
    }


}
