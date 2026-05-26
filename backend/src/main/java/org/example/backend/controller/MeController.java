package org.example.backend.controller;

import org.example.backend.dto.response.AuthResponse;
import org.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/me")
public class MeController {

    private final UserService userService;

    public MeController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/role/specialist")
    public ResponseEntity<AuthResponse> upgradeToSpecialist(
        Authentication auth
    ) {
        return ResponseEntity.ok(
            userService.upgradeToSpecialist(auth.getName())
        );
    }
}
