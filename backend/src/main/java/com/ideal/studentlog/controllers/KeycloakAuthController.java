package com.ideal.studentlog.controllers;


import com.ideal.studentlog.services.KeycloakRestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(path = "/keycloak", produces = MediaType.APPLICATION_JSON_VALUE)
public class KeycloakAuthController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${keycloak-user-info-uri}")
    private String keycloakUserInfo;

    @Autowired
    private KeycloakRestService keycloakRestService;


    @PostMapping
    public String getToken(String username, String password) {
        return keycloakRestService.login(username,password);
    }
    @GetMapping
    public String getUserInfo(HttpServletRequest httpServletRequest) {

        String token = httpServletRequest.getHeader("Authorization");
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add("Authorization", token);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(null, headers);
        return restTemplate.postForObject(keycloakUserInfo, request, String.class);
    }
}
