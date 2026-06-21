package org.example.backend.dto.response.contract;

import java.time.LocalDateTime;
import org.example.backend.entity.ContractType;
import org.example.backend.entity.GeneratedContract;

public record ContractSummaryDto(
    Long id,
    ContractType contractType,
    String ordererDisplayName,
    String specialistFullName,
    LocalDateTime generatedAt
) {
    public static ContractSummaryDto of(GeneratedContract contract) {
        String ordererDisplayName = "COMPANY".equals(contract.getOrdererType())
            ? contract.getOrdererCompanyName()
            : contract.getOrdererFullName();

        return new ContractSummaryDto(
            contract.getId(),
            contract.getContractType(),
            ordererDisplayName,
            contract.getSpecialistFullName(),
            contract.getGeneratedAt()
        );
    }
}
