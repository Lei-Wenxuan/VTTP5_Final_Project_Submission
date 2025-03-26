package sg.edu.nus.iss.server.service;

import org.springframework.stereotype.Service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;

@Service
public class AuthService {

    public static final String APPLICATION_NAME = "VTTP5 Final Project";

    private final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();

    public Calendar getCalendarService(Credential credential) {
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

}
