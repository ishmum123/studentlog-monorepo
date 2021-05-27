/*
 * Copyright 2021 NetKnights GmbH - micha.preusser@netknights.it
 * nils.behlen@netknights.it
 * - Modified
 *
 * Based on original code:
 *
 * Copyright 2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.privacyidea.authenticator;

import org.jboss.logging.Logger;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import static org.privacyidea.authenticator.Const.*;

public class PrivacyIDEAAuthenticator implements org.keycloak.authentication.Authenticator {

    private final Logger logger = Logger.getLogger(PrivacyIDEAAuthenticator.class);

    private Configuration config;
    private Map<String, String> userOTPMap;

    /**
     * This function will be called when the authentication flow triggers the privacyIDEA execution.
     * i.e. after the username + password have been submitted.
     *
     * @param context AuthenticationFlowContext
     */
    @Override
    public void authenticate(AuthenticationFlowContext context) {
        config = new Configuration(context.getAuthenticatorConfig().getConfig());

        if (userOTPMap == null) {
            userOTPMap = new HashMap<>();
        }

        String otp = getOTP();

        System.out.println(otp);

        UserModel user = context.getUser();

        userOTPMap.put(user.getUsername(), otp);

        /* System.out.println("PHONE_NUMBER: " + user.getAttribute("PHONE"));
        System.out.println("SMS_GATEWAY: " + config.getServerURL());

        //Get properties object
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class",
                "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "465");
        //get Session
        Session session = Session.getDefaultInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication("ishmumkhan@gmail.com",
                                "");
                    }
                });
        //compose message
        try {
            MimeMessage message = new MimeMessage(session);
            message.addRecipient(Message.RecipientType.TO,new InternetAddress(user.getEmail()));
            message.setSubject("OTP");
            message.setText(otp);
            //send message
            Transport.send(message);
            System.out.println("message sent successfully");
        } catch (MessagingException e) {throw new RuntimeException(e);}*/

        Response responseForm = context.form()
                .setAttribute(FORM_POLL_INTERVAL, config.getPollingInterval().get(0))
                .setAttribute(FORM_TOKEN_ENROLLMENT_QR, "")
                .setAttribute(FORM_MODE, "otp")
                .setAttribute(FORM_PUSH_AVAILABLE, false)
                .setAttribute(FORM_OTP_AVAILABLE, true)
                .setAttribute(FORM_PUSH_MESSAGE, "en")
                .setAttribute(FORM_OTP_MESSAGE, "Please enter your One-Time-Password!")
                .setAttribute(FORM_WEBAUTHN_SIGN_REQUEST, "")
                .setAttribute(FORM_UI_LANGUAGE, "en")
                .createForm(FORM_FILE_NAME);

        context.challenge(responseForm);
    }

    private String getOTP() {
        int i = new Random().nextInt(9999);
        while (i < 1000) i *= 10;
        return String.valueOf(i);
    }

    /**
     * This function will be called when our form is submitted.
     *
     * @param context AuthenticationFlowContext
     */
    @Override
    public void action(AuthenticationFlowContext context) {
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();

        String otp = formData.getFirst(FORM_OTP);

        if (userOTPMap.get(context.getUser().getUsername()).equals(otp))
            context.success();

//        else context.failure();

        /* MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        if (formData.containsKey("cancel")) {
            context.cancelLogin();
            return;
        }
        LoginFormsProvider form = context.form();

        //logger.info("formData:");
        //formData.forEach((k, v) -> logger.info("key=" + k + ", value=" + v));

        // Get data from form
        String tokenEnrollmentQR = formData.getFirst(FORM_TOKEN_ENROLLMENT_QR);
        String currentMode = formData.getFirst(FORM_MODE);
        boolean pushToken = TRUE.equals(formData.getFirst(FORM_PUSH_AVAILABLE));
        boolean otpToken = TRUE.equals(formData.getFirst(FORM_OTP_AVAILABLE));
        String pushMessage = formData.getFirst(FORM_PUSH_MESSAGE);
        String otpMessage = formData.getFirst(FORM_OTP_MESSAGE);
        String tokenTypeChanged = formData.getFirst(FORM_MODE_CHANGED);
        String uiLanguage = formData.getFirst(FORM_UI_LANGUAGE);
        String transactionID = context.getAuthenticationSession().getAuthNote(AUTH_NOTE_TRANSACTION_ID);
        String currentUserName = context.getUser().getUsername();

        // Reuse the accept language for any requests made in this step
        String acceptLanguage = context.getAuthenticationSession().getAuthNote(AUTH_NOTE_ACCEPT_LANGUAGE);
        Map<String, String> languageHeader = Collections.singletonMap(HEADER_ACCEPT_LANGUAGE, acceptLanguage);

        String webAuthnSignRequest = formData.getFirst(FORM_WEBAUTHN_SIGN_REQUEST);
        String webAuthnSignResponse = formData.getFirst(FORM_WEBAUTHN_SIGN_RESPONSE);
        // The origin is set by the form every time, no need to put it in the form again
        String origin = formData.getFirst(FORM_WEBAUTHN_ORIGIN);

        // Prepare the failure message, the message from privacyIDEA will be appended if possible
        String authenticationFailureMessage = "Authentication failed.";

        // Set the "old" values again
        form.setAttribute(FORM_TOKEN_ENROLLMENT_QR, tokenEnrollmentQR)
                .setAttribute(FORM_MODE, currentMode)
                .setAttribute(FORM_PUSH_AVAILABLE, pushToken)
                .setAttribute(FORM_OTP_AVAILABLE, otpToken)
                .setAttribute(FORM_WEBAUTHN_SIGN_REQUEST, webAuthnSignRequest)
                .setAttribute(FORM_UI_LANGUAGE, uiLanguage);

        boolean didTrigger = false; // To not show the error message if something was triggered
        PIResponse response;

        String otp = formData.getFirst(FORM_OTP);
        // If the transaction id is not present, it will be not be added in validateCheck, so no need to check here
        response = privacyIDEA.validateCheck(currentUserName, otp, transactionID, languageHeader);

        // Evaluate the response
        if (response != null) {
            // On success we finish our execution
            if (response.getValue()) {
                context.success();
                return;
            }

            // If the authentication was not successful (yet), either the provided data was wrong
            // or another challenge was triggered
            if (!response.getMultiChallenge().isEmpty()) {
                // A challenge was triggered, display its message and save the transaction id in the session
                otpMessage = response.getMessage();
                context.getAuthenticationSession().setAuthNote(AUTH_NOTE_TRANSACTION_ID, response.getTransactionID());
                didTrigger = true;
            } else {
                // The authentication failed without triggering anything so the things that have been sent before were wrong
                authenticationFailureMessage += "\n" + response.getMessage();
            }
        }

        // The authCounter is also used to determine the polling interval for push
        // If the authCounter is bigger than the size of the polling interval list, repeat the lists last value
        int authCounter = Integer.parseInt(context.getAuthenticationSession().getAuthNote(AUTH_NOTE_AUTH_COUNTER)) + 1;
        authCounter = (authCounter >= config.getPollingInterval().size() ? config.getPollingInterval().size() - 1 : authCounter);
        context.getAuthenticationSession().setAuthNote(AUTH_NOTE_AUTH_COUNTER, Integer.toString(authCounter));

        // The message variables could be overwritten if a challenge was triggered. Therefore, add them here at the end
        form.setAttribute(FORM_POLL_INTERVAL, config.getPollingInterval().get(authCounter))
                .setAttribute(FORM_PUSH_MESSAGE, (pushMessage == null ? DEFAULT_PUSH_MESSAGE_EN : pushMessage))
                .setAttribute(FORM_OTP_MESSAGE, (otpMessage == null ? DEFAULT_OTP_MESSAGE_EN : otpMessage));

        // Do not display the error if the token type was switched or if another challenge was triggered
        if (!(TRUE.equals(tokenTypeChanged)) && !didTrigger) {
            form.setError(TOKEN_TYPE_PUSH.equals(currentMode) ? "Authentication not verified yet." : authenticationFailureMessage);
        }

        Response responseForm = form.createForm(FORM_FILE_NAME);
        context.failureChallenge(AuthenticationFlowError.INVALID_CREDENTIALS, responseForm);*/
    }

    @Override
    public boolean requiresUser() {
        return true;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return true;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
    }

    @Override
    public void close() {
    }
}
