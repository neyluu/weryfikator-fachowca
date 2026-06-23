package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "chat_images")
@Getter
@Setter
public class ChatImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(nullable = false)
    private byte[] data;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private String originalName;

    @CreationTimestamp
    private Instant createdAt;
}
