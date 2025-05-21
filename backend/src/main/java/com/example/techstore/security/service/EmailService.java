package com.example.techstore.security.service;

import com.example.techstore.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public String sendEmail(User user) {
        String subject = "Verify your email";
        String senderName = "Tech Store";
        String mailContent = "Hi, " + user.getUsername() + ",\n";
        mailContent += "Your verification code is: " + user.getVerificationCode() + "\n";
        mailContent += "Please enter this code to verify your email.";
        mailContent +="\n";
        mailContent+= senderName;

        try{
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject(subject);
            mailMessage.setText(mailContent);
            javaMailSender.send(mailMessage);
        }catch (Exception e){
            return "Error while sending email";
        }
        return "Email sent";
    }
}
