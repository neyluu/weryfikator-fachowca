package org.example.backend.dto.response.chat;

import org.example.backend.dto.request.profile.ImageDto;
import org.example.backend.dto.request.profile.LocalizationDto;

import java.time.Instant;

public record ConversationDto(
        Long id,
        Long otherUserId,
        MessageDto lastMessage,
        String fullName,
        String specialization,
        LocalizationDto localization,
        ImageDto profilePicture,
        Instant createdAt
) {}
