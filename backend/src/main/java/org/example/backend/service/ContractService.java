package org.example.backend.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.contract.GenerateContractRequest;
import org.example.backend.dto.response.contract.ContractSummaryDto;
import org.example.backend.entity.ContractType;
import org.example.backend.entity.GeneratedContract;
import org.example.backend.entity.User;
import org.example.backend.repository.GeneratedContractRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractPdfService contractPdfService;
    private final GeneratedContractRepository contractRepository;

    @Transactional
    public Long generateAndSave(
        GenerateContractRequest request,
        User generatedByUser
    ) {
        ContractType contractType = parseContractType(request.contractType());

        byte[] pdfBytes = contractPdfService.generate(request, contractType);

        GeneratedContract contract = new GeneratedContract();
        contract.setContractType(contractType);
        contract.setPdfData(pdfBytes);
        contract.setGeneratedByUser(generatedByUser);

        // Mapowanie Zleceniodawcy
        contract.setOrdererType(request.ordererType());
        contract.setOrdererFullName(request.ordererFullName());
        contract.setOrdererPesel(request.ordererPesel());
        contract.setOrdererIdNumber(request.ordererIdNumber());
        contract.setOrdererAddress(request.ordererAddress());
        contract.setOrdererCity(request.ordererCity());
        contract.setOrdererPostalCode(request.ordererPostalCode());
        contract.setOrdererCompanyName(request.ordererCompanyName());
        contract.setOrdererNip(request.ordererNip());
        contract.setOrdererRegon(request.ordererRegon());
        contract.setOrdererKrs(request.ordererKrs());
        contract.setOrdererRepresentativeName(
            request.ordererRepresentativeName()
        );
        contract.setOrdererRepresentativeTitle(
            request.ordererRepresentativeTitle()
        );

        // Mapowanie Fachowca
        contract.setSpecialistFullName(request.specialistFullName());
        contract.setSpecialistPesel(request.specialistPesel());
        contract.setSpecialistIdNumber(request.specialistIdNumber());
        contract.setSpecialistAddress(request.specialistAddress());
        contract.setSpecialistCity(request.specialistCity());
        contract.setSpecialistPostalCode(request.specialistPostalCode());
        contract.setSpecialistEmail(request.specialistEmail());
        contract.setSpecialistPhone(request.specialistPhone());

        // Mapowanie parametrów umowy i nowych pól z szablonów
        contract.setSubjectDescription(request.subjectDescription());
        contract.setRemunerationAmount(request.remunerationAmount());
        contract.setRemunerationAmountWords(request.remunerationAmountWords());
        contract.setRemunerationCurrency(request.remunerationCurrency());
        contract.setPaymentMethod(request.paymentMethod());
        contract.setStartDate(request.startDate());
        contract.setCompletionDeadline(request.completionDeadline());
        contract.setPaymentDeadline(request.paymentDeadline());
        contract.setContractPlace(request.contractPlace());
        contract.setContractDate(request.contractDate());
        contract.setNumberOfCopies(request.numberOfCopies());

        // Mapowanie opcjonalnych klauzul
        contract.setProvideMaterials(request.provideMaterials());
        contract.setMaterialsDeadline(request.materialsDeadline());
        contract.setMaterialsDescription(request.materialsDescription());
        contract.setCanDelegate(request.canDelegate());
        contract.setHasPenalties(request.hasPenalties());
        contract.setPenaltyAmount(request.penaltyAmount());

        return contractRepository.save(contract).getId();
    }

    @Transactional(readOnly = true)
    public byte[] getPdfBytes(Long contractId, User requestingUser) {
        GeneratedContract contract = contractRepository
            .findByIdAndGeneratedByUser(contractId, requestingUser)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Umowa nie została znaleziona"
                )
            );

        return contract.getPdfData();
    }

    @Transactional(readOnly = true)
    public List<ContractSummaryDto> getMyContracts(User user) {
        return contractRepository
            .findByGeneratedByUserOrderByGeneratedAtDesc(user)
            .stream()
            .map(ContractSummaryDto::of)
            .toList();
    }

    private ContractType parseContractType(String contractType) {
        try {
            return ContractType.valueOf(contractType);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Nieprawidłowy typ umowy: " + contractType
            );
        }
    }
}
