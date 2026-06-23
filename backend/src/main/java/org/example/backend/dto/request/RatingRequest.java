package org.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingRequest {
    private Long specialistId;
    private Integer quality;
    private Integer price;
    private Integer timeliness;
    private String comment;
}