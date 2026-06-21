package org.example.backend.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.contract.GenerateContractRequest;
import org.example.backend.dto.response.contract.ContractSummaryDto;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.ContractService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/specialist/contract")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;
    private final UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generate(
        @Valid @RequestBody GenerateContractRequest request,
        Authentication authentication
    ) {
        User currentUser = resolveUser(authentication);
        Long contractId = contractService.generateAndSave(request, currentUser);
        return ResponseEntity.ok(Map.of("id", contractId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(
        @PathVariable Long id,
        Authentication authentication
    ) {
        User currentUser = resolveUser(authentication);
        byte[] pdfBytes = contractService.getPdfBytes(id, currentUser);

        return ResponseEntity.ok()
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"umowa_" + id + ".pdf\""
            )
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfBytes);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ContractSummaryDto>> myContracts(
        Authentication authentication
    ) {
        User currentUser = resolveUser(authentication);
        return ResponseEntity.ok(contractService.getMyContracts(currentUser));
    }

    private User resolveUser(Authentication authentication) {
        return userRepository
            .findByEmail(authentication.getName())
            .orElseThrow();
    }
}
