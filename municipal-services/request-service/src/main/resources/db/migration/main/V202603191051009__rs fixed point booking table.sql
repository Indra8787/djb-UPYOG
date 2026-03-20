
CREATE TABLE IF NOT EXISTS eg_fixed_point_booking_details (
    system_assigned_schedule_id VARCHAR(50) PRIMARY KEY NOT NULL,
    fixed_point_code VARCHAR(50),
    day VARCHAR(50),
    trip_no INT,
    arrival_time_to_fpl VARCHAR(50),
    departure_time_from_fpl VARCHAR(50),
    arrival_time_delivery_point VARCHAR(50),
    departure_time_delivery_point VARCHAR(50),
    time_of_arriving_back_fplafterdelivery VARCHAR(50),
    volume_water_tobe_delivery VARCHAR(50),
    remarks VARCHAR(150),
    vehicle_id VARCHAR(50),
    active BOOLEAN,
    is_enable BOOLEAN,
    createdby VARCHAR(64),
    lastmodifiedby VARCHAR(64),
    createdtime BIGINT,
    lastmodifiedtime BIGINT
);