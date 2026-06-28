package org.example.backend.service;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.response.chat.UploadedImageDto;
import org.example.backend.entity.ChatImage;
import org.example.backend.entity.Conversation;
import org.example.backend.entity.Message;
import org.example.backend.repository.ChatImageRepository;
import org.example.backend.repository.ConversationRepository;
import org.example.backend.repository.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;
    private final ChatImageRepository imageRepository;

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        Conversation conversation = getOrCreate(senderId, receiverId);
        Message message = new Message();
        message.setConversation(conversation);
        message.setSenderId(senderId);
        message.setContent(content);
        return messageRepo.save(message);
    }

    public List<Conversation> getConversations(Long userId) {
        return conversationRepo.findAllByUserId(userId);
    }

    public Page<Message> getMessages(Long conversationId, int page, int size) {
        return messageRepo.findByConversationId(
            conversationId,
            PageRequest.of(page, size, Sort.by("sentAt").descending())
        );
    }

    public List<UploadedImageDto> uploadImages(
            List<MultipartFile> files
    ) throws IOException {

        List<UploadedImageDto> result = new ArrayList<>();

        for (MultipartFile file : files) {

            ChatImage image = new ChatImage();

            image.setData(file.getBytes());
            image.setContentType(file.getContentType());
            image.setOriginalName(file.getOriginalFilename());

            image = imageRepository.save(image);

            result.add(
                    new UploadedImageDto(
                            image.getId(),
                            "/chat/images/" + image.getId()
                    )
            );
        }

        return result;
    }

    private Conversation getOrCreate(Long senderId, Long receiverId) {
        long u1 = Math.min(senderId, receiverId);
        long u2 = Math.max(senderId, receiverId);
        return conversationRepo
            .findByUser1IdAndUser2Id(u1, u2)
            .orElseGet(() -> {
                Conversation c = new Conversation();
                c.setUser1Id(u1);
                c.setUser2Id(u2);
                c.setSpecialistUserId(receiverId);
                return conversationRepo.save(c);
            });
    }
}
