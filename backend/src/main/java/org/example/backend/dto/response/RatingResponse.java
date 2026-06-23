package org.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class RatingResponse {
    private Long id;
    private Long authorId;
    private Integer score;
    private String comment;
    private LocalDateTime createdAt;
}