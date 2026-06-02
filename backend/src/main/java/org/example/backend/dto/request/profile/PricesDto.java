package org.example.backend.dto.request.profile;

import jakarta.validation.Valid;

public record PricesDto(
        @Valid PriceDto consultation,
        @Valid PriceDto hourly,
        @Valid PriceDto project
) {
}