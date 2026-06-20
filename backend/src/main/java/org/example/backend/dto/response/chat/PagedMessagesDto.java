package org.example.backend.dto.response.chat;

import java.util.List;

public record PagedMessagesDto(
        List<MessageDto> messages,
        int currentPage,
        int totalPages,
        long totalElements,
        boolean hasNext
) {}
