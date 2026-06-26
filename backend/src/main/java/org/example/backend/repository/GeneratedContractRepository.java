package org.example.backend.repository;

import java.util.List;
import org.example.backend.entity.GeneratedContract;
import org.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratedContractRepository
    extends JpaRepository<GeneratedContract, Long>
{
    List<GeneratedContract> findByClientUserOrderByGeneratedAtDesc(User user);

    List<GeneratedContract> findBySpecialistUserOrderByGeneratedAtDesc(
        User user
    );
    
    long countByClientUserIdAndSpecialistUserId(Long clientId, Long specialistId);
}
