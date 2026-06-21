package org.example.backend.dto.request.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
        @NotNull Long receiverId,
        @NotBlank @Size(max = 2000) String content
) {}