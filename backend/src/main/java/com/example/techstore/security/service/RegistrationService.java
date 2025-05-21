package com.example.techstore.security.service;

import com.example.techstore.dto.request.RegistrationRequest;
import com.example.techstore.dto.response.RegistrationResponse;
import com.example.techstore.entity.User;
import com.example.techstore.helper.VerificationCodeGenerator;
import com.example.techstore.security.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerErrorException;

@Service
public class RegistrationService {
    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleService roleService;

    @Autowired
    private EmailService emailService;

    public RegistrationResponse createUser(RegistrationRequest request) {
        User existing = userDetailRepository.findByEmail(request.getEmail());
        if (existing != null) {
            return RegistrationResponse.builder()
                    .code(400)
                    .message("Email already exist!")
                    .build();
        }
        try{

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhone(request.getPhone());
            user.setIsActive(false);

            String code = VerificationCodeGenerator.generateCode();
            user.setVerificationCode(code);
            user.setRole(roleService.getUserRole());
            userDetailRepository.save(user);

            emailService.sendEmail(user);

            return RegistrationResponse.builder()
                    .code(200)
                    .message("User created!")
                    .build();


        }catch (Exception e){
            System.out.println(e.getMessage());
            throw new ServerErrorException(e.getMessage(), e.getCause());
        }
    }


    public void verifyUser(User user) {
        user.setIsActive(true);
        userDetailRepository.save(user);
    }
}
