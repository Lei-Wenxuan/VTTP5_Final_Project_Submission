package sg.edu.nus.iss.server.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PublicHolidayDTO {
    private String id;
    private Date start;
    private String title;
    private boolean allDay = true;

    public PublicHolidayDTO(String id, Date start, String title) {
        this.id = id;
        this.start = start;
        this.title = title;
        this.allDay = true;
    }

}
