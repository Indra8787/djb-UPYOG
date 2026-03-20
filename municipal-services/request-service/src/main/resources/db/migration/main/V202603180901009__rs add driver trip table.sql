
CREATE TABLE IF NOT EXISTS eg_driver_trip (
                                       id varchar(64) DEFAULT gen_random_uuid() NOT NULL,
                                       booking_id varchar(64) NULL,
                                       booking_no varchar(50) NULL,
                                       tenant_id varchar(50) NULL,
                                       tanker_type varchar(20) NULL,
                                       vendor_id varchar(64) NULL,
                                       vehicle_id varchar(64) NULL,
                                       driver_id varchar(64) NULL,
                                       current_status varchar(30) NULL,
                                       start_latitude numeric(10, 7) NULL,
                                       start_longitude numeric(10, 7) NULL,
                                       start_file_store_id varchar(100) NULL,
                                       end_latitude numeric(10, 7) NULL,
                                       end_longitude numeric(10, 7) NULL,
                                       end_file_store_id varchar(100) NULL,
                                       created_by varchar(64) NULL,
                                       created_time int8 NULL,
                                       last_modified_by varchar(64) NULL,
                                       last_modified_time int8 NULL,
                                       remark varchar(255) NULL,
                                       CONSTRAINT eg_driver_trip_pkey PRIMARY KEY (id)
);

ALTER TABLE public.upyog_rs_water_tanker_booking_details_auditdetails
    ADD COLUMN IF NOT EXISTS locality_code varchar(30) NULL,
    ADD COLUMN IF NOT EXISTS wt_file_store_id varchar(256) NULL,
    ADD COLUMN IF NOT EXISTS latitude CHARACTER VARYING(64),
    ADD COLUMN IF NOT EXISTS longitude CHARACTER VARYING(64);


CREATE TABLE IF NOT EXISTS  eg_driver_trip_history (
    history_id varchar(64) NOT NULL,
    booking_no varchar(30) NULL,
    tenant_id varchar(64) NULL,
    vendor_id varchar(64) NULL,
    driver_id varchar(64) NULL,
    vehicle_id varchar(64) NULL,
    completion_time int8 NULL,
    remark varchar(256) NULL,
    start_latitude varchar(64) NULL,
    end_latitude varchar(64) NULL,
    start_longitude varchar(64) NULL,
    end_longitude varchar(64) NULL,
    created_time int8 NULL,
    created_by varchar(64) NULL,
    lastmodifiedby varchar(64) NULL,
    lastmodifiedtime int8 NULL,
     CONSTRAINT eg_driver_trip_history_pkey PRIMARY KEY (history_id)
);
CREATE INDEX IF NOT EXISTS idx_driver_trip_history_driver_id
    ON public.eg_driver_trip_history USING btree (driver_id);