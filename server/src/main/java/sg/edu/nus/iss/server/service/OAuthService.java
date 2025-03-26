package sg.edu.nus.iss.server.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.oauth2.Oauth2;
import com.google.api.services.oauth2.model.Userinfo;

import jakarta.servlet.http.HttpSession;

@Service
public class OAuthService {

    @Value("${client.secrets}")
    private String CLIENT_SECRETS;

    public static final String CREDENTIAL = "credentials";
    public static final String USERINFO = "userinfo";

    private final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private final Collection<String> SCOPES = Arrays.asList(
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/calendar.readonly");

    private GoogleClientSecrets getSecrets() {
        InputStream is = new ByteArrayInputStream(CLIENT_SECRETS.getBytes(StandardCharsets.UTF_8));

        try {
            return GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(is));
        } catch (IOException e) {
            System.err.println(">>> Error with loading google client secrets");
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    private GoogleAuthorizationCodeFlow buildCodeFlow(GoogleClientSecrets googleClientSecrets) {
        return new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT,
                JSON_FACTORY,
                googleClientSecrets,
                SCOPES).setAccessType("offline").build();
    }

    public TokenResponse exchangeCode(String code) {
        GoogleClientSecrets googleClientSecrets = getSecrets();
        GoogleAuthorizationCodeFlow codeFlow = buildCodeFlow(googleClientSecrets);

        try {
            return codeFlow.newTokenRequest(code)
                    .setRedirectUri(googleClientSecrets.getDetails().getRedirectUris().get(0))
                    .execute();
        } catch (IOException e) {
            System.err.println(">>> Error with token exchange");
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public Credential getCredentialsFromTokenResponse(TokenResponse tokenResponse) {
        GoogleClientSecrets googleClientSecrets = getSecrets();
        GoogleAuthorizationCodeFlow codeFlow = buildCodeFlow(googleClientSecrets);

        try {
            return codeFlow.createAndStoreCredential(tokenResponse, "user");
        } catch (IOException e) {
            System.err.println(">>> Error with creating credentials");
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public Userinfo getUserinfoFromCredential(Credential credential) {
        Oauth2 oauth2 = new Oauth2.Builder(
                HTTP_TRANSPORT,
                JSON_FACTORY,
                credential)
                .setApplicationName(USERINFO)
                .build();
        try {
            return oauth2.userinfo().get().execute();
        } catch (IOException e) {
            System.err.println(">>> Error with creating credentials");
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public String getAuthorisationUrl() {
        GoogleClientSecrets googleClientSecrets = getSecrets();
        GoogleAuthorizationCodeFlow codeFlow = buildCodeFlow(googleClientSecrets);

        return codeFlow.newAuthorizationUrl()
                .setRedirectUri(googleClientSecrets.getDetails().getRedirectUris().get(0))
                .build();
    }

    public void saveCredentialsInSession(Credential credential, HttpSession session) {
        session.setAttribute(CREDENTIAL, credential);
    }

    public Credential getCredentialsFromSession(HttpSession session) {
        return (Credential) session.getAttribute(CREDENTIAL);
    }

    public void saveUserinfoInSession(Userinfo userinfo, HttpSession session) {
        session.setAttribute(USERINFO, userinfo);
    }

    public Userinfo getUserinfoFromSession(HttpSession session) {
        return (Userinfo) session.getAttribute(USERINFO);
    }

}
