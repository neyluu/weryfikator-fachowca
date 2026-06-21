package org.example.backend.dto.request.profile;

public record ExperienceEntryDto(
    String title,
    String description,
    String type,
    Integer startMonth,
    Integer startYear,
    Integer endMonth,
    Integer endYear
) {}
