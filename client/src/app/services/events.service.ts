import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GoogleCalendarDTO } from '../models/google-calendar-dto';
import { PublicHolidayDTO } from '../models/public-holiday-dto';
import { TaskEvent } from '../models/task-event';
import { colors } from '../utils/colors';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);

  getPublicHolidays(): Observable<TaskEvent[]> {
    return this.http
      .get<PublicHolidayDTO[]>('/api/events', { withCredentials: true })
      .pipe(
        map((events) =>
          events.map(
            (event) =>
              ({
                id: event.id,
                start: new Date(event.start),
                title: event.title,
                color: { ...colors['red'] },
                allDay: event.allDay,
              } as TaskEvent)
          )
        )
      );
  }

  getGCalEvents(): Observable<TaskEvent[]> {
    return this.http
      .get<GoogleCalendarDTO[]>('/api/oauth/events', { withCredentials: true })
      .pipe(
        map((events) =>
          events.map(
            (event) =>
              ({
                id: event.id,
                start: new Date(event.start),
                end: new Date(event.end),
                title: event.title,
                body: event.description,
                color: { ...colors['yellow'] },
              } as TaskEvent)
          )
        )
      );
  }
}
