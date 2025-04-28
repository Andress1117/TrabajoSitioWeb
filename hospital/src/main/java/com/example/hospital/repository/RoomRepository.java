package com.example.hospital.repository;

import com.example.hospital.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
    boolean existsByNumber(String number);
}
