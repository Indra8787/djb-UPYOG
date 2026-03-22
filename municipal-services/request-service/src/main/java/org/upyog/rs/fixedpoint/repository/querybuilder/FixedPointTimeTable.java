package org.upyog.rs.fixedpoint.repository.querybuilder;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FixedPointTimeTable {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean existsByFixedPointCode(String fixedPointCode) {
        String query = "SELECT COUNT(1) FROM eg_fixed_point_time_table WHERE fixed_point_code = ?";
        log.info("FixedPointTimeTable :: existsByFixedPointCode :: Checking for fixedPointCode: {}", fixedPointCode);
        Integer count = jdbcTemplate.queryForObject(query, Integer.class, fixedPointCode);
        return count != null && count > 0;
    }
}
