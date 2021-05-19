package com.ideal.studentlog.auth;


import com.fasterxml.jackson.core.type.TypeReference;
import com.google.gson.Gson;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {
        Map<String, Object> body = new HashMap<String, Object>();
        body.put("timestamp", new Date());
        body.put("status", HttpStatus.FORBIDDEN.value());
        body.put("error", "Forbidden");
        body.put("message", "Custom Error Message from CustomAccessDeniedHandler");
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.toString());
        new Gson().toJson(body, new TypeReference<Map<String, Object>>() {
        }.getType(), response.getWriter());

      /*  String message = "Custom Error Message from CustomAccessDeniedHandler";
        HttpStatus httpStatus  = HttpStatus.FORBIDDEN;
        ErrorResponse errorResponse = new ErrorResponse(httpStatus,message);
        Gson gson = new GsonBuilder().serializeNulls().create();
        String jsonResponse = gson.toJson(errorResponse);

        response.setStatus(httpStatus.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.toString());
        response.getWriter().write(jsonResponse);*/

    }

}