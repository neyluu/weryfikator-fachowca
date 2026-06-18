package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.chat.SendMessageRequest;
import org.example.backend.dto.request.profile.ImageDto;
import org.example.backend.dto.request.profile.LocalizationDto;
import org.example.backend.dto.response.chat.ConversationDto;
import org.example.backend.dto.response.chat.MessageDto;
import org.example.backend.dto.response.chat.PagedMessagesDto;
import org.example.backend.entity.*;
import org.example.backend.repository.ProfileRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.ChatService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendMessage(
            @Valid @RequestBody SendMessageRequest req,
            @AuthenticationPrincipal Long senderId) {

        Message msg = chatService.sendMessage(senderId, req.receiverId(), req.content());
        return ResponseEntity.status(201).body(toMessageDTO(msg));
    }

    @GetMapping("/conversations")
    @Transactional(readOnly = true)
    public List<ConversationDto> getConversations(
            @AuthenticationPrincipal Long userId) {

        return chatService.getConversations(userId).stream()
                .map(c -> toConversationDTO(c, userId))
                .toList();
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public PagedMessagesDto getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        Page<Message> result = chatService.getMessages(conversationId, page, size);
        return new PagedMessagesDto(
                result.getContent().stream().map(this::toMessageDTO).toList(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.hasNext()
        );
    }

    private MessageDto toMessageDTO(Message m) {
        return new MessageDto(
                m.getId(),
                m.getConversation().getId(),
                m.getSenderId(),
                m.getContent(),
                m.getSentAt(),
                m.getReadAt()
        );
    }

    private ConversationDto toConversationDTO(Conversation c, Long currentUserId) {
        Long otherUserId = c.getUser1Id().equals(currentUserId)
                ? c.getUser2Id()
                : c.getUser1Id();

        MessageDto last = c.getMessages().isEmpty() ? null
                : toMessageDTO(c.getMessages().get(c.getMessages().size() - 1));

        User user = userRepository.getReferenceById(otherUserId);
        Optional<Profile> profileRes = profileRepository.findByUser(user);

        if(profileRes.isPresent())
        {
            Profile profile = profileRes.get();

            return new ConversationDto(
                    c.getId(),
                    otherUserId,
                    last,
                    user.getFullName(),
                    user.getEmail(),
                    profile.getSpecialization(),
                    new LocalizationDto(
                        profile.getLocalization().getCity(),
                        profile.getLocalization().getVoivodeship()
                    ),
                    mapProfileImage(profile.getProfilePicture()),
                    c.getCreatedAt()
            );
        }

        return new ConversationDto(
                c.getId(),
                otherUserId,
                last,
                user.getFullName(),
                user.getEmail(),
                "Brak danych",
                new LocalizationDto(
                        "Brak",
                        " danych"
                ),
                null,
                c.getCreatedAt()
        );
    }

    private static ImageDto mapProfileImage(ProfileImage image) {
        if (image == null) return null;

        String base64 = java.util.Base64.getEncoder().encodeToString(image.getData());
        String url =  "data:image/" + image.getFileExtension() + ";base64," + base64;

        return new ImageDto(image.getId().toString(), null, url);
    }
}