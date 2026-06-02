package org.example.backend.dto.request.profile;

public record ImageDto(
        String id,
        Object file,
        String url
) {
}