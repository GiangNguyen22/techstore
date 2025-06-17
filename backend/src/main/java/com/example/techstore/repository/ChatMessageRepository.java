package com.example.techstore.repository;

import com.example.techstore.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderOrReceiver(String sender, String receiver);

    @Query("SELECT DISTINCT cm.sender FROM ChatMessage cm WHERE cm.receiver = :adminName AND cm.sender <> :adminName")
    List<String> findUsersChattedWithAdmin(@Param("adminName") String adminName);

    @Query("SELECT cm FROM ChatMessage cm WHERE " +
            "(cm.sender = :user1 AND cm.receiver = :user2) " +
            "OR (cm.sender = :user2 AND cm.receiver = :user1) " +
            "ORDER BY cm.timestamp ASC")
    List<ChatMessage> findChatHistoryBetween(@Param("user1") String user1, @Param("user2") String user2);


}