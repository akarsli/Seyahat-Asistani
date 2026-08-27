package com.holidaytrip.api.repository;

import com.holidaytrip.api.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
    List<Itinerary> findByUserEmailOrderByCreatedAtDesc(String email);
}
