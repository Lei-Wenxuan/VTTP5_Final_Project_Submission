package sg.edu.nus.iss.server.service;

import java.io.StringReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import sg.edu.nus.iss.server.dto.PublicHolidayDTO;
import sg.edu.nus.iss.server.model.PublicHolidayEvent;

@Service
public class PublicHolidayService {

    RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private MongoTemplate mongoTemplate;

    private final String apiUrl = "https://data.gov.sg/api/action/datastore_search";

    public void fetchAndStorePublicHolidays() {
        String url = UriComponentsBuilder
                .fromUriString(apiUrl)
                .queryParam("resource_id", "d_3751791452397f1b1c80c451447e40b7")
                .build()
                .toUriString();

        String response = restTemplate.getForObject(url, String.class);

        JsonObject jsonObject = Json.createReader(new StringReader(response)).readObject();

        JsonArray holidayArr = jsonObject.getJsonObject("result").getJsonArray("records");

        for (int i = 0; i < holidayArr.size(); i++) {
            JsonObject phObject = holidayArr.getJsonObject(i);

            PublicHolidayEvent ph = new PublicHolidayEvent();
            ph.setDate(parseDate(phObject.getString("date")));
            ph.setHoliday(phObject.getString("holiday"));

            Query query = new Query(Criteria.where("date").is(ph.getDate()));
            Update update = new Update()
                    .set("holiday", ph.getHoliday())
                    .set("date", ph.getDate());

            mongoTemplate.upsert(query, update, PublicHolidayEvent.class);
        }
    }

    public List<PublicHolidayDTO> getPublicHolidayDTOs() {
        List<PublicHolidayEvent> events = mongoTemplate.findAll(PublicHolidayEvent.class);
        return events.stream()
                .map(event -> new PublicHolidayDTO(
                        event.getId(),
                        event.getDate(),
                        event.getHoliday()))
                .collect(Collectors.toList());
    }

    private Date parseDate(String dateStr) {
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format", e);
        }
    }
}