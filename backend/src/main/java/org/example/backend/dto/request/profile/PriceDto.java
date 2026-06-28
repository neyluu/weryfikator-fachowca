package org.example.backend.dto.request.profile;

public record PriceDto(
        Boolean enabled,
        ValueDto value
) {
}
