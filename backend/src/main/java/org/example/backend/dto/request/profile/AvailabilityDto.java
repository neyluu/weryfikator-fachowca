package org.example.backend.dto.request.profile;

import java.time.LocalTime;

public record AvailabilityDto(
        String day,
        LocalTime startTime,
        LocalTime endTime
) {
}