package org.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "generated_contracts")
@Getter
@Setter
@NoArgsConstructor
public class GeneratedContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContractType contractType;

    @Column(name = "pdf_data", columnDefinition = "bytea", nullable = false)
    private byte[] pdfData;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    // Zleceniodawca / Zamawiający
    @Column(nullable = false, length = 10)
    private String ordererType; // PERSON or COMPANY

    private String ordererFullName;
    private String ordererPesel;
    private String ordererIdNumber;
    private String ordererAddress;
    private String ordererCity;
    private String ordererPostalCode;

    private String ordererCompanyName;
    private String ordererNip;
    private String ordererRegon;
    private String ordererKrs;
    private String ordererRepresentativeName;
    private String ordererRepresentativeTitle;

    // Zleceniobiorca / Wykonawca
    @Column(nullable = false)
    private String specialistFullName;

    private String specialistPesel;
    private String specialistIdNumber;
    private String specialistAddress;
    private String specialistCity;
    private String specialistPostalCode;
    private String specialistEmail;
    private String specialistPhone;

    // Szczegóły umowy
    @Column(length = 2000)
    private String subjectDescription;

    private String remunerationAmount;
    private String remunerationAmountWords;
    private String remunerationCurrency;
    private String paymentMethod; // np. PRZELEW, GOTOWKA
    private String startDate; // data rozpoczęcia dzieła / rozpoczęcia zlecenia
    private String completionDeadline; // data zakończenia dzieła / zakończenia zlecenia
    private String paymentDeadline;
    private String contractPlace;
    private String contractDate;
    private Integer numberOfCopies;

    // Klauzule fakultatywne (głównie Umowa o dzieło)
    private Boolean provideMaterials;
    private String materialsDeadline;

    @Column(length = 1000)
    private String materialsDescription;

    private Boolean canDelegate;

    private Boolean hasPenalties;
    private String penaltyAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by_user_id")
    private User generatedByUser;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}
