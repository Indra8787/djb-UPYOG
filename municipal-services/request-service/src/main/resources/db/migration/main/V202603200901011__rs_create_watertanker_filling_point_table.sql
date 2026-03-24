CREATE TABLE IF NOT EXISTS upyog_rs_water_tanker_filling_point (

    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64),

    filling_point_name VARCHAR(128),
    emergency_name VARCHAR(128),

    ee_name VARCHAR(128),
    ee_email VARCHAR(128),
    ee_mobile VARCHAR(20),

    ae_name VARCHAR(128),
    ae_email VARCHAR(128),
    ae_mobile VARCHAR(20),

    je_name VARCHAR(128),
    je_email VARCHAR(128),
    je_mobile VARCHAR(20),  -- ✅ added

    createdby VARCHAR(64),
    lastmodifiedby VARCHAR(64),
    createdtime BIGINT NOT NULL,
    lastmodifiedtime BIGINT
    );