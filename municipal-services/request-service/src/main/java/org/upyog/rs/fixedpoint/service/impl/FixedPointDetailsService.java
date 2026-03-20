package org.upyog.rs.fixedpoint.service;

import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsRequest;
import org.upyog.rs.fixedpoint.web.model.FixedPointDetailsResponse;

public interface FixedPointDetailsService {

    FixedPointDetailsResponse saveFixedPointDetails(FixedPointDetailsRequest fixedPointDetailsRequest);
}
