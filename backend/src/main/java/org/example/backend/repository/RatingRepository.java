package org.example.backend.repository;

import org.example.backend.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findBySpecialistIdOrderByCreatedAtDesc(Long specialistId);

    Long countBySpecialistId(Long specialistId);
}