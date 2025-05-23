package com.example.techstore.dto.reponse;

public class SigninResponse {
    private String message;
    private String userName;
    private String role;
    private String token;

    public SigninResponse(String message, String userName, String role, String token) {
        this.message = message;
        this.userName = userName;
        this.role = role;
        this.token = token;

    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

}
