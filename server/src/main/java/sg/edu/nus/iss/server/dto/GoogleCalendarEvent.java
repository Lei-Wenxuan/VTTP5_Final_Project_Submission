package sg.edu.nus.iss.server.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleCalendarEvent {
    private String id;
    private String title;
    private String description;
    private Date start;
    private Date end;
    private Date createdAt;
}
