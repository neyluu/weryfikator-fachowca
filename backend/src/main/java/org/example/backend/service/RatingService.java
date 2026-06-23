package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.RatingRequest;
import org.example.backend.dto.response.RatingResponse;
import org.example.backend.dto.response.RatingSummaryResponse;
import org.example.backend.entity.Rating;
import org.example.backend.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    public void saveRating(RatingRequest request, Long authorId) {
        Rating rating = Rating.builder()
                .specialistId(request.getSpecialistId())
                .authorId(authorId)
                .score(request.getScore())
                .comment(request.getComment())
                .build();
        ratingRepository.save(rating);
    }

    public RatingSummaryResponse getSpecialistRatingSummary(Long specialistId) {
        Double avg = ratingRepository.getAverageScoreBySpecialistId(specialistId);
        Long count = ratingRepository.countBySpecialistId(specialistId);

        List<RatingResponse> ratings = ratingRepository.findBySpecialistIdOrderByCreatedAtDesc(specialistId)
                .stream()
                .map(r -> RatingResponse.builder()
                        .id(r.getId())
                        .authorId(r.getAuthorId())
                        .score(r.getScore())
                        .comment(r.getComment())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();

        return RatingSummaryResponse.builder()
                .averageScore(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .totalRatings(count != null ? count : 0L)
                .ratings(ratings)
                .build();
    }
}