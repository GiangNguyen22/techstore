package com.example.techstore.controller;

import com.example.techstore.dto.Message;
import com.example.techstore.entity.ChatMessage;
import com.example.techstore.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatMessageRepository chatRepo;

    @MessageMapping("/private-message")
    public void recMessage(@Payload Message message) {

        ChatMessage saved = new ChatMessage();
        saved.setSender(message.getSenderName());
        saved.setReceiver(message.getReceiverName());
        saved.setMessage(message.getMessage());
        saved.setTimestamp(new Timestamp(System.currentTimeMillis()));
//        chatRepo.save(saved);
        saved = chatRepo.save(saved);
        Message response = new Message();
        response.setSenderName(saved.getSender());
        response.setReceiverName(saved.getReceiver());
        response.setMessage(saved.getMessage());
        response.setTimestamp(saved.getTimestamp().toInstant().toString());

        simpMessagingTemplate.convertAndSendToUser(
                response.getReceiverName(),
                "/private",  // full destination: /user/{receiver}/private
                response
        );

        simpMessagingTemplate.convertAndSendToUser(
                response.getSenderName(),
                "/private",
                response
        );
        System.out.println("Sent to " + message.getReceiverName() + ": " + message.getMessage());

    }
}