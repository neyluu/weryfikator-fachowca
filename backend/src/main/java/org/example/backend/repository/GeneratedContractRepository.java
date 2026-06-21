package org.example.backend.repository;

import java.util.List;
import java.util.Optional;
import org.example.backend.entity.GeneratedContract;
import org.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratedContractRepository
    extends JpaRepository<GeneratedContract, Long>
{
    List<GeneratedContract> findByGeneratedByUserOrderByGeneratedAtDesc(
        User user
    );
    Optional<GeneratedContract> findByIdAndGeneratedByUser(Long id, User user);
}
