package sg.edu.nus.iss.server.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.oauth2.model.Userinfo;

import jakarta.servlet.http.HttpSession;
import sg.edu.nus.iss.server.dto.GoogleCalendarEvent;
import sg.edu.nus.iss.server.service.AuthService;
import sg.edu.nus.iss.server.service.GoogleCalendarService;
import sg.edu.nus.iss.server.service.OAuthService;

@RestController
@RequestMapping("/api/oauth")
public class OAuthController {

    @Autowired
    AuthService authService;

    @Autowired
    OAuthService oAuthService;

    @Autowired
    GoogleCalendarService googleCalendarService;

    public static final String CREDENTIAL = "credentials";

    @GetMapping("/url")
    public ResponseEntity<Map<String, String>> authorise() {
        String viewUrl = oAuthService.getAuthorisationUrl();
        Map<String, String> response = new HashMap<>();
        response.put("url", viewUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token")
    public String exchangeCode(@RequestBody String code, HttpSession session)
            throws IOException {

        System.out.println(">>>> In callback");
        System.out.println(">>> code: " + code);
        TokenResponse tokenResponse = oAuthService.exchangeCode(code);

        Credential credentials = oAuthService.getCredentialsFromTokenResponse(tokenResponse);
        oAuthService.saveCredentialsInSession(credentials, session);

        Userinfo userinfo = oAuthService.getUserinfoFromCredential(credentials);
        userinfo.toPrettyString();

        return tokenResponse.getAccessToken();
    }

    @GetMapping("/events")
    public List<GoogleCalendarEvent> getEvents(HttpSession session) throws IOException {
        Credential credentials = oAuthService.getCredentialsFromSession(session);

        if (null == credentials)
            return new ArrayList<>();

        Calendar service = authService.getCalendarService(credentials);

        return googleCalendarService.getAllCalendarEvents(service);
    }

}
