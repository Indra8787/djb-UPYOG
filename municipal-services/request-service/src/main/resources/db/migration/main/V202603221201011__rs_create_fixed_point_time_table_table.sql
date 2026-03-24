
CREATE TABLE IF NOT EXISTS  eg_fixed_point_time_table (
                                                  system_assigned_schedule_id varchar(50) NOT NULL,
                                                  fixed_point_code varchar(50) NULL,
                                                  "day" varchar(50) NULL,
                                                  trip_no int4 NULL,
                                                  arrival_time_to_fpl varchar(50) NULL,
                                                  departure_time_from_fpl varchar(50) NULL,
                                                  arrival_time_delivery_point varchar(50) NULL,
                                                  departure_time_delivery_point varchar(50) NULL,
                                                  time_of_arriving_back_fpl_after_delivery varchar(50) NULL,
                                                  volume_water_tobe_delivery varchar(50) NULL,
                                                  active bool NULL,
                                                  is_enable bool NULL,
                                                  remarks varchar(255) NULL,
                                                  vehicle_id varchar(50) NULL,
                                                  createdby varchar(64) NULL,
                                                  lastmodifiedby varchar(64) NULL,
                                                  createdtime int8 NULL,
                                                  lastmodifiedtime int8 NULL,
                                                  CONSTRAINT eg_fixed_point_time_table_pkey PRIMARY KEY (system_assigned_schedule_id)
);