package com.ideal.studentlog.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Details can be found
 * https://github.com/edwin/java-keycloak-integration
*/
@Service
public class KeycloakRestService {

    private final String grantType = "password";

    @Autowired
    private RestTemplate restTemplate;

    @Value("${keycloak-token-uri}")
    private String keycloakTokenUri;

    @Value("${keycloak.resource}")
    private String clientId;


    /**
     *  login by using username and password to keycloak, and capturing token on response body
     *
     * @param username
     * @param password
     * @return
     */
    public String login(String username, String password) {

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("username",username);
        map.add("password",password);
        map.add("client_id",clientId);
        map.add("grant_type",grantType);
      //  map.add("client_secret",clientSecret);
     //   map.add("scope",scope);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        return restTemplate.postForObject(keycloakTokenUri, request, String.class);
    }


}