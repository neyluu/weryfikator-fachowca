package org.example.backend.repository;

import java.util.List;
import java.util.Optional;
import org.example.backend.entity.Profile;
import org.example.backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);

    @Query(
        """
            SELECT DISTINCT p FROM Profile p
            WHERE
                (:service IS NULL OR :service = '' OR
                    LOWER(p.specialization) LIKE LOWER(CONCAT('%', :service, '%')) OR
                    EXISTS (SELECT c FROM p.categories c WHERE LOWER(c) LIKE LOWER(CONCAT('%', :service, '%')))
                )
                AND
                (:city IS NULL OR :city = '' OR
                    LOWER(p.localization.city) LIKE LOWER(CONCAT('%', :city, '%'))
                )
        """
    )
    List<Profile> search(
        @Param("service") String service,
        @Param("city") String city
    );

    List<Profile> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
