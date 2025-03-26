package sg.edu.nus.iss.server.model;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "holidays")
public class PublicHolidayEvent {
    @Id
    private String id;
    private Date date;
    private String holiday;
}