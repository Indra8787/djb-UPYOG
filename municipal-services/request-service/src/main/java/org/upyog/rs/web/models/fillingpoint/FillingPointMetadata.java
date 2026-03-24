package org.upyog.rs.web.models.fillingpoint;

import lombok.Data;

@Data
public class FillingPointMetadata {
    private String name;           // → filling_point_name + emergency_name
    private String mobileNumber;   // → emergency mobile
    private String emailId;        // → emergency email

    private String jeName;
    private String jeMobileNumber; // ← frontend naming
    private String jeEmailId;

    private String eeName;
    private String eeMobileNumber; // ← frontend naming
    private String eeEmailId;


    private String aeName;
    private String aeMobileNumber;
    private String aeEmailId;

    private String type;
}
