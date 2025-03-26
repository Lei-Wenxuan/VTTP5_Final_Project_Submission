package sg.edu.nus.iss.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sg.edu.nus.iss.server.dto.PublicHolidayDTO;
import sg.edu.nus.iss.server.service.PublicHolidayService;

@RestController
@RequestMapping("/api/events")
public class PublicHolidayController {

    @Autowired
    private PublicHolidayService publicHolidayService;

    @GetMapping
    public List<PublicHolidayDTO> getEvents() {
        publicHolidayService.fetchAndStorePublicHolidays();
        return publicHolidayService.getPublicHolidayDTOs();
    }

}
