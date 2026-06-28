package org.example.backend.controller;

import jakarta.validation.Valid;
import org.example.backend.dto.request.UpdateAccountRequest;
import org.example.backend.dto.response.AuthResponse;
import org.example.backend.dto.response.UserDto;
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
    public ResponseEntity<AuthResponse> upgradeToSpecialist(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(userService.upgradeToSpecialist(userId));
    }

    @GetMapping("/get")
    public ResponseEntity<UserDto> getSelf(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(new UserDto(userService.getById(userId)));
    }

    @PatchMapping("/update")
    public ResponseEntity<AuthResponse> update(
            @Valid @RequestBody UpdateAccountRequest dto,
            Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(userService.update(userId, dto));
    }
}
