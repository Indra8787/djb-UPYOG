package org.upyog.rs.service;

import org.upyog.rs.web.models.fillingpoint.FillingPoint;
import org.upyog.rs.web.models.fillingpoint.FillingPointRequest;
import org.upyog.rs.web.models.fillingpoint.FillingPointSearchCriteria;

import java.util.List;

public interface FillingPointService {

    List<FillingPoint> create(FillingPointRequest request);

    List<FillingPoint> search(FillingPointSearchCriteria criteria);

    List<FillingPoint> update(FillingPointRequest request);
    List<FillingPoint> createFromWaterTankerRequest(FillingPointRequest request); // ← ADD


}
