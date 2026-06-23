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
                .quality(request.getQuality())
                .price(request.getPrice())
                .timeliness(request.getTimeliness())
                .comment(request.getComment())
                .build();
        ratingRepository.save(rating);
    }

    public RatingSummaryResponse getSpecialistRatingSummary(Long specialistId) {
        List<Rating> ratingEntities = ratingRepository.findBySpecialistIdOrderByCreatedAtDesc(specialistId);
        long count = ratingEntities.size();

        double avg = 0.0;
        if (count > 0) {
            double totalSum = ratingEntities.stream()
                    .mapToDouble(r -> (r.getQuality() + r.getPrice() + r.getTimeliness()) / 3.0)
                    .sum();
            avg = totalSum / count;
        }

        List<RatingResponse> ratings = ratingEntities.stream()
                .map(r -> RatingResponse.builder()
                        .id(r.getId())
                        .authorId(r.getAuthorId())
                        .quality(r.getQuality())
                        .price(r.getPrice())
                        .timeliness(r.getTimeliness())
                        .comment(r.getComment())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();

        return RatingSummaryResponse.builder()
                .averageScore(Math.round(avg * 10.0) / 10.0)
                .totalRatings(count)
                .ratings(ratings)
                .build();
    }
}