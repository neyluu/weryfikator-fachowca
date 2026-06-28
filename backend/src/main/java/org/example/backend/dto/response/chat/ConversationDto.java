package org.example.backend.dto.response.chat;

import java.time.Instant;
import org.example.backend.dto.request.profile.ImageDto;
import org.example.backend.dto.request.profile.LocalizationDto;

public record ConversationDto(
    Long id,
    Long otherUserId,
    Long specialistUserId,
    MessageDto lastMessage,
    String fullName,
    String email,
    String specialization,
    LocalizationDto localization,
    ImageDto profilePicture,
    Instant createdAt
) {}
