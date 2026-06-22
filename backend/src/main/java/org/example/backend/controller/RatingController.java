package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.RatingRequest;
import org.example.backend.dto.response.RatingSummaryResponse;
import org.example.backend.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<Void> addRating(@RequestBody RatingRequest request, Authentication authentication) {
        Long authorId = Long.parseLong(authentication.getName());
        ratingService.saveRating(request, authorId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/specialist/{specialistId}")
    public ResponseEntity<RatingSummaryResponse> getSpecialistRatings(@PathVariable Long specialistId) {
        return ResponseEntity.ok(ratingService.getSpecialistRatingSummary(specialistId));
    }
}