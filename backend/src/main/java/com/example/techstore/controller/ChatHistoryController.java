package com.example.techstore.controller;

import com.example.techstore.entity.ChatMessage;
import com.example.techstore.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatRepo;

    @GetMapping("/history/{username}")
    public List<ChatMessage> getMessagesForUser(@PathVariable String username) {
        return chatRepo.findBySenderOrReceiver(username, username);
    }


    @GetMapping("/users-chatted-with-admin")
    public List<String> getUsersChattedWithAdmin() {
        return chatRepo.findUsersChattedWithAdmin("admin");
    }

    @GetMapping("/history/{user1}/{user2}")
    public List<ChatMessage> getChatHistoryBetween(@PathVariable String user1, @PathVariable String user2) {
        return chatRepo.findChatHistoryBetween(user1, user2);
    }


}