package org.example.backend.dto.response;

import org.example.backend.entity.Profile;

public record SearchProfileDto(
        Long id,
        String firstName,
        String lastName,
        String specialization,
        String description,
        String experience,
        String city,
        String voivodeship,
        PricesPayload prices
) {
    public record PriceRangePayload(double min, double max) {}
    public record PriceEntryPayload(boolean enabled, PriceRangePayload value) {}
    public record PricesPayload(
            PriceEntryPayload consultation,
            PriceEntryPayload hourly,
            PriceEntryPayload project
    ) {}

    public static SearchProfileDto of(Profile p) {
        String firstName = "";
        String lastName  = "";

        if (p.getUser() != null) {
            String fullName = p.getUser().getFullName();
            if (fullName != null && !fullName.isBlank()) {
                int space = fullName.indexOf(' ');
                if (space > 0) {
                    firstName = fullName.substring(0, space);
                    lastName  = fullName.substring(space + 1);
                } else {
                    firstName = fullName;
                }
            }
        }

        String city = "";
        String voivodeship = "";
        if (p.getLocalization() != null) {
            city = p.getLocalization().getCity() != null ? p.getLocalization().getCity() : "";
            voivodeship = p.getLocalization().getVoivodeship() != null ? p.getLocalization().getVoivodeship() : "";
        }

        var prices = new PricesPayload(
                new PriceEntryPayload(
                        Boolean.TRUE.equals(p.getConsultationEnabled()),
                        p.getConsultationPrice() != null
                                ? new PriceRangePayload(p.getConsultationPrice().getMin(), p.getConsultationPrice().getMax())
                                : new PriceRangePayload(0, 0)
                ),
                new PriceEntryPayload(
                        Boolean.TRUE.equals(p.getHourlyEnabled()),
                        p.getHourlyPrice() != null
                                ? new PriceRangePayload(p.getHourlyPrice().getMin(), p.getHourlyPrice().getMax())
                                : new PriceRangePayload(0, 0)
                ),
                new PriceEntryPayload(
                        Boolean.TRUE.equals(p.getProjectEnabled()),
                        p.getProjectPrice() != null
                                ? new PriceRangePayload(p.getProjectPrice().getMin(), p.getProjectPrice().getMax())
                                : new PriceRangePayload(0, 0)
                )
        );

        return new SearchProfileDto(
                p.getId(),
                firstName,
                lastName,
                p.getSpecialization(),
                p.getDescription(),
                p.getExperience(),
                city,
                voivodeship,
                prices
        );
    }
}