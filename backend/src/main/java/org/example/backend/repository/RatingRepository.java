package org.example.backend.repository;

import org.example.backend.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findBySpecialistIdOrderByCreatedAtDesc(Long specialistId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.specialistId = :specialistId")
    Double getAverageScoreBySpecialistId(@Param("specialistId") Long specialistId);

    Long countBySpecialistId(Long specialistId);
}