package org.example.backend.repository;

import org.example.backend.entity.ChatImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatImageRepository
        extends JpaRepository<ChatImage, Long> {
}