package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.RatingRequest;
import org.example.backend.dto.response.RatingResponse;
import org.example.backend.dto.response.RatingSummaryResponse;
import org.example.backend.entity.Rating;
import org.example.backend.entity.RatingImage;
import org.example.backend.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

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
                .images(new ArrayList<>())
                .build();

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            String uploadDir = "C:\\Users\\macie\\OneDrive\\Dokumenty\\GitHub\\weryfikator-fachowca\\frontend\\public\\images\\samples\\";
            
            for (String base64Str : request.getImages()) {
                try {
                    String cleanBase64 = base64Str.contains(",") ? base64Str.split(",")[1] : base64Str;
                    byte[] data = Base64.getDecoder().decode(cleanBase64);
                    
                    String fileName = UUID.randomUUID().toString() + ".jpg";
                    File file = new File(uploadDir + fileName);
                    
                    try (OutputStream stream = new FileOutputStream(file)) {
                        stream.write(data);
                    }

                    RatingImage ratingImage = RatingImage.builder()
                            .url("/images/samples/" + fileName)
                            .rating(rating)
                            .build();
                    
                    rating.getImages().add(ratingImage);
                } catch (Exception e) {
                    System.err.println("Błąd zapisu zdjęcia: " + e.getMessage());
                }
            }
        }

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
                        .images(r.getImages().stream().map(RatingImage::getUrl).toList())
                        .build())
                .toList();

        return RatingSummaryResponse.builder()
                .averageScore(Math.round(avg * 10.0) / 10.0)
                .totalRatings(count)
                .ratings(ratings)
                .build();
    }
}