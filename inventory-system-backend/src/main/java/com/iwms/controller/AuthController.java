package com.iwms.controller;

import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @CrossOrigin(origins="http://localhost:4200")
public class AuthController {
    public record LoginRequest(String username,String password) {}
    public record LoginResponse(boolean authenticated,String username,String message) {}
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        boolean ok = "admin".equals(request.username()) && "admin123".equals(request.password());
        return new LoginResponse(ok, ok ? "admin" : null, ok ? "Login successful" : "Invalid username or password");
    }
}
