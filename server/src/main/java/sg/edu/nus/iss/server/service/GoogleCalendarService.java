package sg.edu.nus.iss.server.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarList;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;

import sg.edu.nus.iss.server.dto.GoogleCalendarEvent;

@Service
public class GoogleCalendarService {

    @Autowired
    AuthService authService;

    public List<GoogleCalendarEvent> getAllCalendarEvents(Calendar service) throws IOException {
        List<String> calendarIdList = new ArrayList<>();

        String pageTokenCalendar = null;
        do {
            CalendarList calendarList = service.calendarList().list().setPageToken(pageTokenCalendar).execute();
            List<CalendarListEntry> items = calendarList.getItems();

            for (CalendarListEntry calendarListEntry : items) {
                System.out.println(">>> Added calendar ID: " + calendarListEntry.getId());
                calendarIdList.add(calendarListEntry.getId());
            }
            pageTokenCalendar = calendarList.getNextPageToken();
        } while (pageTokenCalendar != null);

        List<GoogleCalendarEvent> calendarEvents = new ArrayList<>();

        for (String s : calendarIdList) {
            String pageTokenEvent = null;
            do {
                Events events = service.events().list(s).setPageToken(pageTokenEvent).execute();
                List<Event> items = events.getItems();
                for (Event event : items) {
                    GoogleCalendarEvent calEvent = new GoogleCalendarEvent();
                    calEvent.setId(event.getId());
                    calEvent.setTitle(event.getSummary());
                    calEvent.setDescription(event.getDescription());
                    calEvent.setStart(new Date(event.getStart().getDateTime().getValue()));
                    calEvent.setEnd(new Date(event.getEnd().getDateTime().getValue()));
                    calEvent.setCreatedAt(new Date(event.getCreated().getValue()));
                    calendarEvents.add(calEvent);
                    System.out.println(">>> Calendar Event: " + calEvent);
                }
                pageTokenEvent = events.getNextPageToken();
            } while (pageTokenEvent != null);
        }

        return calendarEvents;
    }
}
