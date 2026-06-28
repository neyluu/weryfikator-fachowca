package org.example.backend.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(
    name = "conversations",
    uniqueConstraints = @UniqueConstraint(
        columnNames = { "user1_id", "user2_id" }
    )
)
@Getter
@Setter
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user1_id", nullable = false)
    private Long user1Id;

    @Column(name = "user2_id", nullable = false)
    private Long user2Id;

    @Column(name = "specialist_user_id")
    private Long specialistUserId;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "conversation", fetch = FetchType.LAZY)
    @OrderBy("sentAt ASC")
    private List<Message> messages = new ArrayList<>();
}
