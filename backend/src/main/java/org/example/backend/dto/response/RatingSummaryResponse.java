package org.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class RatingSummaryResponse {
    private Double averageScore;
    private Long totalRatings;
    private List<RatingResponse> ratings;
}