package org.example.backend.service;

import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Conversation;
import org.example.backend.entity.Message;
import org.example.backend.repository.ConversationRepository;
import org.example.backend.repository.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;

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
