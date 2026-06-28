package org.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class RatingResponse {
    private Long id;
    private Long authorId;
    private String authorName;
    private Integer quality;
    private Integer price;
    private Integer timeliness;
    private String comment;
    private LocalDateTime createdAt;
    private List<String> images;
}