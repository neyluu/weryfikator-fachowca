package org.example.backend.dto.request.contract;

import jakarta.validation.constraints.NotBlank;

public record GenerateContractRequest(
    @NotBlank String contractType,
    @NotBlank String ordererType,

    // Dane Zleceniodawcy jako Osoba Fizyczna
    String ordererFullName,
    String ordererPesel,
    String ordererIdNumber,
    String ordererAddress,
    String ordererCity,
    String ordererPostalCode,

    // Dane Zleceniodawcy jako Firma
    String ordererCompanyName,
    String ordererNip,
    String ordererRegon,
    String ordererKrs,
    String ordererRepresentativeName,
    String ordererRepresentativeTitle,

    // Dane Fachowca (Zleceniobiorca / Wykonawca)
    @NotBlank String specialistFullName,
    String specialistPesel,
    String specialistIdNumber,
    String specialistAddress,
    String specialistCity,
    String specialistPostalCode,
    String specialistEmail,
    String specialistPhone,

    // Szczegóły umowy
    String subjectDescription,
    String remunerationAmount,
    String remunerationAmountWords,
    String remunerationCurrency,
    String paymentMethod,
    String startDate,
    String completionDeadline,
    String paymentDeadline,
    String contractPlace,
    String contractDate,
    Integer numberOfCopies,

    // Pola fakultatywne z formularza frontendu
    Boolean provideMaterials,
    String materialsDeadline,
    String materialsDescription,
    Boolean canDelegate,
    Boolean hasPenalties,
    String penaltyAmount
) {}
